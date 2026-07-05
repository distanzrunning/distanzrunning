"use client";

// ============================================================================
// ArticleCard — the canonical editorial card for the rebuilt site
// ============================================================================
//
// One card, optional feature slots; each placement renders the subset it
// needs (and each content type has a different subset available — race
// guides have no author, for example):
//
//   image · badge · category name · published date · title ·
//   subtitle/excerpt · author avatar · author name
//
// Content order follows Quartr's card anatomy, with 404 Media's editorial
// title scale and byline:
//   category · date  (meta line, smallest label slot — Quartr)
//   title            (semibold, clamped; sized by the card `size` — 404's
//                     card title is ~25px, so md=heading-20 / lg=heading-24
//                     rather than a UI-sized 16)
//   subtitle/excerpt (muted, clamped to 2 lines)
//   author byline    (20px avatar + name — 404; the date stays in the meta
//                     line so it isn't doubled)
// Chrome stays Prismic-style (surface + hairline card) per the DS elevation
// model; deliberately NOT adopted from 404: title hover-underline (the DS
// card affordance is the image settle-zoom) and their mono uppercase kicker
// (outside our two-typeface system).
//
// Anatomy (all DS-established patterns):
//   - surface + hairline border, 12px radius (elevation = border, no shadow)
//   - image on top, settle-zoom on card hover (rests at 1.04 → 1.0)
//   - card-with-overlay-link: the title's <a> spans the card via
//     after:inset-0; the category label is its own link punched above it
//     with relative z-10 (see the DS convention notes)
//   - no hover underline on the title
//   - image URL pre-resolved at the data layer (urlFor), date passed as a
//     pre-formatted display string (e.g. "29 May 2026")
//
// Example — mega-menu featured placement (image + badge + category + title):
//   <ArticleCard href=… title=… imageUrl=… badge="Featured"
//                category={{ label, href }} />

import Link from "next/link";
import Image from "next/image";
import { Dot } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import {
  Badge,
  type BadgeSize,
  type BadgeVariant,
} from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ArticleCardCategory {
  label: string;
  /** Category landing page; when set the label is its own click target. */
  href?: string;
}

// Editorial size scale — drives the title slot (and excerpt on lg).
// sm: dense grids/sidebars · md: the standard card · lg: leads/features.
export type ArticleCardSize = "sm" | "md" | "lg";

// Titles use text-pretty (not text-balance): balance equalises line lengths,
// which wraps titles early and makes the type read smaller than it is —
// pretty only prevents orphans, so lines fill the measure (Quartr/404 both
// let card titles run full-measure). lg titles get a third line before
// clamping, matching their larger presence.
const titleSizeStyles: Record<ArticleCardSize, string> = {
  sm: "text-heading-16 line-clamp-2",
  md: "text-heading-20 line-clamp-2",
  lg: "text-heading-24 line-clamp-3",
};

export interface ArticleCardProps {
  title: string;
  href: string;
  /** Editorial size (default "md"). */
  size?: ArticleCardSize;
  /** Pre-resolved image URL (urlFor(...).url() at the data layer). */
  imageUrl?: string | null;
  imageAlt?: string;
  /** next/image `sizes` for the slot the card is placed in. */
  imageSizes?: string;
  /** Placement label rendered as a DS Badge over the image's top-left
      corner, e.g. "Featured". */
  badge?: string | null;
  badgeVariant?: BadgeVariant;
  badgeSize?: BadgeSize;
  category?: ArticleCardCategory | null;
  excerpt?: string | null;
  /** Byline author; `href` (the author page) makes the byline its own
      link punched above the card overlay, like the category. */
  author?: { name: string; avatarUrl?: string | null; href?: string } | null;
  /** Pre-formatted display date, e.g. "04 Jul 2026". */
  publishedAt?: string | null;
  className?: string;
}

export default function ArticleCard({
  title,
  href,
  size = "md",
  imageUrl,
  imageAlt = "",
  imageSizes = "480px",
  badge,
  badgeVariant = "gray",
  badgeSize = "sm",
  category,
  excerpt,
  author,
  publishedAt,
  className,
}: ArticleCardProps) {

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-borderSubtle bg-surface",
        className,
      )}
    >
      {/* Image — 16/10 editorial crop, settle-zoom on card hover. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--ds-gray-100)]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={imageSizes}
            className="scale-[1.04] object-cover transition-transform duration-300 ease-out group-hover:scale-100"
          />
        )}
        {/* Placement badge over the image's top-left corner. */}
        {badge && (
          <span className="absolute left-3 top-3">
            <Badge variant={badgeVariant} size={badgeSize}>
              {badge}
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Meta line (Quartr anatomy): category · date, in the smallest
            label slot. The category is its own link (z-10 above the title
            overlay) when it has an href. */}
        {(category || publishedAt) && (
          <div className="flex shrink-0 items-center gap-1">
            {category &&
              (category.href ? (
                <Link
                  href={category.href}
                  className="relative z-10 rounded-sm text-copy-13 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ds-focus-color)]"
                >
                  {category.label}
                </Link>
              ) : (
                <span className="text-copy-13 text-textSubtle">
                  {category.label}
                </span>
              ))}
            {category && publishedAt && (
              <span aria-hidden className="flex h-4 items-center">
                <Dot className="w-5 text-textSubtler opacity-75" />
              </span>
            )}
            {publishedAt && (
              <span className="text-copy-13 text-textSubtle">
                {publishedAt}
              </span>
            )}
          </div>
        )}

        {/* Title — its overlay makes the whole card the click target. */}
        <h3
          className={cn(titleSizeStyles[size], "text-pretty text-textDefault")}
        >
          {/* Keyboard focus draws the DS focus outline via the overlay —
              inset 2px so the card's overflow-hidden doesn't clip it. */}
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[color:var(--ds-focus-color)]"
          >
            {title}
          </Link>
        </h3>

        {/* Subtitle/excerpt. */}
        {excerpt && (
          <p
            className={cn(
              size === "lg" ? "text-copy-16" : "text-copy-14",
              "text-pretty text-textSubtle line-clamp-2",
            )}
          >
            {excerpt}
          </p>
        )}

        {/* Author byline (DS Avatar + name) — date lives in the meta
            line above, so this row only exists when there's an author.
            Avatar carries the hairline ring and falls back to initials
            when the author has no photo. With an href the byline is its
            own link, punched above the card overlay like the category. */}
        {author &&
          (author.href ? (
            <Link
              href={author.href}
              className="relative z-10 mt-auto flex items-center gap-2 self-start rounded-sm pt-2 text-copy-13 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ds-focus-color)]"
            >
              <Avatar
                src={author.avatarUrl ?? undefined}
                alt=""
                size={20}
                fallback={author.name}
              />
              {author.name}
            </Link>
          ) : (
            <div className="mt-auto flex items-center gap-2 pt-2">
              <Avatar
                src={author.avatarUrl ?? undefined}
                alt=""
                size={20}
                fallback={author.name}
              />
              <span className="text-copy-13 text-textSubtle">
                {author.name}
              </span>
            </div>
          ))}
      </div>
    </article>
  );
}
