import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import './App.css'
import Publish from './components/buttons/Publish'
import Query from './components/Query'
import useStore from './hooks/useStore'

const queryClient = new QueryClient()

function App() {
  const updates = useStore((state) => state.updates)

  return (
    <div className="bg-gray-100 min-h-screen">
      {updates && (
        <div className="fixed inset-0 pointer-events-none p-4 z-40 flex justify-end items-end">
          <pre className="bg-white bg-opacity-90 rounded-xl p-4 shadow-xl max-w-sm font-mono text-xs">
            {JSON.stringify(updates, null, 1)}
          </pre>
        </div>
      )}
      <QueryClientProvider client={queryClient}>
        <Publish />
        <div className="bg-gradient-to-t from-purple-900 to-purple-800 text-white font-bold text-xs uppercase tracking-widest text-center p-3">
          Sanity &times; React Query/Table &times; Zustand
        </div>
        <Query />
      </QueryClientProvider>
    </div>
  )
}

export default App
