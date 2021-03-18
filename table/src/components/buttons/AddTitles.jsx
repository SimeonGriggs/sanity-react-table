import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@headlessui/react'
// eslint-disable-next-line import/no-unresolved
import { MenuAlt2Solid } from '@graywolfai/react-heroicons'

export default function AddTitles({ onClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const [lines, setLines] = useState('')

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="bg-purple-900 bg-opacity-75 fixed inset-0 p-8 z-50"
      >
        <Dialog.Overlay />

        <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-auto">
          <Dialog.Title>Add New Artworks, one per line</Dialog.Title>

          <textarea
            onChange={(e) => setLines(e.target.value)}
            className="mt-4 h-24 p-2 transition-colors duration-200 ease-out ring-1 ring-gray-200 focus:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none w-full"
          />

          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end gap-4">
            <button
              type="button"
              className="text-purple-400 font-bold"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="text-purple-600 font-bold"
              onClick={() => {
                setIsOpen(false)
                onClick(lines)
              }}
            >
              Create
            </button>
          </div>
        </div>
      </Dialog>
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 focus:bg-green-400 transform hover:scale-110 focus:scale-110 transition duration-200 ease-out text-white rounded-full py-3 px-6 block shadow-xl font-bold text-sm flex items-center gap-1"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <MenuAlt2Solid className="w-5 h-auto" />
        Add Titles
      </button>
    </>
  )
}

AddTitles.propTypes = {
  onClick: PropTypes.func,
}
