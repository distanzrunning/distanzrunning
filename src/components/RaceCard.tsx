import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/Badge";
import CardImage from "@/components/ui/CardImage";
import { formatPrice } from "@/lib/raceUtils";

// ============================================================================
// RaceCard
// ============================================================================
//
// Two visual variants:
//   - "default" (current homepage usage) — cinematic 16/8.75 image
//     with category Badge top-right, body has title + location +
//     square MAR/31 date block on the right. No hover affordances
//     beyond the image settle-zoom.
//   - "index" (new /races index page) — same 16/8.75 image but the
//     top-right Badge carries the *date* ("31 MAR 2026") and the
//     category moves into the body as a third meta line. On hover
//     three glassy pills (Surface / Profile / Price) fade in
//     centred over the image. Body becomes title → location → date
//     stacked, no square date block.
//
// Markup uses the "card-with-overlay-link" pattern so the whole
// card stays clickable while the title's anchor carries an
// after:absolute overlay that spans the full <article>.

export interface RaceCardProps {
  href: string;
  title: string;
  /** ISO date — formatted into the date block / pill. */
  eventDate?: string;
  /** Pre-formatted location string, e.g. "Tokyo, Japan". */
  location?: string;
  /** Distance / category label rendered on the image (default
   *  variant) or as a body meta line (index variant). */
  category?: string;
  /** Pre-resolved image URL. */
  imageUrl?: string;
  /** Defaults to the title — override if the image conveys something different. */
  imageAlt?: string;
  /** Mark above-the-fold cards as priority — disables lazy load. */
  priority?: boolean;
  className?: string;
  /** Visual variant. "default" matches the homepage Races row;
   *  "index" is the /races index page treatment. */
  variant?: "default" | "index";
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
      <span className="text-heading-20 tracking-[0.17px] text-white">
        {value}
      </span>
      {detail && (
        <span className="text-label-12 font-semibold tracking-[0.11px] text-white/40">
          {detail}
        </span>
      )}
    </div>
  );
}

export default function RaceCard({
  href,
  title,
  eventDate,
  location,
  category,
  imageUrl,
  imageAlt,
  priority = false,
  className = "",
  variant = "default",
  surface,
  surfaceBreakdown,
  profile,
  elevationGain,
  price,
  currency,
}: RaceCardProps) {
  const isIndex = variant === "index";

  const month = safeFormat(eventDate, "MMM");
  const day = safeFormat(eventDate, "dd");

  // Format profile as title-case ("rolling" → "Rolling").
  const profileLabel = profile
    ? profile.charAt(0).toUpperCase() + profile.slice(1)
    : undefined;
  const elevationGainLabel =
    elevationGain != null ? `+${Math.round(elevationGain)}m` : undefined;
  const priceLabel =
    price != null && currency ? formatPrice(price, currency) : undefined;
  const hasAnyHoverContent = Boolean(
    surface || profileLabel || elevationGainLabel || priceLabel,
  );

  // Outer rounding — index variant uses overflow-hidden +
  // rounded-md so the single radius matches the homepage cards'
  // 6 px corners (where the image + body each carry rounded-t-md
  // / rounded-b-md separately for the same visual result).
  const articleRadius = isIndex ? "overflow-hidden rounded-md" : "";

  return (
    <article
      className={`group relative flex w-full flex-col ${articleRadius} ${className}`.trim()}
    >
      <div
        className={`relative aspect-[16/8.75] w-full overflow-hidden bg-[color:var(--ds-gray-100)] ${
          isIndex ? "" : "rounded-t-md"
        }`}
      >
        {imageUrl && (
          <div className="absolute inset-0 scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover:scale-100">
            <CardImage
              src={imageUrl}
              alt={imageAlt ?? title}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
            />
          </div>
        )}

        {/* Top-right pill — category Badge in both variants
            (matches the homepage's race card). The index variant
            additionally renders the hover stat overlay below. */}
        {category && (
          <div className="absolute right-3 top-3 z-10">
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
              backdropFilter: "blur(12px) brightness(0.7) contrast(1.1)",
              WebkitBackdropFilter:
                "blur(12px) brightness(0.7) contrast(1.1)",
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
                detail={currency}
              />
            )}
          </div>
        )}
      </div>

      {/* Body — title + location stacked left, MAR / 31 square
          block right. Same shape across variants now; the index
          variant's only structural difference is the hover stat
          overlay rendered above on the image. */}
      <div className="flex items-center justify-between gap-3 rounded-b-md bg-[color:var(--ds-gray-100)] p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="line-clamp-2 text-heading-20 text-[color:var(--ds-gray-1000)]">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-ring)]"
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

        {(month || day) && (
          <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-md bg-[color:var(--ds-gray-200)]">
            <span className="text-label-11 font-medium uppercase tracking-[0.04em] text-[color:var(--ds-gray-1000)]">
              {month}
            </span>
            <span className="text-heading-24 text-[color:var(--ds-gray-1000)]">
              {day}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
