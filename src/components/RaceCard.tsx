import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/Badge";
import CardImage from "@/components/ui/CardImage";

// ============================================================================
// RaceCard
// ============================================================================
//
// Race-guide card used on the homepage Races row and section
// landings. Anatomy is lifted from the original homepage draft and
// rebuilt against the DS tokens:
//   - Cinematic 16/8.75 image with a settle-zoom on hover
//   - Floating category pill (top-right of the image)
//   - Inset content panel below the image: title, location, square
//     month/day date block aligned to the right
//
// Markup uses the "card-with-overlay-link" pattern so the whole
// card stays clickable while the title's anchor carries an
// after:absolute overlay that spans the full <article>. No nested
// links inside the card today.

export interface RaceCardProps {
  href: string;
  title: string;
  /** ISO date — formatted into the square month/day block. */
  eventDate?: string;
  /** Pre-formatted location string, e.g. "Tokyo, Japan". */
  location?: string;
  /** Distance / category label rendered as a floating pill on the image. */
  category?: string;
  /** Pre-resolved image URL. */
  imageUrl?: string;
  /** Defaults to the title — override if the image conveys something different. */
  imageAlt?: string;
  /** Mark above-the-fold cards as priority — disables lazy load. */
  priority?: boolean;
  className?: string;
}

const safeFormat = (iso: string | undefined, pattern: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : format(d, pattern);
};

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
}: RaceCardProps) {
  const month = safeFormat(eventDate, "MMM");
  const day = safeFormat(eventDate, "dd");

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

        {category && (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="inverted" size="md">
              {category}
            </Badge>
          </div>
        )}
      </div>

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
            <p className="truncate text-sm font-normal text-[color:var(--ds-gray-900)]">
              {location}
            </p>
          )}
        </div>

        {(month || day) && (
          <div
            className="flex size-16 shrink-0 flex-col items-center justify-center rounded-md bg-[color:var(--ds-gray-200)]"
            aria-hidden={false}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[color:var(--ds-gray-1000)]">
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
