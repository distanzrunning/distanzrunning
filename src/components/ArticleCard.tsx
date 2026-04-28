import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { urlFor } from "@/sanity/lib/image";

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
// Colours all flow through DS tokens so the card flips cleanly with
// the theme. The whole card is a single <Link> so the entire surface
// is the click target.

export interface ArticleCardProps {
  href: string;
  title: string;
  publishedAt: string;
  /** Short label above the title — category, "Race Guide", etc. */
  kicker?: string;
  excerpt?: string;
  image?: SanityImageSource;
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
  excerpt,
  image,
  imageAlt,
  className = "",
}: ArticleCardProps) {
  const dateLabel = formatDate(publishedAt);
  const imgSrc = image ? urlFor(image).width(1200).auto("format").url() : null;
  const blurSrc = image
    ? urlFor(image).width(16).height(9).blur(20).auto("format").url()
    : undefined;

  return (
    <Link
      href={href}
      className={`group flex w-full flex-col items-start gap-4 ${className}`.trim()}
    >
      <div className="relative w-full overflow-hidden rounded-md bg-[color:var(--ds-gray-100)] aspect-[16/8.75]">
        {imgSrc && (
          <div className="h-full w-full scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover:scale-100">
            <Image
              src={imgSrc}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover"
              placeholder={blurSrc ? "blur" : undefined}
              blurDataURL={blurSrc}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1">
        {(kicker || dateLabel) && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.0275em] text-[color:var(--ds-gray-900)]">
            {kicker && <span>{kicker}</span>}
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

        <h3 className="line-clamp-2 text-[19px] font-semibold leading-[1.4] tracking-[-0.01em] text-[color:var(--ds-gray-1000)] decoration-1 underline-offset-4 group-hover:underline md:line-clamp-3">
          {title}
        </h3>

        {excerpt && (
          <p className="line-clamp-2 max-w-3xl text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)]">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
