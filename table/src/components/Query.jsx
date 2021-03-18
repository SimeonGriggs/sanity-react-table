import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'

import client from '../../lib/client'
import useStore from '../hooks/useStore'
import { stubNewDocument } from '../helpers'

import Table from './Table'
import AddNew from './buttons/AddNew'
import AddTitles from './buttons/AddTitles'
import AddImages from './buttons/AddImages'

function Query() {
  const setArtists = useStore((state) => state.setArtists)
  const addUpdate = useStore((state) => state.addUpdate)
  const extendedData = useStore((state) => state.extendedData)
  const setExtendedData = useStore((state) => state.setExtendedData)
  const appendToExtendedData = useStore((state) => state.appendToExtendedData)

  const query = `{
    "artworks": *[_type == "artwork"]{_id,visible,title,price,artist,image} | order(_createdAt asc),
    "artists": *[_type == "artist"]{_id,name}
  }`

  const { isLoading, error, data } = useQuery('artworkQuery', () =>
    client.fetch(query).then((allScreening) => allScreening)
  )

  useEffect(() => {
    if (data?.artists?.length) setArtists(data.artists)
    if (data?.artworks?.length) setExtendedData(data.artworks)
  }, [data])

  if (isLoading) return <div className="p-4 text-gray-500">Loading...</div>
  if (error)
    return (
      <div className="p-4 text-gray-500">
        An error has occurred: ${error?.message}
      </div>
    )

  if (!data) {
    return <div className="bg-orange-100 p-4">Query did not return data</div>
  }

  // Handlers for creating new documents
  function handleNewClick() {
    const newDoc = stubNewDocument()
    addUpdate(newDoc)
    appendToExtendedData([newDoc])
  }

  function handleNewLines(lines) {
    const linesIntoDocs = lines.split('\n').map((title) => ({
      ...stubNewDocument(),
      title,
    }))
    linesIntoDocs.forEach((doc) =>
      addUpdate({
        _id: doc._id,
        _action: doc._action,
        key: `title`,
        value: doc.title,
      })
    )
    appendToExtendedData(linesIntoDocs)
  }

  return (
    <>
      <Table data={extendedData} />
      <div className="p-4 flex items-center justify-center space-x-4">
        <AddNew onClick={handleNewClick} />
        <AddTitles onClick={handleNewLines} />
        <AddImages />
      </div>
    </>
  )
}

export default Query
