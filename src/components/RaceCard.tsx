"use client";

import Link from "next/link";
import { format } from "date-fns";

import {
  Badge,
  type BadgeSize,
  type BadgeVariant,
} from "@/components/ui/Badge";
import CardImage from "@/components/ui/CardImage";
import {
  convertCurrencySync,
  formatElevation,
  formatPrice,
} from "@/lib/raceUtils";
import { useUnits } from "@/contexts/UnitsContext";

// ============================================================================
// RaceCard
// ============================================================================
//
// Cinematic 16/8.75 image with the category Badge in the top-right
// corner (inverted variant for contrast against any photo). Body
// stacks the title + location on the left with a date pill (full
// date, e.g. "11 Apr, 2027") vertically centered against that
// stack on the right. Two visual variants:
//   - "default" — homepage row. No hover affordances beyond the
//     image settle-zoom.
//   - "index"   — /races index page. Adds a glassy hover overlay
//     over the image with three stat columns (Surface / Elevation
//     / Price) that fades in on group hover.
//
// Markup uses the "card-with-overlay-link" pattern so the whole
// card stays clickable while the title's anchor carries an
// after:absolute overlay that spans the full <article>.

export interface RaceCardProps {
  href: string;
  title: string;
  /** ISO date — formatted into the body's date pill ("11 Apr, 2027"). */
  eventDate?: string;
  /** Pre-formatted location string, e.g. "Tokyo, Japan". */
  location?: string;
  /** Race category (Marathon / Half Marathon / 10K / etc.) —
   *  rendered as the inverted Badge in the image's top-right
   *  corner. */
  category?: string;
  /** Placement label rendered as a DS Badge over the image's top-LEFT
      corner, e.g. "Featured" — mirrors ArticleCard's badge slot. The
      category badge keeps the top-right corner, so both can coexist. */
  badge?: string | null;
  badgeVariant?: BadgeVariant;
  badgeSize?: BadgeSize;
  /** Pre-resolved image URL. */
  imageUrl?: string;
  /** Inline LQIP (Sanity asset->metadata.lqip) for the blur placeholder. */
  blurDataURL?: string | null;
  /** Defaults to the title — override if the image conveys something different. */
  imageAlt?: string;
  /** Mark above-the-fold cards as priority — disables lazy load. */
  priority?: boolean;
  className?: string;
  /** Visual variant. "default" matches the homepage Races row;
   *  "index" is the /races index page treatment. */
  variant?: "default" | "index";
  /** Block chrome. "filled" (default) is the established homepage/index
      look — gray-100 body, 6px corners. "outline" adopts the ArticleCard
      chrome (bg-surface + hairline border, 12px radius, p-5 body) so the
      card sits consistently next to ArticleCards — e.g. the mega-menu
      featured slot. Content structure is identical in both. */
  chrome?: "filled" | "outline";
  /** Index-variant only — populates the glassy hover stat columns. */
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  price?: number;
  currency?: string;
}

const safeFormat = (iso: string | undefined, pattern: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : format(d, pattern);
};

