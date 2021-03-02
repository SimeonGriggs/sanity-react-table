import React from 'react'
import { useQuery } from 'react-query'

import client from '../../lib/client'

import Table from './Table'

function Query() {
  const query = '*[_type == "screening"]'
  const { isLoading, error, data } = useQuery('screeningQuery', () =>
    client.fetch(query).then((allScreening) => allScreening)
  )

  if (isLoading) return <div className="bg-orange-100 p-4">'Loading...'</div>
  if (error)
    return (
      <div className="bg-orange-100 p-4">
        `An error has occurred: ${error.message}`
      </div>
    )

  return <Table data={data} />
}

export default Query
