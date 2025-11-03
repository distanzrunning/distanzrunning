// src/components/Search.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { InstantSearch, SearchBox, Hits, Highlight, Configure } from 'react-instantsearch'
import algoliasearch from 'algoliasearch/lite'
import Link from 'next/link'
import { Search as SearchIcon, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

type HitProps = {
  hit: {
    objectID: string
    title: string
    slug: string
    _type: string
    excerpt?: string
    category?: string
    location?: string
  }
}

function Hit({ hit }: HitProps) {
  // Determine the URL based on content type
  let href = '/'
  if (hit._type === 'post') {
    href = `/articles/post/${hit.slug}`
  } else if (hit._type === 'gearPost') {
    href = `/gear/${hit.slug}`
  } else if (hit._type === 'raceGuide') {
    href = `/races/${hit.slug}`
  }

  // Determine the type label
  let typeLabel = 'Article'
  if (hit._type === 'gearPost') typeLabel = 'Gear'
  if (hit._type === 'raceGuide') typeLabel = 'Race'

  return (
    <Link
      href={href}
      className="block p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-200 dark:border-neutral-700 last:border-b-0"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {typeLabel}
            </span>
            {hit.category && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {hit.category}
                </span>
              </>
            )}
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
            <Highlight attribute="title" hit={hit} />
          </h3>
          {hit.excerpt && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {hit.excerpt}
            </p>
          )}
          {hit.location && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              📍 {hit.location}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function Search() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Search trigger button */}
      <Dialog.Trigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
          aria-label="Open search"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-neutral-200 dark:bg-neutral-700 rounded">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>

      {/* Search dialog */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <InstantSearch
            searchClient={searchClient}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'}
          >
            <Configure hitsPerPage={8} />

            <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
              <div className="flex items-center gap-3">
                <SearchIcon className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                <SearchBox
                  placeholder="Search articles, gear, and races..."
                  classNames={{
                    root: 'flex-1',
                    form: 'relative',
                    input: 'w-full bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none text-base',
                    submit: 'hidden',
                    reset: 'hidden',
                    loadingIndicator: 'hidden',
                  }}
                  autoFocus
                />
                <Dialog.Close asChild>
                  <button
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <Hits
                hitComponent={Hit}
                classNames={{
                  root: '',
                  list: '',
                  item: '',
                }}
              />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Press ESC to close</span>
              <a
                href="https://www.algolia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Search by <span className="font-semibold">Algolia</span>
              </a>
            </div>
          </InstantSearch>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
