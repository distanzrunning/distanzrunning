"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// Map-led race guide canvas modelled on trippin.world's guide
// pages. The Mapbox map is sticky at the top of the viewport
// (just below the 50 px SiteHeader); the editorial panel sits
// on top of the map on the left and grows tall enough to make
// the page itself scroll. The panel scrolls with the page; the
// map stays put.

import { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import {
  ArrowDown,
  ChevronRight,
  ChevronsUp,
  Clock,
  Droplets,
  Footprints,
  Mountain,
  Ruler,
  Thermometer,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { AdSlot } from "@/components/ui/AdSlot";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Switch } from "@/components/ui/Switch";
import { formatDistance, formatElevation } from "@/lib/raceUtils";
import { useUnits, type UnitSystem } from "@/contexts/UnitsContext";
import type {
  ElevationPoint,
  RouteBounds,
  RouteEndpoint,
} from "@/lib/gpxUtils";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface RaceGuideMeta {
  _id: string;
  title: string;
  slug?: string;
  eventDate?: string;
  startTime?: string;
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
  altitude?: number;
  humidity?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  fieldSize?: number;
  expoVenueName?: string;
  expoAddress?: string;
  mensCourseRecord?: string;
  mensCourseRecordAthlete?: string;
  mensCourseRecordCountry?: string;
  womensCourseRecord?: string;
  womensCourseRecordAthlete?: string;
  womensCourseRecordCountry?: string;
  mensWheelchairCourseRecord?: string;
  mensWheelchairCourseRecordAthlete?: string;
  mensWheelchairCourseRecordCountry?: string;
  womensWheelchairCourseRecord?: string;
  womensWheelchairCourseRecordAthlete?: string;
  womensWheelchairCourseRecordCountry?: string;
  officialWebsite?: string;
  tags?: string[];
  introduction?: PortableTextBlock[];
  body?: PortableTextBlock[];
}

export interface ExpoLocation {
  venueName: string | null;
  address: string | null;
  lng: number;
  lat: number;
}

interface RaceGuideShellProps {
  race: RaceGuideMeta;
  routeGeoJsonUrl: string | null;
  heroImageUrl: string | null;
  elevationSeries: ElevationPoint[] | null;
  routeBounds: RouteBounds | null;
  routeEndpoints: { start: RouteEndpoint; finish: RouteEndpoint } | null;
  expo: ExpoLocation | null;
}

// Resolves the route line / elevation chart color from
// --ds-pink-800 at runtime via its -rgb companion so the value
// stays anchored to the DS token (rather than a parallel hex
// constant). We use the -rgb triplet rather than the named
// token directly because Mapbox's style-spec parser and SVG
// presentation attributes don't accept `var()` or oklch() — but
// they both accept an rgb(R, G, B) string assembled from the
// triplet. --ds-pink-800 is theme-stable (same RGB in light and
// dark modes per globals.css), so resolving once on the client
// is sufficient. The hex fallback only fires during SSR or if
// the token isn't loaded yet.
const ROUTE_LINE_COLOR_FALLBACK = "#DA2D73";

function getRouteLineColor(): string {
  if (typeof document === "undefined") return ROUTE_LINE_COLOR_FALLBACK;
  const triplet = getComputedStyle(document.documentElement)
    .getPropertyValue("--ds-pink-800-rgb")
    .trim();
  return triplet ? `rgb(${triplet})` : ROUTE_LINE_COLOR_FALLBACK;
}

// Sticky map sits just below the 50 px SiteHeader, filling the
// rest of the viewport while the page scrolls past it.
const MAP_STICKY_TOP = 50;
const MAP_VIEWPORT_HEIGHT = "calc(100vh - 50px)";

const PANEL_WIDTH = 520;
const PANEL_INSET = 32;
// Extra breathing room around the route bbox so the map reads
// slightly zoomed out — the panel ate enough of the canvas
// width that the route would otherwise feel cramped.
const ROUTE_BREATHING = 96;

export default function RaceGuideShell({
  race,
  routeGeoJsonUrl,
  heroImageUrl,
  elevationSeries,
  routeBounds,
  routeEndpoints,
  expo,
}: RaceGuideShellProps) {
  // Drive the panel's enter animation off the map's ready state.
  // Races without a route asset have nothing to wait for — the
  // panel reveals immediately. Races with a map keep the panel
  // at opacity 0 until RaceMap reports it has drawn the route,
  // then a transition fades + slides it in so the reveal feels
  // sequenced with the map.
  const [mapReady, setMapReady] = useState(false);
  const panelRevealed = !routeGeoJsonUrl || mapReady;
  // Bidirectional bridge between the elevation chart and the
  // map: the chart reports the hovered distance (km along the
  // route) and the map drops a blue marker at the matching
  // coordinate. null = no hover.
  const [hoverDistance, setHoverDistance] = useState<number | null>(null);
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
          // Explicitly below the panel's zIndex: 1 so the loading
          // cover (which lives inside this sticky container) can
          // never paint over the panel cards' borders.
          zIndex: 0,
          // Match PageFrame's 6 px radius on the top corners so
          // the map tiles + loading overlay (clipped by the
          // overflow-hidden above) don't paint past the frame's
          // curve. Bottom corners stay flat: the map deliberately
          // extends past PageFrame's bottom margin to fill the
          // viewport (see MAP_VIEWPORT_HEIGHT), so a second curve
          // there would sit below PageFrame's own bottom corner.
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
      >
        {routeGeoJsonUrl ? (
          <RaceMap
            geoJsonUrl={routeGeoJsonUrl}
            initialBounds={routeBounds}
            endpoints={routeEndpoints}
            expo={expo}
            elevationSeries={elevationSeries}
            hoverDistance={hoverDistance}
            onReady={() => setMapReady(true)}
          />
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
        className={`guide-panel-crt${panelRevealed ? " is-revealed" : ""}`}
        style={{
          gridColumn: 1,
          gridRow: 1,
          padding: PANEL_INSET,
          pointerEvents: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <GuidePanel
          race={race}
          heroImageUrl={heroImageUrl}
          elevationSeries={elevationSeries}
          onHoverDistance={setHoverDistance}
        />
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

function RaceMap({
  geoJsonUrl,
  initialBounds,
  endpoints,
  expo,
  elevationSeries,
  hoverDistance,
  onReady,
}: {
  geoJsonUrl: string;
  initialBounds: RouteBounds | null;
  endpoints: { start: RouteEndpoint; finish: RouteEndpoint } | null;
  expo: ExpoLocation | null;
  elevationSeries: ElevationPoint[] | null;
  hoverDistance: number | null;
  onReady?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geoJsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const expoMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const endpointMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);
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

    // Padding used both for the constructor's initial fit and
    // for the recenter button so a click always reproduces the
    // first frame the user saw — the map never reframes
    // differently on recenter than it did on first paint.
    const fitBoundsPadding = {
      top: ROUTE_BREATHING,
      bottom: ROUTE_BREATHING,
      left: PANEL_INSET + PANEL_WIDTH + ROUTE_BREATHING,
      right: ROUTE_BREATHING,
    };

    // Initialise framed on the route bbox (computed server-side
    // by fetchRouteAssets and passed in via initialBounds) so the
    // map never paints the [0, 0] / zoom 1 globe before fitting.
    // If we somehow don't have bounds (very rare edge — e.g.
    // Sanity returned no GeoJSON URL but we still landed here),
    // fall back to the same global default and the legacy
    // post-load fit takes over.
    const mapOptions: mapboxgl.MapOptions = {
      container: containerRef.current,
      style: styleForMode(isDark),
      attributionControl: false,
      ...(initialBounds
        ? {
            bounds: initialBounds,
            fitBoundsOptions: {
              padding: fitBoundsPadding,
              duration: 0,
            },
          }
        : { center: [0, 0] as [number, number], zoom: 1 }),
    };
    const map = new mapboxgl.Map(mapOptions);
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    // Recenter control sits in its own .mapboxgl-ctrl-group chip
    // below the zoom buttons. Only meaningful when we have a
    // route bbox to recenter to, so we skip it on the rare bound-
    // less path.
    if (initialBounds) {
      map.addControl(
        createRecenterControl(initialBounds, fitBoundsPadding),
        "bottom-right",
      );
    }

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
        addRouteLayer(map, data, getRouteLineColor());
        if (endpoints) {
          endpointMarkersRef.current = addEndpointMarkers(map, endpoints);
        }
        if (expo) {
          expoMarkerRef.current = addExpoMarker(map, expo);
        }
        // Hover marker is created hidden; the hoverDistance
        // effect below shows + repositions it as the user hovers
        // the elevation chart.
        hoverMarkerRef.current = createHoverMarker(map);
        // Only fit post-load when we didn't get server-side
        // bounds — the constructor already framed it otherwise.
        if (!initialBounds) {
          const fitted = fitToRoute(map, data, expo);
          if (!fitted) {
            setStatus({
              kind: "error",
              message: "Route GeoJSON contains no coordinates.",
            });
            return;
          }
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
      if (data) addRouteLayer(map, data, getRouteLineColor());
    });

    // Resize after the first paint as a guard against the
    // container measuring 0 dimensions before layout settles.
    requestAnimationFrame(() => map.resize());

    return () => {
      expoMarkerRef.current?.remove();
      expoMarkerRef.current = null;
      endpointMarkersRef.current.forEach((m) => m.remove());
      endpointMarkersRef.current = [];
      hoverMarkerRef.current?.remove();
      hoverMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonUrl, expo, initialBounds, endpoints]);

  // Swap style when dark mode flips. Doesn't recreate the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleForMode(isDark));
  }, [isDark]);

  // Notify the shell once the route is drawn so the panel can
  // animate in. Reactive to status.kind only — onReady is an
  // inline arrow in the parent and changes identity on every
  // render, but the only flip we care about is loading → ready,
  // and that only happens once per map mount.
  useEffect(() => {
    if (status.kind === "ready") onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.kind]);

  // Mirror the elevation chart's hover onto the route line. We
  // binary-search the elevation series for the sample closest
  // to the hovered distance and read its lng/lat directly off
  // that point (carried alongside distance + elevation since
  // the gpxUtils refactor).
  useEffect(() => {
    const marker = hoverMarkerRef.current;
    if (!marker) return;
    const el = marker.getElement();
    if (hoverDistance == null || !elevationSeries) {
      el.style.display = "none";
      return;
    }
    const point = findPointAtDistance(elevationSeries, hoverDistance);
    if (!point) {
      el.style.display = "none";
      return;
    }
    marker.setLngLat([point.lng, point.lat]);
    el.style.display = "block";
  }, [hoverDistance, elevationSeries]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {status.kind === "loading" && <MapLoadingOverlay />}
      {status.kind === "error" && <StatusOverlay text={status.message} />}
    </>
  );
}

// Loading state: opaque cover with the shared LoadingDots
// primitive — text + animated dots, matching the rest of the
// app's loading affordances. Fully opaque so any blank tile or
// pre-route-layer frame stays hidden behind it. Surface uses
// --ds-gray-100 (the Geist "component background" surface)
// rather than --ds-background-100 so the panel cards above
// still read with visible edges in both themes — the cards use
// background-200 / background-100, which would blend.
//
// Dots sit dead-centre because the panel doesn't reveal until
// the map is ready, so there's no left-side panel to compensate
// for during the load phase.
function MapLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:var(--ds-gray-100)]">
      <LoadingDots>Loading</LoadingDots>
    </div>
  );
}

