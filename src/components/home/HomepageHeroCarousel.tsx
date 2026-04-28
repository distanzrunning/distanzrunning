"use client";

// ============================================================================
// HomepageHeroCarousel
// ============================================================================
//
// Single-hero slideshow for the top of the homepage. Built on the
// shadcn-pattern <Carousel /> primitive (Embla Carousel under the
// hood). No autoplay — manual navigation only via the prev / next
// chevrons (visible on section hover) or drag / swipe on touch.
//
// Slides are the editorial entries flagged `featuredOnHomepage`
// (post / productPost / raceGuide — fetched server-side and passed
// in as `slides`).
//
// Layout follows the Quartr reference:
//   - 33 / 66 column split on lg+
//   - Left: serif headline + excerpt + kicker (clickable) · date
//   - Right: rounded image card with subtle inverse-zoom on slide hover
// On mobile the columns stack, image first.

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

export type HomepageHeroSlide = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource | null;
  kicker?: string;
  kickerHref?: string | null;
  href: string;
};

interface HomepageHeroCarouselProps {
  slides: ReadonlyArray<HomepageHeroSlide>;
}

export default function HomepageHeroCarousel({
  slides,
}: HomepageHeroCarouselProps) {
  const slideCount = slides.length;
  if (slideCount === 0) return null;

  return (
    <section
      aria-label="Featured stories"
      className="group/carousel relative z-0 flex w-full justify-center px-4 py-12 md:py-20 lg:py-28"
    >
      <div className="w-full max-w-[1280px]">
        <Carousel
          opts={{ loop: true, align: "start" }}
          className="px-12 lg:px-14"
        >
          <CarouselContent>
            {slides.map((slide, i) => {
              const dateLabel = slide.publishedAt
                ? format(new Date(slide.publishedAt), "d MMM yyyy")
                : null;
              return (
                <CarouselItem key={slide._id}>
                  <article className="group/slide grid items-center gap-8 lg:grid-cols-3 lg:gap-20">
                    {/* Left: text — Headline → Excerpt → Meta */}
                    <div className="flex flex-col justify-center gap-4 lg:col-span-1">
                      <h2
                        className="text-balance font-headline font-semibold text-[color:var(--ds-gray-1000)]"
                        style={{
                          fontSize: "clamp(36px, 5vw, 58px)",
                          lineHeight: 1.05,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <Link
                          href={slide.href}
                          className="outline-none transition-colors hover:text-[color:var(--ds-gray-900)] focus-visible:text-[color:var(--ds-gray-900)]"
                        >
                          {slide.title}
                        </Link>
                      </h2>
                      {slide.excerpt && (
                        <p className="max-w-prose text-[18px] leading-[1.4] text-[color:var(--ds-gray-900)] md:text-[21px] md:leading-[1.4]">
                          {slide.excerpt}
                        </p>
                      )}
                      {(slide.kicker || dateLabel) && (
                        <div className="mt-1 flex items-center gap-2 text-[13px] text-[color:var(--ds-gray-700)]">
                          {slide.kicker && slide.kickerHref ? (
                            <Link
                              href={slide.kickerHref}
                              className="rounded-sm transition-colors hover:text-[color:var(--ds-gray-1000)] focus-visible:text-[color:var(--ds-gray-1000)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ds-focus-ring)]"
                            >
                              {slide.kicker}
                            </Link>
                          ) : slide.kicker ? (
                            <span>{slide.kicker}</span>
                          ) : null}
                          {slide.kicker && dateLabel && (
                            <span
                              aria-hidden
                              className="size-1 rounded-full bg-[color:var(--ds-gray-700)] opacity-60"
                            />
                          )}
                          {dateLabel && (
                            <span className="font-mono">{dateLabel}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: image card. Inverse-zoom on slide hover. */}
                    <Link
                      href={slide.href}
                      className="relative block overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] lg:col-span-2"
                      style={{ background: "var(--ds-gray-200)" }}
                      aria-label={slide.title}
                    >
                      <div className="relative aspect-[16/9] w-full">
                        {slide.mainImage && (
                          <Image
                            src={urlFor(slide.mainImage)
                              .width(1600)
                              .height(900)
                              .url()}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 853px, 100vw"
                            priority={i === 0}
                            className="scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover/slide:scale-100"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </Link>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Prev / next chevrons fade in on section hover (desktop
              affordance). Mobile users navigate via swipe (Embla's
              built-in drag handler). */}
          {slideCount > 1 && (
            <>
              <CarouselPrevious className="opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100" />
              <CarouselNext className="opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
