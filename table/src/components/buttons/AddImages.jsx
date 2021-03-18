import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@headlessui/react'
// eslint-disable-next-line import/no-unresolved
import { ViewGridAddSolid } from '@graywolfai/react-heroicons'

import SanityImage from '../cells/SanityImage'

export default function AddImages({ onClick }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="bg-purple-900 bg-opacity-75 fixed inset-0 p-8 z-50"
      >
        <Dialog.Overlay />

        <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-auto">
          <Dialog.Title>Add New Artworks, one per image</Dialog.Title>

          <div className="mt-4">
            <SanityImage bulkUpload field="image" />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end gap-4">
            <button
              type="button"
              className="text-purple-400 font-bold"
              onClick={() => setIsOpen(false)}
            >
              Close
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
        <ViewGridAddSolid className="w-5 h-auto" />
        Add Images
      </button>
    </>
  )
}

AddImages.propTypes = {
  onClick: PropTypes.func,
}