function StatColumn({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex w-20 flex-col items-center gap-4 text-center">
      <div className="flex h-6 w-full items-center justify-center rounded-full bg-white/30 backdrop-blur-md">
        <span className="text-label-12 font-medium leading-none text-white">
          {label}
        </span>
      </div>
      {/* value + detail share a tighter inner stack so the detail
          sits visually anchored to its value rather than floating
          equidistant between value and the label pill above. */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-heading-20 tracking-[0.17px] text-white">
          {value}
        </span>
        {detail && (
          <span className="text-label-12 font-bold tracking-[0.11px] text-white/40">
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RaceCard({
  href,
  title,
  eventDate,
  location,
  category,
  badge,
  badgeVariant = "gray",
  badgeSize = "md",
  imageUrl,
  blurDataURL,
  imageAlt,
  priority = false,
  className = "",
  variant = "default",
  chrome = "filled",
  surface,
  surfaceBreakdown,
  profile,
  elevationGain,
  price,
  currency,
}: RaceCardProps) {
  const isIndex = variant === "index";
  const { units, currency: displayCurrency } = useUnits();

  // Date pill — abbreviated month, full year always shown.
  const fullDate = safeFormat(eventDate, "d MMM, yyyy");

  // Format profile as title-case ("rolling" → "Rolling").
  const profileLabel = profile
    ? profile.charAt(0).toUpperCase() + profile.slice(1)
    : undefined;
  const elevationGainLabel =
    elevationGain != null ? formatElevation(elevationGain, units) : undefined;
  const isLocalCurrency = displayCurrency === "local";
  const targetCurrency = isLocalCurrency ? currency ?? "USD" : displayCurrency;
  const priceLabel =
    price != null && currency
      ? formatPrice(
          isLocalCurrency
            ? price
            : convertCurrencySync(price, currency, displayCurrency),
          targetCurrency,
        )
      : undefined;
  const hasAnyHoverContent = Boolean(
    surface || profileLabel || elevationGainLabel || priceLabel,
  );

  // Outer chrome — outline adopts the ArticleCard block (surface +
  // hairline, 12px radius, container clips the image). Filled: index
  // variant uses overflow-hidden + rounded-sm so the single radius
  // matches the homepage cards' 6 px corners (where the image + body
  // each carry rounded-t-sm / rounded-b-sm separately for the same
  // visual result).
  const isOutline = chrome === "outline";
  const articleRadius = isOutline
    ? "overflow-hidden rounded-lg border border-borderSubtle bg-surface"
    : isIndex
      ? "overflow-hidden rounded-sm"
      : "";

  return (
    <article
      className={`group relative flex w-full flex-col ${articleRadius} ${className}`.trim()}
    >
      <div
        className={`relative aspect-[16/8.75] w-full overflow-hidden bg-[color:var(--ds-gray-100)] ${
          isIndex || isOutline ? "" : "rounded-t-sm"
        }`}
      >
        {imageUrl && (
          <div className="absolute inset-0 scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover:scale-100">
            <CardImage
              src={imageUrl}
              alt={imageAlt ?? title}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
              blurDataURL={blurDataURL}
            />
          </div>
        )}

        {/* Top-left pill — placement badge (e.g. "Featured"), same
            treatment as ArticleCard's badge slot. */}
        {badge && (
          <div className="absolute left-3 top-3 z-20">
            <Badge variant={badgeVariant} size={badgeSize}>
              {badge}
            </Badge>
          </div>
        )}

        {/* Top-right pill — category Badge (inverted variant
            so the dark bg + white text reads against any photo).
            Date pill sits inline with the title in the body. */}
        {category && (
          <div className="absolute right-3 top-3 z-20">
            <Badge variant="inverted" size="md">
              {category}
            </Badge>
          </div>
        )}

        {/* Hover overlay (index variant only). Single absolutely-
            positioned layer that darkens the image via
            backdrop-filter brightness/contrast (no blur — keeps
            the photography readable underneath) and renders the
            three stat columns on top. Fades in on group hover. */}
        {isIndex && hasAnyHoverContent && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-6 px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backdropFilter: "blur(12px) brightness(0.8) contrast(1.1)",
              WebkitBackdropFilter:
                "blur(12px) brightness(0.8) contrast(1.1)",
            }}
          >
            {surface && (
              <StatColumn
                label="Surface"
                value={surface}
                detail={surfaceBreakdown}
              />
            )}
            {(profileLabel || elevationGainLabel) && (
              <StatColumn
                label="Elevation"
                value={profileLabel ?? elevationGainLabel ?? ""}
                detail={profileLabel ? elevationGainLabel : undefined}
              />
            )}
            {priceLabel && (
              <StatColumn
                label="Price"
                value={priceLabel}
                detail={targetCurrency}
              />
            )}
          </div>
        )}
      </div>

      {/* Body — title + location stacked left, date pill on
          the right vertically centered against the whole stack
          (so it sits midway between title and location rather
          than top-aligned with the title's first line). */}
      <div
        className={`flex items-center justify-between gap-3 ${
          isOutline
            ? "p-5"
            : "rounded-b-sm bg-[color:var(--ds-gray-100)] p-6"
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="line-clamp-2 text-heading-20 text-[color:var(--ds-gray-1000)]">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-color)]"
            >
              {title}
            </Link>
          </h3>
          {location && (
            <p className="truncate text-copy-14 text-[color:var(--ds-gray-900)]">
              {location}
            </p>
          )}
        </div>
        {fullDate && <MetaPill>{fullDate}</MetaPill>}
      </div>
    </article>
  );
}

// Subtle gray pill — uses --ds-gray-300 for visible contrast
// against the body's --ds-gray-100 surface in BOTH light and
// dark modes. (gray-200 was too close to the body bg in dark
// mode and rendered nearly invisible.) Sized one step up
// (h-7 + text-copy-13) so the date string is comfortably
// readable rather than label-tiny.
function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[color:var(--ds-gray-300)] px-3 text-copy-13 font-medium text-[color:var(--ds-gray-1000)]">
      {children}
    </span>
  );
}
