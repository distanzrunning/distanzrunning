import { ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import ArticleCard from "@/components/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";

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
  kickerHref?: string | null;
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

  // Faint registration-cross grid, the kind an editor sees on a
  // paste-up board. Pattern lives in globals.css under
  // --newsprint-cross so the stroke colour flips between black
  // (light) and white (dark) automatically.
  const newsprintBg: React.CSSProperties = {
    backgroundImage: "var(--newsprint-cross)",
  };

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div
        className="flex w-full max-w-[1400px] flex-col gap-8 rounded-xl border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-6 md:gap-11 md:p-10 lg:p-12 dark:bg-[color:var(--ds-background-200)]"
        style={newsprintBg}
      >
        <header className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 inline-flex items-center gap-2 self-start rounded-full bg-[color:var(--ds-red-100)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--ds-red-800)] dark:text-[color:var(--ds-red-900)]">
              <span
                aria-hidden
                className="relative inline-flex size-2 items-center justify-center"
              >
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[color:var(--ds-red-800)] opacity-60 dark:bg-[color:var(--ds-red-900)]" />
                <span className="relative inline-flex size-2 rounded-full bg-[color:var(--ds-red-800)] dark:bg-[color:var(--ds-red-900)]" />
              </span>
              Breaking
            </h2>

            <p className="text-balance text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)] md:text-[19px]">
              Stories moving the sport this week.
            </p>
          </div>

          <ButtonLink
            href={SEE_ALL_HREF}
            variant="default"
            size="small"
            suffixIcon={<ChevronRight />}
            className="hidden md:inline-flex"
          >
            All articles
          </ButtonLink>
        </header>

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-12">
          {visible.map((item) => {
            const imageUrl = item.mainImage
              ? urlFor(item.mainImage).width(1200).auto("format").url()
              : undefined;
            const blurDataURL = item.mainImage
              ? urlFor(item.mainImage)
                  .width(16)
                  .height(9)
                  .blur(20)
                  .auto("format")
                  .url()
              : undefined;
            return (
              <ArticleCard
                key={item._id}
                href={item.href}
                title={item.title}
                publishedAt={item.publishedAt ?? ""}
                kicker={item.kicker}
                kickerHref={item.kickerHref ?? undefined}
                excerpt={item.excerpt}
                imageUrl={imageUrl}
                blurDataURL={blurDataURL}
              />
            );
          })}
        </div>

        <div className="md:hidden">
          <ButtonLink
            href={SEE_ALL_HREF}
            variant="default"
            size="small"
            suffixIcon={<ChevronRight />}
            className="w-full"
          >
            All articles
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
