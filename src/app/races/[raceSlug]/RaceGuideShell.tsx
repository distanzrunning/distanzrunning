"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// Map-led canvas for a single race guide. The Mapbox map fills
// the available PageFrame surface; a floating glass panel on the
// right side carries the race meta + write-up. On mobile the
// layout collapses to a stacked view: map first, panel below.

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { Badge } from "@/components/ui/Badge";
import {
  convertCurrencySync,
  formatDistance,
  formatElevation,
  formatPrice,
} from "@/lib/raceUtils";
import { useUnits } from "@/contexts/UnitsContext";

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

const ROUTE_LINE_COLOR = "#FF0058"; // electric-pink

export default function RaceGuideShell({
  race,
  routeGeoJsonUrl,
}: RaceGuideShellProps) {
  return (
    // The shell takes the full inner height of PageFrame on md+
    // and stacks (map first, panel below) on mobile. overflow-hidden
    // lets the map clip to PageFrame's 6 px corner radius.
    <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
      <div className="relative h-[50vh] w-full md:h-auto md:flex-1">
        {routeGeoJsonUrl ? (
          <RaceMap geoJsonUrl={routeGeoJsonUrl} />
        ) : (
          <NoRouteFallback />
        )}
      </div>

      {/* Panel:
          - mobile: normal flow under the map, full width
          - md+: absolute, floating right with material-menu treatment */}
      <aside
        className={[
          "flex flex-col bg-[color:var(--ds-background-100)]",
          // Mobile flow
          "border-t border-[color:var(--ds-gray-400)] md:border-t-0",
          // Desktop floating card
          "md:absolute md:right-4 md:top-4 md:bottom-4 md:w-[420px]",
          "md:rounded-md md:border md:border-[color:var(--ds-gray-400)]",
          "md:overflow-y-auto md:[box-shadow:var(--ds-shadow-menu)]",
        ].join(" ")}
      >
        <RaceGuidePanel race={race} />
      </aside>
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

  // Initial map create — depends on `isInitialized` so we don't
  // spin up before DarkModeContext has settled (avoids a style
  // flip on first paint).
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
    { padding: { top: 64, bottom: 64, left: 64, right: 480 }, duration: 0 },
  );
}

function NoRouteFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--ds-gray-100)] p-6 text-center text-copy-14 text-[color:var(--ds-gray-900)]">
      Route map coming soon.
    </div>
  );
}

// ============================================================================
// Guide panel — race meta + key stats + records + write-up slot.
// Pulled into its own component so the shell stays focused on layout.
// ============================================================================

function RaceGuidePanel({ race }: { race: RaceGuideMeta }) {
  const { units, currency: displayCurrency } = useUnits();

  const location = [race.city, race.stateRegion, race.country]
    .filter((p): p is string => Boolean(p))
    .join(", ");
  const dateLabel = formatEventDate(race.eventDate);
  const distanceLabel =
    race.distance != null ? formatDistance(race.distance, units) : null;
  const elevationLabel =
    race.elevationGain != null
      ? formatElevation(race.elevationGain, units)
      : null;
  const profileLabel = race.profile
    ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1)
    : null;

  const isLocalCurrency = displayCurrency === "local";
  const targetCurrency = isLocalCurrency
    ? race.currency ?? "USD"
    : displayCurrency;
  const priceLabel =
    race.price != null && race.currency
      ? formatPrice(
          isLocalCurrency
            ? race.price
            : convertCurrencySync(race.price, race.currency, displayCurrency),
          targetCurrency,
        )
      : null;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-3">
        <Link
          href="/races"
          className="inline-flex w-fit items-center gap-1 text-copy-13 text-[color:var(--ds-gray-900)] underline-offset-4 hover:text-[color:var(--ds-gray-1000)] hover:underline"
        >
          ← All races
        </Link>
        {race.category && (
          <Badge variant="gray" size="md">
            {race.category}
          </Badge>
        )}
        <h1 className="m-0 text-balance text-heading-32 text-[color:var(--ds-gray-1000)]">
          {race.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-copy-14 text-[color:var(--ds-gray-900)]">
          {dateLabel && <span>{dateLabel}</span>}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {location}
            </span>
          )}
        </div>
      </header>

      <StatGrid
        items={[
          { label: "Distance", value: distanceLabel },
          { label: "Surface", value: race.surface ?? null, detail: race.surfaceBreakdown },
          { label: "Elevation", value: elevationLabel, detail: profileLabel },
          { label: "Price", value: priceLabel, detail: targetCurrency },
        ]}
      />

      {(race.mensCourseRecord || race.womensCourseRecord) && (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-heading-16 text-[color:var(--ds-gray-1000)]">
            Course records
          </h2>
          <ul className="m-0 flex flex-col gap-2 p-0 list-none">
            {race.mensCourseRecord && (
              <RecordRow
                label="Men"
                time={race.mensCourseRecord}
                athlete={race.mensCourseRecordAthlete}
                country={race.mensCourseRecordCountry}
              />
            )}
            {race.womensCourseRecord && (
              <RecordRow
                label="Women"
                time={race.womensCourseRecord}
                athlete={race.womensCourseRecordAthlete}
                country={race.womensCourseRecordCountry}
              />
            )}
          </ul>
        </section>
      )}

      {race.officialWebsite && (
        <a
          href={race.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[color:var(--ds-gray-1000)] px-4 text-copy-14 font-medium text-[color:var(--ds-background-100)] transition-colors hover:bg-[color:var(--ds-gray-900)]"
        >
          Official website
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </div>
  );
}

function StatGrid({
  items,
}: {
  items: { label: string; value: string | null; detail?: string | null }[];
}) {
  const visible = items.filter((i) => i.value);
  if (visible.length === 0) return null;
  return (
    <dl className="m-0 grid grid-cols-2 gap-4">
      {visible.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <dt className="text-label-12 font-medium uppercase tracking-wide text-[color:var(--ds-gray-700)]">
            {item.label}
          </dt>
          <dd className="m-0 text-copy-16 text-[color:var(--ds-gray-1000)]">
            {item.value}
          </dd>
          {item.detail && (
            <span className="text-copy-13 text-[color:var(--ds-gray-900)]">
              {item.detail}
            </span>
          )}
        </div>
      ))}
    </dl>
  );
}

function RecordRow({
  label,
  time,
  athlete,
  country,
}: {
  label: string;
  time: string;
  athlete?: string;
  country?: string;
}) {
  const subtitle = [athlete, country].filter(Boolean).join(" · ");
  return (
    <li className="flex items-baseline justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-copy-14 text-[color:var(--ds-gray-1000)]">
          {label}
        </span>
        {subtitle && (
          <span className="text-copy-13 text-[color:var(--ds-gray-900)]">
            {subtitle}
          </span>
        )}
      </div>
      <span className="font-mono text-copy-14 text-[color:var(--ds-gray-1000)]">
        {time}
      </span>
    </li>
  );
}

function formatEventDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : format(d, "EEEE, d MMMM yyyy");
}
