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
// On mobile the columns stack, image first (via `order-1 lg:order-2`),
// the carousel drops its outer px-12 so the image fills the viewport,
// and the prev/next chevron chips hide entirely (they sit off-screen
// on narrow viewports anyway). Mobile users navigate via swipe and
// the dot wayfinding strip below the slides.

import { useCallback, useEffect, useState } from "react";
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
  type CarouselApi,
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
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  );

  if (slideCount === 0) return null;

  return (
    <section
      aria-label="Featured stories"
      className="group/carousel relative z-0 flex w-full justify-center px-4 py-12 md:py-24 lg:py-32"
    >
      <div className="w-full max-w-[1400px]">
        <Carousel
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
          className="lg:px-14"
        >
          <CarouselContent>
            {slides.map((slide, i) => {
              const dateLabel = slide.publishedAt
                ? format(new Date(slide.publishedAt), "d MMM yyyy")
                : null;
              return (
                <CarouselItem key={slide._id}>
                  <article className="group/slide grid items-center gap-8 lg:grid-cols-3 lg:gap-24">
                    {/* Left: text — Headline → Excerpt → Meta.
                        order-2 on mobile so it sits below the image;
                        lg:order-1 reverts to normal flow on desktop. */}
                    <div className="order-2 flex flex-col justify-center gap-4 lg:order-1 lg:col-span-1">
                      <h2
                        className="text-balance font-headline font-semibold text-[color:var(--ds-gray-1000)]"
                        style={{
                          fontSize: "clamp(36px, 5.2vw, 64px)",
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

                    {/* Right: image card. Inverse-zoom on slide hover.
                        order-1 on mobile pulls it above the text block;
                        lg:order-2 puts it back on the right on desktop. */}
                    <Link
                      href={slide.href}
                      className="relative order-1 block overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] lg:order-2 lg:col-span-2"
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
              affordance). Hidden on mobile / tablet — they sit at
              -left-12 / -right-12 which puts them off-screen on
              narrow viewports. Mobile users navigate via swipe
              (Embla's built-in drag handler) and the dot
              wayfinding strip below. */}
          {slideCount > 1 && (
            <>
              <CarouselPrevious className="hidden opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100 lg:grid" />
              <CarouselNext className="hidden opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100 lg:grid" />
            </>
          )}
        </Carousel>

        {/* Subtle dots — wayfinding only. Active widens slightly to
            mark position; inactive sit quietly at gray-400 so they
            read as "more here" without dominating. */}
        {slideCount > 1 && (
          <div
            role="tablist"
            aria-label="Slide navigation"
            className="mt-8 flex items-center justify-center gap-1.5 lg:mt-10"
          >
            {slides.map((s, i) => (
              <button
                key={s._id}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => scrollTo(i)}
                className={`h-[5px] rounded-full transition-all ${
                  i === active
                    ? "w-4 bg-[color:var(--ds-gray-1000)]"
                    : "w-[5px] bg-[color:var(--ds-gray-400)] hover:bg-[color:var(--ds-gray-700)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
