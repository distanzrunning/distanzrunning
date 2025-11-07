// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { ArrowRight, Search as SearchIconLucide, Loader2 } from 'lucide-react'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

type HitType = AlgoliaHit<{
  objectID: string
  title: string
  slug: string
  _type: string
  excerpt?: string
  category?: string
  tags?: string[]
  gearCategory?: string
  raceCategory?: string
  location?: string
}>

function SearchResults({
  query,
  onClearQuery,
  isExpanded,
  isSearching
}: {
  query: string
  onClearQuery: () => void
  isExpanded: boolean
  isSearching: boolean
}) {
  const { hits } = useHits<HitType>()

  const handleResultClick = () => {
    onClearQuery()
  }

  // Show empty state with search icon when no query
  if (!isExpanded || query.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <SearchIconLucide className="w-8 h-8 text-neutral-300 dark:text-neutral-700" strokeWidth={1.5} />
      </div>
    )
  }

  // Show loading spinner while searching
  if (isSearching) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neutral-400 dark:text-neutral-600 animate-spin" />
      </div>
    )
  }

  // Show results
  return (
    <div className="h-full overflow-x-hidden">
      <div className="py-2 px-2">
        {hits.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
            No results found
          </div>
        ) : (
          hits.slice(0, 6).map((hit) => {
            // Determine URL
            let href = '/'
            if (hit._type === 'post') {
              href = `/articles/post/${hit.slug}`
            } else if (hit._type === 'gearPost') {
              href = `/gear/${hit.slug}`
            } else if (hit._type === 'raceGuide') {
              href = `/races/${hit.slug}`
            }

            return (
              <Link
                key={hit.objectID}
                href={href}
                className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
                onClick={handleResultClick}
              >
                <div className="flex basis-2/3 overflow-hidden">
                  <span className="font-semibold truncate">{hit.title}</span>
                </div>
                <div>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

function SearchInput({
  onQueryChange,
  isExpanded,
  onExpandChange,
  onSearchingChange
}: {
  onQueryChange: (query: string) => void
  isExpanded: boolean
  onExpandChange: (expanded: boolean) => void
  onSearchingChange: (searching: boolean) => void
}) {
  const { query, refine } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search with loading state
  useEffect(() => {
    if (localQuery.length > 0) {
      onSearchingChange(true)
    }

    const timeoutId = setTimeout(() => {
      refine(localQuery)
      onQueryChange(localQuery)
      onSearchingChange(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localQuery, refine, onQueryChange, onSearchingChange])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocalQuery('')
        onExpandChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onExpandChange])

  // Auto-focus on mount
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleClear = () => {
    setLocalQuery('')
    onExpandChange(false)
  }

  return (
    <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 py-2 pl-5 pr-4">
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        className="placeholder:text-neutral-400 h-9 w-full bg-transparent outline-none text-[1rem] md:text-base text-neutral-900 dark:text-white"
      />
      <button
        onClick={handleClear}
        className="group whitespace-nowrap font-medium text-sm relative m-0 flex cursor-pointer select-none items-center rounded-lg border-none p-1 no-underline outline-none transition ease-out focus-visible:outline-none active:scale-[0.98] active:duration-100 h-6 gap-1 bg-transparent hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 px-1 shrink-0 justify-center text-neutral-600 dark:text-neutral-400"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-4" aria-hidden="true">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  )
}

function SearchContent({
  isExpanded,
  onExpandChange
}: {
  isExpanded: boolean
  onExpandChange: (expanded: boolean) => void
}) {
  const [currentQuery, setCurrentQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleClearQuery = () => {
    setCurrentQuery('')
    onExpandChange(false)
  }

  return (
    <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-200/35 dark:border-neutral-700/35 bg-white/90 dark:bg-neutral-900/90 shadow-2xl backdrop-blur-xl">
      <SearchInput
        onQueryChange={setCurrentQuery}
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
        onSearchingChange={setIsSearching}
      />
      <div className="relative min-h-64 flex-grow">
        <SearchResults
          query={currentQuery}
          onClearQuery={handleClearQuery}
          isExpanded={isExpanded}
          isSearching={isSearching}
        />
      </div>
    </div>
  )
}

export default function Search({
  isExpanded,
  onExpandChange
}: {
  isExpanded: boolean
  onExpandChange: (expanded: boolean) => void
}) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'}
    >
      <Configure hitsPerPage={50} />
      <SearchContent isExpanded={isExpanded} onExpandChange={onExpandChange} />
    </InstantSearch>
  )
}
