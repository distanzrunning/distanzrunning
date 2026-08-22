// src/app/races/RaceGrid.tsx
//
// Server component. Takes the already-filtered, already-sorted
// race list from page.tsx and renders the responsive RaceCard grid
// — three per row on desktop, the homepage's chrome="card"
// treatment (Vercel-KB anatomy: clipped surface container, 16/10
// photo, footer with title/location + date pill). No client logic
// — first paint is the final layout.

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import RaceCard from "@/components/RaceCard";
import { urlFor } from "@/sanity/lib/image";

export type RaceIndexItem = {
  _id: string;
  title: string;
  slug?: string;
  href: string;
  mainImage?: SanityImageSource | null;
  /** Inline LQIP (asset->metadata.lqip) for the blur placeholder. */
  lqip?: string | null;
  /** Stored map coordinates (the `location` geopoint) — the map view
   *  prefers these; races without them fall back to a server-side
   *  geocode of city/state/country. */
  lat?: number | null;
  lng?: number | null;
  eventDate?: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  category?: string;
  tags?: string[];
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  price?: number;
  currency?: string;
  fieldSize?: number;
};

function formatLocation(item: RaceIndexItem): string | undefined {
  const parts = [item.city, item.stateRegion, item.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : undefined;
}

function resolveImage(item: RaceIndexItem): string | undefined {
  if (!item.mainImage) return undefined;
  // Crop at the data layer to the card chrome's 16/10 panel so the
  // client never over-fetches or re-crops.
  return urlFor(item.mainImage).width(960).height(600).auto("format").url();
}

export default function RaceGrid({ races }: { races: RaceIndexItem[] }) {
  if (races.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-[color:var(--ds-gray-400)] p-12 text-center">
        <p className="text-copy-16 text-textSubtle">
          No races match these filters.
        </p>
      </div>
    );
  }

  return (
    // Promote the grid onto its own GPU compositor layer so
    // filter-row reflow above (chip wrap when search expands
    // on narrow Safari viewports) translates the cards on the
    // GPU instead of triggering a paint pass for every card.
    //   - transform: translateZ(0) → forces a stacking context
    //     + composited layer.
    //   - contain: layout paint → tells the browser the grid's
    //     layout AND paint are independent of ancestors, so
    //     external changes don't invalidate either.
    <ul
      className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
      style={{ contain: "layout paint", transform: "translateZ(0)" }}
    >
      {races.map((race, i) => (
        <li key={race._id}>
          {/* variant="index" on the card chrome: the glassy hover
              overlay with the Surface / Elevation / Price stat pills
              — the index page's extra-information layer. */}
          <RaceCard
            chrome="card"
            variant="index"
            href={race.href}
            title={race.title}
            eventDate={race.eventDate}
            location={formatLocation(race)}
            category={race.category}
            imageUrl={resolveImage(race)}
            blurDataURL={race.lqip}
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
