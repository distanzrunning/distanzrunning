"use client";

// ============================================================================
// MegaMenuPanel
// ============================================================================
//
// Mega-menu panel rendered inside a Radix NavigationMenu.Content (the
// Masthead's canvas expand-down viewport). Pure presentational shell —
// takes one section's config (intro copy + CTA + links + featured item)
// and renders the layout. The parent owns the section taxonomy and
// forwards the right slice per Content slot.
//
// Design: Prismic's mega-menu anatomy on Stride tokens. Their palette maps
// 1:1 — gray-15 #151515 (ink) → textDefault, gray-F7 hover → --ds-gray-100,
// gray-EE borders → borderSubtle.
//   - 18px-ish semibold column headings (text-heading-16), sentence case
//   - link cards: hairline-outlined blocks (title + description) that fully
//     INVERT on hover — ink fill, surface-coloured text
//   - featured: products render the canonical ArticleCard (lg) — image +
//     "Featured" badge, category · date meta line, title; race guides
//     render the canonical RaceCard (category badge, location, event-date
//     pill) matching the /races index. Both are whole-card clickable via
//     the DS overlay-link pattern with image settle-zoom on hover
//   - full-height hairline dividers between columns; py-12; columns align
//     to the 1400px site grid
// ----------------------------------------------------------------------------
// Left column   — section intro (heading + lede + CTA)
// Middle column — "Explore" outlined link cards
// Right column  — "Featured" media card

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import ArticleCard, {
  type ArticleCardCategory,
} from "@/components/ui/ArticleCard";
import RaceCard from "@/components/RaceCard";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/components/ui/SiteNavigationMenu";

// ----------------------------------------------------------------------------
// Featured item shape (union of product / race) — the panel doesn't care
// which kind of featured object it got, it just needs an image, a title,
// a description string, and a destination href. The parent builds those
// values from the raw Sanity object before passing them in.
// ----------------------------------------------------------------------------

export interface MegaMenuFeatured {
  title: string;
  href: string;
  image?: SanityImageSource | null;
  /** Article-card meta line: the item's category (label + href). */
  category?: ArticleCardCategory | null;
  /** Pre-formatted display date for the meta line, e.g. "29 May 2026". */
  publishedAt?: string;
  /** Race-guide variant — when set the panel renders the canonical
      RaceCard (category badge, location, event-date pill) instead of
      the ArticleCard, matching the /races index presentation. */
  race?: {
    /** ISO event date — RaceCard formats its own date pill. */
    eventDate?: string;
    location?: string;
    /** Race category title (Marathon / Half Marathon / …). */
    category?: string;
  };
}

export interface MegaMenuPanelProps {
  /** Section taxonomy key — used as a stable id for the panel. */
  sectionKey: string;
  /** Section headline, e.g. "Shoes that work". */
  heading: string;
  /** Lede beneath the heading (copy-16 — the DS subtitle slot under a
      heading-32; copy-14 read too small here). */
  tagline?: string;
  /** CTA label, e.g. "Browse all shoes". */
  ctaLabel: string;
  /** CTA destination. */
  ctaHref: string;
  /** The link cards rendered in the middle column. */
  links: ReadonlyArray<CategoryItem>;
  /** Featured item rendered in the right column, or null/undefined. */
  featured?: MegaMenuFeatured | null;
  className?: string;
}

