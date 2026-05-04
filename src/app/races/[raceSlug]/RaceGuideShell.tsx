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
        <NoRouteFallback />
      )}
    </div>
  );
}

// ============================================================================
// Mapbox island — fills its parent. Reads the FeatureCollection from
// `geoJsonUrl`, draws every LineString in a single source/layer,
// fits bounds to the route, swaps style on dark-mode flips.
// ============================================================================

function RaceMap({ geoJsonUrl }: { geoJsonUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geoJsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const { isDark, isInitialized } = useContext(DarkModeContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isInitialized) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setError("Map unavailable (token missing)");
      return;
    }
    mapboxgl.accessToken = token;

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

    map.on("load", async () => {
      try {
        const res = await fetch(geoJsonUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GeoJSON.FeatureCollection;
        geoJsonRef.current = data;
        addRouteLayer(map, data);
        fitToRoute(map, data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load route";
        setError(msg);
      }
    });

    // Re-add the route layer after a style swap (setStyle wipes
    // user-added sources/layers).
    map.on("style.load", () => {
      const data = geoJsonRef.current;
      if (data) addRouteLayer(map, data);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geoJsonUrl, isInitialized]);

  // Swap style when dark mode flips after init.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isInitialized) return;
    map.setStyle(styleForMode(isDark));
  }, [isDark, isInitialized]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color:var(--ds-gray-100)] p-6 text-center text-copy-14 text-[color:var(--ds-gray-900)]">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0" />;
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
): void {
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

  if (!hasPoint) return;
  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 64, duration: 0 },
  );
}

function NoRouteFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--ds-gray-100)] p-6 text-center text-copy-14 text-[color:var(--ds-gray-900)]">
      Route map coming soon.
    </div>
  );
}
