import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import ArticleCard from "@/components/ArticleCard";

// ============================================================================
// HomepageBreakingNews
// ============================================================================
//
// Editorial row that sits below the hero carousel. Three article
// cards on desktop, stacked on mobile. Items come from the
// `breakingNewsItems` array on the homepageSettings singleton —
// drag-and-drop ordering in Studio.
//
// Section anatomy is modelled on Quartr's "Recent articles":
//   - Header: title + subtitle on the left, "See all articles ›"
//     ghost button on the right (md+)
//   - Grid: 1 col mobile, 3 cols md+
//   - Mobile shows the "See all articles" button below the grid

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
  /** Visible items count on desktop. Anything beyond is ignored on the homepage. */
  limit?: number;
}

const SEE_ALL_HREF = "/articles";

export default function HomepageBreakingNews({
  items,
  limit = 3,
}: HomepageBreakingNewsProps) {
  const visible = items.slice(0, limit);
  if (visible.length === 0) return null;

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8 md:gap-11">
        <header className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <h2
              className="text-balance font-headline font-semibold text-[color:var(--ds-gray-1000)]"
              style={{
                fontSize: "clamp(28px, 3.4vw, 38px)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Breaking news
            </h2>
            <p className="text-balance text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)] md:text-[19px]">
              The latest stories from across running.
            </p>
          </div>

          <SeeAllLink className="hidden md:inline-flex" />
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

        <div className="flex md:hidden">
          <SeeAllLink className="inline-flex" />
        </div>
      </div>
    </section>
  );
}

function SeeAllLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href={SEE_ALL_HREF}
      className={`group items-center gap-1 rounded-md border border-transparent px-2.5 py-2 text-[13px] font-medium text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] ${className}`.trim()}
    >
      <span className="px-1">See all articles</span>
      <ChevronRight
        className="size-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
