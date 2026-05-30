"use client";

// ============================================================================
// MegaMenuPanel
// ============================================================================
//
// Frontify-style 3-column mega-menu panel rendered inside a Radix
// NavigationMenu.Content. Pure presentational shell — takes one
// section's config (intro copy + CTA + link grid + featured item) and
// renders the layout. The parent (SiteNavigationMenu) owns the section
// taxonomy and forwards the right slice for each Content slot.
//
// Layout: 376 / 752 / 376 columns separated by a 32 px gap, fixed at
// 468 px tall so the Viewport's --radix-navigation-menu-viewport-height
// stays uniform across sections (no jumpy resize between hovers).
// ----------------------------------------------------------------------------
// Left column   — section intro (eyebrow + serif heading + lede + CTA)
// Middle column — eyebrow + 2-col link grid (title + description per item)
// Right column  — eyebrow + featured card (image + title + excerpt)

import Link from "next/link";
import Image from "next/image";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type {
  CategoryItem,
  FeaturedProduct,
  FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";

// ----------------------------------------------------------------------------
// Featured item shape (union of product / race) — the panel doesn't
// care which kind of featured object it got, it just needs an image, a
// title, a description string, and a destination href. The parent
// builds those values from the raw Sanity object before passing them
// in.
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
  /** Eyebrow label above the section heading, e.g. "News". */
  eyebrow: string;
  /** Serif headline, e.g. "The latest in running". */
  heading: string;
  /** Lede beneath the heading. */
  tagline: string;
  /** CTA label, e.g. "View all news". */
  ctaLabel: string;
  /** CTA destination. */
  ctaHref: string;
  /** The link grid items rendered in the middle column. */
  links: ReadonlyArray<CategoryItem>;
  /** Featured item rendered in the right column, or null/undefined. */
  featured?: MegaMenuFeatured | null;
  className?: string;
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
  return (
    <div
      // 3-col grid hardcoded to the Frontify spec: left 376, middle
      // 752, right 376 with 32 px column gaps. Height is content-
      // driven — Radix reads --radix-navigation-menu-viewport-height
      // from the active Content's measured box, so a taller section
      // (longer heading, more links) gets a taller panel without
      // anything clipping against the Viewport's overflow-hidden.
      // Grid's default align-items:stretch keeps all three columns
      // the same height as the tallest within a given section, so the
      // CTA's mt-auto and the left-column divider line still anchor
      // to the bottom of the panel.
      className={cn(
        "grid w-full grid-cols-[376px_752px_376px] gap-x-8",
        className,
      )}
      data-mega-menu-panel={sectionKey}
    >
      {/* ---------------------------------------------------------- */}
      {/* Left column — section intro                                */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col border-r border-[color:var(--ds-gray-300)] pr-8">
        <p className="text-heading-14 text-[color:var(--ds-gray-900)]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-heading-32 font-serif text-balance text-[color:var(--ds-gray-1000)]">
          {heading}
        </h3>
        <p className="mt-3 text-copy-14 text-[color:var(--ds-gray-900)]">
          {tagline}
        </p>
        <div className="mt-auto">
          {/* ButtonLink renders as an <a> so we can let Radix's
              NavigationMenu.Link forward its data-state / focus
              wiring to the same anchor — no illegal <button>
              inside-<a> nesting. We pass href directly here; this
              isn't a Next <Link> so client-side navigation stays a
              standard browser link. The CTA destinations are top-
              level section indices (/articles, /shoes, etc) so the
              full-page navigation is fine. */}
          <NavigationMenuPrimitive.Link asChild>
            <ButtonLink href={ctaHref} size="medium">
              {ctaLabel}
            </ButtonLink>
          </NavigationMenuPrimitive.Link>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Middle column — category link grid                         */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col">
        <p className="pl-2 text-heading-14 text-[color:var(--ds-gray-900)]">
          Categories
        </p>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {links.map((item) => (
            <NavigationMenuPrimitive.Link asChild key={item.href}>
              <Link
                href={item.href}
                className="rounded-[8px] p-2 transition-colors hover:bg-[color:var(--ds-gray-100)] focus-visible:bg-[color:var(--ds-gray-100)] focus-visible:outline-none"
              >
                <span className="block text-heading-20 text-[color:var(--ds-gray-1000)]">
                  {item.label}
                </span>
                <span className="mt-1 block text-copy-14 text-[color:var(--ds-gray-900)]">
                  {item.description}
                </span>
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Right column — featured card                               */}
      {/* ---------------------------------------------------------- */}
      <div className="flex h-full flex-col">
        <p className="text-heading-14 text-[color:var(--ds-gray-900)]">
          Featured
        </p>
        {featured ? (
          <NavigationMenuPrimitive.Link asChild>
            <Link
              href={featured.href}
              className="mt-3 block rounded-[8px] bg-[color:var(--ds-gray-1000)] px-2 pt-2 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)]"
            >
              <FeaturedImage
                image={featured.image}
                alt={featured.title}
              />
              <h4 className="mt-2 px-2 text-button-14 font-bold text-[color:var(--ds-gray-100)]">
                {featured.title}
              </h4>
              {featured.description && (
                <p className="mt-1 px-2 text-copy-14 text-[color:var(--ds-gray-100)] line-clamp-3">
                  {featured.description}
                </p>
              )}
            </Link>
          </NavigationMenuPrimitive.Link>
        ) : (
          // Stable layout: when there's no featured item we still
          // render a placeholder at the same 4/3 aspect as the image
          // slot so the right column keeps the same footprint and
          // the panel doesn't shrink for unfeatured sections.
          <div className="mt-3 flex aspect-[4/3] w-full items-center justify-center rounded-[8px] border border-dashed border-[color:var(--ds-gray-300)] p-4 text-copy-14 text-[color:var(--ds-gray-900)]">
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
// Inline helper: resolves the Sanity image URL with urlFor (matching
// the convention used in MobileNavDrawer + ArticleCard callers) and
// renders the card image at the spec's 4/3 aspect ratio. Falls back
// to a gray placeholder if the section has no image.

function FeaturedImage({
  image,
  alt,
}: {
  image: SanityImageSource | null | undefined;
  alt: string;
}) {
  if (!image) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[color:var(--ds-gray-700)]" />
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[color:var(--ds-gray-700)]">
      <Image
        src={urlFor(image).width(720).height(540).auto("format").url()}
        alt={alt}
        fill
        sizes="376px"
        className="object-cover"
      />
    </div>
  );
}
