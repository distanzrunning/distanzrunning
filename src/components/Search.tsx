// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'

// Define categories to display
const categories = [
  { name: 'Road', path: '/articles/category/road', type: 'post', category: 'Road' },
  { name: 'Track & Field', path: '/articles/category/track', type: 'post', category: 'Track' },
  { name: 'Trail', path: '/articles/category/trail', type: 'post', category: 'Trail' },
  { name: 'Gear', type: 'gearPost', hasSubcategories: true },
  { name: 'Races', path: '/races', type: 'raceGuide' },
]

// Define gear subcategories
const gearSubcategories = [
  { name: 'Race Day Shoes', path: '/gear/category/race-day-shoes', gearCategory: 'Race Day Shoes' },
  { name: 'Daily Trainers', path: '/gear/category/daily-trainers', gearCategory: 'Daily Trainers' },
  { name: 'Max Cushion Shoes', path: '/gear/category/max-cushion-shoes', gearCategory: 'Max Cushion Shoes' },
  { name: 'Tempo Shoes', path: '/gear/category/tempo-shoes', gearCategory: 'Tempo Shoes' },
  { name: 'Trail Shoes', path: '/gear/category/trail-shoes', gearCategory: 'Trail Shoes' },
  { name: 'GPS Watches', path: '/gear/category/gps-watches', gearCategory: 'GPS Watches' },
  { name: 'Nutrition', path: '/gear/category/nutrition', gearCategory: 'Nutrition' },
]

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
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [gearSubcategoryCounts, setGearSubcategoryCounts] = useState<Record<string, number>>({})
  const [countsLoading, setCountsLoading] = useState(true)
  const [showGearSubcategories, setShowGearSubcategories] = useState(false)

  const handleResultClick = () => {
    onClearQuery()
  }

  // Fetch category counts when component mounts
  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        // First check if there's ANY data in the index
        const totalResult = await searchClient.search({
          requests: [
            {
              indexName,
              query: '',
              hitsPerPage: 5,
              attributesToRetrieve: ['_type', 'category', 'title']
            }
          ]
        })
        console.log('Total items in index:', totalResult.results[0])
        console.log('Sample records:', totalResult.results[0].hits)

        const counts: Record<string, number> = {}

        // First, let's get total counts by type
        for (const cat of categories) {
          let filters = `_type:"${cat.type}"`
          if (cat.category) {
            filters += ` AND category:"${cat.category}"`
          }

          console.log('Fetching count for', cat.name, 'with filters:', filters)

          const result = await searchClient.search({
            requests: [
              {
                indexName,
                query: '',
                filters,
                hitsPerPage: 0,
                attributesToRetrieve: []
              }
            ]
          })

          const searchResult = result.results[0]
          console.log('Result for', cat.name, ':', searchResult)

          if ('nbHits' in searchResult) {
            counts[cat.name] = searchResult.nbHits || 0
          }
        }

        console.log('Final counts:', counts)
        setCategoryCounts(counts)

        // Also fetch gear subcategory counts
        const gearCounts: Record<string, number> = {}
        for (const subcat of gearSubcategories) {
          const filters = `_type:"gearPost" AND gearCategory:"${subcat.gearCategory}"`
          console.log('Fetching gear subcat count for', subcat.name, 'with filters:', filters)

          const result = await searchClient.search({
            requests: [
              {
                indexName,
                query: '',
                filters,
                hitsPerPage: 0,
                attributesToRetrieve: []
              }
            ]
          })

          const searchResult = result.results[0]
          if ('nbHits' in searchResult) {
            gearCounts[subcat.name] = searchResult.nbHits || 0
          }
        }
        console.log('Gear subcategory counts:', gearCounts)
        setGearSubcategoryCounts(gearCounts)

        setCountsLoading(false)
      } catch (error) {
        console.error('Error fetching category counts:', error)
        setCountsLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  // Show category listing when no query
  if (!isExpanded || query.length === 0) {
    return (
      <div className="h-full overflow-x-hidden relative">
        <div className="py-2 px-2">
          {countsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
            </div>
          ) : showGearSubcategories ? (
            <>
              {/* Back button */}
              <button
                onClick={() => setShowGearSubcategories(false)}
                className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all w-full"
              >
                <ArrowRight className="size-4 rotate-180" />
                <span className="font-semibold">Back</span>
              </button>
              {/* Gear subcategories */}
              {gearSubcategories.map((subcat) => (
                <Link
                  key={subcat.name}
                  href={subcat.path}
                  className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
                  onClick={onClearQuery}
                >
                  <div className="flex basis-2/3 overflow-hidden">
                    <span className="font-semibold truncate">{subcat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {gearSubcategoryCounts[subcat.name] || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            categories.map((cat) => {
              const isGear = cat.hasSubcategories

              if (isGear) {
                return (
                  <button
                    key={cat.name}
                    onClick={() => setShowGearSubcategories(true)}
                    className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all w-full"
                  >
                    <div className="flex basis-2/3 overflow-hidden">
                      <span className="font-semibold truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-500">
                        {categoryCounts[cat.name] || 0}
                      </span>
                    </div>
                  </button>
                )
              }

              return (
                <Link
                  key={cat.name}
                  href={cat.path!}
                  className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-4 text-neutral-600 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
                  onClick={onClearQuery}
                >
                  <div className="flex basis-2/3 overflow-hidden">
                    <span className="font-semibold truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {categoryCounts[cat.name] || 0}
                    </span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // Show loading spinner while searching
  if (isSearching) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-neutral-900 dark:text-white animate-spin" />
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
          hits.slice(0, 8).map((hit) => {
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
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
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
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-neutral-900 text-white text-sm px-3 py-2.5 rounded-lg shadow-lg z-[100]"
              side="bottom"
              sideOffset={5}
            >
              Close search
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
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
      <div className="relative h-[432px]">
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
