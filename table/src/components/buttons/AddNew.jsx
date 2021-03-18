import PropTypes from 'prop-types'
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { PlusSolid } from '@graywolfai/react-heroicons'

export default function AddNew({ onClick }) {
  return (
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 focus:bg-green-400 transform hover:scale-110 focus:scale-110 transition duration-200 ease-out text-white rounded-full py-3 px-6 block shadow-xl font-bold text-sm flex items-center gap-1"
      onClick={() => onClick()}
    >
      <PlusSolid className="w-5 h-auto" />
      Add New
    </button>
  )
}

AddNew.propTypes = {
  onClick: PropTypes.func,
}