// Error state: plain text on the same opaque surface. Distinct
// from the loading state so the difference reads instantly.
function StatusOverlay({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:var(--ds-gray-100)] p-6 text-center text-copy-14 text-[color:var(--ds-gray-900)]">
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
  color: string,
): void {
  if (map.getSource("race-route")) return;
  map.addSource("race-route", { type: "geojson", data });
  map.addLayer({
    id: "race-route-line",
    type: "line",
    source: "race-route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": color,
      "line-width": 4,
    },
  });
}

function fitToRoute(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
  expo: ExpoLocation | null,
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

  // Pull the expo into the bounding box so the marker is always
  // framed alongside the route — otherwise an expo across town
  // could end up offscreen at the default route-only zoom.
  if (expo) visit([expo.lng, expo.lat]);

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

// Off-route POI primitive: brand-pink dot + always-visible
// label chip in the same DOM (used by the expo marker). Dot
// picks up --ds-pink-800 (via getRouteLineColor) so the marker
// + route line read as a single brand gesture. anchor 'left' +
// offset of half the dot width puts the dot's *centre* on the
// geographic point with the chip extending rightward.
function addPoiMarker(
  map: mapboxgl.Map,
  lngLat: RouteEndpoint,
  label: string,
  options: { dotSize?: number } = {},
): mapboxgl.Marker {
  const dotSize = options.dotSize ?? 14;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "display: flex",
    "align-items: center",
    "gap: 8px",
  ].join("; ");

  const dot = document.createElement("div");
  dot.style.cssText = [
    `width: ${dotSize}px`,
    `height: ${dotSize}px`,
    "border-radius: 50%",
    "flex-shrink: 0",
    `background: ${getRouteLineColor()}`,
    "border: 2px solid var(--ds-background-100)",
    "box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35)",
  ].join("; ");

  const chip = document.createElement("div");
  chip.style.cssText = [
    "padding: 3px 8px",
    "border-radius: 4px",
    "background: var(--ds-background-100)",
    "color: var(--ds-gray-1000)",
    "font-size: 12px",
    "font-weight: 600",
    "line-height: 1",
    "white-space: nowrap",
    "box-shadow: var(--ds-shadow-small)",
  ].join("; ");
  chip.textContent = label;

  wrapper.appendChild(dot);
  wrapper.appendChild(chip);

  return new mapboxgl.Marker(wrapper, {
    anchor: "left",
    offset: [-dotSize / 2, 0],
  })
    .setLngLat(lngLat)
    .addTo(map);
}

const EXPO_DOT_SIZE = 18;

function addExpoMarker(
  map: mapboxgl.Map,
  expo: ExpoLocation,
): mapboxgl.Marker {
  return addPoiMarker(map, [expo.lng, expo.lat], "Expo", {
    dotSize: EXPO_DOT_SIZE,
  });
}

// Endpoint markers — the start and finish dots ride on the
// route line itself. Each is a 24 px circle with a 2.5 px white
// border + drop shadow; the colour / pattern is the marker
// (no side chip). Universally legible:
//   - Start  Solid --ds-green-700 (reads as "go").
//   - Finish Tiled 6 px black-and-white checker (classic
//            finish-flag pattern).
// aria-label on the DOM keeps the markers identifiable to
// screen readers.
type EndpointVariant = "start" | "finish";

const ENDPOINT_DOT_SIZE = 20;
const ENDPOINT_BORDER_WIDTH = 2;

function addEndpointMarker(
  map: mapboxgl.Map,
  lngLat: RouteEndpoint,
  variant: EndpointVariant,
): mapboxgl.Marker {
  const dot = document.createElement("div");
  dot.setAttribute("role", "img");
  dot.setAttribute(
    "aria-label",
    variant === "start" ? "Race start" : "Race finish",
  );

  const baseStyles = [
    `width: ${ENDPOINT_DOT_SIZE}px`,
    `height: ${ENDPOINT_DOT_SIZE}px`,
    "border-radius: 50%",
    `border: ${ENDPOINT_BORDER_WIDTH}px solid #fff`,
    "box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4)",
    "box-sizing: border-box",
  ];

  if (variant === "start") {
    dot.style.cssText = [
      ...baseStyles,
      "background: var(--ds-green-700)",
    ].join("; ");
  } else {
    // 6 px checker tiles via two 45° gradient layers. Tile size
    // matches the marker scale so the pattern reads cleanly at
    // a 24 px dot.
    dot.style.cssText = [
      ...baseStyles,
      "background-color: #fff",
      "background-image: " +
        "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), " +
        "linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)",
      "background-size: 6px 6px",
      "background-position: 0 0, 3px 3px",
    ].join("; ");
  }

  return new mapboxgl.Marker(dot).setLngLat(lngLat).addTo(map);
}

