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
      look — gray-100 body, 4px corners. "outline" adopts the ArticleCard
      chrome (bg-surface + hairline border, 4px radius, p-5 body) so the
      card sits consistently next to ArticleCards — e.g. the mega-menu
      featured slot. "card" is the Vercel-KB topic-card grammar on
      Stride tokens (the homepage row): surface + hairline container,
      hover = soft shadow lift (no card zoom). The top half is an
      ILLUSTRATION PANEL on the recessed canvas tone — dashed-grid
      backdrop (the dashed register: interior subdivision), the race
      photo composed inside a mini browser frame (we sell interactive
      race GUIDES — the frame says "this opens"), and the date +
      category floating as bordered surface pills. Footer: heading-20
      title (KB product voice, Vercel's card h3 verbatim) + location.
      The stat hover overlay stays an index-variant feature. */
  chrome?: "filled" | "outline" | "card";
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

  // Stat-overlay compute (profile/elevation/price labels) is an
  // index-variant-only feature — gate it so non-index chromes (the
  // homepage "card" chrome, "filled", "outline") skip the work.
  const stats = isIndex
    ? (() => {
        // Format profile as title-case ("rolling" → "Rolling").
        const profileLabel = profile
          ? profile.charAt(0).toUpperCase() + profile.slice(1)
          : undefined;
        const elevationGainLabel =
          elevationGain != null
            ? formatElevation(elevationGain, units)
            : undefined;
        const isLocalCurrency = displayCurrency === "local";
        const targetCurrency = isLocalCurrency
          ? (currency ?? "USD")
          : displayCurrency;
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
        return {
          profileLabel,
          elevationGainLabel,
          targetCurrency,
          priceLabel,
          hasAnyHoverContent,
        };
      })()
    : null;

  // Outer chrome — outline adopts the ArticleCard block (surface +
  // hairline, container clips the image). Filled: index variant uses
  // overflow-hidden so the single radius matches the homepage cards
  // (where the image + body each carry rounded-t-xs / rounded-b-xs
  // separately for the same visual result). Card: Vercel-KB chrome —
  // surface + hairline, hover lifts with a soft gray shadow (Geist's
  // hover:shadow move; elevation stays border-based at rest). All
  // variants run the 4px editorial radius (user call 2026-07-29).
  const isOutline = chrome === "outline";
  const isCard = chrome === "card";
  const articleRadius = isOutline
    ? "overflow-hidden rounded-xs border border-borderSubtle bg-surface"
    : isCard
      ? "overflow-hidden rounded-xs border border-borderSubtle bg-surface transition-shadow duration-200 ease-in-out hover:shadow-[0_12px_24px_-8px_hsla(var(--ds-gray-1000-value),0.12)]"
      : isIndex
        ? "overflow-hidden rounded-xs"
        : "";
  // The hover stat overlay is an index-variant feature.
  const showHoverStats = isIndex && Boolean(stats?.hasAnyHoverContent);

  return (
    <article
      className={`group relative flex w-full flex-col ${articleRadius} ${className}`.trim()}
    >
      {/* Card chrome: Vercel-KB card anatomy with a full-bleed photo
          panel — the image fills the 16/10 area edge to edge under
          the panel's border-b, with the category ("distance") as a
          bordered surface pill top-right. The date lives in the
          footer's right slot. Carousel arrow maths in
          HomepageUpcomingRaces matches the 16/10 ratio. */}
      {isCard && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-borderSubtle bg-[color:var(--ds-gray-100)]">
          {/* EXPERIMENT (2026-08-10): BBC card-hover grammar on trial —
              instant 80% image dim replacing the settle-zoom. Revert
              this commit to restore the house pattern. */}
          {imageUrl && (
            <div className="absolute inset-0 group-hover:opacity-80">
              <CardImage
                src={imageUrl}
                alt={imageAlt ?? title}
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, 405px"
                priority={priority}
                blurDataURL={blurDataURL}
              />
            </div>
          )}
          {category && (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex h-6 items-center rounded-full border border-borderSubtle bg-surface px-3 text-label-12 text-textDefault">
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      {!isCard && (
        <div
          className={`relative aspect-[16/8.75] w-full overflow-hidden bg-[color:var(--ds-gray-100)] ${
            isIndex || isOutline ? "" : "rounded-t-xs"
          }`}
        >
          {/* EXPERIMENT (2026-08-10): BBC card-hover grammar on trial —
              instant 80% image dim replacing the settle-zoom. Revert
              this commit to restore the house pattern. */}
          {imageUrl && (
            <div className="absolute inset-0 group-hover:opacity-80">
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

          {/* Top-right pill — category Badge (inverted variant so the
            dark bg + white text reads against any photo); the date
            pill sits inline with the title in the body. */}
          {category && (
            <div className="absolute right-3 top-3 z-20">
              <Badge variant="inverted" size="md">
                {category}
              </Badge>
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
              {(stats?.profileLabel || stats?.elevationGainLabel) && (
                <StatColumn
                  label="Elevation"
                  value={stats?.profileLabel ?? stats?.elevationGainLabel ?? ""}
                  detail={
                    stats?.profileLabel ? stats?.elevationGainLabel : undefined
                  }
                />
              )}
              {stats?.priceLabel && (
                <StatColumn
                  label="Price"
                  value={stats.priceLabel}
                  detail={stats.targetCurrency}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Body. Card (Vercel-KB anatomy): clean surface footer under
          the panel's border-b — heading-20 title (the KB product
          voice; a race guide card is a utility card, not editorial
          content) + location stacked left, DATE as a bordered pill on
          the right, vertically centered against the stack. Category
          lives on the image. Filled/outline: title + location stacked
          left, date MetaPill right. */}
      {isCard ? (
        // Two-line clamp matches the filled/outline variants' truncation
        // rule; the pill centres against the title+location block (user
        // call 2026-07-21 — matches the filled/outline footers). The row
        // wraps so narrow cards give the title full width (the pill
        // drops below); min-w-[10rem] is the wrap trigger — min-w-0
        // would let the title shrink to nothing and never wrap.
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex min-w-[10rem] flex-1 flex-col gap-1">
            {/* display-20, not heading-20: race guides are editorial
                content cards, so the title runs the display register
                (450) like ArticleCard — heading 600 is chrome-only.
                The photo's stat overlay keeps heading-20 (data display). */}
            <h3 className="line-clamp-2 text-display-20 text-pretty text-textDefault">
              {/* The container clips (overflow-hidden), so the focus
                  ring insets at the card's 4px corner, like the card
                  ArticleCard chrome. */}
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:after:rounded-xs focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[color:var(--ds-focus-color)]"
              >
                {title}
              </Link>
            </h3>
            {location && (
              <p className="truncate text-copy-14 text-textSubtle">
                {location}
              </p>
            )}
          </div>
          {fullDate && (
            <span className="inline-flex h-6 shrink-0 items-center rounded-full border border-borderSubtle bg-surface px-3 text-label-12 text-textSubtle">
              <time dateTime={eventDate}>{fullDate}</time>
            </span>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-between gap-3 ${
            isOutline ? "p-5" : "rounded-b-xs bg-[color:var(--ds-gray-100)] p-6"
          }`}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="line-clamp-2 text-display-20 text-textDefault">
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:after:rounded-xs focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-color)]"
              >
                {title}
              </Link>
            </h3>
            {location && (
              <p className="truncate text-copy-14 text-textSubtle">
                {location}
              </p>
            )}
          </div>
          {fullDate && (
            <MetaPill>
              <time dateTime={eventDate}>{fullDate}</time>
            </MetaPill>
          )}
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
