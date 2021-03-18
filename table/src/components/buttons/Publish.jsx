import React, { useState, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import useStore from '../../hooks/useStore'
import client from '../../../lib/client'

export default function Publish() {
  const [toastVisible, setToastVisible] = useState(false)
  const updates = useStore((state) => state.updates)
  const reset = useStore((state) => state.reset)
  const queryClient = useQueryClient()

  function handleSubmit() {
    if (!Object.keys(updates)) return

    const clientTransaction = client.transaction()

    Object.keys(updates).forEach((_id) => {
      if (updates[_id]._action === 'patch') {
        delete updates[_id]._action
        clientTransaction.patch(_id, (doc) => doc.set(updates[_id]))
      }

      if (updates[_id]._action === 'create') {
        delete updates[_id]._action
        clientTransaction.create({ _id, _type: `artwork`, ...updates[_id] })
      }

      if (updates[_id]._action === 'delete') {
        clientTransaction.delete(_id)
      }
    })

    clientTransaction
      .commit()
      .then((updates) => {
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 1000)
        reset()
        queryClient.invalidateQueries('artworkQuery')
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  // TODO: Refactor to .reduce() for 😎 points
  const updateCount = useMemo(
    () =>
      Object.keys(updates)
        // Convert object of updates into an array
        .map((key) => updates[key])
        .reduce(
          (acc, obj) => {
            if (obj._action === 'patch') {
              // Updates count keys in the object, minus the _action key
              acc.patches += Object.keys(obj).length - 1
            }

            acc[obj._action] += 1

            return acc
          },
          { create: 0, patch: 0, patches: 0, delete: 0 }
        ),
    [updates]
  )
  const docCount = useMemo(() => Object.keys(updates).length, [updates])

  return (
    <div className="fixed z-50 inset-0 p-4 flex justify-start items-end pointer-events-none">
      <div
        className={`bg-white rounded-lg shadow-xl p-4 transition duration-200 ease-out transform ${
          docCount ? `opacity-100 translate-y-0` : `opacity-0 translate-y-2`
        }`}
      >
        <button
          onClick={() => handleSubmit()}
          type="button"
          className={`bg-purple-500 hover:bg-purple-600 text-white rounded-full py-3 px-6 block font-bold text-sm pointer-events-auto `}
        >
          Publish Changes to{` `}
          {docCount === 1 ? `${docCount} Document` : `${docCount} Documents`}
        </button>
        <div className="flex gap-4 text-xs mt-4 uppercase text-gray-500">
          {Object.keys(updateCount)
            .filter((key) => updateCount[key])
            .map((key) => (
              <div key={key}>
                {key}{' '}
                <span className="font-bold text-purple-500">
                  {updateCount[key]}
                </span>
              </div>
            ))}
        </div>
      </div>
      <div
        className={`absolute bg-green-400 transition duration-200 ease-out text-white rounded-full py-3 px-6 block shadow-xl font-bold text-sm transform ${
          toastVisible ? `opacity-100 translate-y-0` : `opacity-0 translate-y-2`
        }`}
      >
        Updated!
      </div>
    </div>
  )
}
