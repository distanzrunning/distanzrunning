import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// ============================================================================
// ArticleCard
// ============================================================================
//
// Editorial card used in homepage rows (Breaking News, etc.) and
// section listings. Anatomy is modelled on Quartr's article card:
//   - Cinematic ~1.83:1 image
//   - Image starts at scale 104% and settles to 100% on hover
//   - Meta row (kicker · date) above the title
//   - 2-line title clamp on mobile, 3-line on md+
//   - 2-line excerpt clamp
//
// Markup uses the "card-with-overlay-link" pattern so the whole
// card is clickable while still letting the kicker carry its own
// link to the category landing page:
//   - <article> is the card surface (group + relative)
//   - The <h3>'s anchor has after:absolute after:inset-0, which
//     stretches an invisible click overlay across the entire card
//     — the title is the primary link.
//   - The kicker's anchor sits with relative z-10 so it punches
//     through the overlay and gets its own click + hover state.
//
// The component takes the resolved image URL directly; resolving
// from a Sanity image source (or any other source) is the caller's
// responsibility. Keeps the card framework-agnostic.

export interface ArticleCardProps {
  href: string;
  title: string;
  publishedAt: string;
  /** Short label above the title — category, "Race Guide", etc. */
  kicker?: string;
  /** Optional URL for the kicker. When set, the kicker becomes a clickable link punching through the card-wide click overlay. */
  kickerHref?: string;
  excerpt?: string;
  /** Pre-resolved image URL (e.g. from urlFor(...).width(1200).auto("format").url()). */
  imageUrl?: string;
  /** Optional low-res blur placeholder URL (e.g. urlFor(...).width(16).height(9).blur(20).auto("format").url()). */
  blurDataURL?: string;
  /** Defaults to the title — override if the image conveys something different. */
  imageAlt?: string;
  className?: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : format(d, "d MMM yyyy");
};

export default function ArticleCard({
  href,
  title,
  publishedAt,
  kicker,
  kickerHref,
  excerpt,
  imageUrl,
  blurDataURL,
  imageAlt,
  className = "",
}: ArticleCardProps) {
  const dateLabel = formatDate(publishedAt);

  return (
    <article
      className={`group relative flex w-full flex-col items-start gap-4 ${className}`.trim()}
    >
      <div className="relative w-full overflow-hidden rounded-md bg-[color:var(--ds-gray-100)] aspect-[16/8.75]">
        {imageUrl && (
          <div className="h-full w-full scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover:scale-100">
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover"
              placeholder={blurDataURL ? "blur" : undefined}
              blurDataURL={blurDataURL}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1">
        {(kicker || dateLabel) && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.0275em] text-[color:var(--ds-gray-900)]">
            {kicker &&
              (kickerHref ? (
                <Link
                  href={kickerHref}
                  className="relative z-10 transition-colors hover:text-[color:var(--ds-gray-1000)]"
                >
                  {kicker}
                </Link>
              ) : (
                <span>{kicker}</span>
              ))}
            {kicker && dateLabel && (
              <span aria-hidden className="text-[color:var(--ds-gray-700)]">
                ·
              </span>
            )}
            {dateLabel && (
              <time dateTime={publishedAt} suppressHydrationWarning>
                {dateLabel}
              </time>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 text-[19px] font-semibold leading-[1.4] tracking-[-0.01em] text-[color:var(--ds-gray-1000)] md:line-clamp-3">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-ring)]"
          >
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="line-clamp-2 max-w-3xl text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)]">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
