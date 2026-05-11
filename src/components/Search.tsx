// src/components/Search.tsx
//
// Public-site search modal — Algolia-backed via react-instantsearch.
// Exposes a single SearchModal presentation matching the
// original pre-refactor SiteHeader modal: centered card with
// a rounded surface + drop shadow, plain text input + ghost
// close button, fixed 432 px result list. Dialog.Content's own
// `w-[calc(100%-1rem)] md:max-w-xl` handles mobile vs desktop
// sizing — same chrome, just narrower on mobile.
//
// Hit URLs:
//   - post        → /articles/{slug}
//   - productPost → /{section}/{slug} — section is indexed by
//                   the algolia-sync route from productCategory
//   - raceGuide   → /races/{slug}

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

// ============================================================================
// Algolia client (shared between presentations)
// ============================================================================

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
// Body — empty state, loading, no-results, results. Shared between
// both presentations.
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
// Shared input-state hook. The two presentations need identical
// debounced refine + autofocus behaviour, just with different
// surrounding chrome.
// ============================================================================

function useSearchInputState({
  isExpanded,
  onQueryChange,
  onSearchingChange,
}: {
  isExpanded: boolean;
  onQueryChange: (q: string) => void;
  onSearchingChange: (b: boolean) => void;
}) {
  const { query, refine } = useSearchBox();
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localQuery.length > 0) onSearchingChange(true);
    const id = setTimeout(() => {
      refine(localQuery);
      onQueryChange(localQuery);
      onSearchingChange(false);
    }, 200);
    return () => clearTimeout(id);
  }, [localQuery, refine, onQueryChange, onSearchingChange]);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  return { localQuery, setLocalQuery, inputRef };
}

// ============================================================================
// Shared panel-state hook. Owns query / searching state and the
// "close + reset" handler, used by both presentations.
// ============================================================================

function useSearchPanelState(onExpandChange: (b: boolean) => void) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleClose = useMemo(
    () => () => {
      setQuery("");
      onExpandChange(false);
    },
    [onExpandChange],
  );
  return { query, setQuery, isSearching, setIsSearching, handleClose };
}

// ============================================================================
// Algolia wrapper — both presentations share the same client +
// index + hitsPerPage config, so we factor it out.
// ============================================================================

function SearchInstantSearch({ children }: { children: ReactNode }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure hitsPerPage={50} />
      {children}
    </InstantSearch>
  );
}

// ============================================================================
// SearchModal — desktop / tablet (md+). Original look: centered
// rounded card with shadow, plain text input + ghost close
// button, fixed 432 px result list.
// ============================================================================

export function SearchModal({
  isExpanded,
  onExpandChange,
}: {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}) {
  return (
    <SearchInstantSearch>
      <SearchModalPanel
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
      />
    </SearchInstantSearch>
  );
}

function SearchModalPanel({
  isExpanded,
  onExpandChange,
}: {
  isExpanded: boolean;
  onExpandChange: (b: boolean) => void;
}) {
  const { query, setQuery, isSearching, setIsSearching, handleClose } =
    useSearchPanelState(onExpandChange);
  return (
    <div
      className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl bg-[color:var(--ds-background-100)]"
      style={{ boxShadow: "var(--ds-shadow-modal)" }}
    >
      <SearchModalInput
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

function SearchModalInput({
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
  const { localQuery, setLocalQuery, inputRef } = useSearchInputState({
    isExpanded,
    onQueryChange,
    onSearchingChange,
  });
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
      <Tooltip content="Close search" side="bottom" showArrow={false}>
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

