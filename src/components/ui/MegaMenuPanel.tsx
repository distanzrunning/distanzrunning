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
// Design (Flowbite mega-menu structure on Stride tokens):
//   - uppercase micro-label eyebrow on every column
//   - full-height hairline dividers (borderSubtle) between columns
//   - link blocks (Flowbite "full dropdown" anatomy): semibold 16px title
//     + 14px muted description, block padding, flush gray-100 hover
//   - featured (Flowbite "with image" anatomy, widened): a full-bleed
//     image card filling the column — ink gradient wash, white overlaid
//     title + description, and an outline chip that inverts on hover;
//     image settle-zoom on hover
//   - generous vertical padding; columns align to the 1400px site grid
// ----------------------------------------------------------------------------
// Left column   — section intro (eyebrow + heading + lede + CTA)   (1fr)
// Middle column — "Explore" link blocks                            (1.4fr)
// Right column  — "Featured" full-bleed image card                 (1.4fr)

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

// Uppercase micro-label used as the column eyebrow. textSubtle keeps it
// AA-readable at 13px; the tracking does the "premium" work.
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
      // 1 : 1.4 : 1.4 fluid columns on the 1400px site grid (the viewport
      // wrapper carries the container + px) — the featured card gets equal
      // billing with the link grid instead of a quarter-width slot. Height
      // is content-driven; align-items:stretch keeps the hairline dividers
      // and the full-height featured card spanning the panel.
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] py-10",
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
      {/* Middle column — link blocks (Flowbite anatomy)             */}
      {/* ---------------------------------------------------------- */}
      <div className="h-full border-l border-borderSubtle px-8">
        <Eyebrow className="pl-3">Explore</Eyebrow>
        <div
          className="mt-4 grid grid-flow-col grid-cols-2 gap-x-4 gap-y-1"
          style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        >
          {links.map((item) => (
            <NavigationMenuPrimitive.Link asChild key={item.href}>
              <Link
                href={item.href}
                className="block rounded-sm p-3 transition-colors hover:bg-[var(--ds-gray-100)] focus-visible:bg-[var(--ds-gray-100)] focus-visible:outline-none"
              >
                <span className="block text-heading-16 text-textDefault">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-copy-14 text-textSubtle">
                  {item.description}
                </span>
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Right column — featured image card (Flowbite "with image") */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col border-l border-borderSubtle pl-8">
        <Eyebrow>Featured</Eyebrow>
        {featured ? (
          <NavigationMenuPrimitive.Link asChild>
            <Link
              href={featured.href}
              // Full-bleed media card: fills the column (flex-1) so it always
              // spans the panel height; content sits on an ink wash at the
              // bottom. group drives the image settle-zoom + chip invert.
              className="group relative mt-4 flex min-h-[260px] flex-1 flex-col justify-end overflow-hidden rounded-lg p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-color)]"
            >
              {featured.image ? (
                <Image
                  src={urlFor(featured.image)
                    .width(1000)
                    .height(640)
                    .auto("format")
                    .url()}
                  alt=""
                  fill
                  sizes="480px"
                  className="scale-[1.04] object-cover transition-transform duration-300 ease-out group-hover:scale-100"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--ds-gray-800)]" />
              )}
              {/* Ink wash so the white copy reads on any image — a deliberate
                  fixed-black overlay (image treatment, not a themed surface). */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5"
              />
              <div className="relative">
                <p className="text-heading-20 text-balance text-white">
                  {featured.title}
                </p>
                {featured.description && (
                  <p className="mt-1.5 text-copy-14 text-white/80 line-clamp-2">
                    {featured.description}
                  </p>
                )}
                {/* Outline chip (Flowbite's card CTA): white hairline, inverts
                    to white fill + ink text on card hover. A styled span, not
                    a ButtonLink — the whole card is already the <a>, and
                    anchors can't nest. Sized to the DS tiny button. */}
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-sm border border-white/60 px-3 py-1.5 text-copy-13 font-medium text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#0a0a0a]">
                  Read more
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          </NavigationMenuPrimitive.Link>
        ) : (
          // Stable layout: no featured item still renders a placeholder that
          // fills the same slot so the column keeps its footprint and the
          // panel doesn't shrink for unfeatured sections.
          <div className="mt-4 flex min-h-[260px] flex-1 items-center justify-center rounded-lg border border-dashed border-borderSubtle bg-[var(--ds-gray-100)] p-4 text-copy-14 text-textSubtle">
            No featured item yet
          </div>
        )}
      </div>
    </div>
  );
}
