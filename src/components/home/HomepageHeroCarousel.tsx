"use client";

// ============================================================================
// HomepageHeroCarousel
// ============================================================================
//
// Single-hero slideshow for the top of the homepage. Auto-advances
// every 7s through the editorial slides flagged `featuredOnHomepage`
// (post / productPost / raceGuide — fetched server-side and passed
// in as `slides`).
//
// Layout follows the Quartr reference:
//   - 33 / 66 column split on lg+
//   - Left: serif headline, excerpt, kicker (clickable category) · date
//   - Right: rounded image card with subtle inverse-zoom on hover
// On mobile the columns stack, image first.
//
// Controls:
//   - Glass-effect prev / next chips overlay the image (left + right
//     edges, vertically centered)
//   - Below: a segmented progress bar — one segment per slide. The
//     current segment fills over the interval and onAnimationEnd
//     advances to the next slide (single source of truth for
//     timing). Hover / focus / reduced-motion pauses the animation.
//
// A11y:
//   - aria-roledescription="carousel"
//   - aria-live="polite" on the slide region (announce new slide)
//   - prev / next labelled
//   - reduced-motion users get auto-advance disabled (still
//     navigable manually via the chips or arrow keys)

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
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  kickerHref?: string | null;
  href: string;
};

interface HomepageHeroCarouselProps {
  slides: ReadonlyArray<HomepageHeroSlide>;
  /** Auto-advance interval in ms. Defaults to 7000. */
  intervalMs?: number;
}

const DEFAULT_INTERVAL = 7000;

// ============================================================================
// Keyframes — injected once. Drives the segmented progress bar.
// ============================================================================

const KEYFRAMES_ID = "homepage-hero-progress-keyframes";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes homepage-hero-progress {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `;
  document.head.appendChild(style);
}

export default function HomepageHeroCarousel({
  slides,
  intervalMs = DEFAULT_INTERVAL,
}: HomepageHeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    ensureKeyframes();
  }, []);

  // Reduced-motion preference. If the user has it on, no auto-advance.
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
    () => slideCount > 1 && !prefersReducedMotion,
    [slideCount, prefersReducedMotion],
  );
  const isPaused = hovered || focused;

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
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
      className="relative z-0 flex w-full justify-center px-4 py-12 md:py-20 lg:py-28"
    >
      <div className="w-full max-w-[1280px]">
        <article
          aria-live="polite"
          aria-atomic="true"
          className="group/slide relative grid items-center gap-8 lg:grid-cols-3 lg:gap-20"
        >
          {/* Left: text block (1/3) — Headline → Excerpt → Meta */}
          <div className="z-[1] flex flex-col justify-center gap-4 lg:col-span-1">
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
            {/* Meta — Category (clickable) · Date */}
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
                {dateLabel && <span className="font-mono">{dateLabel}</span>}
              </div>
            )}
          </div>

          {/* Right: image card (2/3). Inverse-zoom on slide hover. */}
          <Link
            href={slide.href}
            className="relative block overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] lg:col-span-2"
            style={{ background: "var(--ds-gray-200)" }}
            aria-label={slide.title}
          >
            <div className="relative aspect-[16/9] w-full">
              {slide.mainImage && (
                <Image
                  key={slide._id}
                  src={urlFor(slide.mainImage).width(1600).height(900).url()}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 853px, 100vw"
                  priority={active === 0}
                  className="scale-[1.04] transition-transform duration-300 ease-out will-change-transform group-hover/slide:scale-100"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </Link>

          {/* Prev / next chips at the article's left + right edges so
              they frame the entire section rather than overlay the
              image. Hidden below lg — on mobile the progress bar's
              segment buttons handle navigation. */}
          {slideCount > 1 && (
            <>
              <NavChip
                aria-label="Previous slide"
                onClick={prev}
                className="left-0 hidden lg:grid"
              >
                <ArrowLeft className="size-4" />
              </NavChip>
              <NavChip
                aria-label="Next slide"
                onClick={next}
                className="right-0 hidden lg:grid"
              >
                <ArrowRight className="size-4" />
              </NavChip>
            </>
          )}
        </article>

        {/* Progress indicator — only the active slide gets a wide
            fillable bar. Past slides are filled dots, future slides
            are empty dots. The active bar's onAnimationEnd drives
            the auto-advance; hover / focus pauses via animation
            play-state. */}
        {slideCount > 1 && (
          <div className="mt-8 flex items-center gap-2 lg:mt-10">
            {slides.map((s, i) => {
              const isPast = i < active;
              const isCurrent = i === active;
              if (isCurrent) {
                return (
                  <button
                    key={s._id}
                    type="button"
                    aria-label={`Slide ${i + 1} of ${slideCount}`}
                    aria-current="true"
                    onClick={() => goTo(i)}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color:var(--ds-gray-200)]"
                  >
                    <div
                      className="h-full origin-left bg-[color:var(--ds-gray-1000)]"
                      style={{
                        transform: shouldAutoplay ? "scaleX(0)" : "scaleX(1)",
                        animation: shouldAutoplay
                          ? `homepage-hero-progress ${intervalMs}ms linear forwards`
                          : undefined,
                        animationPlayState: isPaused ? "paused" : "running",
                      }}
                      onAnimationEnd={next}
                    />
                  </button>
                );
              }
              return (
                <button
                  key={s._id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`size-[6px] rounded-full transition-colors ${
                    isPast
                      ? "bg-[color:var(--ds-gray-1000)]"
                      : "bg-[color:var(--ds-gray-400)] hover:bg-[color:var(--ds-gray-700)]"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// NavChip — circular chip used as prev/next at the section edges.
// Same anatomy as the SiteHeader hamburger family (bordered + alt
// surface inside) so the controls feel part of the same DS.
// ============================================================================

function NavChip({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`absolute top-1/2 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] dark:bg-[color:var(--ds-background-100)] dark:hover:bg-[color:var(--ds-gray-100)] ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
