import { ChevronRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import RaceCard from "@/components/RaceCard";
import { ButtonLink } from "@/components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { urlFor } from "@/sanity/lib/image";

// ============================================================================
// HomepageRaces
// ============================================================================
//
// Editorial "Upcoming Races" row. Items come from the
// `featuredRaceItems` array on the homepageSettings singleton —
// drag-and-drop ordering in Studio.
//
// Layout follows the same pattern as HomepageBreakingNews:
//   ≤ 3 items → static 3-col grid (stacked on mobile)
//   > 3 items → horizontal scroll carousel (Embla, with Mac
//     trackpad + touch swipe + hover chevrons)
//
// Panel anatomy mirrors Breaking News (border + canvas-coloured
// bg) but with no newsprint texture — the texture belongs to the
// "breaking" identity. A small grey eyebrow pill labels the row
// "Races" so the homepage reads as News → Reviews → Races.

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
  /** Hard cap on items rendered. Defaults to 8 — matches the schema's max. */
  limit?: number;
}

const SEE_ALL_HREF = "/races";

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
  limit = 8,
}: HomepageRacesProps) {
  const visible = items.slice(0, limit);
  if (visible.length === 0) return null;

  const isScrollable = visible.length > 3;

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8 rounded-xl border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-6 md:gap-11 md:p-10 lg:p-12 dark:bg-[color:var(--ds-background-200)]">
        <header className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 inline-flex items-center gap-2 self-start rounded-full bg-[color:var(--ds-gray-200)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--ds-gray-1000)]">
              Races
            </h2>

            <p className="text-balance text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-900)] md:text-[19px]">
              Upcoming races worth planning your year around.
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

        {isScrollable ? (
          <Carousel
            opts={{ align: "start" }}
            className="group/row relative w-full"
          >
            <CarouselContent>
              {visible.map((item) => {
                const { imageUrl, blurDataURL } = resolveCardImages(item);
                return (
                  <CarouselItem
                    key={item._id}
                    className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
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
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0" />
            <CarouselNext className="opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0" />
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-12">
            {visible.map((item) => {
              const { imageUrl, blurDataURL } = resolveCardImages(item);
              return (
                <RaceCard
                  key={item._id}
                  href={item.href}
                  title={item.title}
                  eventDate={item.eventDate}
                  location={formatLocation(item)}
                  category={item.category}
                  imageUrl={imageUrl}
                  blurDataURL={blurDataURL}
                />
              );
            })}
          </div>
        )}

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
