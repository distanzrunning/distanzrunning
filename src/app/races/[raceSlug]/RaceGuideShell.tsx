"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// Map-led race guide canvas modelled on trippin.world's guide
// pages. The Mapbox map is sticky at the top of the viewport
// (just below the 50 px SiteHeader); the editorial panel sits
// on top of the map on the left and grows tall enough to make
// the page itself scroll. The panel scrolls with the page; the
// map stays put.

import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
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
  tags?: string[];
}

interface RaceGuideShellProps {
  race: RaceGuideMeta;
  routeGeoJsonUrl: string | null;
  heroImageUrl: string | null;
}

const ROUTE_LINE_COLOR = "#FF0058";

// Sticky map sits just below the 50 px SiteHeader, filling the
// rest of the viewport while the page scrolls past it.
const MAP_STICKY_TOP = 50;
const MAP_VIEWPORT_HEIGHT = "calc(100vh - 50px)";

const PANEL_WIDTH = 520;
const PANEL_INSET = 24;
// Extra breathing room around the route bbox so the map reads
// slightly zoomed out — the panel ate enough of the canvas
// width that the route would otherwise feel cramped.
const ROUTE_BREATHING = 96;

export default function RaceGuideShell({
  race,
  routeGeoJsonUrl,
  heroImageUrl,
}: RaceGuideShellProps) {
  return (
    // Single-cell grid: the sticky map and the editorial panel
    // both occupy row 1 / col 1. The cell auto-sizes to the
    // larger of the two children — so when the panel is taller
    // than the viewport, the grid (and therefore <main>) grows
    // tall enough to drive page scroll, while the map's
    // `position: sticky; top: 50px` keeps it pinned just under
    // the SiteHeader throughout that scroll.
    <div
      className="relative grid w-full"
      style={{ gridTemplateColumns: "1fr", gridTemplateRows: "auto" }}
      aria-label={`${race.title} route guide`}
    >
      <div
        className="overflow-hidden"
        style={{
          gridColumn: 1,
          gridRow: 1,
          position: "sticky",
          top: MAP_STICKY_TOP,
          height: MAP_VIEWPORT_HEIGHT,
        }}
      >
        {routeGeoJsonUrl ? (
          <RaceMap geoJsonUrl={routeGeoJsonUrl} />
        ) : (
          <StatusOverlay text="Route map coming soon." />
        )}
      </div>

      {/* Panel layer over the same grid cell. position:relative
          + zIndex lifts the wrapper above the sticky map: without
          this, the static wrapper would paint in a lower layer
          than the map (which is positioned via `sticky`), and
          Mapbox's absolutely-positioned canvas would cover the
          panel. The container is padded for the panel inset and
          is pointer-events:none so map interactions pass through
          the empty area; the aside re-enables pointer events so
          its own content stays interactive. */}
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          padding: PANEL_INSET,
          pointerEvents: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <GuidePanel race={race} heroImageUrl={heroImageUrl} />
      </div>
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

  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setStatus({
        kind: "error",
        message: "Map unavailable — NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN missing.",
      });
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

    map.on("error", (e) => {
      const msg =
        (e?.error as Error | undefined)?.message ?? "Mapbox error";
      // eslint-disable-next-line no-console
      console.error("[RaceMap] mapbox error:", msg, e);
      setStatus({ kind: "error", message: msg });
    });

    map.on("load", async () => {
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
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load route";
        // eslint-disable-next-line no-console
        console.error("[RaceMap] route load failed:", err);
        setStatus({ kind: "error", message: msg });
      }
    });

    // Re-add the route layer after a style swap (setStyle wipes
    // user-added sources/layers).
    map.on("style.load", () => {
      const data = geoJsonRef.current;
      if (data) addRouteLayer(map, data);
    });

    // Resize after the first paint as a guard against the
    // container measuring 0 dimensions before layout settles.
    requestAnimationFrame(() => map.resize());

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonUrl]);

  // Swap style when dark mode flips. Doesn't recreate the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleForMode(isDark));
  }, [isDark]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {status.kind === "loading" && (
        <StatusOverlay text="Loading route…" subtle />
      )}
      {status.kind === "error" && <StatusOverlay text={status.message} />}
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
  // Left padding accounts for the floating panel's inset + width
  // plus extra breathing room. Other sides also get the breathing
  // value so the route reads centred and slightly zoomed out.
  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    {
      padding: {
        top: ROUTE_BREATHING,
        bottom: ROUTE_BREATHING,
        left: PANEL_INSET + PANEL_WIDTH + ROUTE_BREATHING,
        right: ROUTE_BREATHING,
      },
      duration: 0,
    },
  );
  return true;
}

