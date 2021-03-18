import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
// eslint-disable-next-line import/no-unresolved
import { TrashSolid } from '@graywolfai/react-heroicons'

import useStore from '../../hooks/useStore'

import Delete from '../buttons/Delete'

function DeleteId({ _id, _action, value }) {
  const [newValue, setNewValue] = useState(value)
  const updates = useStore((state) => state.updates)
  const addUpdate = useStore((state) => state.addUpdate)
  const removeUpdate = useStore((state) => state.removeUpdate)

  function handleChange(incomingValue) {
    setNewValue(incomingValue)

    if (incomingValue === value) {
      removeUpdate({ _id, _action })
    } else {
      addUpdate({ _id, _action })
    }
  }

  // useEffect-ish subscription to changes in updates
  useStore.subscribe(
    (data) => {
      if (data[_id] && data[_id]._action === 'delete') {
        setNewValue(true)
      }
    },
    (state) => state.updates
  )

  // When the data query re-runs, refresh value from prop
  useEffect(() => {
    setNewValue(value)
  }, [value])

  return (
    <div className={`relative ${newValue ? `text-red-600` : `text-red-200`}`}>
      <Delete active onClick={() => handleChange(!newValue)} />
    </div>
  )
}

DeleteId.propTypes = {
  _id: PropTypes.string,
  _action: PropTypes.string,
  value: PropTypes.bool,
}

export default DeleteId
