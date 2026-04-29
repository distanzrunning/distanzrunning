"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import RaceCard from "@/components/RaceCard";
import { ButtonLink } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";

// ============================================================================
// HomepageRaces
// ============================================================================
//
// "Upcoming Races" row. Items are auto-selected by the homepage
// query — the next 10 raceGuides with eventDate ≥ now, ordered
// ascending. No editorial curation: the homepage stays current as
// races pass.
//
// Sits directly on the PageFrame surface (no inner panel). Row
// uses native CSS scroll-snap: overflow-x-auto + snap-x +
// snap-mandatory, hidden scrollbar, tight calc()-based item
// widths (2-up at sm, 3-up at lg) so cards fit precisely with
// the 1.5 rem gap.
//
// Chevron chips (modelled on v0's row pattern) sit on the row's
// edges — fade out when there's nothing to scroll in that
// direction. Trackpad horizontal swipes scroll natively in
// addition; mobile users get standard touch scrolling.

export type HomepageRaceItem = {
  _id: string;
  title: string;
  slug?: string;
  href: string;
  mainImage?: SanityImageSource | null;
  eventDate?: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  category?: string;
};

interface HomepageRacesProps {
  items: ReadonlyArray<HomepageRaceItem>;
  /** Hard cap on items rendered. Defaults to 10 — matches the query cap. */
  limit?: number;
}

const SEE_ALL_HREF = "/races";
const SCROLL_GAP_PX = 24; // gap-x-6

function formatLocation(item: HomepageRaceItem): string | undefined {
  const parts = [item.city, item.stateRegion, item.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : undefined;
}

function resolveCardImages(item: HomepageRaceItem) {
  if (!item.mainImage) return { imageUrl: undefined, blurDataURL: undefined };
  return {
    imageUrl: urlFor(item.mainImage).width(1200).auto("format").url(),
    blurDataURL: urlFor(item.mainImage)
      .width(16)
      .height(9)
      .blur(20)
      .auto("format")
      .url(),
  };
}

export default function HomepageRaces({
  items,
  limit = 10,
}: HomepageRacesProps) {
  const visible = items.slice(0, limit);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, visible.length]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstItem = el.querySelector<HTMLElement>("[data-scroll-item]");
    const cardStep = (firstItem?.offsetWidth ?? el.clientWidth * 0.85) +
      SCROLL_GAP_PX;
    el.scrollBy({ left: cardStep * direction, behavior: "smooth" });
  }, []);

  if (visible.length === 0) return null;

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <header className="flex items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h2
              className="m-0 text-balance font-headline font-semibold text-[color:var(--ds-gray-1000)]"
              style={{
                fontSize: "clamp(28px, 3.4vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Upcoming races
            </h2>
            <p className="text-[14px] leading-[1.4] text-[color:var(--ds-gray-900)]">
              Find your next race with detailed race guides, course
              analysis, and insider tips on thousands of the world&apos;s
              greatest races.
            </p>
          </div>

          <ButtonLink
            href={SEE_ALL_HREF}
            variant="default"
            size="small"
            suffixIcon={<ChevronRight />}
            className="hidden md:inline-flex"
          >
            All races
          </ButtonLink>
        </header>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll races left"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 z-20 hidden size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] shadow-sm transition-opacity hover:bg-[color:var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-0 sm:flex dark:bg-[color:var(--ds-background-200)]"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          <button
            type="button"
            aria-label="Scroll races right"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 z-20 hidden size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] shadow-sm transition-opacity hover:bg-[color:var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-0 sm:flex dark:bg-[color:var(--ds-background-200)]"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>

          <div
            ref={scrollRef}
            className="snap-x snap-mandatory scroll-smooth overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex list-none gap-x-6 p-0">
              {visible.map((item) => {
                const { imageUrl, blurDataURL } = resolveCardImages(item);
                return (
                  <li
                    key={item._id}
                    data-scroll-item
                    className="w-[85%] shrink-0 snap-start sm:w-[calc(1/2*(100%-1.5rem))] lg:w-[calc(1/3*(100%-1.5rem*2))]"
                  >
                    <RaceCard
                      href={item.href}
                      title={item.title}
                      eventDate={item.eventDate}
                      location={formatLocation(item)}
                      category={item.category}
                      imageUrl={imageUrl}
                      blurDataURL={blurDataURL}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="md:hidden">
          <ButtonLink
            href={SEE_ALL_HREF}
            variant="default"
            size="small"
            suffixIcon={<ChevronRight />}
            className="w-full"
          >
            All races
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
