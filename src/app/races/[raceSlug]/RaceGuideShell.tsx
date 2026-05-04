"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// First slice: just the map. Race stats / guide panel will be
// reintroduced once we're confident the map renders correctly
// in every viewport.

import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";

export interface RaceGuideMeta {
  _id: string;
  title: string;
  slug?: string;
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
  elevationLoss?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  finishers?: number;
  mensCourseRecord?: string;
  mensCourseRecordAthlete?: string;
  mensCourseRecordCountry?: string;
  womensCourseRecord?: string;
  womensCourseRecordAthlete?: string;
  womensCourseRecordCountry?: string;
  officialWebsite?: string;
}

interface RaceGuideShellProps {
  race: RaceGuideMeta;
  routeGeoJsonUrl: string | null;
}

const ROUTE_LINE_COLOR = "#FF0058";

// Explicit height calc: 100vh minus the 50 px sticky site header
// and the 9 px PageFrame margins/borders below it. Without an
// explicit height, the absolutely-positioned map container would
// collapse to 0 height because `position: absolute inset-0`
// gives its parent no content to size against, and the parent's
// flex-1 chain through PageFrame doesn't propagate a definite
// height down to a leaf with no in-flow children.
const SHELL_HEIGHT = "calc(100vh - 59px)";

export default function RaceGuideShell({
  race,
  routeGeoJsonUrl,
}: RaceGuideShellProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: SHELL_HEIGHT }}
      aria-label={`${race.title} route map`}
    >
      {routeGeoJsonUrl ? (
        <RaceMap geoJsonUrl={routeGeoJsonUrl} />
      ) : (
        <StatusOverlay text="Route map coming soon." />
      )}
    </div>
  );
}

// ============================================================================
// Mapbox island
// ============================================================================

type MapStatus =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

function RaceMap({ geoJsonUrl }: { geoJsonUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geoJsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const { isDark } = useContext(DarkModeContext);
  const [status, setStatus] = useState<MapStatus>({ kind: "loading" });
  const [debug, setDebug] = useState<string>("init");

  // Initial create — runs exactly once. We deliberately do NOT
  // depend on DarkModeContext.isInitialized: in a hydration race
  // the flag may stay false momentarily on a fresh load and stall
  // map creation. Better to render with whatever isDark is at
  // mount and let the second effect swap styles when the flag
  // settles.
  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    setDebug(`token:${token ? "ok" : "missing"}`);
    if (!token) {
      setStatus({
        kind: "error",
        message: "Map unavailable — NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN missing.",
      });
      return;
    }
    mapboxgl.accessToken = token;

    const rect = containerRef.current.getBoundingClientRect();
    setDebug(`token:ok size:${Math.round(rect.width)}×${Math.round(rect.height)}`);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleForMode(isDark),
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    map.on("error", (e) => {
      // Surface Mapbox-internal errors so we can see them rather
      // than getting a silent blank canvas.
      const msg =
        (e?.error as Error | undefined)?.message ?? "Mapbox error";
      // eslint-disable-next-line no-console
      console.error("[RaceMap] mapbox error:", msg, e);
      setDebug(`err:${msg.slice(0, 60)}`);
      setStatus({ kind: "error", message: msg });
    });

    map.on("style.load", () => {
      setDebug((prev) => `${prev} | style.load`);
    });

    map.on("load", async () => {
      setDebug((prev) => `${prev} | load`);
      try {
        const res = await fetch(geoJsonUrl);
        if (!res.ok) throw new Error(`Route fetch HTTP ${res.status}`);
        const data = (await res.json()) as GeoJSON.FeatureCollection;
        geoJsonRef.current = data;
        addRouteLayer(map, data);
        const fitted = fitToRoute(map, data);
        if (!fitted) {
          setStatus({
            kind: "error",
            message: "Route GeoJSON contains no coordinates.",
          });
          return;
        }
        setStatus({ kind: "ready" });
        setDebug((prev) => `${prev} | route-ready`);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load route";
        // eslint-disable-next-line no-console
        console.error("[RaceMap] route load failed:", err);
        setDebug(`route-err:${msg.slice(0, 60)}`);
        setStatus({ kind: "error", message: msg });
      }
    });

    // Re-add the route layer after a style swap (setStyle wipes
    // user-added sources/layers).
    map.on("style.load", () => {
      const data = geoJsonRef.current;
      if (data) addRouteLayer(map, data);
    });

    // Resize after a tick — guards against the container having
    // 0 dimensions on the very first paint (e.g. PageFrame
    // hadn't laid out yet).
    requestAnimationFrame(() => {
      map.resize();
      const r = containerRef.current?.getBoundingClientRect();
      if (r) {
        setDebug(
          (prev) => `${prev} | resize ${Math.round(r.width)}×${Math.round(r.height)}`,
        );
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonUrl]);

  // Swap style when dark mode flips after init. Doesn't recreate
  // the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleForMode(isDark));
  }, [isDark]);

  return (
    <>
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ background: "var(--ds-gray-200)" }}
      />
      {status.kind === "loading" && (
        <StatusOverlay text="Loading route…" subtle />
      )}
      {status.kind === "error" && <StatusOverlay text={status.message} />}
      <div
        className="pointer-events-none absolute left-2 top-2 max-w-[60ch] rounded bg-black/70 px-2 py-1 font-mono text-[11px] text-white"
        style={{ zIndex: 10 }}
      >
        {debug}
      </div>
    </>
  );
}

function StatusOverlay({
  text,
  subtle = false,
}: {
  text: string;
  subtle?: boolean;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-copy-14",
        subtle
          ? "bg-[color:var(--ds-background-100)]/40 text-[color:var(--ds-gray-900)]"
          : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-900)]",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function styleForMode(isDark: boolean): string {
  return isDark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/light-v11";
}

function addRouteLayer(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
): void {
  if (map.getSource("race-route")) return;
  map.addSource("race-route", { type: "geojson", data });
  map.addLayer({
    id: "race-route-line",
    type: "line",
    source: "race-route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": ROUTE_LINE_COLOR,
      "line-width": 4,
    },
  });
}

function fitToRoute(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
): boolean {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let hasPoint = false;

  const visit = (coords: GeoJSON.Position) => {
    const [lng, lat] = coords;
    if (typeof lng !== "number" || typeof lat !== "number") return;
    hasPoint = true;
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  };

  for (const feature of data.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === "LineString") {
      geom.coordinates.forEach(visit);
    } else if (geom.type === "MultiLineString") {
      geom.coordinates.forEach((line) => line.forEach(visit));
    } else if (geom.type === "Point") {
      visit(geom.coordinates);
    }
  }

  if (!hasPoint) return false;
  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 64, duration: 0 },
  );
  return true;
}
