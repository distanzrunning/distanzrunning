"use client";

// ============================================================================
// HomepageHeroCarousel
// ============================================================================
//
// Single-hero slideshow for the top of the homepage. Auto-advances
// every 7s, pauses on hover / focus / explicit pause click, and
// rotates through the editorial slides flagged `featuredOnHomepage`
// (post / productPost / raceGuide — fetched server-side and passed
// in as `slides`).
//
// Layout follows the Quartr reference:
//   - 33 / 66 column split on md+
//   - Left: kicker + serif headline + dek + meta dot + date
//   - Right: rounded image card with a subtle hover zoom
// On mobile the columns stack, image first.
//
// A11y:
//   - aria-roledescription="carousel"
//   - aria-live="polite" on the slide region (announce new slide)
//   - prev/next + pause/play buttons labelled
//   - reduced-motion users get auto-advance disabled by default
//     (still navigable manually)

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type HomepageHeroSlide = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource | null;
  kicker?: string;
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
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reduced-motion preference. If the user has it on, pause by default.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slideCount = slides.length;
  const shouldAutoplay = useMemo(
    () =>
      slideCount > 1 && !isPaused && !hovered && !focused && !prefersReducedMotion,
    [slideCount, isPaused, hovered, focused, prefersReducedMotion],
  );

  // Auto-advance timer.
  useEffect(() => {
    if (!shouldAutoplay) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldAutoplay, slideCount, intervalMs]);

  const goTo = useCallback(
    (idx: number) => {
      if (slideCount === 0) return;
      setActive(((idx % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Keyboard nav while focused inside the carousel.
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [focused, next, prev]);

  if (slideCount === 0) return null;

  const slide = slides[active];
  const dateLabel = slide.publishedAt
    ? format(new Date(slide.publishedAt), "d MMM yyyy")
    : null;

  return (
    <section
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        // Only blur out if focus is leaving the carousel entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
      className="relative z-0 flex w-full justify-center px-4 py-12 md:py-20 lg:py-28"
    >
      <div className="w-full max-w-[1280px]">
        {/* Slide region */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="grid items-center gap-8 lg:grid-cols-3 lg:gap-20"
        >
          {/* Left: text block (1/3) */}
          <div className="z-[1] flex flex-col justify-center gap-4 lg:col-span-1">
            {slide.kicker && (
              <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-[color:var(--ds-gray-700)]">
                <span className="uppercase">{slide.kicker}</span>
                {dateLabel && (
                  <>
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-[color:var(--ds-gray-700)] opacity-60"
                    />
                    <span className="font-mono">{dateLabel}</span>
                  </>
                )}
              </div>
            )}
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
          </div>

          {/* Right: image card (2/3) */}
          <Link
            href={slide.href}
            className="group relative block overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] lg:col-span-2"
            style={{ background: "var(--ds-gray-200)" }}
            aria-label={slide.title}
          >
            <div className="relative aspect-[16/9] w-full">
              {slide.mainImage && (
                <Image
                  key={slide._id /* force fade on slide change */}
                  src={urlFor(slide.mainImage).width(1600).height(900).url()}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 853px, 100vw"
                  priority={active === 0}
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </Link>
        </div>

        {/* Controls: dots + prev/next + pause/play */}
        {slideCount > 1 && (
          <div className="mt-8 flex items-center justify-between gap-4 lg:mt-10">
            {/* Dots */}
            <div
              role="tablist"
              aria-label="Choose a slide"
              className="flex items-center gap-2"
            >
              {slides.map((s, i) => (
                <button
                  key={s._id}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  aria-label={`Slide ${i + 1}: ${s.title}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active
                      ? "w-6 bg-[color:var(--ds-gray-1000)]"
                      : "w-1.5 bg-[color:var(--ds-gray-400)] hover:bg-[color:var(--ds-gray-700)]"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <CarouselButton
                aria-label="Previous slide"
                onClick={prev}
              >
                <ArrowLeft className="size-4" />
              </CarouselButton>
              <CarouselButton
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
                aria-pressed={isPaused}
                onClick={() => setIsPaused((p) => !p)}
              >
                {isPaused ? (
                  <Play className="size-4" />
                ) : (
                  <Pause className="size-4" />
                )}
              </CarouselButton>
              <CarouselButton aria-label="Next slide" onClick={next}>
                <ArrowRight className="size-4" />
              </CarouselButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Button — same anatomy as the SiteHeader hamburger so the carousel
// controls feel like part of the same DS family.
// ============================================================================

function CarouselButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="grid size-8 place-items-center rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] dark:bg-[color:var(--ds-background-100)] dark:hover:bg-[color:var(--ds-gray-100)]"
    >
      {children}
    </button>
  );
}
