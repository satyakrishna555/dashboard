'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchContent() {
  'use client'

  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <>
      {query ? (
        <p>Showing results for: <span className="font-semibold">{query}</span></p>
      ) : (
        <p>Please enter a search term in the top navigation bar.</p>
      )}
      {/* TODO: Fetch and display actual search results based on the query */}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
