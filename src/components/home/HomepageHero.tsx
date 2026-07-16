// src/components/home/HomepageHero.tsx
//
// Homepage hero — the main featured article. Server component: fetches
// the first curated homepage slide (falling back to the latest post),
// resolves images at the data boundary, and renders a chrome-less
// text-left / image-right feature.
//
// Design: Quartr's hero frame with 404 Media's editorial anatomy, on
// Stride tokens —
//   - text column (~5/12) · image (~7/12), vertically centred; mobile
//     stacks image on top
//   - text stack follows the ArticleCard grammar so the hero reads as
//     the same system as the mega-menu featured cards: meta line
//     (category · date) → title → excerpt → author byline (avatar +
//     name, 404-style)
//   - NO card chrome — the hero is a section, not a card in a grid;
//     the image carries the 12px radius + settle-zoom, and the whole
//     hero is clickable via the DS overlay-link pattern (the category
//     kicker punches through at z-10)
//   - title is the page's <h1>: sans heading scale (serif is reserved
//     for article-page titles + pull quotes), text-pretty

import Link from "next/link";
import Image from "next/image";
import { Dot } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { safeSanityFetch } from "@/sanity/lib/safeFetch";
import { heroArticleQuery } from "@/sanity/queries/heroArticleQuery";
import { urlFor } from "@/sanity/lib/image";
import { formatDisplayDate } from "@/lib/dates";

export default async function HomepageHero() {
  const { data: hero } = await safeSanityFetch({ query: heroArticleQuery });
  if (!hero) return null;

  const imageUrl = hero.mainImage
    ? urlFor(hero.mainImage).width(1600).height(1067).auto("format").url()
    : null;
  const avatarUrl = hero.author?.image
    ? urlFor(hero.author.image).width(48).height(48).auto("format").url()
    : null;
  const date = formatDisplayDate(hero.publishedAt);

  return (
    <section className="mx-auto w-full max-w-content px-4">
      {/* Hero top padding tuned so the TOTAL viewport-top→hero distance
          matches Quartr's (their 56px header + 48/64/144 padding =
          104/…/200 totals; our taller masthead means 32/48/80 here lands
          the same optical position — user call 2026-07-16). Bottom
          (pb-10 lg:pb-16) keeps the site rhythm. */}
      <article className="group relative flex flex-col-reverse gap-8 pt-8 md:pt-12 lg:pt-20 pb-10 lg:pb-16 lg:flex-row lg:items-center lg:gap-12">
        {/* Text column */}
        <div className="flex flex-col justify-center gap-4 lg:basis-5/12">
          {/* Meta line — category · date, the ArticleCard grammar one
              size up (copy-14). The kicker is its own link above the
              hero overlay. */}
          {(hero.kicker || date) && (
            <div className="flex items-center gap-1">
              {hero.kicker &&
                (hero.kickerHref ? (
                  <Link
                    href={hero.kickerHref}
                    className="relative z-10 rounded-sm text-copy-14 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ds-focus-color)]"
                  >
                    {hero.kicker}
                  </Link>
                ) : (
                  <span className="text-copy-14 text-textSubtle">
                    {hero.kicker}
                  </span>
                ))}
              {hero.kicker && date && (
                <span aria-hidden className="flex h-4 items-center">
                  <Dot className="w-5 text-textSubtler opacity-75" />
                </span>
              )}
              {date && (
                <time
                  dateTime={hero.publishedAt}
                  className="text-copy-14 text-textSubtle"
                >
                  {date}
                </time>
              )}
            </div>
          )}

          {/* Title — the homepage h1; its overlay makes the whole hero
              (image included) the click target. after:z-[1] lifts the
              overlay above the image column, which comes LATER in the
              DOM and would otherwise paint over it and swallow clicks;
              the kicker/byline links sit at z-10, still above. */}
          <h1 className="text-display-32 md:text-display-48 text-pretty text-textDefault">
            <Link
              href={hero.href}
              className="outline-none after:absolute after:inset-0 after:z-[1] focus-visible:after:rounded focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[color:var(--ds-focus-color)]"
            >
              {hero.title}
            </Link>
          </h1>

          {/* Excerpt */}
          {hero.excerpt && (
            <p className="text-copy-16 md:text-copy-18 text-pretty text-textSubtle line-clamp-3">
              {hero.excerpt}
            </p>
          )}

          {/* Author byline — DS Avatar + name (404-style); the date
              lives in the meta line above. Avatar carries the hairline
              ring and falls back to initials when the author has no
              photo. Links to the author page, punched above the hero
              overlay like the kicker. */}
          {hero.author?.name &&
            (hero.author.slug ? (
              <Link
                href={`/authors/${hero.author.slug}`}
                className="relative z-10 flex items-center gap-2 self-start rounded-sm pt-1 text-copy-14 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ds-focus-color)]"
              >
                <Avatar
                  src={avatarUrl ?? undefined}
                  alt=""
                  size={24}
                  fallback={hero.author.name}
                />
                {hero.author.name}
              </Link>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <Avatar
                  src={avatarUrl ?? undefined}
                  alt=""
                  size={24}
                  fallback={hero.author.name}
                />
                <span className="text-copy-14 text-textSubtle">
                  {hero.author.name}
                </span>
              </div>
            ))}
        </div>

        {/* Image — 3/2, 12px radius, settle-zoom on hero hover. The
            homepage LCP, so priority. The Sanity LQIP ships inline in
            the SSR HTML as the blur placeholder — the box is never
            empty, and the full image resolves over its own preview
            instead of popping in over flat gray (the load flicker). */}
        {/* rounded = 8px (our DEFAULT) — the editorial image radius
            (Vercel's article figures + Quartr's cards are stock
            rounded-lg = 8px; our remapped rounded-lg is 12px, the
            SURFACE/material radius). */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded lg:basis-7/12">
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse bg-[color:var(--ds-gray-100)]"
          />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={hero.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              placeholder={hero.lqip ? "blur" : "empty"}
              blurDataURL={hero.lqip ?? undefined}
              className="scale-[1.04] object-cover transition-transform duration-300 ease-out group-hover:scale-100 motion-reduce:scale-100 motion-reduce:transition-none"
            />
          )}
        </div>
      </article>
    </section>
  );
}
