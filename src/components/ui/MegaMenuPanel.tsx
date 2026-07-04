"use client";

// ============================================================================
// MegaMenuPanel
// ============================================================================
//
// Premium three-column mega-menu panel rendered inside a Radix
// NavigationMenu.Content (the Masthead's canvas expand-down viewport).
// Pure presentational shell — takes one section's config (intro copy +
// CTA + link grid + featured item) and renders the layout. The parent
// owns the section taxonomy and forwards the right slice per Content slot.
//
// Design (AngelList / Frontify / Parallel-style, on Stride tokens):
//   - uppercase micro-label eyebrow on every column
//   - full-height hairline dividers (borderSubtle) between columns
//   - link rows: icon tile (surface + hairline, 6px) + title + muted
//     description, flush gray-100 hover
//   - featured: image (6px radius + hairline, settle-zoom on hover) with
//     the caption below it — no filled card
//   - generous vertical padding; columns align to the 1400px site grid
// ----------------------------------------------------------------------------
// Left column   — section intro (eyebrow + heading + lede + CTA)
// Middle column — "Explore" link grid (icon + title + description)
// Right column  — "Featured" image card

import Link from "next/link";
import Image from "next/image";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ButtonLink } from "@/components/ui/Button";
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
  description?: string;
  href: string;
  image?: SanityImageSource | null;
}

export interface MegaMenuPanelProps {
  /** Section taxonomy key — used as a stable id for the eyebrows. */
  sectionKey: string;
  /** Eyebrow label above the section heading, e.g. "Shoes". */
  eyebrow: string;
  /** Section headline, e.g. "Shoes that work". */
  heading: string;
  /** Lede beneath the heading. */
  tagline: string;
  /** CTA label, e.g. "Browse all shoes". */
  ctaLabel: string;
  /** CTA destination. */
  ctaHref: string;
  /** The link grid items rendered in the middle column. */
  links: ReadonlyArray<CategoryItem>;
  /** Featured item rendered in the right column, or null/undefined. */
  featured?: MegaMenuFeatured | null;
  className?: string;
}

// Uppercase micro-label used as the column eyebrow (the AngelList
// "BY PRODUCT SUITE" / Planhat "CAPABILITIES" pattern). textSubtle keeps
// it AA-readable at 13px; the tracking does the "premium" work.
function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-copy-13 font-medium uppercase tracking-[0.08em] text-textSubtle",
        className,
      )}
    >
      {children}
    </p>
  );
}

export default function MegaMenuPanel({
  sectionKey,
  eyebrow,
  heading,
  tagline,
  ctaLabel,
  ctaHref,
  links,
  featured,
  className,
}: MegaMenuPanelProps) {
  // Column-major fill over two columns: ceil(n/2) rows, so 5 links pack
  // 3 + 2 and 3 links pack 2 + 1 — the first column always carries more,
  // which reads deliberate rather than lopsided.
  const rows = Math.max(1, Math.ceil(links.length / 2));

  return (
    <div
      // 1:2:1 fluid columns on the 1400px site grid (the viewport wrapper
      // carries the container + px). Height is content-driven — Radix reads
      // --radix-navigation-menu-viewport-height from the active Content's
      // measured box. align-items:stretch keeps the hairline dividers and
      // the left column's bottom-anchored CTA spanning the full panel.
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] py-10",
        className,
      )}
      data-mega-menu-panel={sectionKey}
    >
      {/* ---------------------------------------------------------- */}
      {/* Left column — section intro                                */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col pr-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-4 text-heading-32 text-balance text-textDefault">
          {heading}
        </h3>
        <p className="mt-3 max-w-[36ch] text-copy-14 text-textSubtle">
          {tagline}
        </p>
        <div className="mt-auto pt-8">
          {/* ButtonLink renders as an <a> so Radix's NavigationMenu.Link can
              forward its focus/dismiss wiring to the same anchor — no illegal
              <button>-inside-<a> nesting. */}
          <NavigationMenuPrimitive.Link asChild>
            <ButtonLink href={ctaHref} size="small">
              {ctaLabel}
            </ButtonLink>
          </NavigationMenuPrimitive.Link>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Middle column — link grid                                  */}
      {/* ---------------------------------------------------------- */}
      <div className="h-full border-l border-borderSubtle px-10">
        <Eyebrow className="pl-3">Explore</Eyebrow>
        <div
          className="mt-4 grid grid-flow-col grid-cols-2 gap-x-6 gap-y-1"
          style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        >
          {links.map((item) => (
            <NavigationMenuPrimitive.Link asChild key={item.href}>
              <Link
                href={item.href}
                className="group/item flex items-start gap-3 rounded-sm p-3 transition-colors hover:bg-[var(--ds-gray-100)] focus-visible:bg-[var(--ds-gray-100)] focus-visible:outline-none"
              >
                {/* Icon tile — surface + hairline control chrome (Parallel
                    style); ink follows the row's hover via currentColor. */}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-borderSubtle bg-surface text-textSubtle transition-colors group-hover/item:text-textDefault">
                  <item.Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-heading-16 text-textDefault">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-copy-14 text-textSubtle">
                    {item.description}
                  </span>
                </span>
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Right column — featured card                               */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col border-l border-borderSubtle pl-10">
        <Eyebrow>Featured</Eyebrow>
        {featured ? (
          <NavigationMenuPrimitive.Link asChild>
            <Link
              href={featured.href}
              className="group mt-4 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-color)]"
            >
              <FeaturedImage image={featured.image} alt={featured.title} />
              {/* Caption below the image (no filled card) — per the DS card
                  convention, no hover underline on the title. */}
              <h4 className="mt-3 text-heading-16 text-textDefault">
                {featured.title}
              </h4>
              {featured.description && (
                <p className="mt-1 text-copy-14 text-textSubtle line-clamp-2">
                  {featured.description}
                </p>
              )}
            </Link>
          </NavigationMenuPrimitive.Link>
        ) : (
          // Stable layout: no featured item still renders a placeholder at
          // the image slot's aspect so the column keeps its footprint and the
          // panel doesn't shrink for unfeatured sections.
          <div className="mt-4 flex aspect-[4/3] w-full items-center justify-center rounded-sm border border-dashed border-borderSubtle bg-[var(--ds-gray-100)] p-4 text-copy-14 text-textSubtle">
            No featured item yet
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// FeaturedImage
// ----------------------------------------------------------------------------
//
// Resolves the Sanity image URL with urlFor (matching the ArticleCard
// convention) and renders it at 4/3 inside a hairline-bordered 6px frame.
// Hover uses the DS settle-zoom: the image rests at scale-[1.04] and
// settles to scale-100 on group-hover.

function FeaturedImage({
  image,
  alt,
}: {
  image: SanityImageSource | null | undefined;
  alt: string;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-borderSubtle bg-[var(--ds-gray-100)]">
      {image && (
        <Image
          src={urlFor(image).width(720).height(540).auto("format").url()}
          alt={alt}
          fill
          sizes="360px"
          className="scale-[1.04] object-cover transition-transform duration-300 ease-out group-hover:scale-100"
        />
      )}
    </div>
  );
}
