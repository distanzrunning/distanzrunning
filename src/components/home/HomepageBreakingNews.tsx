import { ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import ArticleCard from "@/components/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";

// ============================================================================
// HomepageBreakingNews
// ============================================================================
//
// Editorial row that sits below the hero carousel. Three article
// cards on desktop, stacked on mobile. Items come from the
// `breakingNewsItems` array on the homepageSettings singleton —
// drag-and-drop ordering in Studio.
//
// The whole row lives inside a bordered panel so it reads as a
// distinct "Breaking" surface rather than a plain content row.
// Backgrounds use the canvas tokens — bg-100 (light) / bg-200
// (dark) — so the panel reasserts the canvas colour against the
// PageFrame surface that wraps it (which is the inverse pair).
//
// Section anatomy follows Quartr's "Recent articles" header (title
// + subtitle on the left, ghost button on the right), with a small
// red live-dot eyebrow above the title to signal urgency.

export type BreakingNewsItem = {
  _id: string;
  _type: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource | null;
  kicker?: string;
  href: string;
};

interface HomepageBreakingNewsProps {
  items: ReadonlyArray<BreakingNewsItem>;
  /** Visible items on desktop. Anything beyond is ignored on the homepage. */
  limit?: number;
}

const SEE_ALL_HREF = "/articles";

export default function HomepageBreakingNews({
  items,
  limit = 3,
}: HomepageBreakingNewsProps) {
  const visible = items.slice(0, limit);
  if (visible.length === 0) return null;

  // Faint diagonal-line texture, newsprint-style. Drawn with a
  // repeating-linear-gradient so the stripe colour can flow through
  // a DS rgb-tuple token (--ds-gray-1000-rgb is near-black in light
  // and near-white in dark — flips automatically) at 6% opacity.
  const newsprintBg: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(-45deg, rgba(var(--ds-gray-1000-rgb), 0.06) 0, rgba(var(--ds-gray-1000-rgb), 0.06) 1px, transparent 1px, transparent 8px)",
  };

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div
        className="flex w-full max-w-[1400px] flex-col gap-8 rounded-xl border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-6 md:gap-11 md:p-10 lg:p-12 dark:bg-[color:var(--ds-background-200)]"
        style={newsprintBg}
      >
        <header className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--ds-red-800)]">
              <span
                aria-hidden
                className="relative inline-flex size-2 items-center justify-center"
              >
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[color:var(--ds-red-800)] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[color:var(--ds-red-800)]" />
              </span>
              Breaking
            </div>

            <p className="text-balance text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)] md:text-[19px]">
              Stories moving the sport this week.
            </p>
          </div>

          <ButtonLink
            href={SEE_ALL_HREF}
            variant="tertiary"
            size="small"
            suffixIcon={<ChevronRight />}
            className="hidden md:inline-flex"
          >
            See all articles
          </ButtonLink>
        </header>

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-12">
          {visible.map((item) => (
            <ArticleCard
              key={item._id}
              href={item.href}
              title={item.title}
              publishedAt={item.publishedAt ?? ""}
              kicker={item.kicker}
              excerpt={item.excerpt}
              image={item.mainImage ?? undefined}
            />
          ))}
        </div>

        <div className="md:hidden">
          <ButtonLink
            href={SEE_ALL_HREF}
            variant="tertiary"
            size="small"
            suffixIcon={<ChevronRight />}
          >
            See all articles
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