// For loop courses where start ≈ finish (within ~50 m), we drop
// the finish marker — pre-race the user cares about "where do I
// start", and a single green dot at the loop point is cleaner
// than two stacked markers covering each other.
function addEndpointMarkers(
  map: mapboxgl.Map,
  endpoints: { start: RouteEndpoint; finish: RouteEndpoint },
): mapboxgl.Marker[] {
  if (endpointsCoincide(endpoints.start, endpoints.finish)) {
    return [addEndpointMarker(map, endpoints.start, "start")];
  }
  return [
    addEndpointMarker(map, endpoints.start, "start"),
    addEndpointMarker(map, endpoints.finish, "finish"),
  ];
}

// ~50 m at most latitudes (0.0005 degrees ≈ 55 m). Loose
// threshold so any plausible loop chute reads as a single
// start/finish point.
const ENDPOINT_COINCIDENCE_DEG = 0.0005;

function endpointsCoincide(a: RouteEndpoint, b: RouteEndpoint): boolean {
  return (
    Math.abs(a[0] - b[0]) < ENDPOINT_COINCIDENCE_DEG &&
    Math.abs(a[1] - b[1]) < ENDPOINT_COINCIDENCE_DEG
  );
}

// Hover marker — a small blue dot that mirrors the elevation
// chart's hover position back onto the route line. Created
// hidden; the hoverDistance effect in RaceMap shows it and
// updates its lng/lat when the user hovers the chart. The
// marker DOM uses var(--ds-blue-700) directly (CSS variables
// resolve in inline styles, unlike Mapbox style-spec paint
// values) so it picks up the DS blue token in either theme.
const HOVER_DOT_SIZE = 14;

function createHoverMarker(map: mapboxgl.Map): mapboxgl.Marker {
  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.style.cssText = [
    `width: ${HOVER_DOT_SIZE}px`,
    `height: ${HOVER_DOT_SIZE}px`,
    "border-radius: 50%",
    "background: var(--ds-blue-700)",
    "border: 2px solid #fff",
    "box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4)",
    "box-sizing: border-box",
    "pointer-events: none",
    "display: none",
  ].join("; ");
  return new mapboxgl.Marker(dot).setLngLat([0, 0]).addTo(map);
}

// Binary-search the elevation series (sorted ascending by
// distance) for the sample closest to `target`. Picks whichever
// of the two neighbours straddling the target is nearer.
function findPointAtDistance(
  series: ElevationPoint[],
  target: number,
): ElevationPoint | null {
  if (series.length === 0) return null;
  let lo = 0;
  let hi = series.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (series[mid].distance < target) lo = mid + 1;
    else hi = mid;
  }
  if (
    lo > 0 &&
    Math.abs(series[lo - 1].distance - target) <
      Math.abs(series[lo].distance - target)
  ) {
    return series[lo - 1];
  }
  return series[lo];
}

// Factory for a Mapbox IControl that fits the map back to the
// route bbox + the same padding the constructor used. Lives in
// its own .mapboxgl-ctrl-group chip so it stacks under the
// default NavigationControl, picking up Mapbox's standard
// button styling (size, hover, focus). Inline crosshair SVG
// uses currentColor so it matches Mapbox's icon contrast in
// both themes.
function createRecenterControl(
  bounds: RouteBounds,
  padding: mapboxgl.PaddingOptions,
): mapboxgl.IControl {
  let mapInstance: mapboxgl.Map | null = null;
  let buttonEl: HTMLButtonElement | null = null;

  const handleClick = () => {
    mapInstance?.fitBounds(bounds, {
      padding,
      duration: 600,
    });
  };

  return {
    onAdd(map: mapboxgl.Map): HTMLElement {
      mapInstance = map;
      const container = document.createElement("div");
      container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

      const button = document.createElement("button");
      button.type = "button";
      button.title = "Recenter route";
      button.setAttribute("aria-label", "Recenter route");
      button.className = "mapboxgl-ctrl-recenter";
      button.innerHTML = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
        '<circle cx="10" cy="10" r="6"/>',
        '<circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none"/>',
        '<line x1="10" y1="2" x2="10" y2="4"/>',
        '<line x1="10" y1="16" x2="10" y2="18"/>',
        '<line x1="2" y1="10" x2="4" y2="10"/>',
        '<line x1="16" y1="10" x2="18" y2="10"/>',
        "</svg>",
      ].join("");
      button.addEventListener("click", handleClick);
      buttonEl = button;

      container.appendChild(button);
      return container;
    },
    onRemove(): void {
      buttonEl?.removeEventListener("click", handleClick);
      mapInstance = null;
      buttonEl = null;
    },
    getDefaultPosition(): mapboxgl.ControlPosition {
      return "bottom-right";
    },
  };
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
  elevationSeries: ElevationPoint[] | null;
  onHoverDistance: (distance: number | null) => void;
}

function GuidePanel({
  race,
  heroImageUrl,
  elevationSeries,
  onHoverDistance,
}: GuidePanelProps) {
  // Single source of truth for whether the elevation block
  // appears: TOC entry and the card itself both gate on the
  // prefetched series being non-empty, so the TOC link can
  // never dead-end.
  const hasElevation = !!elevationSeries && elevationSeries.length > 0;
  // Split the body into H2-keyed sections once. Both the TOC and
  // the body cards consume this list so anchor IDs are guaranteed
  // to match.
  const bodySections = useMemo(
    () => splitBodyIntoSections(race.body),
    [race.body],
  );
  return (
    <div
      className="flex flex-col gap-6"
      style={{
        width: PANEL_WIDTH,
        pointerEvents: "auto",
      }}
    >
      <HeroCard race={race} imageUrl={heroImageUrl} />
      <TocCard
        race={race}
        hasElevation={hasElevation}
        bodySections={bodySections}
      />
      <AdsCard />
      <StatsCard race={race} />
      {hasElevation && (
        <ElevationCard
          series={elevationSeries!}
          onHoverDistance={onHoverDistance}
        />
      )}
      <CourseRecordsCard race={race} />
      <BodySections sections={bodySections} />
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
        className={`m-0 text-balance text-heading-40 text-[color:var(--ds-gray-1000)] ${
          imageUrl ? "mt-5" : ""
        }`}
      >
        {race.title}
      </h1>
      {(() => {
        const location = formatLocation(race);
        return location ? (
          <p className="mt-1 text-copy-18 text-[color:var(--ds-gray-900)]">
            {location}
          </p>
        ) : null;
      })()}
      {pills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {pills.map((p) => (
            <MetaPill
              key={p.key}
              variant={p.variant ?? "subtle"}
              href={p.href}
            >
              {p.value}
            </MetaPill>
          ))}
        </div>
      )}
      {race.introduction && race.introduction.length > 0 && (
        <div className="mt-5">
          <PortableText
            value={race.introduction}
            components={INTRODUCTION_PT_COMPONENTS}
          />
        </div>
      )}
    </div>
  );
}

// Portable Text components for the lede paragraph(s) inside
// the hero card. Single concern: each block becomes a paragraph
// in the same copy-16 / gray-900 voice as the location line so
// the introduction reads as a continuation of the meta header,
// not as the body content (which gets its own card later).
const INTRODUCTION_PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3 text-copy-16 text-[color:var(--ds-gray-900)] last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-[color:var(--ds-gray-1000)]">
        {children}
      </strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        className="text-[color:var(--ds-gray-1000)] underline underline-offset-2 hover:text-[color:var(--ds-gray-700)]"
      >
        {children}
      </a>
    ),
  },
};

