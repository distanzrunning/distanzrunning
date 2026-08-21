"use client";

// src/app/races/ViewSwitch.tsx
//
// Grid ↔ Map view switch for the /races index. View state lives in
// the URL (?view=map) like every other piece of page state here, so
// map views are shareable/bookmarkable and the server renders the
// right layout on first paint. The server builds both target hrefs
// (current filters preserved, view param toggled) — no
// useSearchParams here, so the island needs no Suspense boundary.

import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/Switch";

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

  const setView = (next: string) => {
    if (next === view) return;
    router.replace(next === "map" ? mapHref : gridHref, { scroll: false });
  };

  return (
    <Switch
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
  );
}
