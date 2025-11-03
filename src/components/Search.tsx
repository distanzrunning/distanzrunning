// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { Search as SearchIcon, ArrowRight } from 'lucide-react'

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

function SearchResults({ query, onClearQuery }: { query: string; onClearQuery: () => void }) {
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
    setIsOpen(query.length > 0 && hits.length > 0)
  }, [hits.length, query])

  const handleResultClick = () => {
    setIsOpen(false)
    onClearQuery()
  }

  if (!isOpen || hits.length === 0) return null

  return (
    <div className="absolute top-full left-0 mt-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-black/35 dark:border-white/20 rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto z-50 min-w-[600px] w-auto">
      <div className="py-2 px-2">
        {orderedGroups.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            {/* Group Header */}
            <div className="px-3 py-2 border-b border-neutral-200/50 dark:border-neutral-700/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {group} ({groupedHits[group].length})
              </h3>
            </div>

            {/* Group Results - limit to 5 per category */}
            <div className="mt-2">
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
                    className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-all"
                    onClick={handleResultClick}
                  >
                    <div className="flex basis-2/3 overflow-hidden">
                      <h4 className="font-semibold truncate">
                        {hit.title}
                      </h4>
                    </div>
                    <div>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Show "View more" if there are more results */}
            {groupedHits[group].length > 5 && (
              <div className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                + {groupedHits[group].length - 5} more results
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SearchInput({ onQueryChange }: { onQueryChange: (query: string) => void }) {
  const { query, refine } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refine(localQuery)
      onQueryChange(localQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localQuery, refine, onQueryChange])

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

  const handleBlur = () => {
    setIsFocused(false)
    // Clear search when input loses focus
    setLocalQuery('')
  }

  return (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder="Search"
        className={`w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-pink/20 transition-all ${isFocused ? 'min-w-[400px]' : 'min-w-[240px]'}`}
      />
      <kbd className="absolute right-3 hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded pointer-events-none">
        ⌘K
      </kbd>
    </div>
  )
}

function SearchContent() {
  const [currentQuery, setCurrentQuery] = useState('')

  const handleClearQuery = () => {
    setCurrentQuery('')
  }

  return (
    <>
      <SearchInput onQueryChange={setCurrentQuery} />
      <SearchResults query={currentQuery} onClearQuery={handleClearQuery} />
    </>
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
        <SearchContent />
      </InstantSearch>
    </div>
  )
}