// Mirrors the formatter in src/app/races/RaceGrid.tsx so the
// location string reads identically on the index card and the
// race detail page: "City, State, Country" with state optional.
function formatLocation(race: RaceGuideMeta): string | null {
  const parts = [race.city, race.stateRegion, race.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : null;
}

// Pill that opens a filtered /races page. Two variants:
//   - "primary" — dark fill, used for the date pill so it
//     reads as the headline meta on the card.
//   - "subtle"  — gray-300 fill, used for the rest (surface,
//     tag) so they sit quietly behind the date.
// Pills without an `href` render as a non-interactive <span>.
function MetaPill({
  children,
  href,
  variant = "subtle",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "subtle";
}) {
  const base =
    "inline-flex h-7 items-center rounded-full px-3 text-copy-13 font-medium transition-colors";
  const skin =
    variant === "primary"
      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)] hover:bg-[color:var(--ds-gray-900)]"
      : "bg-[color:var(--ds-gray-300)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-400)]";
  const className = `${base} ${skin}`;
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <span className={className}>{children}</span>;
}

interface HeroPill {
  key: string;
  value: string;
  href?: string;
  variant?: "primary" | "subtle";
}

// Builds the ordered list of meta pills shown under the title.
// Skips entries that have no underlying value so empty fields
// don't appear as ghost pills. Each pill links to the /races
// index pre-filtered by the matching field, except for any pill
// whose source isn't a /races filter dimension.
function useHeroPills(race: RaceGuideMeta): HeroPill[] {
  const pills: HeroPill[] = [];

  const date = formatPillDate(race.eventDate);
  if (date && race.eventDate) {
    const iso = isoDate(race.eventDate);
    pills.push({
      key: "date",
      value: date,
      // Filter the index to races on the same calendar day.
      href: iso ? `/races?dateFrom=${iso}&dateTo=${iso}` : undefined,
      variant: "primary",
    });
  }

  if (race.surface) {
    pills.push({
      key: "surface",
      value: race.surface,
      href: `/races?surface=${encodeURIComponent(race.surface)}`,
    });
  }

  for (const tag of race.tags ?? []) {
    pills.push({
      key: `tag-${tag}`,
      value: tag,
      href: `/races?tag=${encodeURIComponent(tag)}`,
    });
  }

  return pills;
}

// "2026-07-12" from any ISO datetime — drops the time portion
// so the /races index filter matches the entire calendar day
// in the visitor's local timezone-ish way (the index treats
// dateFrom / dateTo as date-only strings).
function isoDate(iso: string): string | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// ============================================================================
// In-this-guide TOC card. Derives one entry per H2 block in the
// raceGuide body. Each link points to the matching `#section-id`
// anchor, which the body card (still to come) will stamp on its
// rendered <h2> elements. Auto-hides when the body has no H2s
// (e.g. the empty NYC race).
// ============================================================================

interface TocEntry {
  id: string;
  title: string;
}

// Anchor IDs stamped on the Stats, Elevation, and Course-records
// cards so the TOC entries above can scroll-link to them.
const STATS_SECTION_ID = "key-stats";
const ELEVATION_SECTION_ID = "elevation";
const RECORDS_SECTION_ID = "course-records";
// Vertical offset baked into each anchor target so the scroll
// destination doesn't tuck under the 50 px SiteHeader. Bit of
// breathing room (16 px) above the section's top edge.
const SCROLL_MARGIN_TOP = 66;

// Smooth-scroll handler for TOC links. Default <a href="#id">
// behaviour jumps instantly; this overrides it with
// scrollIntoView({ behavior: 'smooth' }) and updates the URL
// hash via history.replaceState so the address bar still
// reflects the current section without triggering another
// (instant) scroll from the browser's hash navigation.
function smoothScrollToAnchor(
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
): void {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof history !== "undefined") {
    history.replaceState(null, "", `#${id}`);
  }
}

function TocCard({
  race,
  hasElevation,
  bodySections,
}: {
  race: RaceGuideMeta;
  hasElevation: boolean;
  bodySections: BodySection[];
}) {
  // Top-level panel sections (Stats, Elevation, Course records)
  // sit ahead of the body's H2-derived entries. Each is included
  // only when its card will actually render so the link doesn't
  // dead-end on a missing anchor.
  const sectionEntries: TocEntry[] = [];
  if (hasStatsData(race)) {
    sectionEntries.push({ id: STATS_SECTION_ID, title: "Key stats" });
  }
  if (hasElevation) {
    sectionEntries.push({ id: ELEVATION_SECTION_ID, title: "Elevation profile" });
  }
  if (hasCourseRecords(race)) {
    sectionEntries.push({ id: RECORDS_SECTION_ID, title: "Course records" });
  }
  const bodyEntries = bodySections.map((s) => ({ id: s.id, title: s.title }));
  const entries = [...sectionEntries, ...bodyEntries];
  if (entries.length === 0) return null;
  return (
    <aside
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        In this guide
      </h2>
      <ol className="m-0 list-none divide-y divide-[color:var(--ds-gray-400)] p-0">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => smoothScrollToAnchor(e, entry.id)}
              className="group flex items-center justify-between gap-3 py-2 text-copy-16 text-[color:var(--ds-gray-1000)] no-underline"
            >
              <span className="min-w-0">
                <span className="text-[color:var(--ds-gray-900)]">
                  {i + 1}
                </span>
                <span className="ml-3 underline-offset-4 group-hover:underline">
                  {entry.title}
                </span>
              </span>
              <ArrowDown
                className="size-4 shrink-0 text-[color:var(--ds-gray-900)] group-hover:text-[color:var(--ds-gray-1000)]"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// Walks Portable Text body blocks, picks out H2s, joins their
// span text, and slugifies for the anchor id. Falls back to
// `section-N` if a heading has no plain text (rare).
// Mirrors the populate-checks in StatsCard / CourseRecordsCard
// so the TOC only links to sections that will actually render.
function hasStatsData(race: RaceGuideMeta): boolean {
  return (
    race.distance != null ||
    Boolean(race.surface) ||
    race.elevationGain != null ||
    race.altitude != null ||
    race.averageTemperature != null ||
    race.humidity != null ||
    race.fieldSize != null ||
    Boolean(race.startTime)
  );
}

function hasCourseRecords(race: RaceGuideMeta): boolean {
  return Boolean(
    race.mensCourseRecord ||
      race.womensCourseRecord ||
      race.mensWheelchairCourseRecord ||
      race.womensWheelchairCourseRecord,
  );
}

interface BodySection {
  id: string;
  title: string;
  blocks: PortableTextBlock[];
}

// Walks the Portable Text body once, breaking it into sections at
// every H2. The H2 itself becomes the section's `title` (and is
// rendered as the card heading) — it isn't included in the
// `blocks` array so the body renderer doesn't draw a duplicate
// inline heading. Content that appears before the first H2 is
// dropped: the dedicated `introduction` field already handles
// the lede and any pre-H2 leakage in a migrated body would read
// as misplaced. Same source of truth for the TOC's body entries
// and the body cards, so anchor IDs always match.
function splitBodyIntoSections(
  body: PortableTextBlock[] | undefined,
): BodySection[] {
  if (!body) return [];
  const sections: BodySection[] = [];
  let current: BodySection | null = null;
  body.forEach((block) => {
    const isH2 =
      block._type === "block" &&
      (block as { style?: string }).style === "h2";
    if (isH2) {
      const children = (
        block as { children?: { _type?: string; text?: string }[] }
      ).children;
      const text = (children ?? [])
        .filter((c) => c._type === "span")
        .map((c) => c.text ?? "")
        .join("")
        .trim();
      if (!text) return;
      current = {
        id: slugify(text) || `section-${sections.length + 1}`,
        title: text,
        blocks: [],
      };
      sections.push(current);
    } else if (current) {
      current.blocks.push(block);
    }
  });
  return sections;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================================================
// Ad card. MPU (300×250) AdSlot inside the panel's standard card
// surface. `preview` is on for now since this position doesn't
// have a real AdSense slot ID — the fallback below renders in
// its place. Wire a real `slot` ID and drop `preview` once the
// AdSense unit is created.
// ============================================================================

function AdsCard() {
  return (
    <div
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      <AdSlot
        slot="race-detail-panel"
        size="mpu"
        preview
        label={false}
        fallback={<AdsCardFallback />}
        className="mx-auto"
      />
    </div>
  );
}

// ============================================================================
// Stats card. 2-column grid of dark stat tiles (matches the
// "primary" pill treatment: --ds-gray-1000 bg, --ds-background-100
// text — both flip with theme so the tile reads as an inverted
// surface in both modes). Each tile auto-omits when its
// underlying field is empty so sparse races render fewer tiles
// without leaving holes.
// ============================================================================

function StatsCard({ race }: { race: RaceGuideMeta }) {
  const tiles = useStatTiles(race);
  // The Switch is bound to the same UnitsContext as
  // /races/RaceUnitControls, so flipping it here also updates
  // the index page (and persists via localStorage).
  const { units, setUnits } = useUnits();
  if (tiles.length === 0) return null;
  return (
    <section
      id={STATS_SECTION_ID}
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW, scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="m-0 text-heading-20 text-[color:var(--ds-gray-1000)]">
          Key stats
        </h2>
        <Switch
          size="small"
          name="race-detail-units"
          options={UNIT_TOGGLE_OPTIONS}
          value={units}
          onChange={(next) => setUnits(next as UnitSystem)}
        />
      </header>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ key, ...tile }) => (
          <StatTile key={key} {...tile} />
        ))}
      </div>
    </section>
  );
}

