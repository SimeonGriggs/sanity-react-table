import PropTypes from 'prop-types'
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { BackspaceSolid } from '@graywolfai/react-heroicons'

export default function Undo({ active, onClick }) {
  return (
    <div
      className={`absolute inset-0 flex justify-end items-center pr-2 transition duration-200 ease-out font-bold text-sm transform pointer-events-none ${
        active ? `opacity-100 translate-y-0` : `opacity-0 translate-y-2`
      }`}
    >
      <button
        className="pointer-events-auto text-sm font-bold w-6 h-auto text-green-300 focus:text-green-500 transition duration-200 ease-out transform focus:scale-110 focus:outline-none"
        type="button"
        tabIndex={active ? 0 : -1}
        onClick={() => onClick()}
      >
        <BackspaceSolid />
        <span className="sr-only">Undo Change</span>
      </button>
    </div>
  )
}

Undo.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
}
