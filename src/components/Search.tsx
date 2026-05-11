// src/components/Search.tsx
//
// Public-site search — Algolia-backed via react-instantsearch,
// rendered through the design-system `CommandMenu` primitive
// so look + behaviour match the rest of the cmdk-based search
// patterns documented in /admin/design-system/search.
//
// Architecture:
//   - InstantSearch + Configure wrap the whole thing so the
//     useSearchBox / useHits hooks have a client + index.
//   - SearchInner is the controlled CommandMenu — its input
//     value is wired to Algolia's `refine` (cmdk's own filter
//     is disabled via `filter={() => 1}` since Algolia already
//     produces a relevance-ranked list).
//   - Hits render as CommandMenu.Item rows, grouped by content
//     type (Articles · Shoes · Gear · Nutrition · Races) so the
//     menu reads as a structured navigator rather than a flat
//     soup. Selecting a hit pushes its public URL via the Next
//     router and closes the menu.
//
// Hit URLs:
//   - post        → /articles/{slug}
//   - productPost → /{section}/{slug} — section is indexed by
//                   the algolia-sync route from productCategory
//   - raceGuide   → /races/{slug}

"use client";

import { useMemo } from "react";
import {
  Configure,
  InstantSearch,
  useHits,
  useSearchBox,
} from "react-instantsearch";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { CommandMenu } from "@/components/ui/CommandMenu";

// ============================================================================
// Algolia client
// ============================================================================

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "distanz_content";

// ============================================================================
// Hit helpers
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
  // productPost / legacy gearPost — section indexed from
  // productCategory->section. Fall back to /gear for any
  // pre-resync records that don't carry it.
  const section =
    hit.section === "shoes" || hit.section === "nutrition"
      ? hit.section
      : "gear";
  return `/${section}/${hit.slug}`;
}

// Section heading for a hit — used to group results.
function headingForHit(hit: HitType): string {
  if (hit._type === "post") return "Articles";
  if (hit._type === "raceGuide") return "Races";
  if (hit.section === "shoes") return "Shoes";
  if (hit.section === "nutrition") return "Nutrition";
  return "Gear";
}

const GROUP_ORDER: ReadonlyArray<string> = [
  "Articles",
  "Shoes",
  "Gear",
  "Nutrition",
  "Races",
];

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
      <Configure hitsPerPage={20} />
      <SearchInner isExpanded={isExpanded} onExpandChange={onExpandChange} />
    </InstantSearch>
  );
}

// ============================================================================
// CommandMenu-wired search inner — owns the wiring between the
// CommandMenu's controlled input and Algolia's refine, plus the
// hit grouping + navigation.
// ============================================================================

function SearchInner({
  isExpanded,
  onExpandChange,
}: {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}) {
  const router = useRouter();
  const { query, refine } = useSearchBox();
  const { hits } = useHits<HitFields>();

  const handleClose = () => {
    refine("");
    onExpandChange(false);
  };

  const handleSelect = (hit: HitType) => {
    refine("");
    onExpandChange(false);
    router.push(hrefForHit(hit));
  };

  // Group hits by section heading, preserving relevance order
  // within each group and the canonical site-nav order across
  // groups. Algolia's hit limit (20) keeps the rendered list
  // short enough that all groups fit in the 436 px scrollable
  // region without truncation.
  const grouped = useMemo(() => {
    const buckets = new Map<string, HitType[]>();
    for (const hit of hits) {
      const heading = headingForHit(hit);
      const bucket = buckets.get(heading) ?? [];
      bucket.push(hit);
      buckets.set(heading, bucket);
    }
    return GROUP_ORDER.filter((heading) => buckets.has(heading)).map(
      (heading) => ({ heading, items: buckets.get(heading) ?? [] }),
    );
  }, [hits]);

  return (
    <CommandMenu
      open={isExpanded}
      onClose={handleClose}
      placeholder="Search articles, gear, races…"
      value={query}
      onValueChange={refine}
      // Algolia already ranks results — tell cmdk to render
      // every item it's handed instead of running its own
      // fuzzy filter on top of the title strings.
      filter={() => 1}
    >
      {grouped.map((group) => (
        <CommandMenu.Group key={group.heading} heading={group.heading}>
          {group.items.map((hit) => (
            <CommandMenu.Item
              key={hit.objectID}
              value={hit.objectID}
              icon={<ArrowRight className="size-4" />}
              onSelect={() => handleSelect(hit)}
            >
              {hit.title}
            </CommandMenu.Item>
          ))}
        </CommandMenu.Group>
      ))}
    </CommandMenu>
  );
}