const UNIT_TOGGLE_OPTIONS = [
  { value: "imperial", label: "Imperial" },
  { value: "metric", label: "Metric" },
];

interface Tile {
  key: string;
  Icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  /** Optional bottom-right indicator. Each tile builds its own
   *  shape (bars, thermometer, etc) so visuals stay distinct
   *  per-stat rather than reusing the same primitive. */
  visual?: React.ReactNode;
}

function StatTile({ Icon, label, value, subtitle, visual }: Tile) {
  return (
    // Tiles are content-sized; the grid's row-stretch keeps
    // tiles in the same row uniform-height. Visual sits
    // absolute bottom-right so it doesn't add to the tile's
    // intrinsic height and can overlap the value text on
    // tiles where the value is long.
    <div
      className="relative flex flex-col gap-3 rounded-md p-4"
      style={{
        background: "var(--ds-gray-1000)",
        color: "var(--ds-background-100)",
      }}
    >
      <div
        className="flex items-center gap-2 text-copy-13"
        style={{ opacity: 0.6 }}
      >
        <Icon className="size-4" aria-hidden />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-heading-24">{value}</div>
      {/* Always render the subtitle slot — even when empty —
          so every tile lands at the same height. Tiles without
          a real subtitle render a non-breaking space so the
          row still occupies the full text-copy-13 line height. */}
      <div
        className="mt-auto text-copy-13 font-medium"
        style={{ opacity: 0.6 }}
      >
        {subtitle ?? " "}
      </div>
      {visual && (
        <div className="pointer-events-none absolute bottom-4 right-4">
          {visual}
        </div>
      )}
    </div>
  );
}

