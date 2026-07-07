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

// Editorial size scale — drives the title slot (and the excerpt size).
// sm: dense grids/sidebars · md: the standard card · lg: leads/features ·
// xl: the section-dominating main pick (Quartr's headlineLarge slot — our
// UI scale tops out at heading-32).
export type ArticleCardSize = "sm" | "md" | "lg" | "xl";

// Titles use text-pretty (not text-balance): balance equalises line lengths,
// which wraps titles early and makes the type read smaller than it is —
// pretty only prevents orphans, so lines fill the measure (Quartr/404 both
// let card titles run full-measure). lg/xl titles get a third line before
// clamping, matching their larger presence.
const titleSizeStyles: Record<ArticleCardSize, string> = {
  sm: "text-heading-16 line-clamp-2",
  md: "text-heading-20 line-clamp-2",
  lg: "text-heading-24 line-clamp-3",
  xl: "text-heading-24 md:text-heading-32 line-clamp-3",
};

const excerptSizeStyles: Record<ArticleCardSize, string> = {
  sm: "text-copy-14",
  md: "text-copy-14",
  lg: "text-copy-16",
  xl: "text-copy-16 md:text-copy-18",
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
  /** Inline LQIP (Sanity asset->metadata.lqip) — renders as the blur
      placeholder so the image resolves over its own preview instead of
      popping in over flat gray. */
  blurDataURL?: string | null;
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
  /** Block chrome. "card" (default) is the bordered surface box (mega-menu
      featured slot). "plain" is the hero's chromeless anatomy — rounded
      image, text straight on the canvas — for editorial grids (Quartr's
      card style). */
  chrome?: "card" | "plain";
  /** Image crop. "16/10" (default) is the editorial card crop;
      "16/8.75" is the wider grid crop (Quartr's 54.6875% — also
      RaceCard's ratio). */
  imageRatio?: "16/10" | "16/8.75";
  /** Below-md anatomy. "row" lays the card out horizontally on mobile
      (thumbnail left, text right — Quartr's list-row treatment for
      rails) and returns to the column anatomy from md up. Plain chrome
      only. */
  mobileLayout?: "column" | "row";
  className?: string;
}

const imageRatioStyles: Record<
  NonNullable<ArticleCardProps["imageRatio"]>,
  string
> = {
  "16/10": "aspect-[16/10]",
  "16/8.75": "aspect-[16/8.75]",
};

export default function ArticleCard({
  title,
  href,
  size = "md",
  imageUrl,
  imageAlt = "",
  imageSizes = "480px",
  blurDataURL,
  badge,
  badgeVariant = "gray",
  badgeSize = "sm",
  category,
  excerpt,
  author,
  publishedAt,
  chrome = "card",
  imageRatio = "16/10",
  mobileLayout = "column",
  className,
}: ArticleCardProps) {
  const isPlain = chrome === "plain";
  const isRow = mobileLayout === "row";

  return (
    <article
      className={cn(
        "group relative flex",
        isRow
          ? "flex-row items-center gap-4 md:flex-col md:items-stretch md:gap-0"
          : "flex-col",
        !isPlain &&
          "overflow-hidden rounded-lg border border-borderSubtle bg-surface",
        className,
      )}
    >
      {/* Image — 16/10 editorial crop, settle-zoom on card hover. Plain
          chrome: the image carries the radius itself (hero anatomy).
          Row anatomy: a fixed thumbnail on the left below md. */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--ds-gray-100)]",
          imageRatioStyles[imageRatio],
          isPlain && "rounded-lg",
          isRow && "w-1/3 max-w-36 shrink-0 md:w-full md:max-w-none",
        )}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={imageSizes}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL ?? undefined}
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

      <div
        className={cn(
          "flex flex-1 flex-col gap-2",
          isPlain ? "px-1 pt-4" : "p-5",
          isRow && isPlain && "px-0 pt-0 md:px-1 md:pt-4",
        )}
      >
        {/* Meta line (Quartr anatomy): category · date, in the tiny
            metadata slot (label-12 — Quartr runs 11px against a 19px
            title; 12 is our nearest step and widens the hierarchy the
            same way). The category is its own link (z-10 above the
            title overlay) when it has an href. */}
        {(category || publishedAt) && (
          <div className="flex shrink-0 items-center gap-1">
            {category &&
              (category.href ? (
                <Link
                  href={category.href}
                  className="relative z-10 rounded-sm text-label-12 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ds-focus-color)]"
                >
                  {category.label}
                </Link>
              ) : (
                <span className="text-label-12 text-textSubtle">
                  {category.label}
                </span>
              ))}
            {category && publishedAt && (
              <span aria-hidden className="flex h-4 items-center">
                <Dot className="w-5 text-textSubtler opacity-75" />
              </span>
            )}
            {publishedAt && (
              <span className="text-label-12 text-textSubtle">
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
              card chrome insets it 2px so overflow-hidden doesn't clip;
              plain chrome (no clipping) breathes outward like the hero. */}
          <Link
            href={href}
            className={cn(
              "outline-none after:absolute after:inset-0 focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-color)]",
              isPlain
                ? "focus-visible:after:outline-offset-4"
                : "focus-visible:after:-outline-offset-2",
            )}
          >
            {title}
          </Link>
        </h3>

        {/* Subtitle/excerpt. */}
        {excerpt && (
          <p
            className={cn(
              excerptSizeStyles[size],
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
