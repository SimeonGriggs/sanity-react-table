import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'

import useStore from '../../hooks/useStore'

function Toggle({ _id, _action, field, value }) {
  const [newValue, setNewValue] = useState(value)
  const updates = useStore((state) => state.updates)
  const addUpdate = useStore((state) => state.addUpdate)
  const removeUpdate = useStore((state) => state.removeUpdate)

  function handleChange(incomingValue) {
    setNewValue(incomingValue)

    if (incomingValue === value) {
      removeUpdate({ _id, _action, key: field })
    } else {
      addUpdate({ _id, _action, key: field, value: incomingValue })
    }
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
    <div
      className={`h-8 w-12 p-1 rounded-full transition-colors duration-200 ease-out ${
        value !== newValue ? `bg-purple-300` : `bg-white  `
      } `}
    >
      <Switch
        checked={newValue}
        onChange={(value) => handleChange(value)}
        className={`${
          newValue ? 'bg-green-500' : 'bg-gray-200'
        } relative inline-flex items-center h-6 rounded-full w-10 outline-none focus:ring-4 focus:ring-green-200 focus:outline-none`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            newValue ? 'translate-x-5' : 'translate-x-1'
          } inline-block w-4 h-4 transform transition duration-100 ease-out bg-white rounded-full`}
        />
      </Switch>
    </div>
  )
}

Toggle.propTypes = {
  _id: PropTypes.string,
  _action: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.bool,
}

export default Toggle
