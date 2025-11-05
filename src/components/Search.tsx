// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, useSearchBox, useHits, Configure } from 'react-instantsearch'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import Link from 'next/link'
import { Search as SearchIcon, ArrowRight, BookOpen, Wrench, Trophy } from 'lucide-react'
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

// Category navigation when search is open but no query
function CategoryNavigation({ onNavigate }: { onNavigate: () => void }) {
  const [activeView, setActiveView] = useState<'trending' | 'category'>('trending')
  const [activeSection, setActiveSection] = useState<'articles' | 'gear' | 'races'>('articles')
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Fetch category counts from Algolia on mount
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'

        // Use search() with multiple requests
        const results = await searchClient.search({
          requests: [
            {
              indexName,
              query: '',
              filters: '_type:post',
              facets: ['category'],
              hitsPerPage: 0,
            },
            {
              indexName,
              query: '',
              filters: '_type:gearPost',
              facets: ['gearCategory'],
              hitsPerPage: 0,
            },
            {
              indexName,
              query: '',
              filters: '_type:raceGuide',
              facets: ['raceCategory'],
              hitsPerPage: 0,
            }
          ]
        })

        const counts: Record<string, number> = {}

        // Extract facets from each result
        const result0 = results.results[0] as any
        const result1 = results.results[1] as any
        const result2 = results.results[2] as any

        const articleFacets = result0?.facets?.category || {}
        const gearFacets = result1?.facets?.gearCategory || {}
        const raceFacets = result2?.facets?.raceCategory || {}

        // Merge all counts
        Object.entries(articleFacets).forEach(([cat, count]) => {
          counts[cat] = count as number
        })
        Object.entries(gearFacets).forEach(([cat, count]) => {
          counts[cat] = count as number
        })
        Object.entries(raceFacets).forEach(([cat, count]) => {
          counts[cat] = count as number
        })

        console.log('Category counts:', counts)
        setCategoryCounts(counts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching category counts:', error)
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex">
        {/* Left sidebar menu - View selector (Trending / By Category) */}
        <div className="w-48 border-r border-neutral-200 dark:border-neutral-700 py-2">
          <button
            onClick={() => setActiveView('trending')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'trending'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveView('category')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'category'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <span>By Category</span>
          </button>
        </div>

        {/* Right content area */}
        <div className="flex-1 py-4 px-2 max-h-[60vh] overflow-y-auto">
          {activeView === 'trending' && (
            <div className="px-3 py-8 text-center text-neutral-500 dark:text-neutral-400">
              <p className="text-sm">Trending content coming soon</p>
            </div>
          )}

          {activeView === 'category' && (
            <div className="flex h-full">
              {/* Category type selector (Articles/Gear/Races) */}
              <div className="w-32 border-r border-neutral-200 dark:border-neutral-700 pr-2">
                <button
                  onClick={() => setActiveSection('articles')}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-xs font-medium transition-colors rounded ${
                    activeSection === 'articles'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <BookOpen className="size-4" />
                  <span>Articles</span>
                </button>
                <button
                  onClick={() => setActiveSection('gear')}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-xs font-medium transition-colors rounded ${
                    activeSection === 'gear'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <Wrench className="size-4" />
                  <span>Gear</span>
                </button>
                <button
                  onClick={() => setActiveSection('races')}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-xs font-medium transition-colors rounded ${
                    activeSection === 'races'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <Trophy className="size-4" />
                  <span>Races</span>
                </button>
              </div>

              {/* Categories list */}
              <div className="flex-1 pl-2">
                {activeSection === 'articles' && (
                  <div>
                    <Link
                      href="/articles/category/road"
                      onClick={onNavigate}
                      className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    >
                      <h4 className="font-semibold text-base text-neutral-900 dark:text-white">Road</h4>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {loading ? '...' : categoryCounts['Road'] || 0}
                      </span>
                    </Link>
                    <Link
                      href="/articles/category/track"
                      onClick={onNavigate}
                      className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    >
                      <h4 className="font-semibold text-base text-neutral-900 dark:text-white">Track</h4>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {loading ? '...' : categoryCounts['Track'] || 0}
                      </span>
                    </Link>
                    <Link
                      href="/articles/category/trail"
                      onClick={onNavigate}
                      className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    >
                      <h4 className="font-semibold text-base text-neutral-900 dark:text-white">Trail</h4>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {loading ? '...' : categoryCounts['Trail'] || 0}
                      </span>
                    </Link>
                  </div>
                )}

                {activeSection === 'gear' && (
                  <div>
                    {Object.entries(categoryCounts)
                      .filter(([key]) => !['Road', 'Track', 'Trail', 'Marathon', 'Half Marathon', 'Ultra', '5K', '10K'].includes(key))
                      .map(([category, count]) => (
                        <Link
                          key={category}
                          href={`/gear/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={onNavigate}
                          className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        >
                          <h4 className="font-semibold text-base text-neutral-900 dark:text-white">{category}</h4>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {loading ? '...' : count}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}

                {activeSection === 'races' && (
                  <div>
                    {['Marathon', 'Half Marathon', 'Ultra', '5K', '10K'].map((category) => {
                      const count = categoryCounts[category]
                      if (!count && !loading) return null

                      return (
                        <Link
                          key={category}
                          href={`/races/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={onNavigate}
                          className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        >
                          <h4 className="font-semibold text-base text-neutral-900 dark:text-white">{category}</h4>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {loading ? '...' : count || 0}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
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
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
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
        placeholder="Search..."
        className="w-full h-9 pl-11 pr-16 text-base bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-pink/20 transition-all [&::-webkit-search-cancel-button]:appearance-none"
      />

      {/* Esc button - only show when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
            aria-label="Clear search (Esc)"
          >
            Esc
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

  const handleNavigate = () => {
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
      {/* Show category navigation when expanded but no query */}
      <AnimatePresence>
        {isExpanded && currentQuery.length === 0 && (
          <CategoryNavigation onNavigate={handleNavigate} />
        )}
      </AnimatePresence>
      {/* Show search results when there's a query */}
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
