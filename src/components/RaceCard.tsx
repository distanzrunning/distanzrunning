import Link from "next/link";
import { format } from "date-fns";
import { User } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
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
  /** Index-variant only — populates the body meta row. */
  distance?: number;
  /** Index-variant only — number of finishers from the prior year. */
  finishers?: number;
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
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="rounded-full bg-white/30 px-3 py-1 backdrop-blur-md">
        <span className="text-label-12 font-medium text-white">{label}</span>
      </div>
      <span className="text-heading-20 text-white">{value}</span>
      {detail && (
        <span className="text-label-11 font-medium text-white/40">
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
  distance,
  finishers,
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
  const fullDate = safeFormat(eventDate, "dd MMM yyyy"); // → "31 Mar 2026"

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

        {/* Top-right pill — date in index variant (frosted glass,
            heavy backdrop blur, dark text), category Badge in
            default. Date pill text is hard-coded near-black so it
            stays legible regardless of theme — the pill always
            sits over a photo, not over the canvas. */}
        {isIndex && fullDate ? (
          <div className="absolute right-3 top-3 z-20 rounded-full bg-white/50 px-3 py-1 backdrop-blur-2xl">
            <span className="text-label-12 font-medium text-[#161616]">
              {fullDate}
            </span>
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

        {/* Hover overlay (index variant only). Single absolutely-
            positioned layer that darkens the image via
            backdrop-filter brightness/contrast (no blur — keeps
            the photography readable underneath) and renders the
            three stat columns on top. Fades in on group hover. */}
        {isIndex && hasAnyHoverContent && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-6 px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ backdropFilter: "brightness(0.7) contrast(1.2)" }}
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
          {(category || finishers != null) && (
            <div className="mt-2 flex items-center gap-3">
              {category && (
                <Badge
                  variant="gray-subtle"
                  size="md"
                  className="shrink-0 bg-[color:var(--ds-gray-300)]"
                >
                  {category}
                </Badge>
              )}
              {finishers != null && (
                <span className="flex items-center gap-2 text-copy-13 text-[color:var(--ds-gray-900)]">
                  <Avatar
                    size={24}
                    placeholderIcon={<User className="size-3" aria-hidden />}
                  />
                  {finishers.toLocaleString()} Runners
                </span>
              )}
            </div>
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
