// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { Search as SearchIcon, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

function SearchResults({ query, onClearQuery, isExpanded }: {
  query: string
  onClearQuery: () => void
  isExpanded: boolean
}) {
  const { hits } = useHits<HitType>()

  const handleResultClick = () => {
    onClearQuery()
  }

  if (!isExpanded || query.length === 0 || hits.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-2xl max-h-[60vh] overflow-y-auto"
    >
      <div className="py-4 px-2">
        {hits.slice(0, 20).map((hit) => {
          // Determine URL
          let href = '/'
          if (hit._type === 'post') {
            href = `/articles/post/${hit.slug}`
          } else if (hit._type === 'gearPost') {
            href = `/gear/${hit.slug}`
          } else if (hit._type === 'raceGuide') {
            href = `/races/${hit.slug}`
          }

          // Get main category
          const mainCategory = getCategoryGroup(hit)

          // Get subcategory based on content type
          let subCategories: string[] = []
          if (hit._type === 'post' && hit.tags && hit.tags.length > 0) {
            // For articles, show all tags
            subCategories = hit.tags
          } else if (hit._type === 'gearPost' && hit.gearCategory) {
            // For gear, show gear category
            subCategories = [hit.gearCategory]
          } else if (hit._type === 'raceGuide' && hit.raceCategory) {
            // For races, show race category
            subCategories = [hit.raceCategory]
          }

          return (
            <Link
              key={hit.objectID}
              href={href}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-all"
              onClick={handleResultClick}
            >
              {/* Left: Title */}
              <h4 className="font-semibold text-base text-neutral-900 dark:text-white truncate flex-shrink min-w-0">
                {hit.title}
              </h4>

              {/* Right: Pills + Arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Main category pill */}
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-200/70 dark:bg-neutral-700/70 rounded-full">
                    {mainCategory}
                  </span>
                  {/* Subcategory pills */}
                  {subCategories.map((subCat, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-800/70 rounded-full">
                      {subCat}
                    </span>
                  ))}
                </div>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}

function SearchInput({
  onQueryChange,
  isExpanded,
  onExpandChange
}: {
  onQueryChange: (query: string) => void
  isExpanded: boolean
  onExpandChange: (expanded: boolean) => void
}) {
  const { query, refine } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const [isMac, setIsMac] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect OS on mount
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

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
        onExpandChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onExpandChange])

  const handleFocus = () => {
    onExpandChange(true)
  }

  const handleClear = () => {
    setLocalQuery('')
    onExpandChange(false)
    inputRef.current?.blur()
  }

  return (
    <div className="relative flex items-center w-full">
      <SearchIcon className="absolute left-3 h-5 w-5 text-neutral-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search articles, gear, races..."
        className="w-full pl-11 pr-24 py-3 text-base bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-pink/20 transition-all"
      />

      {/* Clear button - only show when expanded and has query */}
      <AnimatePresence>
        {isExpanded && localQuery.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-16 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-neutral-500" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut - hide when expanded */}
      {!isExpanded && (
        <kbd className="absolute right-3 hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded pointer-events-none">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      )}
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

  const handleClearQuery = () => {
    setCurrentQuery('')
    onExpandChange(false)
  }

  return (
    <div className="relative w-full">
      <SearchInput
        onQueryChange={setCurrentQuery}
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
      />
      <SearchResults
        query={currentQuery}
        onClearQuery={handleClearQuery}
        isExpanded={isExpanded}
      />
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
