// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'

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
  location?: string
}>

// Map Sanity categories to our 5 main groups
function getCategoryGroup(hit: HitType): string {
  if (hit._type === 'post') {
    // Blog posts - use their category
    if (hit.category?.toLowerCase().includes('road')) return 'Road'
    if (hit.category?.toLowerCase().includes('trail')) return 'Trail'
    if (hit.category?.toLowerCase().includes('track')) return 'Track'
    return 'Road' // default for posts
  }
  if (hit._type === 'gearPost') return 'Gear'
  if (hit._type === 'raceGuide') return 'Races'
  return 'Other'
}

function SearchResults() {
  const { hits } = useHits<HitType>()
  const [isOpen, setIsOpen] = useState(false)

  // Group hits by category
  const groupedHits = hits.reduce((acc, hit) => {
    const group = getCategoryGroup(hit)
    if (!acc[group]) acc[group] = []
    acc[group].push(hit)
    return acc
  }, {} as Record<string, HitType[]>)

  // Order groups
  const groupOrder = ['Road', 'Trail', 'Track', 'Gear', 'Races']
  const orderedGroups = groupOrder.filter(group => groupedHits[group]?.length > 0)

  useEffect(() => {
    setIsOpen(hits.length > 0)
  }, [hits.length])

  if (!isOpen || hits.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl max-h-[70vh] overflow-y-auto z-50">
      <div className="py-2">
        {orderedGroups.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            {/* Group Header */}
            <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                {group} ({groupedHits[group].length})
              </h3>
            </div>

            {/* Group Results - limit to 5 per category */}
            <div>
              {groupedHits[group].slice(0, 5).map((hit) => {
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
                    className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate mb-1">
                          {hit.title}
                        </h4>
                        {hit.excerpt && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                            {hit.excerpt}
                          </p>
                        )}
                        {hit.location && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                            📍 {hit.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Show "View more" if there are more results */}
            {groupedHits[group].length > 5 && (
              <div className="px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                + {groupedHits[group].length - 5} more results
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>{hits.length} results found</span>
          <a
            href="https://www.algolia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Search by Algolia
          </a>
        </div>
      </div>
    </div>
  )
}

function SearchInput() {
  const { query, refine } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refine(localQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localQuery, refine])

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Clear on Escape
      if (e.key === 'Escape') {
        setLocalQuery('')
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-pink/20 transition-all"
      />
      <kbd className="absolute right-3 hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded pointer-events-none">
        ⌘K
      </kbd>
    </div>
  )
}

export default function Search() {
  return (
    <div className="relative w-full">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'}
      >
        <Configure hitsPerPage={50} />
        <SearchInput />
        <SearchResults />
      </InstantSearch>
    </div>
  )
}
