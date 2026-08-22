// src/app/races/RacePagination.tsx
//
// Numbered pagination for the /races grid (user call 2026-08-22:
// page numbers, 24 per page). Server component — pages are URL
// navigation, so every number is a real <Link> (crawlable,
// open-in-new-tab, back-button-correct), soft-navigating like the
// filter round-trips. The DS Pagination primitive is a prev/next
// rail without numbers, so this composes ButtonLink instead: the
// current page wears the segmented-control selected recipe (gray-100
// fill), neighbours are tertiary ghosts.
//
// Window: 1 … (page±1) … last, ellipses only where pages are
// actually skipped. Prev/Next chevrons omit at the ends (the DS
// Pagination convention) rather than rendering disabled.

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Pages shown around the current one on each side. */
const WINDOW = 1;

function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const wanted = new Set<number>([1, totalPages]);
  for (let n = page - WINDOW; n <= page + WINDOW; n++) {
    if (n >= 1 && n <= totalPages) wanted.add(n);
  }
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      // A single skipped page reads better as the page itself than
      // as an ellipsis of one.
      if (curr - prev === 2) out.push(prev + 1);
      else if (curr - prev > 2) out.push("gap");
    }
    out.push(sorted[i]);
  }
  return out;
}

export default function RacePagination({
  page,
  totalPages,
  hrefForPage,
}: {
  /** Current 1-based page. */
  page: number;
  totalPages: number;
  /** Builds the href for a page — current filters preserved,
   *  page param normalised (absent for page 1). */
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      {page > 1 && (
        <ButtonLink
          href={hrefForPage(page - 1)}
          prefetch
          variant="tertiary"
          size="small"
          shape="square"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </ButtonLink>
      )}
      {pageWindow(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="px-1 text-copy-14 text-textSubtler"
          >
            …
          </span>
        ) : (
          <ButtonLink
            key={item}
            href={hrefForPage(item)}
            prefetch
            variant="tertiary"
            size="small"
            shape="square"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              item === page &&
                "bg-[var(--ds-gray-100)] text-[color:var(--ds-gray-1000)]",
            )}
          >
            {item}
          </ButtonLink>
        ),
      )}
      {page < totalPages && (
        <ButtonLink
          href={hrefForPage(page + 1)}
          prefetch
          variant="tertiary"
          size="small"
          shape="square"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </ButtonLink>
      )}
    </nav>
  );
}
