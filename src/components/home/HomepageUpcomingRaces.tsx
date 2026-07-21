// src/components/home/HomepageUpcomingRaces.tsx
//
// Homepage Upcoming Races — the Latest News section anatomy (header
// row: title + tagline left, view-all right; ONE row of cards in the
// shared wheel-stepping carousel, three in view on desktop) over
// Runna's race-card grammar via RaceCard chrome="card": one clipped
// container per card — image + filled footer.
//
// Items are auto-selected — the next 10 race guides by event date
// (see upcomingRacesQuery), so the row stays current as races pass.
// Server component: image URLs + LQIPs resolve at the data boundary
// per the DS convention; the Carousel primitives are client
// components receiving these server-rendered cards as children.

import { ChevronRight } from "lucide-react";

import RaceCard from "@/components/RaceCard";
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
import { safeSanityFetch } from "@/sanity/lib/safeFetch";
import { upcomingRacesQuery } from "@/sanity/queries/upcomingRacesQuery";
import { urlFor } from "@/sanity/lib/image";

const ALL_RACES_HREF = "/races";

function AllRacesButton({ className }: { className?: string }) {
  return (
    <ButtonLink
      href={ALL_RACES_HREF}
      variant="tertiary"
      size="medium"
      suffixIcon={<ChevronRight />}
      className={className}
    >
      All races
    </ButtonLink>
  );
}

// Bare chevrons OUTSIDE the content edge, over the canvas (see the
// Latest News notes — deterministic background, ≥1400px only; always
// visible while scrollable, hover = colour step-up, no fill). Unlike
// Latest News (photo-centred cq maths), these centre on the WHOLE
// card: the buttons keep the Carousel default top-1/2 translate
// against the row, which is exactly card height. Threshold recomputed
// for the 16px-gutter geometry (at 1360 the arrow sits flush against
// the viewport edge; 1400 restores the ~20px breathing room the
// original 1360 gave under the old 24px gutters).
const ARROW_CLASS =
  "hidden min-[1400px]:grid text-textSubtle transition-[color,opacity] duration-200 hover:bg-transparent hover:text-textDefault disabled:opacity-0 dark:hover:bg-transparent [&_svg]:size-8";

type UpcomingRace = {
  _id: string;
  title: string;
  href: string;
  mainImage?: unknown;
  lqip?: string | null;
  eventDate?: string;
  city?: string | null;
  stateRegion?: string | null;
  country?: string | null;
  category?: string | null;
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  price?: number;
  currency?: string;
};

function formatLocation(race: UpcomingRace): string | undefined {
  const parts = [race.city, race.stateRegion, race.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : undefined;
}

export default async function HomepageUpcomingRaces() {
  const { data: races } = await safeSanityFetch({ query: upcomingRacesQuery });
  if (!races?.length) return null;

  return (
    <section
      aria-label="Upcoming races"
      // Tight homepage rhythm — the Carousel wrapper carries the
      // section rule (DEFAULT, subtle grayscale hairline) at exact
      // content width, like Editor's Picks.
      className="mx-auto w-full max-w-content px-4 pb-10 lg:pb-12"
    >
      <Carousel
        opts={{
          align: "start",
          // Mobile single-card view (user call 2026-07-21): the active
          // card centres with equal peeks; containScroll off so first/last
          // snaps centre too (see Latest News).
          breakpoints: {
            "(max-width: 639px)": { align: "center", containScroll: false },
          },
        }}
        // Free-glide wheel gestures off — CarouselWheelStep below steps
        // one card per gesture instead, so the row always lands in place.
        wheelGestures={false}
        aria-label="Upcoming races"
        className="flex w-full flex-col gap-8 border-t border-borderSubtle pt-10 md:gap-10 lg:pt-12"
      >
        {/* Header row — title + tagline left; view-all right (desktop). */}
        <div className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            {/* Section headers are wayfinding chrome — UI heading
                register (600), shared across the homepage sections. */}
            <h2 className="text-heading-24 md:text-heading-32 text-balance text-textDefault">
              Upcoming Races
            </h2>
            <p className="text-copy-16 md:text-copy-18 text-balance text-textSubtle">
              Interactive guides for the next races on the calendar.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <AllRacesButton />
          </div>
        </div>

        {/* One row — three cards in view on desktop, a peek of the next
            on mobile. The group/row wrapper scopes the arrows' hover
            reveal to the row itself. */}
        <CarouselWheelStep className="group/row relative @container">
          <CarouselContent>
            {races.map((race: UpcomingRace) => (
              <CarouselItem
                key={race._id}
                // Full content-column width on mobile — matches Latest
                // News (the chevron pager below carries navigation).
                className="basis-full sm:basis-1/2 md:basis-1/3"
              >
                <RaceCard
                  chrome="card"
                  href={race.href}
                  title={race.title}
                  eventDate={race.eventDate}
                  location={formatLocation(race)}
                  category={race.category ?? undefined}
                  imageUrl={
                    race.mainImage
                      ? urlFor(race.mainImage as Parameters<typeof urlFor>[0])
                          .width(960)
                          .height(525)
                          .auto("format")
                          .url()
                      : undefined
                  }
                  blurDataURL={race.lqip}
                  surface={race.surface}
                  surfaceBreakdown={race.surfaceBreakdown}
                  profile={race.profile}
                  elevationGain={race.elevationGain}
                  price={race.price}
                  currency={race.currency}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className={cn("left-0 -translate-x-[calc(100%+8px)]", ARROW_CLASS)}
          />
          <CarouselNext
            variant="ghost"
            className={cn("right-0 translate-x-[calc(100%+8px)]", ARROW_CLASS)}
          />
          {/* Mobile pair (<sm) — centred row of square chips below the
              content, matching Latest News. */}
          <div className="mt-6 flex justify-center gap-3 sm:hidden">
            <CarouselPrevious className="static translate-y-0 rounded-sm" />
            <CarouselNext className="static translate-y-0 rounded-sm" />
          </div>
        </CarouselWheelStep>

        {/* Mobile view-all — full-width row below the content (user call
            2026-07-16; header keeps it from md up). */}
        <div className="md:hidden">
          <AllRacesButton className="w-full" />
        </div>
      </Carousel>
    </section>
  );
}