// ============================================================================
// Guide panel — vertical stack of editorial cards over the map.
// The wrapper has no visual treatment of its own; each card
// inside carries the floating-surface look (bg, rounded edge,
// shadow-menu elevation). Cards stack with a 24 px gap and the
// page itself scrolls; the panel never scrolls internally.
// ============================================================================

interface GuidePanelProps {
  race: RaceGuideMeta;
  heroImageUrl: string | null;
}

function GuidePanel({ race, heroImageUrl }: GuidePanelProps) {
  return (
    <div
      className="flex flex-col gap-6"
      style={{
        width: PANEL_WIDTH,
        pointerEvents: "auto",
      }}
    >
      <HeroCard race={race} imageUrl={heroImageUrl} />
      {/* Temporary spacer so the page keeps scrolling while we
          add more cards in subsequent iterations. Remove once
          the stack is full enough to overflow on its own. */}
      <div style={{ minHeight: 1500 }} />
    </div>
  );
}

// Reusable card surface — one of these per content section so
// each editorial block carries its own elevated treatment over
// the map.
const CARD_CLASS =
  "overflow-hidden rounded-md bg-[color:var(--ds-background-200)] dark:bg-[color:var(--ds-background-100)]";
const CARD_SHADOW = "var(--ds-shadow-menu)";

function HeroCard({
  race,
  imageUrl,
}: {
  race: RaceGuideMeta;
  imageUrl: string | null;
}) {
  const pills = useHeroPills(race);
  return (
    <div
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {imageUrl && (
        // Image sits inset within the card surface — the card's
        // bg shows around it as a frame. Inner radius is one
        // step down from the card's so the visible margin
        // between the two reads consistently. 3:4 portrait so
        // the hero leans editorial.
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded">
          <Image
            src={imageUrl}
            alt={race.title}
            fill
            sizes={`${PANEL_WIDTH}px`}
            priority
            className="object-cover"
          />
        </div>
      )}
      <h1
        className={`m-0 text-heading-32 text-[color:var(--ds-gray-1000)] ${
          imageUrl ? "mt-5" : ""
        }`}
      >
        {race.title}
      </h1>
      {pills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {pills.map((p) => (
            <MetaPill key={p.key}>{p.value}</MetaPill>
          ))}
        </div>
      )}
    </div>
  );
}

// Subtle gray pill — matches the style used on the /races
// index card. gray-300 reads against the card's bg-200/bg-100
// surface in both themes.
function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[color:var(--ds-gray-300)] px-3 text-copy-13 font-medium text-[color:var(--ds-gray-1000)]">
      {children}
    </span>
  );
}

// Builds the ordered list of meta pills shown under the title.
// Skips entries that have no underlying value so empty fields
// don't appear as ghost pills.
function useHeroPills(race: RaceGuideMeta): { key: string; value: string }[] {
  const { units, currency: displayCurrency } = useUnits();
  const pills: { key: string; value: string }[] = [];

  const date = formatPillDate(race.eventDate);
  if (date) pills.push({ key: "date", value: date });

  if (race.distance != null) {
    pills.push({ key: "distance", value: formatDistance(race.distance, units) });
  }

  if (race.country) pills.push({ key: "country", value: race.country });
  if (race.city) pills.push({ key: "city", value: race.city });

  if (race.price != null && race.currency) {
    const isLocal = displayCurrency === "local";
    const target = isLocal ? race.currency : displayCurrency;
    const value = isLocal
      ? race.price
      : convertCurrencySync(race.price, race.currency, displayCurrency);
    pills.push({ key: "price", value: formatPrice(value, target) });
  }

  if (race.elevationGain != null) {
    pills.push({
      key: "elevation",
      value: `${formatElevation(race.elevationGain, units)} gain`,
    });
  }

  if (race.surface) pills.push({ key: "surface", value: race.surface });

  for (const tag of race.tags ?? []) {
    pills.push({ key: `tag-${tag}`, value: tag });
  }

  return pills;
}

function formatPillDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : format(d, "d MMM, yyyy");
}
