import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import { useDropzone } from 'react-dropzone'
// eslint-disable-next-line import/no-unresolved
import { UploadSolid } from '@graywolfai/react-heroicons'

import useStore from '../../hooks/useStore'
import client from '../../../lib/client'
import { stubNewDocument } from '../../helpers'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

function SanityImage({ _id, _action, field, value, bulkUpload }) {
  const [newValue, setNewValue] = useState(value?.asset?._ref)

  const addUpdate = useStore((state) => state.addUpdate)
  const appendToExtendedData = useStore((state) => state.appendToExtendedData)

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      // reader.onabort = () => console.log('file reading was aborted')
      // reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result

        client.assets
          .upload('image', binaryStr, { filename: file.name })
          .then((asset) => {
            const assetValue = {
              _type: `image`,
              asset: {
                _ref: asset._id,
                _type: `reference`,
              },
            }
            if (bulkUpload) {
              const newBulkUpload = {
                ...stubNewDocument(),
                image: assetValue,
              }
              addUpdate({
                _id: newBulkUpload._id,
                _action: newBulkUpload._action,
                key: field,
                value: assetValue,
              })
              appendToExtendedData([newBulkUpload])
            } else {
              setNewValue(asset._id)
              addUpdate({
                _id,
                _action,
                key: field,
                value: assetValue,
              })
            }
          })
          .catch((error) => {
            // console.error('Upload failed:', error.message)
          })
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  if (!newValue) {
    return (
      <button
        type="button"
        className={`${
          bulkUpload ? `w-full h-32 bg-gray-50` : `w-10 h-10`
        } text-gray-400 hover:bg-purple-200 hover:border-purple-500 hover:text-purple-500 transition-colors duration-200 ease-out focus:bg-green-50 focus:text-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none border-gray-200 border-2 border-dashed text-xs flex items-center justify-center`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadSolid className="w-5 h-auto" />
        <span className="sr-only">Upload Images</span>
      </button>
    )
  }

  return (
    <img
      className="w-10 h-10"
      src={urlFor(newValue).width(100).height(100).url()}
      alt=""
    />
  )
}

SanityImage.propTypes = {
  _id: PropTypes.string,
  _action: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.object,
  bulkUpload: PropTypes.bool,
}

export default SanityImage
