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
  /** Index-variant only — populates the glassy hover pills. */
  surface?: string;
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

function HoverPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-center text-white backdrop-blur-md">
      <span className="text-label-11 uppercase tracking-[0.04em] opacity-70">
        {label}
      </span>
      <span className="text-copy-14 font-medium">{value}</span>
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
  profile,
  elevationGain,
  price,
  currency,
}: RaceCardProps) {
  const isIndex = variant === "index";

  const month = safeFormat(eventDate, "MMM");
  const day = safeFormat(eventDate, "dd");
  const fullDate = safeFormat(eventDate, "dd MMM yyyy"); // → "31 Mar 2026"

  // Format profile as title-case ("rolling" → "Rolling").
  const profileLabel = profile
    ? profile.charAt(0).toUpperCase() + profile.slice(1)
    : undefined;
  const elevationLabel =
    elevationGain != null ? `+${Math.round(elevationGain)}m` : profileLabel;
  const priceLabel =
    price != null && currency ? formatPrice(price, currency) : undefined;
  const hasAnyHoverPill = Boolean(surface || elevationLabel || priceLabel);

  return (
    <article
      className={`group relative flex w-full flex-col ${className}`.trim()}
    >
      <div className="relative aspect-[16/8.75] w-full overflow-hidden rounded-t-md bg-[color:var(--ds-gray-100)]">
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

        {/* Top-right pill — date in index variant, category in
            default. Same Badge slot, different content. */}
        {isIndex && fullDate ? (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="inverted" size="md" className="uppercase">
              {fullDate}
            </Badge>
          </div>
        ) : (
          category && (
            <div className="absolute right-3 top-3 z-10">
              <Badge variant="inverted" size="md">
                {category}
              </Badge>
            </div>
          )
        )}

        {/* Glassy hover pills (index variant only). Centred row,
            fades in on group hover. */}
        {isIndex && hasAnyHoverPill && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {surface && <HoverPill label="Surface" value={surface} />}
            {elevationLabel && (
              <HoverPill label="Elevation" value={elevationLabel} />
            )}
            {priceLabel && <HoverPill label="Price" value={priceLabel} />}
          </div>
        )}
      </div>

      {/* Body — index variant: stacked text only.
                 default variant: text + square date block on the right. */}
      {isIndex ? (
        <div className="flex flex-col gap-1 rounded-b-md bg-[color:var(--ds-gray-100)] p-6">
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
          {category && (
            <p className="text-copy-14 text-[color:var(--ds-gray-900)]">
              {category}
            </p>
          )}
        </div>
      ) : (
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
      )}
    </article>
  );
}
