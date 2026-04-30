import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import ArticleCard from "@/components/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import CardImage from "@/components/ui/CardImage";
import { urlFor } from "@/sanity/lib/image";

// ============================================================================
// HomepageGear
// ============================================================================
//
// Editorial "Gear" row, modelled on Quartr's Editor's-picks layout.
// One large featured article on the left + three supporting
// articles on the right. On lg+ the featured article uses
// position:sticky so it pins to the viewport while the supporting
// column scrolls past — a "spotlight" pattern that lets a hero
// review hold the visitor's attention while related items pass by.
//
// Sits inside a contrast-toned panel (bg-gray-100, rounded-xl,
// no border) at the same max-w-[1400px] / p-6 md:p-10 lg:p-12
// rhythm as Breaking News and Races above and below. Surface
// tone differs by design — gray-100 sits one notch off the
// canvas in both themes so the row reads as its own editorial
// moment without leaving the shared section geometry.
//
// Items come from the homepage query as the latest 4 productPost
// records (any section) — first is the featured slot, next three
// fill the supporting column. The shape matches the article
// projection so kicker / kickerHref / href / mainImage / excerpt
// all flow through.

export type HomepageGearItem = {
  _id: string;
  _type: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource | null;
  kicker?: string;
  kickerHref?: string | null;
  href: string;
};

interface HomepageGearProps {
  items: ReadonlyArray<HomepageGearItem>;
}

// Combined index of every productPost (shoes + gear + nutrition).
// Route lives at /products — named after the schema rather than
// "reviews" since the productPost type covers reviews, best-of
// round-ups, and explainers.
const SEE_ALL_HREF = "/products";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : format(d, "d MMM yyyy");
};

function resolveImageUrl(item: HomepageGearItem): string | undefined {
  if (!item.mainImage) return undefined;
  return urlFor(item.mainImage).width(1600).auto("format").url();
}

// ============================================================================
// Featured article — large hero card on the left of the row
// ============================================================================

function FeaturedArticle({ item }: { item: HomepageGearItem }) {
  const dateLabel = formatDate(item.publishedAt);
  const imageUrl = resolveImageUrl(item);

  return (
    <article className="group relative flex w-full flex-col gap-6">
      <div className="relative aspect-[16/8.75] w-full overflow-hidden rounded-md bg-[color:var(--ds-gray-100)]">
        {imageUrl && (
          <div className="absolute inset-0 scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover:scale-100">
            <CardImage
              src={imageUrl}
              alt={item.title}
              sizes="(max-width: 1024px) 100vw, 75vw"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-1">
        {(item.kicker || dateLabel) && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.0275em] text-[color:var(--ds-gray-900)]">
            {item.kicker &&
              (item.kickerHref ? (
                <Link
                  href={item.kickerHref}
                  className="relative z-10 transition-colors hover:text-[color:var(--ds-gray-1000)]"
                >
                  {item.kicker}
                </Link>
              ) : (
                <span>{item.kicker}</span>
              ))}
            {item.kicker && dateLabel && (
              <span aria-hidden className="text-[color:var(--ds-gray-700)]">
                ·
              </span>
            )}
            {dateLabel && (
              <time dateTime={item.publishedAt} suppressHydrationWarning>
                {dateLabel}
              </time>
            )}
          </div>
        )}

        <h3 className="text-heading-32 text-balance text-[color:var(--ds-gray-1000)]">
          <Link
            href={item.href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[color:var(--ds-focus-ring)]"
          >
            {item.title}
          </Link>
        </h3>

        {item.excerpt && (
          <p className="max-w-3xl text-balance text-copy-16 text-[color:var(--ds-gray-900)] md:text-copy-18">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

// ============================================================================
// HomepageGear
// ============================================================================

export default function HomepageGear({ items }: HomepageGearProps) {
  const visible = items.slice(0, 4);
  if (visible.length === 0) return null;

  const [featured, ...supporting] = visible;

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8 rounded-xl bg-[color:var(--ds-gray-100)] p-6 md:gap-11 md:p-10 lg:p-12">
        <header className="flex flex-col-reverse items-start justify-end gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-2">
            {/* text-heading-40 — one DS step above the heading-32
                used by News and Races so the spotlight row feels
                weightier than the regular content rows. */}
            <h2 className="m-0 text-heading-40 text-balance text-[color:var(--ds-gray-1000)]">
              Editor&apos;s picks in shoes &amp; gear
            </h2>
            <p className="text-balance text-copy-16 text-[color:var(--ds-gray-900)] md:text-copy-18">
              Hand-picked reviews, best-of round-ups, and explainers
              on the latest running shoes and gear.
            </p>
          </div>

          <ButtonLink
            href={SEE_ALL_HREF}
            variant="tertiary"
            size="small"
            suffixIcon={<ChevronRight />}
            className="hidden md:inline-flex"
          >
            See all articles
          </ButtonLink>
        </header>

        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-12">
          {/* Featured — sticky on lg so it pins while the supporting
              column scrolls past. */}
          <div className="lg:sticky lg:top-20 lg:col-span-3 lg:self-start">
            <FeaturedArticle item={featured} />
          </div>

          {/* Supporting column. md: 3-up horizontal grid; lg: stacked
              column-1 so the row reads as one big hero + three
              smaller cards lined up beside it. */}
          {supporting.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4 lg:grid-cols-1 lg:gap-12">
              {supporting.map((item) => (
                <ArticleCard
                  key={item._id}
                  href={item.href}
                  title={item.title}
                  publishedAt={item.publishedAt ?? ""}
                  kicker={item.kicker}
                  kickerHref={item.kickerHref ?? undefined}
                  imageUrl={resolveImageUrl(item)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden">
          <ButtonLink
            href={SEE_ALL_HREF}
            variant="tertiary"
            size="small"
            suffixIcon={<ChevronRight />}
            className="w-full"
          >
            See all articles
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
