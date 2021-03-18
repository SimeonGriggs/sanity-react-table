import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import useStore from '../../hooks/useStore'
import Undo from '../buttons/Undo'

export default function Text({ _id, _action, field, value }) {
  const [newValue, setNewValue] = useState(value)
  const addUpdate = useStore((state) => state.addUpdate)
  const removeUpdate = useStore((state) => state.removeUpdate)

  function handleChange(e) {
    setNewValue(e.target.value)

    if (e.target.value === value) {
      removeUpdate({ _id, _action, key: field })
    } else {
      addUpdate({ _id, _action, key: field, value: e.target.value })
    }
  }

  function undoChange() {
    setNewValue(value)
    removeUpdate({ _id, key: field })
  }

  // useEffect-ish subscription to changes in updates
  useStore.subscribe(
    (data) => {
      if (data[_id] && data[_id].hasOwnProperty(field)) {
        setNewValue(data[_id][field])
      }
    },
    (state) => state.updates
  )

  // When the data query re-runs, refresh value from prop
  useEffect(() => {
    setNewValue(value)
  }, [value])

  return (
    <div className="relative">
      <input
        className={`${
          value !== newValue ? `bg-purple-50` : `bg-transparent`
        } p-2 transition-colors duration-200 ease-out focus:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none w-full`}
        value={newValue}
        name={field}
        onChange={(e) => handleChange(e)}
      />

      <Undo active={value !== newValue} onClick={undoChange} />
    </div>
  )
}

Text.propTypes = {
  _id: PropTypes.string,
  _action: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
}
