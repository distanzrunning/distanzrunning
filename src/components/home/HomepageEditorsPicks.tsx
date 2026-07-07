// src/components/home/HomepageEditorsPicks.tsx
//
// Homepage Editor's Picks — Quartr's anatomy: section header (title +
// tagline + view-all), then a 4-column grid. The main pick spans three
// columns and is STICKY on lg, so the right rail of three smaller cards
// scrolls past it. Rail cards are list rows on mobile (thumbnail left),
// a 3-up row on tablet, and a stacked column on lg — via ArticleCard's
// mobileLayout="row" + responsive grid classes.
//
// Data: curated featuredSlides[1..] (the hero owns slide 0), cross-type;
// when curation holds fewer than four, recent posts backfill so the
// section never renders lopsided.

import { ChevronRight } from "lucide-react";

import ArticleCard from "@/components/ui/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { sanityFetch } from "@/sanity/lib/live";
import {
  editorsPicksQuery,
  editorsPicksBackfillQuery,
} from "@/sanity/queries/editorsPicksQuery";
import { heroArticleQuery } from "@/sanity/queries/heroArticleQuery";
import { urlFor } from "@/sanity/lib/image";
import { formatDisplayDate } from "@/lib/dates";

interface Pick {
  _id: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  mainImage?: unknown;
  lqip?: string | null;
  kicker?: string | null;
  kickerHref?: string | null;
  href: string;
}

function SeeAllButton() {
  return (
    <ButtonLink
      href="/articles"
      variant="tertiary"
      size="medium"
      suffixIcon={<ChevronRight />}
    >
      See all articles
    </ButtonLink>
  );
}

function cardProps(pick: Pick, width: number, height: number) {
  return {
    href: pick.href,
    title: pick.title,
    imageUrl: pick.mainImage
      ? urlFor(pick.mainImage as Parameters<typeof urlFor>[0])
          .width(width)
          .height(height)
          .auto("format")
          .url()
      : null,
    blurDataURL: pick.lqip,
    category: pick.kicker
      ? { label: pick.kicker, href: pick.kickerHref ?? undefined }
      : null,
    publishedAt: pick.publishedAt ? formatDisplayDate(pick.publishedAt) : null,
  };
}

export default async function HomepageEditorsPicks() {
  const [{ data: curated }, { data: hero }] = await Promise.all([
    sanityFetch({ query: editorsPicksQuery }),
    sanityFetch({ query: heroArticleQuery }),
  ]);

  let picks: Pick[] = curated ?? [];
  if (picks.length < 4) {
    const usedIds = [hero?._id, ...picks.map((p) => p._id)].filter(Boolean);
    const { data: backfill } = await sanityFetch({
      query: editorsPicksBackfillQuery,
      params: { usedIds },
    });
    picks = [...picks, ...(backfill ?? [])].slice(0, 4);
  }
  if (!picks.length) return null;

  const [main, ...rail] = picks;

  return (
    <section
      aria-label="Editor's picks"
      className="mx-auto w-full max-w-content px-6 py-16 lg:py-20"
    >
      <div className="flex w-full flex-col gap-8 md:gap-11">
        {/* Header row — same anatomy as Latest News. */}
        <div className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <h2 className="text-heading-24 md:text-heading-32 text-balance text-textDefault">
              Editor&rsquo;s Picks
            </h2>
            <p className="text-copy-14 md:text-copy-16 text-balance text-textSubtle">
              Hand-picked stories from our editors.
            </p>
          </div>
          <div className="hidden md:block">
            <SeeAllButton />
          </div>
        </div>

        {/* Main pick (3 cols, sticky on lg — the rail scrolls past it;
            top offset clears the condensed masthead) + right rail. */}
        <div className="grid w-full grid-cols-1 gap-12 md:gap-4 lg:grid-cols-4">
          <div className="top-24 self-start lg:sticky lg:col-span-3">
            <ArticleCard
              size="xl"
              chrome="plain"
              imageRatio="16/8.75"
              excerpt={main.excerpt}
              imageSizes="(max-width: 1024px) 100vw, 920px"
              {...cardProps(main, 1840, 1006)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 lg:grid-cols-1 lg:gap-6">
            {rail.map((pick) => (
              <ArticleCard
                key={pick._id}
                size="sm"
                chrome="plain"
                imageRatio="16/8.75"
                mobileLayout="row"
                imageSizes="(max-width: 768px) 33vw, (max-width: 1024px) 33vw, 300px"
                {...cardProps(pick, 720, 394)}
              />
            ))}
          </div>
        </div>

        {/* Mobile view-all — below the grid. */}
        <div className="md:hidden">
          <SeeAllButton />
        </div>
      </div>
    </section>
  );
}
