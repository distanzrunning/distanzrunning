// src/app/(public)/(site)/(with-newsletter)/layout.tsx
//
// Every public page EXCEPT the /races index, which sits outside this
// group: its full-bleed MAP view owns the whole viewport below the
// masthead, where a newsletter band is dead weight (user call
// 2026-08-21). The index's GRID view renders this band's markup
// itself (user call 2026-08-24) — keep the two in sync. Route-group
// split, not pathname sniffing — the same decision that removed
// x-pathname from the chrome.
//
// Appends the pre-footer Shakeout band inside <main>'s flex column:
// children sit in a flex-1 wrapper so the band stays pinned against
// the footer on short pages (the band carries the TOP border only;
// the Footer's own border-t is its bottom edge — a border-b here
// would double it).
//
// /races/[raceSlug] and /races/calendar live under this group's own
// races/ segment (parallel segments across groups don't collide) —
// the detail and calendar pages keep the band.

import { ReactNode } from "react";

import NewsletterSignup from "@/components/ui/NewsletterSignup";

export default function WithNewsletterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>
      <section
        aria-label="Newsletter signup"
        className="border-t border-borderSubtle"
      >
        {/* Content grid — the band, the footer below and the page
            sections above all share one left edge. */}
        <div className="mx-auto w-full max-w-content px-4 py-12 lg:py-16">
          <NewsletterSignup chrome="band" source="pre_footer" />
        </div>
      </section>
    </>
  );
}
