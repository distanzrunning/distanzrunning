// src/components/Search.tsx
//
// Public-site search modal — Algolia-backed via react-instantsearch.
// Visual layer is built from DS tokens / primitives only:
//   - Panel uses material-modal (12 px radius + DS shadow) on top of
//     --ds-background-100 with a --ds-gray-400 hairline.
//   - All text colour flows through the gray scale tokens (gray-1000
//     primary, gray-900 subtle, gray-700 muted) so light/dark flip
//     automatically.
//   - Hover state on rows uses --ds-gray-100.
//
// Empty state lists the five top-level destinations that mirror the
// site nav (Articles · Shoes · Gear · Nutrition · Races).
//
// When the user types, hits are grouped by section header so a
// query that spans content types reads as a structured list rather
// than a flat soup. Each hit routes to its flat public URL:
//   - post        → /articles/{slug}
//   - productPost → /{section}/{slug} — section is indexed by
//                   the algolia-sync route from productCategory
//   - raceGuide   → /races/{slug}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Configure,
  InstantSearch,
  useHits,
  useSearchBox,
} from "react-instantsearch";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import Link from "next/link";
import { ArrowRight, Loader2, Search as SearchIcon, X } from "lucide-react";

import IconButton from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "distanz_content";

// ============================================================================
// Hit helpers — used to route a hit to its flat public URL
// ============================================================================

type HitFields = {
  objectID: string;
  title: string;
  slug: string;
  _type: "post" | "productPost" | "gearPost" | "raceGuide";
  /** productPost section, indexed from productCategory->section. */
  section?: "shoes" | "gear" | "nutrition";
};

type HitType = AlgoliaHit<HitFields>;

function hrefForHit(hit: HitType): string {
  if (hit._type === "post") return `/articles/${hit.slug}`;
  if (hit._type === "raceGuide") return `/races/${hit.slug}`;
  // productPost / legacy gearPost — section comes from Algolia
  // (indexed from productCategory->section). Fall back to /gear
  // for any pre-resync records that don't carry it.
  const section =
    hit.section === "shoes" || hit.section === "nutrition"
      ? hit.section
      : "gear";
  return `/${section}/${hit.slug}`;
}

// ============================================================================
// Hit row — title + arrow affordance
// ============================================================================

function HitRow({
  href,
  title,
  onSelect,
}: {
  href: string;
  title: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-3 text-sm text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
    >
      <span className="truncate font-medium text-[color:var(--ds-gray-1000)]">
        {title}
      </span>
      <ArrowRight
        className="size-4 shrink-0 text-[color:var(--ds-gray-700)] transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--ds-gray-1000)]"
        aria-hidden
      />
    </Link>
  );
}

// ============================================================================
// Body — empty state, loading, no-results, results
// ============================================================================

function SearchBody({
  query,
  isSearching,
  onSelect,
}: {
  query: string;
  isSearching: boolean;
  onSelect: () => void;
}) {
  const { hits } = useHits<HitFields>();

  // Empty state — a subtle centred search glyph. No section list,
  // no copy. The placeholder + ⌘K shortcut do the labelling work.
  if (query.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <SearchIcon
          className="size-12 text-[color:var(--ds-gray-500)]"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2
          className="size-5 animate-spin text-[color:var(--ds-gray-700)]"
          aria-hidden
        />
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-[color:var(--ds-gray-700)]">
        No results for &ldquo;{query}&rdquo;.
      </div>
    );
  }

  // Flat list — Algolia's relevance ordering, top 8 results.
  return (
    <div className="px-2 py-2">
      {hits.slice(0, 8).map((hit) => (
        <HitRow
          key={hit.objectID}
          href={hrefForHit(hit)}
          title={hit.title}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Input row — text field + close button
// ============================================================================

function SearchInput({
  isExpanded,
  onClose,
  onQueryChange,
  onSearchingChange,
}: {
  isExpanded: boolean;
  onClose: () => void;
  onQueryChange: (q: string) => void;
  onSearchingChange: (b: boolean) => void;
}) {
  const { query, refine } = useSearchBox();
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced refine + searching state
  useEffect(() => {
    if (localQuery.length > 0) onSearchingChange(true);
    const id = setTimeout(() => {
      refine(localQuery);
      onQueryChange(localQuery);
      onSearchingChange(false);
    }, 200);
    return () => clearTimeout(id);
  }, [localQuery, refine, onQueryChange, onSearchingChange]);

  // Auto-focus when the modal opens
  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  const reset = () => {
    setLocalQuery("");
    onClose();
  };

  return (
    <div className="flex items-center gap-2 border-b border-[color:var(--ds-gray-400)] px-4 py-2">
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="h-9 w-full bg-transparent text-base text-[color:var(--ds-gray-1000)] outline-none placeholder:text-[color:var(--ds-gray-700)]"
      />
      <Tooltip content="Close search" side="bottom">
        <IconButton
          onClick={reset}
          variant="tertiary"
          size="small"
          aria-label="Close search"
        >
          <X className="size-4" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

// ============================================================================
// Panel — wraps the input + body in a material-modal surface
// ============================================================================

function SearchPanel({
  isExpanded,
  onExpandChange,
}: {
  isExpanded: boolean;
  onExpandChange: (b: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleClose = useMemo(
    () => () => {
      setQuery("");
      onExpandChange(false);
    },
    [onExpandChange],
  );

  return (
    <div className="material-modal flex w-full max-w-xl flex-col overflow-hidden bg-[color:var(--ds-background-100)]">
      <SearchInput
        isExpanded={isExpanded}
        onClose={handleClose}
        onQueryChange={setQuery}
        onSearchingChange={setIsSearching}
      />
      <div className="relative h-[432px] overflow-y-auto">
        <SearchBody
          query={query}
          isSearching={isSearching}
          onSelect={handleClose}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Public component
// ============================================================================

export default function Search({
  isExpanded,
  onExpandChange,
}: {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure hitsPerPage={50} />
      <SearchPanel isExpanded={isExpanded} onExpandChange={onExpandChange} />
    </InstantSearch>
  );
}
