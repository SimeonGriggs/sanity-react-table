import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Listbox, Transition } from '@headlessui/react'
// eslint-disable-next-line import/no-unresolved
import { ChevronDownSolid } from '@graywolfai/react-heroicons'

import useStore from '../../hooks/useStore'

import Undo from '../buttons/Undo'

export default function Select({ _id, _action, field, value }) {
  const [newValue, setNewValue] = useState(value)
  const artists = useStore((state) => state.artists)
  const currentArtist = useMemo(
    () => artists.find((artist) => artist._id === newValue),
    [newValue, value]
  )

  const addUpdate = useStore((state) => state.addUpdate)
  const removeUpdate = useStore((state) => state.removeUpdate)

  function handleChange(newRef) {
    setNewValue(newRef)

    if (newRef === value) {
      removeUpdate({ _id, _action, key: field })
    } else {
      addUpdate({ _id, _action, key: field, value: { _ref: newRef } })
    }
  }

  function undoChange() {
    setNewValue(value)
    removeUpdate({ _id, _action, key: field })
  }

  // useEffect-ish subscription to changes in updates
  useStore.subscribe(
    (data) => {
      if (data[_id] && data[_id].hasOwnProperty(field)) {
        setNewValue(data[_id][field]._ref)
      }
    },
    (state) => state.updates
  )

  // When the data query re-runs, refresh value from prop
  useEffect(() => {
    setNewValue(value)
  }, [value])

  return (
    <div className="relative pr-10">
      <Listbox value={newValue} onChange={(item) => handleChange(item)}>
        {({ open }) => (
          <>
            <Listbox.Button
              className={`${
                value !== newValue ? `bg-purple-50` : `bg-transparent`
              } ${open ? `bg-green-50` : ``} ${
                !value && !currentArtist?.name ? `text-gray-400` : ``
              } p-2 transition-colors duration-200 ease-out focus:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none w-full text-left flex items-center justify-between border border-gray-200 focus:border-transparent rounded my-1 py-1`}
            >
              {currentArtist && currentArtist.name
                ? currentArtist.name
                : 'Select'}
              <ChevronDownSolid className="w-4 h-auto" />
            </Listbox.Button>
            <Transition
              show={open}
              enter="w-full absolute z-50 transition duration-100 ease-out"
              enterFrom="transform translate-y-3 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="w-full  absolute z-50 transition duration-100 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-3 opacity-0"
            >
              <Listbox.Options className="w-full  absolute z-50 bg-white shadow-lg  rounded outline-none focus:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none">
                {artists?.length > 0 &&
                  artists.map((artist) => (
                    <Listbox.Option key={artist._id} value={artist._id}>
                      {({ active }) => (
                        <span
                          className={`${
                            active ? `bg-green-200` : ``
                          } block p-2 pr-4`}
                        >
                          {artist.name}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
      <Undo active={value !== newValue} onClick={undoChange} />
    </div>
  )
}

Select.propTypes = {
  _id: PropTypes.string,
  _action: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
}