export default function MegaMenuPanel({
  sectionKey,
  heading,
  tagline,
  ctaLabel,
  ctaHref,
  links,
  featured,
  className,
}: MegaMenuPanelProps) {
  return (
    <div
      // Equal thirds on the 1400px site grid (the viewport wrapper carries
      // the container + px), Prismic-style. Height is content-driven;
      // align-items:stretch keeps the hairline dividers and the intro
      // column's bottom-anchored CTA spanning the full panel.
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] py-12",
        className,
      )}
      data-mega-menu-panel={sectionKey}
    >
      {/* ---------------------------------------------------------- */}
      {/* Left column — section intro                                */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col pr-10">
        <h3 className="text-heading-32 text-balance text-textDefault">
          {heading}
        </h3>
        {tagline && (
          <p className="mt-3 max-w-[36ch] text-copy-16 text-textSubtle">
            {tagline}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Middle column — link rows (Prismic "Features" anatomy)     */}
      {/* ---------------------------------------------------------- */}
      <div className="h-full border-l border-borderSubtle px-10">
        <div className="flex flex-col gap-3">
          {links.map((item) => (
            <NavigationMenuPrimitive.Link asChild key={item.href}>
              <Link
                href={item.href}
                // Slim row: muted 24px section icon + bold label on the left,
                // a trailing arrow at 30% opacity on the right. Hover (or
                // keyboard focus) inks the icon and fades the arrow to full —
                // Prismic's Features-row affordance, no background block.
                className="group/item flex items-center justify-between leading-6 text-textDefault focus-visible:outline-none"
              >
                <span className="flex items-center text-heading-16">
                  {/* Icon tile mirroring Prismic's built-in squircle backdrop:
                      the fill is currentColor at 15% via color-mix, so tint
                      and glyph ink up together on hover — muted at rest,
                      textDefault on hover/focus. */}
                  <span
                    className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-sm text-textSubtler transition-colors group-hover/item:text-textDefault group-focus-visible/item:text-textDefault"
                    style={{
                      background:
                        "color-mix(in srgb, currentColor 15%, transparent)",
                    }}
                  >
                    <item.Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {item.label}
                </span>
                <ArrowRight
                  className="h-6 w-6 opacity-30 transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
                  aria-hidden
                />
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}

          {/* Section CTA — Prismic's "Explore all features" treatment: bold
              underlined ink link closing the list (an underlined text link
              reads as "this list continues"; a filled button here would
              outweigh everything around it). */}
          <NavigationMenuPrimitive.Link asChild>
            <Link
              href={ctaHref}
              className="mt-2 self-start text-heading-16 text-textDefault underline underline-offset-8 transition-opacity hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-none"
            >
              {ctaLabel}
            </Link>
          </NavigationMenuPrimitive.Link>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Right column — featured media card (Prismic "Popular")     */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col border-l border-borderSubtle pl-10">
        {featured?.race ? (
          // Race guides render the canonical RaceCard — the same anatomy
          // as the /races index: inverted category badge over the image,
          // title + location, event-date pill. Image URL resolved at the
          // data boundary per the DS convention (16/8.75 crop).
          <RaceCard
            className="w-full max-w-[480px]"
            href={featured.href}
            title={featured.title}
            badge="Featured"
            badgeVariant="gray"
            badgeSize="md"
            eventDate={featured.race.eventDate}
            location={featured.race.location}
            category={featured.race.category}
            imageUrl={
              featured.image
                ? urlFor(featured.image)
                    .width(960)
                    .height(525)
                    .auto("format")
                    .url()
                : undefined
            }
          />
        ) : featured ? (
          // The canonical ArticleCard, mega-menu subset: image + badge +
          // meta line (category · date) + title. No excerpt — the menu
          // card stays scannable; the excerpt slot is for page placements.
          // Image URL resolved here at the data boundary per the DS
          // convention.
          <ArticleCard
            className="w-full max-w-[480px]"
            size="lg"
            href={featured.href}
            title={featured.title}
            badge="Featured"
            badgeVariant="gray"
            badgeSize="md"
            imageUrl={
              featured.image
                ? urlFor(featured.image)
                    .width(960)
                    .height(600)
                    .auto("format")
                    .url()
                : null
            }
            imageSizes="480px"
            category={featured.category ?? undefined}
            publishedAt={featured.publishedAt}
          />
        ) : (
          // Stable layout: no featured item still renders a placeholder at
          // roughly the card's footprint so the panel doesn't shrink for
          // unfeatured sections.
          <div className="flex aspect-[10/7] w-full max-w-[480px] items-center justify-center rounded-lg border border-dashed border-borderSubtle bg-[var(--ds-gray-100)] p-4 text-copy-14 text-textSubtle">
            No featured item yet
          </div>
        )}
      </div>
    </div>
  );
}
