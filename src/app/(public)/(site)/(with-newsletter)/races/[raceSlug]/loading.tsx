// src/app/races/[raceSlug]/loading.tsx
//
// Instant loading state for a race guide. Same rationale as the
// /races index boundary: the detail page's server work (Sanity doc +
// route GeoJSON fetch + expo geocode) otherwise held the previous
// page painted with zero feedback after a card click. This paints
// immediately: the map page's recessed gray canvas at the same
// full-viewport-under-masthead height, with the shared LoadingBar on
// the fixed top rail — when the real page streams in, the map's own
// backdrop is the identical tone, so the handoff doesn't flash.

import LoadingBar from "../../../races/LoadingBar";

export default function RaceGuideLoading() {
  return (
    <div className="relative min-h-[calc(100vh-113px)] w-full bg-[color:var(--ds-gray-100)]">
      <LoadingBar />
    </div>
  );
}
