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

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/Carousel";

// ============================================================================
// HeroSlideImage — picture/img with skeleton overlay + cached-image fix
// ============================================================================

function HeroSlideImage({
  slide,
  index,
}: {
  slide: HomepageHeroSlide;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Cached-image race: when the <link rel="preload"> for the LCP
  // slide fires before React hydrates, the browser has the image
  // in cache by the time React renders the <img> — and renders it
  // synchronously without firing a load event. Check `complete`
  // on mount; if the image is ready, mark loaded immediately.
  // If not, wire a load listener (in addition to the JSX onLoad
  // for the cached-then-evicted edge case).
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const handler = () => setLoaded(true);
    img.addEventListener("load", handler);
    return () => img.removeEventListener("load", handler);
  }, []);

  if (!slide.mainImage) return null;

  return (
    <>
      {/* Skeleton overlay — uniform gray pulse until <img> decodes,
          then fades out and the actual image takes over. */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-[color:var(--ds-gray-100)] transition-opacity duration-300 ${
          loaded
            ? "pointer-events-none opacity-0"
            : "animate-pulse opacity-100"
        }`}
      />
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={urlFor(slide.mainImage)
            .width(1600)
            .height(900)
            .auto("format")
            .url()}
        />
        <img
          ref={imgRef}
          src={urlFor(slide.mainImage)
            .width(800)
            .height(1000)
            .auto("format")
            .url()}
          alt=""
          // All slides eager — Embla translates non-active slides
          // off-screen, so loading="lazy" never triggers.
          loading="eager"
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full scale-[1.04] object-cover transition-[transform,opacity] duration-300 ease-out will-change-transform group-hover/slide:scale-100 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </picture>
    </>
  );
}

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
      className="group/carousel relative z-0 w-full px-4 py-12 md:py-24 lg:py-32"
    >
      <div className="w-full">
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
                          className="outline-none transition-colors hover:text-[color:var(--ds-gray-900)] focus-visible:text-[color:var(--ds-gray-900)] group-hover/cover:text-[color:var(--ds-gray-900)]"
                        >
                          {slide.title}
                        </Link>
                      </h2>
                      {slide.excerpt && (
                        <p className="max-w-prose text-copy-18 font-medium leading-snug text-[color:var(--ds-gray-900)] md:text-copy-20 md:leading-snug">
                          {slide.excerpt}
                        </p>
                      )}
                      {(slide.kicker || dateLabel) && (
                        <div className="mt-1 flex items-center gap-2 text-copy-13 text-[color:var(--ds-gray-700)]">
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
                        lg:order-2 puts it back on the right on desktop.
                        Aspect flips per viewport: 4/5 portrait on
                        mobile (taller, more impactful in the phone
                        viewport) → 16/9 cinematic on lg+. The
                        <picture> element art-directs the source so
                        Sanity returns a portrait crop on mobile and
                        the original landscape crop on desktop —
                        respects the editor's hotspot if set. */}
                    <Link
                      href={slide.href}
                      className="group/cover relative order-1 block overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] lg:order-2 lg:col-span-2"
                      style={{ background: "var(--ds-gray-200)" }}
                      aria-label={slide.title}
                    >
                      <div className="relative aspect-[4/5] w-full lg:aspect-[16/9]">
                        <HeroSlideImage slide={slide} index={i} />
                      </div>
                    </Link>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Wayfinding row — Embla default controls pattern. Prev +
            next buttons grouped on the bottom-left, dots on the
            bottom-right. Active dot widens to mark position;
            inactive dots sit quietly at gray-400 so they read as
            "more here" without dominating. */}
        {slideCount > 1 && (
          <div className="mt-8 flex items-center justify-between gap-4 lg:mt-10 lg:px-14">
            <div className="flex items-center gap-2">
              <Button
                size="small"
                shape="square"
                variant="secondary"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
              <Button
                size="small"
                shape="square"
                variant="secondary"
                onClick={() => api?.scrollNext()}
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>

            <div
              role="tablist"
              aria-label="Slide navigation"
              className="flex items-center gap-1.5"
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
          </div>
        )}
      </div>
    </section>
  );
}