// Four ascending pill bars (6 / 12 / 24 / 36 px tall) inside a
// 36 px square. The first `level` bars from the left render at
// full opacity; the remainder dim to ~20% so the silhouette
// still reads as a bar chart at-rest. Anchored to the same
// foreground colour as the tile's value text so it inverts
// cleanly with the theme.
function BarsVisual({ level }: { level: 1 | 2 | 3 | 4 }) {
  const HEIGHTS = [6, 12, 24, 36] as const;
  return (
    <div className="flex h-9 items-end gap-1" aria-hidden>
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[6px] rounded-full"
          style={{
            height: h,
            background: "var(--ds-background-100)",
            opacity: i < level ? 1 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Vertical thermometer-style scale. 15 horizontal pill ticks
// stacked from 0 °C (bottom) to 35 °C (top) in 2.5 °C steps.
// Major ticks at every 5 °C are wider (18 px) so the scale
// reads like a thermometer's degree markings; minor 2.5 °C
// ticks are narrower (10 px). Lit ticks are at-or-below the
// race temperature; the rest dim to 20 %. Right-aligned so all
// ticks share a "spine" on the right edge.
// Quarter-arc dial gauge for humidity. 11 identical ticks fan
// from "west" (-90°, 0% humidity, bottom of arc) counter-
// clockwise through to "north" (0°, 100%, top of arc), all
// anchored at the bottom-right corner. Only the tick closest
// to `percent` is illuminated (full opacity); the rest dim to
// 20% so the full arc still reads as a scale.
// Stepped mountain silhouette for altitude. Four horizontal
// pill bars stacked from bottom (widest, "Sea level") to top
// (narrowest, "Mountain"), forming an abstracted peak. The bar
// matching the race's altitude bucket is illuminated; the rest
// dim to 20 % so the silhouette still reads as a stepped
// mountain at-rest. Buckets mirror altitudeLabel() —
// <200 m sea level, <1000 m lowland, <2500 m highland,
// ≥2500 m mountain.
function AltitudeVisual({ metres }: { metres: number }) {
  // Stepped mountain silhouette: bars stacked bottom-up with
  // descending widths so they form a peaked triangle (wide
  // base, narrow tip). Centred horizontally so the silhouette
  // reads as a mountain rather than a staircase. The bar at
  // the matching altitude bucket lights up — its *position*
  // on the silhouette communicates the altitude (lit at the
  // base = sea level, lit at the tip = mountain).
  const STEPS = [
    { width: 28, key: "sea-level" },
    { width: 22, key: "lowland" },
    { width: 16, key: "highland" },
    { width: 10, key: "mountain" },
  ] as const;
  const activeIndex = altitudeBucketIndex(metres);
  return (
    <div
      className="flex flex-col-reverse items-center gap-[5px]"
      aria-hidden
    >
      {STEPS.map((step, i) => {
        const lit = i === activeIndex;
        return (
          <div
            key={step.key}
            className="rounded-full"
            style={{
              width: step.width,
              height: 3,
              background: "var(--ds-background-100)",
              opacity: lit ? 1 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

function altitudeBucketIndex(metres: number): 0 | 1 | 2 | 3 {
  if (metres < 200) return 0; // sea level
  if (metres < 1000) return 1; // lowland
  if (metres < 2500) return 2; // highland
  return 3; // mountain
}

function HumidityVisual({ percent }: { percent: number }) {
  // Runna-style two-half ticks. Each tick is a 2 × 24 px pill
  // split into an outer half (away from the anchor) and an
  // inner half (toward the anchor). On dim ticks only the
  // outer half is visible (12 px); on the active tick both
  // halves render, making the needle 24 px long that extends
  // inward toward the anchor.
  //
  // 21 ticks at 5 % intervals so 56 % lands cleanly on the 55 %
  // mark.
  const TICK_COUNT = 21;
  const TRANSLATE = 36;
  const ARC_DEG = 90;
  const HALF = 12;
  const stepPercent = 100 / (TICK_COUNT - 1);
  const activeIndex = Math.max(
    0,
    Math.min(TICK_COUNT - 1, Math.round(percent / stepPercent)),
  );
  return (
    <div
      className="relative"
      style={{ width: TRANSLATE + HALF * 2, height: TRANSLATE + HALF * 2 }}
      aria-hidden
    >
      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = -90 + (i * ARC_DEG) / (TICK_COUNT - 1);
        const lit = i === activeIndex;
        return (
          <div
            key={i}
            className="absolute bottom-0 right-0 flex flex-col"
            style={{
              width: 2,
              height: HALF * 2,
              transform: `rotate(${angle}deg) translateY(-${TRANSLATE}px)`,
            }}
          >
            {/* Outer half — always rendered. On dim ticks
                this is the only visible part so it gets full
                pill rounding; on the active tick it's the
                upper end of a 24 px pill so only the outer
                corners round. */}
            <div
              style={{
                width: 2,
                height: HALF,
                background: "var(--ds-background-100)",
                opacity: lit ? 1 : 0.2,
                borderRadius: lit ? "1000px 1000px 0 0" : "1000px",
              }}
            />
            {/* Inner half — only visible on the active tick.
                Provides the inner extension that turns the
                12 px outer-only tick into a full 24 px needle
                pointing toward the anchor. */}
            <div
              style={{
                width: 2,
                height: HALF,
                background: "var(--ds-background-100)",
                opacity: lit ? 1 : 0,
                borderRadius: "0 0 1000px 1000px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Ticks ascend from the tile's bottom-right corner upward.
// Anchored to start at the bottom and extend up — the
// silhouette can rise into the row of the value text, which
// is fine: the visual is decorative and uses pointer-events:
// none, and the tile's heading-24 sits above it. Major ticks
// at every 5 °C are wider (24 px), minor 2.5 °C ticks are
// narrower (12 px) so the scale reads like a thermometer's
// degree markings. Ticks at-or-below the race temperature
// render full-opacity; the rest dim to 20 %. Right-aligned so
// every tick shares a vertical "spine" on the right edge.
function ThermometerVisual({ celsius }: { celsius: number }) {
  // 17 ticks covering 0–40 °C in 2.5 °C steps. Taller silhouette
  // (~82 px) matching Runna's reference. The tile is content-
  // sized but the visual is absolute bottom-right, so the
  // taller scale rises up into the value row without changing
  // the tile's own height.
  const MIN_C = 0;
  const MAX_C = 40;
  const STEP = 2.5;
  const ticks: number[] = [];
  for (let v = MIN_C; v <= MAX_C; v += STEP) ticks.push(v);
  return (
    <div className="flex flex-col-reverse items-end gap-[3px]" aria-hidden>
      {ticks.map((t) => {
        const isMajor = t % 5 === 0;
        const lit = t <= celsius;
        return (
          <div
            key={t}
            className="rounded-full"
            style={{
              height: 2,
              width: isMajor ? 24 : 12,
              background: "var(--ds-background-100)",
              opacity: lit ? 1 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

function useStatTiles(race: RaceGuideMeta): Tile[] {
  const { units } = useUnits();
  const tiles: Tile[] = [];

  // Order is curated — fastest-glance facts first (distance,
  // surface, elevation), then environment (altitude, temp,
  // humidity), then logistics (field size, start time).

  if (race.distance != null) {
    tiles.push({
      key: "distance",
      Icon: Ruler,
      label: "Distance",
      value: formatDistance(race.distance, units),
      subtitle: raceTypeLabel(race.distance) ?? undefined,
    });
  }

  if (race.surface) {
    tiles.push({
      key: "surface",
      Icon: Footprints,
      label: "Surface",
      value: race.surface,
      subtitle: race.surfaceBreakdown,
    });
  }

  if (race.elevationGain != null) {
    tiles.push({
      key: "elevation",
      Icon: TrendingUp,
      label: "Elevation",
      value: formatElevation(race.elevationGain, units),
      subtitle: race.profile
        ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1)
        : undefined,
      visual: <BarsVisual level={elevationLevel(race.elevationGain)} />,
    });
  }

  if (race.altitude != null) {
    tiles.push({
      key: "altitude",
      Icon: Mountain,
      label: "Altitude",
      value: formatAltitude(race.altitude, units),
      subtitle: altitudeLabel(race.altitude),
      visual: <AltitudeVisual metres={race.altitude} />,
    });
  }

  if (race.averageTemperature != null) {
    tiles.push({
      key: "temperature",
      Icon: Thermometer,
      label: "Temperature",
      value: formatTemperature(race.averageTemperature, units),
      subtitle: temperatureLabel(race.averageTemperature),
      visual: <ThermometerVisual celsius={race.averageTemperature} />,
    });
  }

  if (race.humidity != null) {
    tiles.push({
      key: "humidity",
      Icon: Droplets,
      label: "Humidity",
      value: `${Math.round(race.humidity)}%`,
      subtitle: humidityLabel(race.humidity),
      visual: <HumidityVisual percent={race.humidity} />,
    });
  }

  if (race.fieldSize != null) {
    tiles.push({
      key: "field-size",
      Icon: Users,
      label: "Field size",
      value: race.fieldSize.toLocaleString(),
    });
  }

  // Plain string from the schema's startTime field — editor
  // types literal race-local time so no timezone math is
  // needed. Falls back to nothing (tile omits) when not set.
  if (race.startTime) {
    tiles.push({
      key: "start-time",
      Icon: Clock,
      label: "Start time",
      value: race.startTime,
    });
  }

  return tiles;
}

// °C → °F when the visitor prefers imperial. Source values are
// always stored in °C in Sanity.
function formatTemperature(c: number, units: UnitSystem): string {
  if (units === "imperial") {
    return `${Math.round((c * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(c)}°C`;
}

// metres → feet conversion + thousands separator. Source values
// are always stored in metres in Sanity.
function formatAltitude(m: number, units: UnitSystem): string {
  if (units === "imperial") {
    return `${Math.round(m * 3.281).toLocaleString()} ft`;
  }
  return `${Math.round(m).toLocaleString()} m`;
}

function altitudeLabel(metres: number): string {
  if (metres < 200) return "Sea level";
  if (metres < 1000) return "Lowland";
  if (metres < 2500) return "Highland";
  return "Mountain";
}

function humidityLabel(percent: number): string {
  if (percent < 30) return "Dry";
  if (percent < 60) return "Moderate";
  return "Humid";
}

// Maps a race distance (km) to the closest standard race-type
// label per World Athletics / AIMS — the same set the /races
// distance filter chip uses. ±0.5 km tolerance handles editor
// rounding (42.2 vs 42.195, etc). Unknown distances return
// null so the tile renders without a subtitle.
function raceTypeLabel(km: number): string | null {
  const within = (target: number, tol = 0.5) =>
    km >= target - tol && km <= target + tol;
  if (within(5)) return "5K";
  if (within(10)) return "10K";
  if (within(16.0934)) return "10 Mile";
  if (within(21.0975)) return "Half Marathon";
  if (within(42.195)) return "Marathon";
  if (km >= 50) return "Ultra";
  return null;
}

// Same buckets the /races temperature filter uses (°C-anchored,
// regardless of viewer's display unit) so the label reads
// consistently across surfaces.
function temperatureLabel(c: number): string {
  if (c < 10) return "Cold";
  if (c < 18) return "Mild";
  if (c < 25) return "Warm";
  return "Hot";
}

// Elevation gain (metres) → 4-bucket intensity scale that maps
// onto the BarsVisual. Tuned for marathon-distance gains; tweak
// thresholds when shorter/longer races need a different feel.
function elevationLevel(metres: number): 1 | 2 | 3 | 4 {
  if (metres < 100) return 1; // very flat (Berlin, Chicago)
  if (metres < 300) return 2; // rolling
  if (metres < 600) return 3; // hilly
  return 4; // mountain
}

// ============================================================================
// Course records. Two-column rows (label · time + athlete /
// country) divided by hairlines, mirroring the editorial style
// of the trippin TOC and the original Webflow race-records
// table. Auto-hides when no records are populated; individual
// rows omit when their `time` field is missing.
// ============================================================================

function CourseRecordsCard({ race }: { race: RaceGuideMeta }) {
  const rows = [
    {
      label: "Men",
      time: race.mensCourseRecord,
      athlete: race.mensCourseRecordAthlete,
      country: race.mensCourseRecordCountry,
    },
    {
      label: "Women",
      time: race.womensCourseRecord,
      athlete: race.womensCourseRecordAthlete,
      country: race.womensCourseRecordCountry,
    },
    {
      label: "Men's Wheelchair",
      time: race.mensWheelchairCourseRecord,
      athlete: race.mensWheelchairCourseRecordAthlete,
      country: race.mensWheelchairCourseRecordCountry,
    },
    {
      label: "Women's Wheelchair",
      time: race.womensWheelchairCourseRecord,
      athlete: race.womensWheelchairCourseRecordAthlete,
      country: race.womensWheelchairCourseRecordCountry,
    },
  ].filter((r) => Boolean(r.time));
  if (rows.length === 0) return null;
  return (
    <section
      id={RECORDS_SECTION_ID}
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW, scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        Course records
      </h2>
      <ul className="m-0 list-none divide-y divide-[color:var(--ds-gray-400)] p-0">
        {rows.map((r) => {
          const detail = [r.athlete, r.country].filter(Boolean).join(", ");
          return (
            <li
              key={r.label}
              className="flex items-baseline justify-between gap-4 py-3 text-copy-14 text-[color:var(--ds-gray-1000)] first:pt-0 last:pb-0"
            >
              <span className="font-medium">{r.label}</span>
              <span className="text-right">
                <span className="font-semibold tabular-nums">{r.time}</span>
                {detail && (
                  <span className="text-[color:var(--ds-gray-900)]">
                    {" "}
                    ({detail})
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ============================================================================
// Elevation card. Recharts area chart styled with DS tokens —
// shadcn-flavoured (CSS-var driven, hairline grid, minimal axes,
// floating tooltip) but no third-party chart wrapper. Fetches the
// race's GeoJSON via the existing gpxUtils helper, samples it
// into a distance/elevation series, and re-derives the chart's
// units from the global UnitsContext so flipping the Stats card
// switch updates this chart too.
// ============================================================================

const ELEVATION_GRADIENT_ID = "race-elevation-gradient";

function ElevationCard({
  series,
  onHoverDistance,
}: {
  series: ElevationPoint[];
  onHoverDistance: (distance: number | null) => void;
}) {
  const { units } = useUnits();
  const useMetric = units === "metric";
  // Resolve from --ds-pink-800 once on mount. Lazy initializer
  // so the DOM read only fires after hydration; the value is
  // theme-stable so we don't need to re-resolve on dark/light
  // flips.
  const [lineColor] = useState(() => getRouteLineColor());

  // Chart data + tick domains, recomputed when units or the
  // series change. Source distances are kilometres and source
  // elevations are metres; we convert to mi/ft inline so axis
  // ticks land on round numbers in either system.
  const chart = useMemo(() => {
    const distKm = series.map((p) => p.distance);
    const eleM = series.map((p) => p.elevation);
    const maxKm = Math.max(...distKm);
    const minM = Math.min(...eleM);
    const maxM = Math.max(...eleM);

    const points = series.map((p) => ({
      distance: useMetric ? p.distance : p.distance / 1.609344,
      elevation: useMetric ? p.elevation : p.elevation * 3.28084,
    }));

    const distMax = useMetric ? Math.ceil(maxKm) : Math.ceil(maxKm / 1.609344);
    const distInterval = distanceTickInterval(distMax, useMetric);
    const distTicks: number[] = [];
    for (let v = 0; v <= distMax; v += distInterval) distTicks.push(v);

    const eleInterval = elevationTickInterval(maxM - minM, useMetric);
    const eleStart = useMetric
      ? Math.floor(minM / eleInterval) * eleInterval
      : Math.floor((minM * 3.28084) / eleInterval) * eleInterval;
    const eleEnd = useMetric
      ? Math.ceil(maxM / eleInterval) * eleInterval
      : Math.ceil((maxM * 3.28084) / eleInterval) * eleInterval;
    const eleTicks: number[] = [];
    for (let v = eleStart; v <= eleEnd; v += eleInterval) eleTicks.push(v);

    return {
      points,
      distDomain: [0, distMax] as [number, number],
      eleDomain: [eleStart, eleEnd] as [number, number],
      distTicks,
      eleTicks,
    };
  }, [series, useMetric]);

  const distanceUnit = useMetric ? "km" : "mi";
  const elevationUnit = useMetric ? "m" : "ft";
  // Tokens flip with theme automatically, so we don't need a
  // light/dark branch here.
  const axisColor = "rgba(var(--ds-gray-1000-rgb), 0.55)";
  const gridColor = "var(--ds-gray-400)";

  return (
    <section
      id={ELEVATION_SECTION_ID}
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW, scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        Elevation profile
      </h2>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chart.points}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            onMouseMove={(state) => {
              // Pull the hovered point's distance via Recharts'
              // activePayload (well-supported across versions)
              // and convert back to km so the map lookup matches
              // the source elevation series. Fall back through
              // activeTooltipIndex / activeIndex purely as a
              // belt-and-braces.
              const stateAny = state as {
                activePayload?: Array<{
                  payload?: { distance?: number };
                }>;
                activeTooltipIndex?: number;
                activeIndex?: number;
              };
              const idx =
                stateAny.activeTooltipIndex ?? stateAny.activeIndex;
              if (typeof idx === "number" && series[idx]) {
                onHoverDistance(series[idx].distance);
                return;
              }
              const displayDistance =
                stateAny.activePayload?.[0]?.payload?.distance;
              if (typeof displayDistance === "number") {
                onHoverDistance(
                  useMetric ? displayDistance : displayDistance * 1.609344,
                );
              }
            }}
            onMouseLeave={() => onHoverDistance(null)}
          >
            <defs>
              <linearGradient
                id={ELEVATION_GRADIENT_ID}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={lineColor}
                  stopOpacity={0.32}
                />
                <stop
                  offset="100%"
                  stopColor={lineColor}
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              dataKey="distance"
              type="number"
              domain={chart.distDomain}
              ticks={chart.distTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={(v: number) => `${Math.round(v)}${distanceUnit}`}
            />
            <YAxis
              type="number"
              domain={chart.eleDomain}
              ticks={chart.eleTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={(v: number) =>
                `${Math.round(v).toLocaleString()}${elevationUnit}`
              }
            />
            <Tooltip
              content={
                <ElevationTooltip
                  distanceUnit={distanceUnit}
                  elevationUnit={elevationUnit}
                  points={chart.points}
                  useMetric={useMetric}
                />
              }
              cursor={{
                stroke: "var(--ds-gray-1000)",
                strokeWidth: 1,
                strokeDasharray: "2 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${ELEVATION_GRADIENT_ID})`}
              isAnimationActive={false}
              activeDot={{
                r: 3,
                fill: lineColor,
                stroke: "var(--ds-background-100)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

interface ElevationTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { distance: number; elevation: number } }>;
  distanceUnit: string;
  elevationUnit: string;
  points: Array<{ distance: number; elevation: number }>;
  useMetric: boolean;
}

function ElevationTooltip({
  active,
  payload,
  distanceUnit,
  elevationUnit,
  points,
  useMetric,
}: ElevationTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const grade = computeGrade(points, point.distance, useMetric);
  return (
    <div
      className="rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] px-3 py-2"
      style={{ boxShadow: "var(--ds-shadow-menu)" }}
    >
      <TooltipRow
        label="Distance"
        value={`${point.distance.toFixed(2)} ${distanceUnit}`}
      />
      <TooltipRow
        label="Elevation"
        value={`${Math.round(point.elevation).toLocaleString()} ${elevationUnit}`}
      />
      <TooltipRow
        label="Grade"
        value={`${grade >= 0 ? "+" : ""}${grade.toFixed(1)}%`}
      />
    </div>
  );
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-copy-13">
      <span className="text-[color:var(--ds-gray-900)]">{label}</span>
      <span className="font-semibold tabular-nums text-[color:var(--ds-gray-1000)]">
        {value}
      </span>
    </div>
  );
}

// Slope between the points ±3 samples around the hovered index.
// `points` is sorted ascending by distance, so we binary-search
// the closest index by the hovered X value rather than matching
// payload references — that survives any future Recharts cloning
// of the data prop. `points` already match the active unit
// system; we only need to convert the distance side to the same
// linear unit as the elevation (metres / feet) before dividing.
function computeGrade(
  points: Array<{ distance: number; elevation: number }>,
  targetDistance: number,
  useMetric: boolean,
): number {
  if (points.length < 2) return 0;
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].distance < targetDistance) lo = mid + 1;
    else hi = mid;
  }
  // `lo` is the first index whose distance ≥ target. Pick the
  // closer of (lo-1, lo) so a hover that lands between samples
  // resolves to whichever sample is nearer.
  const idx =
    lo > 0 &&
    Math.abs(points[lo - 1].distance - targetDistance) <
      Math.abs(points[lo].distance - targetDistance)
      ? lo - 1
      : lo;
  const lookAhead = 3;
  const startIdx = Math.max(0, idx - lookAhead);
  const endIdx = Math.min(points.length - 1, idx + lookAhead);
  if (endIdx <= startIdx) return 0;
  const elevationChange = points[endIdx].elevation - points[startIdx].elevation;
  const distanceChange = points[endIdx].distance - points[startIdx].distance;
  if (distanceChange <= 0) return 0;
  const distanceLinear = useMetric
    ? distanceChange * 1000
    : distanceChange * 5280;
  return (elevationChange / distanceLinear) * 100;
}

// Picks the smallest "round" interval from `candidates` such that
// `range / interval` doesn't exceed `maxTicks`. Keeps tick density
// consistent regardless of route length — a 5K and a 100-mile
// ultra both land at ~5-6 ticks instead of one being sparse and
// the other a wall of labels.
function pickTickInterval(
  range: number,
  candidates: number[],
  maxTicks: number,
): number {
  for (const c of candidates) {
    if (Math.ceil(range / c) <= maxTicks) return c;
  }
  return candidates[candidates.length - 1];
}

const DISTANCE_TICK_CANDIDATES_KM = [1, 2, 5, 10, 20, 50, 100];
const DISTANCE_TICK_CANDIDATES_MI = [0.5, 1, 2, 5, 10, 25, 50];
const ELEVATION_TICK_CANDIDATES_M = [10, 20, 50, 100, 250, 500, 1000];
const ELEVATION_TICK_CANDIDATES_FT = [25, 50, 100, 250, 500, 1000, 2500];
// 6 X-ticks max keeps labels comfortable in a 520 px panel; 5
// Y-ticks max gives the chart room to breathe vertically.
const MAX_X_TICKS = 6;
const MAX_Y_TICKS = 5;

function distanceTickInterval(maxDist: number, useMetric: boolean): number {
  return pickTickInterval(
    maxDist,
    useMetric ? DISTANCE_TICK_CANDIDATES_KM : DISTANCE_TICK_CANDIDATES_MI,
    MAX_X_TICKS,
  );
}

function elevationTickInterval(rangeMetres: number, useMetric: boolean): number {
  if (useMetric) {
    return pickTickInterval(
      rangeMetres,
      ELEVATION_TICK_CANDIDATES_M,
      MAX_Y_TICKS,
    );
  }
  return pickTickInterval(
    rangeMetres * 3.28084,
    ELEVATION_TICK_CANDIDATES_FT,
    MAX_Y_TICKS,
  );
}

// Plain fallback — no border / bg of its own because the parent
// panel card already supplies the surface, hairline, and
// shadow. Just inner content.
function AdsCardFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
      <h4 className="m-0 text-heading-16 text-[color:var(--ds-gray-1000)]">
        Want to reach runners?
      </h4>
      <p className="m-0 max-w-[80%] text-copy-13 leading-snug text-[color:var(--ds-gray-900)]">
        Feature your brand, product, or story here.
      </p>
      <a
        href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
        className="inline-flex h-9 items-center gap-1 rounded-md bg-[color:var(--ds-gray-1000)] px-4 text-copy-13 font-semibold text-[color:var(--ds-background-100)] no-underline transition-colors hover:bg-[color:var(--ds-gray-900)]"
      >
        Get in touch
        <ChevronRight className="size-4" />
      </a>
    </div>
  );
}

function formatPillDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : format(d, "d MMM, yyyy");
}

// ============================================================================
// Body sections. Each H2 in the race body becomes its own panel
// card with the H2 as the card heading, the section's anchor id,
// and SCROLL_MARGIN_TOP so TOC links land below the SiteHeader.
// AdsCard is interleaved every 3 sections so longer guides break
// up visually without stacking ads on shorter ones.
// ============================================================================

// Inserts an ad after every 3rd body section (between sections
// 3-4, 6-7, …). Skips entirely for short bodies (<4 sections) so
// a quick guide doesn't end on an ad, and never inserts after the
// last section so the body always closes on editorial content.
const SECTIONS_PER_AD = 3;
const MIN_SECTIONS_FOR_ADS = 4;

function shouldInsertAdAfter(idx: number, total: number): boolean {
  if (total < MIN_SECTIONS_FOR_ADS) return false;
  const positionFromTop = idx + 1;
  return positionFromTop % SECTIONS_PER_AD === 0 && positionFromTop < total;
}

function BodySections({ sections }: { sections: BodySection[] }) {
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((section, i) => (
        <Fragment key={section.id}>
          <BodySectionCard section={section} />
          {shouldInsertAdAfter(i, sections.length) && <AdsCard />}
        </Fragment>
      ))}
    </>
  );
}

function BodySectionCard({ section }: { section: BodySection }) {
  return (
    <section
      id={section.id}
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW, scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        {section.title}
      </h2>
      <PortableText value={section.blocks} components={BODY_PT_COMPONENTS} />
    </section>
  );
}

// Body Portable Text renderer. DS-token-anchored typography
// (text-copy-16 paragraphs, text-heading-* for sub-headings)
// rather than the legacy article-layout class names. Inline
// images render via a <figure> with an optional caption + credit.
// We don't define an `h2` block component because H2s are
// consumed by `splitBodyIntoSections` to split the body and never
// reach this renderer. h1 is intentionally absent too — the page
// title (HeroCard) is the only h1 on the page.
const BODY_PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-copy-16 text-[color:var(--ds-gray-1000)] last:mb-0">
        {children}
      </p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-2 mt-6 text-heading-16 text-[color:var(--ds-gray-1000)] first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-4 text-heading-14 text-[color:var(--ds-gray-1000)] first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-5 border-l-2 border-[color:var(--ds-gray-400)] pl-4 text-copy-16 italic text-[color:var(--ds-gray-900)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[color:var(--ds-gray-1000)] underline underline-offset-2 hover:text-[color:var(--ds-gray-700)]"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-copy-16 text-[color:var(--ds-gray-1000)] last:mb-0 marker:text-[color:var(--ds-gray-700)]">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li>{children}</li>
    ),
  },
  types: {
    image: BodyImage,
    // customCodeBlock: stripped during the post→raceGuide
    // migration. customTable: skipped — the panel column is too
    // narrow for the legacy table primitive, and no migrated body
    // currently has one.
  },
};

type BodyImageValue = SanityImageSource & {
  alt?: string;
  caption?: string;
  credit?: string;
};

function BodyImage({ value }: { value: BodyImageValue }) {
  if (!value) return null;
  // Sanity CDN-served URL with `auto=format` for AVIF/WebP. We
  // use a plain <img> rather than next/image because the panel
  // body doesn't ship asset dimensions in the GROQ projection
  // and editorial body images vary in aspect ratio. The card
  // column is fixed at 480 px so a single 960 px request is
  // sharp on retina without responsive sizing logic.
  const url = urlFor(value).width(960).auto("format").url();
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={value.alt ?? ""} className="block w-full" />
      </div>
      {(value.caption || value.credit) && (
        <figcaption className="mt-2 text-copy-13 text-[color:var(--ds-gray-900)]">
          {value.caption}
          {value.caption && value.credit ? " " : ""}
          {value.credit && (
            <span className="text-[color:var(--ds-gray-700)]">
              — {value.credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
