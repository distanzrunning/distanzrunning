// src/app/races/RaceGrid.tsx
//
// Server component. Takes the already-filtered, already-sorted
// race list from page.tsx and renders the responsive RaceCard grid.
// No client logic — first paint is the final layout.

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import RaceCard from "@/components/RaceCard";
import { urlFor } from "@/sanity/lib/image";

export type RaceIndexItem = {
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
  distance?: number;
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  price?: number;
  currency?: string;
  finishers?: number;
};

function formatLocation(item: RaceIndexItem): string | undefined {
  const parts = [item.city, item.stateRegion, item.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : undefined;
}

function resolveImage(item: RaceIndexItem): string | undefined {
  if (!item.mainImage) return undefined;
  return urlFor(item.mainImage).width(1200).auto("format").url();
}

export default function RaceGrid({ races }: { races: RaceIndexItem[] }) {
  if (races.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[color:var(--ds-gray-400)] p-12 text-center">
        <p className="text-copy-16 text-[color:var(--ds-gray-900)]">
          No races match these filters.
        </p>
      </div>
    );
  }

  return (
    // contain: layout isolates the grid's reflow from filter-
    // row layout shifts above (chip wrap when search expands on
    // narrow viewports). Without it, Safari was repainting
    // every card whenever the filter row resized.
    <ul
      className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
      style={{ contain: "layout" }}
    >
      {races.map((race, i) => (
        <li key={race._id}>
          <RaceCard
            variant="index"
            href={race.href}
            title={race.title}
            eventDate={race.eventDate}
            location={formatLocation(race)}
            category={race.category}
            imageUrl={resolveImage(race)}
            priority={i < 6}
            surface={race.surface}
            surfaceBreakdown={race.surfaceBreakdown}
            profile={race.profile}
            elevationGain={race.elevationGain}
            price={race.price}
            currency={race.currency}
          />
        </li>
      ))}
    </ul>
  );
}
