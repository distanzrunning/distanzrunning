"use client";

// ============================================================================
// ArticleCard — the canonical editorial card for the rebuilt site
// ============================================================================
//
// One card, eight optional feature slots; each placement renders the subset
// it needs (and each content type has a different subset available — race
// guides have no author, for example):
//
//   1. image            — pre-resolved URL (resolve with urlFor at the data
//                         layer, per the DS convention; no raw Sanity refs)
//   2. category icon    — the SAME glyph the mega-menu taxonomy uses for
//                         that category (newsLinks/shoeLinks/…), sized down
//   3. category name    — kicker text next to the icon
//   4. title            — always required
//   5. subtitle/excerpt
//   6. author avatar
//   7. author name
//   8. published date   — pass a pre-formatted display string
//
// Anatomy (all DS-established patterns):
//   - surface + hairline border, 12px radius (elevation = border, no shadow)
//   - image on top, settle-zoom on card hover (rests at 1.04 → 1.0)
//   - card-with-overlay-link: the title's <a> spans the card via
//     after:inset-0; the category kicker is its own link punched above it
//     with relative z-10 (see the DS convention notes)
//   - no hover underline on the title
//
// Example — mega-menu featured placement (image + category + title):
//   <ArticleCard href=… title=… imageUrl=… category={{label, Icon, href}} />

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export interface ArticleCardCategory {
  label: string;
  /** Category landing page; when set the kicker is its own click target. */
  href?: string;
  /** Taxonomy glyph (Tabler icon component), rendered in a tinted tile. */
  Icon?: React.ComponentType<{ className?: string }>;
}

export interface ArticleCardProps {
  title: string;
  href: string;
  /** Pre-resolved image URL (urlFor(...).url() at the data layer). */
  imageUrl?: string | null;
  imageAlt?: string;
  /** next/image `sizes` for the slot the card is placed in. */
  imageSizes?: string;
  category?: ArticleCardCategory | null;
  excerpt?: string | null;
  author?: { name: string; avatarUrl?: string | null } | null;
  /** Pre-formatted display date, e.g. "04 Jul 2026". */
  publishedAt?: string | null;
  className?: string;
}

export default function ArticleCard({
  title,
  href,
  imageUrl,
  imageAlt = "",
  imageSizes = "480px",
  category,
  excerpt,
  author,
  publishedAt,
  className,
}: ArticleCardProps) {
  const hasMeta = Boolean(author || publishedAt);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-borderSubtle bg-surface",
        className,
      )}
    >
      {/* Image — 16/10 editorial crop, settle-zoom on card hover. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--ds-gray-100)]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={imageSizes}
            className="scale-[1.04] object-cover transition-transform duration-300 ease-out group-hover:scale-100"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Category kicker — taxonomy icon in a tinted tile + name. Its own
            link (z-10 above the title overlay) when a category href exists. */}
        {category && (
          <CategoryKicker category={category} />
        )}

        {/* Title — its overlay makes the whole card the click target. */}
        <h3 className="text-heading-16 text-balance text-textDefault">
          <Link
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="text-copy-14 text-textSubtle line-clamp-2">{excerpt}</p>
        )}

        {hasMeta && (
          <div className="mt-auto flex items-center gap-2 pt-2">
            {author?.avatarUrl && (
              <Image
                src={author.avatarUrl}
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full object-cover"
              />
            )}
            {author && (
              <span className="text-copy-13 text-textSubtle">
                {author.name}
              </span>
            )}
            {author && publishedAt && (
              <span aria-hidden className="text-copy-13 text-textSubtler">
                ·
              </span>
            )}
            {publishedAt && (
              <span className="text-copy-13 text-textSubtler">
                {publishedAt}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// Kicker row — same currentColor-tinted tile as the mega-menu link rows,
// sized down (24px tile / 16px glyph). Muted at rest; when it's a link it
// inks up on its own hover without triggering the card affordance.
function CategoryKicker({ category }: { category: ArticleCardCategory }) {
  const body = (
    <>
      {category.Icon && (
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-sm"
          style={{
            background: "color-mix(in srgb, currentColor 15%, transparent)",
          }}
        >
          <category.Icon className="size-4" aria-hidden />
        </span>
      )}
      <span className="text-copy-13 font-medium">{category.label}</span>
    </>
  );

  return category.href ? (
    <Link
      href={category.href}
      className="relative z-10 flex items-center gap-2 self-start text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline-none"
    >
      {body}
    </Link>
  ) : (
    <span className="flex items-center gap-2 self-start text-textSubtle">
      {body}
    </span>
  );
}
