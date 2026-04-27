"use client";

// ============================================================================
// HomepageHeroCarousel
// ============================================================================
//
// Single-hero slideshow for the top of the homepage. Built on the
// shadcn-pattern <Carousel /> primitive (Embla under the hood) with
// the Autoplay plugin for the 7 s timer. Slides rotate through the
// editorial entries flagged `featuredOnHomepage` (post / productPost
// / raceGuide — fetched server-side and passed in as `slides`).
//
// Layout follows the Quartr reference:
//   - 33 / 66 column split on lg+
//   - Left: serif headline + excerpt + kicker (clickable) · date
//   - Right: rounded image card with subtle inverse-zoom on slide hover
// On mobile the columns stack, image first.
//
// Controls:
//   - <CarouselPrevious /> + <CarouselNext /> sit at the section
//     edges (default shadcn placement: left + right of the content
//     row, vertically centered)
//   - Pause / play toggle below the slide
//   - Dots indicator (segmented; current slide gets a wider pill)
//
// A11y: shadcn's <Carousel /> handles aria-roledescription="carousel"
// + arrow-key nav. We add aria-live announcements for the active
// slide and labelled controls. Reduced-motion users get autoplay
// off by default.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
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
  /** Auto-advance interval in ms. Defaults to 7000. */
  intervalMs?: number;
}

const DEFAULT_INTERVAL = 7000;

export default function HomepageHeroCarousel({
  slides,
  intervalMs = DEFAULT_INTERVAL,
}: HomepageHeroCarouselProps) {
  const slideCount = slides.length;
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reduced-motion preference. If the user has it on, autoplay is off.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Memoised Autoplay plugin instance. stopOnInteraction=false so a
  // manual prev/next click doesn't disable autoplay for the rest of
  // the page life — Embla just resets the interval.
  // stopOnMouseEnter=true gives us the hover-to-pause behaviour for
  // free without us tracking it.
  const autoplay = useRef(
    Autoplay({
      delay: intervalMs,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  // Sync the active index for the dots indicator.
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

  const shouldAutoplay = slideCount > 1 && !prefersReducedMotion;

  return (
    <section
      aria-label="Featured stories"
      className="relative z-0 flex w-full justify-center px-4 py-12 md:py-20 lg:py-28"
    >
      <div className="w-full max-w-[1280px]">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={shouldAutoplay ? [autoplay.current] : []}
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

          {/* Prev / next at the section edges (shadcn defaults to
              -left-12 / -right-12 — the px-12 wrapper above gives
              them room to sit just outside the slide content). */}
          {slideCount > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>

        {/* Dots indicator — centred. Pause/play removed; the carousel
            already pauses on hover via Embla's stopOnMouseEnter. */}
        {slideCount > 1 && (
          <div
            role="tablist"
            aria-label="Choose a slide"
            className="mt-8 flex items-center justify-center gap-2 lg:mt-10"
          >
            {slides.map((s, i) => (
              <button
                key={s._id}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active
                    ? "w-6 bg-[color:var(--ds-gray-1000)]"
                    : "w-1.5 bg-[color:var(--ds-gray-400)] hover:bg-[color:var(--ds-gray-700)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

