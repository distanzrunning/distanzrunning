"use client";

// src/app/races/ViewSwitch.tsx
//
// Grid ↔ Map view switch for the /races index. View state lives in
// the URL (?view=map) like every other piece of page state here, so
// map views are shareable/bookmarkable and the server renders the
// right layout on first paint. The server builds both target hrefs
// (current filters preserved, view param toggled) — no
// useSearchParams here, so the island needs no Suspense boundary.
//
// Perceived-latency work (user call 2026-08-21):
//   - the OTHER view's route is prefetched on mount, so the server
//     render (including the map view's geocoding pass) happens before
//     the click, not after it;
//   - the switch flips inside useTransition and a slim indeterminate
//     LoadingBar rides the fixed top-of-viewport rail while the
//     round-trip is in flight — but only when heading to GRID; the
//     map island owns the bar for the map journey (see pendingView).

import { useEffect, useState, useTransition } from "react";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/Switch";
import LoadingBar from "./LoadingBar";

export default function ViewSwitch({
  view,
  gridHref,
  mapHref,
}: {
  view: "grid" | "map";
  gridHref: string;
  mapHref: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Which view the in-flight switch is heading to. The LoadingBar is
  // ONE line per journey: switching to MAP hands the bar off to the
  // map island (its tile-loading bar mounts at the same fixed rail on
  // commit), so this island only shows a bar when heading to GRID —
  // two bars at once read as duplicates (user call 2026-08-22).
  const [pendingView, setPendingView] = useState<"grid" | "map" | null>(null);

  // Warm the other view ahead of the click. For the map view this
  // also runs the server-side geocoding pass, filling lib/geocode's
  // 24h fetch cache — the single biggest source of first-click lag.
  useEffect(() => {
    router.prefetch(view === "map" ? gridHref : mapHref);
  }, [router, view, gridHref, mapHref]);

  const setView = (next: string) => {
    if (next === view) return;
    setPendingView(next === "map" ? "map" : "grid");
    startTransition(() => {
      router.replace(next === "map" ? mapHref : gridHref, { scroll: false });
    });
  };

  return (
    <>
      {/* size="small" (32px) matches the Imperial/Metric Switch and
          the currency Select beside it. */}
      <Switch
        size="small"
        value={view}
        onChange={setView}
        options={[
          {
            value: "grid",
            label: "Grid",
            icon: <LayoutGrid className="h-3.5 w-3.5" />,
          },
          {
            value: "map",
            label: "Map",
            icon: <MapIcon className="h-3.5 w-3.5" />,
          },
        ]}
      />
      {isPending && pendingView === "grid" && <LoadingBar />}
    </>
  );
}
