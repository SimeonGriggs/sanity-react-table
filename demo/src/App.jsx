import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import './App.css'
import Query from './components/Query'

const queryClient = new QueryClient()

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <div className="bg-orange-500 text-white font-bold text-xs uppercase tracking-widest text-center p-4">
          Sanity &times; React Table
        </div>
        <Query />
      </QueryClientProvider>
    </div>
  )
}

export default App
