import { ChevronRight } from "lucide-react";
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
// Unlike Breaking News, this section sits directly on the
// PageFrame surface — no inner panel. The row uses the v0-pattern
// native scroll-snap carousel: overflow-x-auto + snap-x +
// snap-mandatory, hidden scrollbar, edge-fade gradients matching
// the PageFrame background, and tight calc()-based item widths
// (2-up at sm, 3-up at lg) so the cards fit without spillover.
//
// Trackpad horizontal swipes work natively (no Embla plugin
// needed); mobile users get standard touch scrolling.

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
  if (visible.length === 0) return null;

  return (
    <section className="flex w-full justify-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8 md:gap-11">
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

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[color:var(--ds-background-200)] to-transparent dark:from-[color:var(--ds-background-100)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[color:var(--ds-background-200)] to-transparent dark:from-[color:var(--ds-background-100)]"
          />

          <div className="snap-x snap-mandatory scroll-smooth overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex list-none gap-x-6 p-0">
              {visible.map((item) => {
                const { imageUrl, blurDataURL } = resolveCardImages(item);
                return (
                  <li
                    key={item._id}
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
