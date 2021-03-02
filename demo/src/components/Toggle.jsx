import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { useQueryClient } from 'react-query'

import client from '../../lib/client'

function Toggle({ _id, field, checked, selectedIds }) {
  const [enabled, setEnabled] = useState(checked)
  const queryClient = useQueryClient()

  useEffect(() => {
    setEnabled(checked)
  }, [checked])

  function handleChange(newValue) {
    setEnabled(newValue)
    const idsOtherThanThisOne = selectedIds.filter((id) => id !== _id)
    const newSetting = { [field]: newValue }

    // Patch this ID
    const clientTransaction = client.transaction()
    clientTransaction.patch(_id, (doc) => doc.set(newSetting))

    // Patch all other ID's
    if (idsOtherThanThisOne.length > 0) {
      idsOtherThanThisOne.forEach((selected) =>
        clientTransaction.patch(selected, (doc) => doc.set(newSetting))
      )
    }

    clientTransaction
      .commit()
      .then((updatedDocument) => {
        // eslint-disable-next-line no-unused-expressions
        idsOtherThanThisOne.length > 0
          ? console.log(
              `${field} is now ${newValue} on ${selectedIds.length} docs`
            )
          : console.log(`${field} is now ${newValue} on ${_id}`)

        queryClient.invalidateQueries('screeningQuery')
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  return (
    <Switch
      checked={enabled}
      onChange={(value) => handleChange(value)}
      className={`${
        enabled ? 'bg-green-500' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform transition duration-100 ease-out bg-white rounded-full`}
      />
    </Switch>
  )
}

Toggle.propTypes = {
  _id: PropTypes.string,
  checked: PropTypes.bool,
  field: PropTypes.string,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
}

export default Toggle
