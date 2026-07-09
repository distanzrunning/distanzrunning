// src/components/home/HomepageLatestNews.tsx
//
// Homepage Latest News — Quartr's section anatomy (header row: title +
// subtle tagline left; view-all + slider arrows right) over ONE row of
// compact plain-chrome ArticleCards in the shared Embla Carousel:
// three in view on desktop, more sliding in from the right (trackpad
// horizontal swipes work via the carousel's wheel-gestures plugin).
//
// Server component: fetches the six newest posts (minus the hero's
// article — see latestNewsQuery) and resolves image URLs + LQIPs at
// the data boundary per the DS convention. The Carousel primitives are
// client components receiving these server-rendered cards as children.

import { ChevronRight } from "lucide-react";

import ArticleCard from "@/components/ui/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselWheelStep,
} from "@/components/ui/Carousel";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { latestNewsQuery } from "@/sanity/queries/latestNewsQuery";
import { urlFor } from "@/sanity/lib/image";
import { formatDisplayDate } from "@/lib/dates";

const ALL_ARTICLES_HREF = "/articles";

function AllArticlesButton() {
  return (
    <ButtonLink
      href={ALL_ARTICLES_HREF}
      variant="tertiary"
      size="medium"
      suffixIcon={<ChevronRight />}
    >
      All articles
    </ButtonLink>
  );
}

// Floating arrow chips straddling the row's edges — revealed on row
// hover (and on keyboard focus); a disabled chip stays hidden even
// while hovering. Touch devices never hover, so they swipe the peek.
const ARROW_CLASS =
  "opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 disabled:opacity-0";

// Vertical centre of the IMAGE band (not the whole card): the image
// height is a pure function of the row width — card = (row − gaps) / n,
// image = card × 35/64 (the 16/8.75 crop) — so cq units place the chip
// exactly at half image height at any size. Factors: ÷2-up = 35/256,
// 3-up = 35/384, each halved.
const ARROW_Y =
  "top-[calc((100cqw-16px)*0.1367)] md:top-[calc((100cqw-32px)*0.0911)]";

export default async function HomepageLatestNews() {
  const { data: posts } = await sanityFetch({ query: latestNewsQuery });
  if (!posts?.length) return null;

  return (
    <section
      aria-label="Latest news"
      // Tight homepage rhythm — sections sit close, separated by ink
      // rules. This one follows the full-bleed promo band, which does
      // the separating itself, so no rule here.
      className="mx-auto w-full max-w-content px-6 py-10 lg:py-12"
    >
      <Carousel
        opts={{ align: "start" }}
        // Free-glide wheel gestures off — CarouselWheelStep below steps
        // one card per gesture instead, so the row always lands in place.
        wheelGestures={false}
        className="flex w-full flex-col gap-8 md:gap-11"
      >
        {/* Header row — title + tagline left; view-all + arrows right
            (desktop). */}
        <div className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            {/* Section headers are wayfinding chrome, not editorial
                content — they run the UI heading register (600), the
                Vercel-KB section-h2 voice. Content (hero, card titles)
                stays on the 450 display register. */}
            <h2 className="flex items-center gap-3 text-heading-24 md:text-heading-32 text-balance text-textDefault">
              {/* Live mark — BBC's ring-and-disc anatomy, pulsing as ONE:
                  the opacity pulse sits on the whole mark, so the ring
                  stays a solid drawn circle and breathes together with the
                  dot (never radiating away). DS status-dot keyframes,
                  reduced-motion aware; semantic red token; decorative. */}
              <span
                aria-hidden
                className="ds-status-dot--pulse flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--ds-red-700)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[var(--ds-red-700)]" />
              </span>
              Latest News
            </h2>
            <p className="text-copy-16 md:text-copy-18 text-balance text-textSubtle">
              The latest stories from road, track, and trail.
            </p>
          </div>
          <div className="hidden md:block">
            <AllArticlesButton />
          </div>
        </div>

        {/* One row — three cards in view on desktop (Quartr's 3-col card
            proportions), a peek of the next on mobile. The group/row
            wrapper scopes the arrows' hover reveal to the row itself. */}
        <CarouselWheelStep className="group/row relative @container">
          <CarouselContent>
          {posts.map(
            (post: {
              _id: string;
              title: string;
              excerpt?: string | null;
              publishedAt?: string | null;
              mainImage?: unknown;
              lqip?: string | null;
              category?: { title: string; slug: string } | null;
              href: string;
            }) => (
              <CarouselItem
                key={post._id}
                className="basis-[85%] sm:basis-1/2 md:basis-1/3"
              >
                <ArticleCard
                  size="md"
                  chrome="plain"
                  imageRatio="16/8.75"
                  href={post.href}
                  title={post.title}
                  excerpt={post.excerpt}
                  imageUrl={
                    post.mainImage
                      ? urlFor(post.mainImage as Parameters<typeof urlFor>[0])
                          .width(960)
                          .height(525)
                          .auto("format")
                          .url()
                      : null
                  }
                  blurDataURL={post.lqip}
                  imageSizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, 405px"
                  category={
                    post.category
                      ? {
                          label: post.category.title,
                          href: `/articles/${post.category.slug}`,
                        }
                      : null
                  }
                  publishedAt={
                    post.publishedAt ? formatDisplayDate(post.publishedAt) : null
                  }
                />
              </CarouselItem>
            ),
          )}
          </CarouselContent>
          <CarouselPrevious
            className={cn("left-0 -translate-x-1/2", ARROW_Y, ARROW_CLASS)}
          />
          <CarouselNext
            className={cn("right-0 translate-x-1/2", ARROW_Y, ARROW_CLASS)}
          />
        </CarouselWheelStep>

        {/* Mobile view-all — below the row, as Quartr does. */}
        <div className="md:hidden">
          <AllArticlesButton />
        </div>
      </Carousel>
    </section>
  );
}
