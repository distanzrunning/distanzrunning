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
      featured slot. "plain" is the chromeless editorial anatomy (Runna's
      race card on Stride tokens): rounded image with a glass date pill
      floating top-right over the photo, body text straight on the
      canvas — title on the editorial display register, location, and
      the category as a MetaPill chip. Pass the stat fields to get the
      glassy hover overlay (same treatment as the index variant). */
  chrome?: "filled" | "outline" | "plain";
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
  // visual result). Plain: no box — the image wrapper clips itself.
  const isOutline = chrome === "outline";
  const isPlain = chrome === "plain";
  const articleRadius = isOutline
    ? "overflow-hidden rounded-lg border border-borderSubtle bg-surface"
    : isIndex && !isPlain
      ? "overflow-hidden rounded-sm"
      : "";
  // The hover stat overlay renders on the index variant (its original
  // home) and on plain chrome whenever stats were passed.
  const showHoverStats = (isIndex || isPlain) && hasAnyHoverContent;

  return (
    <article
      className={`group relative flex w-full flex-col ${articleRadius} ${className}`.trim()}
    >
      {/* Plain chrome: the image carries `rounded` (8px, our DEFAULT —
          the editorial image radius) itself, hero/ArticleCard-style. */}
      <div
        className={`relative aspect-[16/8.75] w-full overflow-hidden bg-[color:var(--ds-gray-100)] ${
          isPlain ? "rounded" : isIndex || isOutline ? "" : "rounded-t-sm"
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

        {/* Top-right pill. Filled/outline: category Badge (inverted
            variant so the dark bg + white text reads against any photo);
            the date pill sits inline with the title in the body. Plain
            (Runna anatomy): the DATE takes this corner as a glass pill —
            white translucent + blur with fixed dark ink, a deliberate
            glass effect (like the index overlay's stat pills) so it
            reads on any photo in both themes; the category moves to the
            body's chip row. */}
        {!isPlain && category && (
          <div className="absolute right-3 top-3 z-20">
            <Badge variant="inverted" size="md">
              {category}
            </Badge>
          </div>
        )}
        {isPlain && fullDate && (
          <div className="absolute right-3 top-3 z-20">
            <span className="inline-flex h-6 items-center rounded-full bg-white/60 px-3 text-label-12 text-black backdrop-blur-md">
              {fullDate}
            </span>
          </div>
        )}

        {/* Hover overlay (index variant + plain chrome with stats).
            Single absolutely-positioned layer that darkens the image
            via backdrop-filter brightness/contrast and renders the
            three stat columns on top. Fades in on group hover. */}
        {showHoverStats && (
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

      {/* Body. Plain (Runna anatomy): text straight on the canvas —
          title on the editorial display register (matches the homepage
          ArticleCards), location below, then the category as a chip in
          the bottom row (Runna's distance-chip slot); the date already
          lives on the image. Filled/outline: title + location stacked
          left, date pill on the right vertically centered against the
          whole stack. */}
      {isPlain ? (
        <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
          <h3 className="line-clamp-2 text-display-20 text-pretty text-textDefault">
            {/* Plain chrome has no clipping box, so the focus ring
                breathes outward at the image's 8px radius, like the
                hero / plain ArticleCard. */}
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[color:var(--ds-focus-color)]"
            >
              {title}
            </Link>
          </h3>
          {location && (
            <p className="truncate text-copy-14 text-textSubtle">{location}</p>
          )}
          {category && (
            <div className="pt-1">
              <MetaPill>{category}</MetaPill>
            </div>
          )}
        </div>
      ) : (
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
      )}
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
