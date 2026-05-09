"use client";

// src/app/races/[raceSlug]/RaceMap.tsx
//
// Mapbox island for the race guide. Renders the sticky map +
// route + markers + custom React control overlays (zoom /
// recenter / milestone toggle) and the click-popup card for
// the expo. The shell (RaceGuideShell.tsx) embeds <RaceMap> in
// its sticky map cell; everything Mapbox-flavoured lives here.

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Crosshair,
  ExternalLink,
  Layers,
  Map as MapIcon,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Satellite,
  X,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useUnits } from "@/contexts/UnitsContext";
import type {
  ElevationPoint,
  RouteBounds,
  RouteEndpoint,
} from "@/lib/gpxUtils";

import { PANEL_INSET, PANEL_WIDTH } from "./_constants";

// ============================================================================
// Public types
// ============================================================================

export interface ExpoLocation {
  venueName: string | null;
  address: string | null;
  lng: number;
  lat: number;
}

// ============================================================================
// Internal constants
// ============================================================================

// Extra breathing room around the route bbox so the map reads
// slightly zoomed out — the panel ate enough of the canvas
// width that the route would otherwise feel cramped.
const ROUTE_BREATHING = 96;

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

const EXPO_DOT_SIZE = 18;
const ENDPOINT_DOT_SIZE = 20;
const ENDPOINT_BORDER_WIDTH = 2;
// ~50 m at most latitudes (0.0005 degrees ≈ 55 m). Loose
// threshold so any plausible loop chute reads as a single
// start/finish point.
const ENDPOINT_COINCIDENCE_DEG = 0.0005;
const HOVER_DOT_SIZE = 14;
const DISTANCE_MARKER_INTERVAL_KM = 1;
const DISTANCE_MARKER_INTERVAL_MI = 1;

// ============================================================================
// Internal types
// ============================================================================

type MapStatus =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

type EndpointVariant = "start" | "finish";

// User-selectable basemap. Three options:
//
//   - default: minimal labels-only style that *follows the
//     global page theme*. Light theme → light-v11; dark theme
//     → dark-v11; toggling the global theme swaps the basemap
//     automatically. The user can never end up with a dark map
//     in light mode (or vice versa) — that combination would
//     read as a styling bug, so we don't expose it.
//   - satellite: imagery basemap, theme-agnostic.
//   - terrain: outdoors basemap with hill shading + contour
//     lines, theme-agnostic.
//
// Persisted choice survives across navigations. When the
// stored value is "default" we re-resolve against the *current*
// theme on every mount, which is the whole point.
type MapStyleChoice = "default" | "satellite" | "terrain";

const MAP_STYLE_STORAGE_KEY = "distanz-race-map-style";

const MAP_STYLE_OPTIONS: {
  value: MapStyleChoice;
  label: string;
  Icon: typeof Satellite;
}[] = [
  { value: "default", label: "Map", Icon: MapIcon },
  { value: "satellite", label: "Satellite", Icon: Satellite },
  { value: "terrain", label: "Terrain", Icon: Mountain },
];

function isValidMapStyle(value: string | null): value is MapStyleChoice {
  return (
    value === "default" || value === "satellite" || value === "terrain"
  );
}

// Wires a hover tooltip onto a marker — popup appears on
// mouseenter, hides on mouseleave. Stashes the popup on the
// marker as a custom property so the cleanup paths can dispose
// of it alongside marker.remove() (the popup is otherwise its
// own DOM node, separate from the marker, and would orphan on
// re-mount paths like the distance-marker toggle).
type MarkerWithTooltip = mapboxgl.Marker & {
  _tooltipPopup?: mapboxgl.Popup;
};

type MapButtonPosition = "top" | "bottom" | "standalone";

// ============================================================================
// RaceMap — main component
// ============================================================================

interface RaceMapProps {
  routeGeoJson: GeoJSON.FeatureCollection;
  initialBounds: RouteBounds | null;
  endpoints: { start: RouteEndpoint; finish: RouteEndpoint } | null;
  expo: ExpoLocation | null;
  elevationSeries: ElevationPoint[] | null;
  hoverDistance: number | null;
  onReady?: () => void;
}

export default function RaceMap({
  routeGeoJson,
  initialBounds,
  endpoints,
  expo,
  elevationSeries,
  hoverDistance,
  onReady,
}: RaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const expoMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const endpointMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const distanceMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const { units } = useUnits();
  const useMetric = units === "metric";
  // Default OFF so the map reads as a clean editorial canvas
  // on first paint (Strava-style restraint — bold route line,
  // no chrome). User opts in via the milestone toggle control.
  const [showDistanceMarkers, setShowDistanceMarkers] = useState(false);
  const [expoCardOpen, setExpoCardOpen] = useState(false);
  // We need fitBoundsPadding both inside the load handler (for
  // the constructor) and outside (for the React MapControls'
  // recenter handler). Memoised so the controls don't see a
  // new identity per render and re-trigger their effects.
  const fitBoundsPadding = useMemo<mapboxgl.PaddingOptions>(
    () => ({
      top: ROUTE_BREATHING,
      bottom: ROUTE_BREATHING,
      left: PANEL_INSET + PANEL_WIDTH + ROUTE_BREATHING,
      right: ROUTE_BREATHING,
    }),
    [],
  );
  const { isDark } = useContext(DarkModeContext);
  const [status, setStatus] = useState<MapStatus>({ kind: "loading" });

  // User's chosen basemap. Hydrated from localStorage so the
  // choice persists across page navigations / sessions. SSR
  // fallback is "default" — the map doesn't render until
  // client mount, so there's no flash. "default" follows the
  // global theme (light/dark) automatically, so we don't need
  // to branch on isDark here.
  const [mapStyle, setMapStyle] = useState<MapStyleChoice>(() => {
    if (typeof window === "undefined") return "default";
    const stored = window.localStorage.getItem(MAP_STYLE_STORAGE_KEY);
    if (isValidMapStyle(stored)) return stored;
    return "default";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MAP_STYLE_STORAGE_KEY, mapStyle);
  }, [mapStyle]);

  // Mirror mapStyle + isDark into refs so the style.load
  // handler (registered inside the main map useEffect, with
  // neither in its deps — we don't want to tear down the map
  // on every theme/style swap) can read current values rather
  // than stale closure captures. Without these, a style swap
  // wipes layers via setStyle, then style.load re-runs
  // addRouteLayer with the captured-at-mount values — the
  // casing stays white when the user toggles to dark, and so on.
  const mapStyleRef = useRef(mapStyle);
  useEffect(() => {
    mapStyleRef.current = mapStyle;
  }, [mapStyle]);
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

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

    // Initialise framed on the route bbox (computed server-side
    // by fetchRouteAssets and passed in via initialBounds) so the
    // map never paints the [0, 0] / zoom 1 globe before fitting.
    // If we somehow don't have bounds (very rare edge — e.g.
    // Sanity returned no GeoJSON URL but we still landed here),
    // fall back to the same global default and the legacy
    // post-load fit takes over.
    const mapOptions: mapboxgl.MapOptions = {
      container: containerRef.current,
      style: styleForMode(mapStyle, isDark),
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

    // Attribution at bottom-left as plain text — minimalist, no
    // chip, no "i" toggle. Lives alongside the Mapbox wordmark
    // (the conventional credits corner). compact:false forces
    // the full inline text instead of the collapsed button.
    // The action buttons (zoom / recenter / milestone) are
    // rendered via React (see <MapControls>) instead of via
    // Mapbox's IControl API.
    map.addControl(
      new mapboxgl.AttributionControl({ compact: false }),
      "bottom-left",
    );

    // Force the bottom-left credits row (Mapbox wordmark +
    // attribution) to lay out horizontally via inline styles.
    // CSS-only overrides via globals.css have been unreliable
    // across deploys (Tailwind/PostCSS/CDN-cache); inline
    // .style wins unconditionally. queueMicrotask defers it
    // past Mapbox's synchronous logo injection.
    queueMicrotask(() => {
      const bottomLeft = map
        .getContainer()
        .querySelector<HTMLElement>(".mapboxgl-ctrl-bottom-left");
      if (!bottomLeft) return;
      bottomLeft.style.display = "flex";
      bottomLeft.style.flexDirection = "row";
      bottomLeft.style.alignItems = "center";
      bottomLeft.style.gap = "8px";
      Array.from(bottomLeft.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.float = "none";
        child.style.clear = "none";
        child.style.margin = "0 0 8px 8px";
      });
      const attrib = bottomLeft.querySelector<HTMLElement>(
        ".mapboxgl-ctrl-attrib",
      );
      if (attrib) {
        attrib.style.background = "transparent";
        attrib.style.padding = "0";
      }
    });

    map.on("error", (e) => {
      const msg =
        (e?.error as Error | undefined)?.message ?? "Mapbox error";
      // eslint-disable-next-line no-console
      console.error("[RaceMap] mapbox error:", msg, e);
      setStatus({ kind: "error", message: msg });
    });

    // GeoJSON is now passed as a prop (parsed server-side in
    // fetchRouteAssets), so no client-side fetch is needed —
    // the load handler is synchronous, just adds layers and
    // markers and flips status to ready.
    map.on("load", () => {
      try {
        addRouteLayer(
          map,
          routeGeoJson,
          getRouteLineColor(),
          isBasemapDark(mapStyle, isDark),
        );
        // Marker DOM stacks in the order added (last = on top).
        // Hover first so it sits below the always-on POIs;
        // endpoints last so the start / finish dots stay visible
        // even when the hover marker passes over them.
        hoverMarkerRef.current = createHoverMarker(map);
        if (expo) {
          expoMarkerRef.current = addExpoMarker(map, expo, () =>
            setExpoCardOpen((prev) => !prev),
          );
        }
        if (endpoints) {
          endpointMarkersRef.current = addEndpointMarkers(map, endpoints);
        }
        // Only fit post-load when we didn't get server-side
        // bounds — the constructor already framed it otherwise.
        if (!initialBounds) {
          const fitted = fitToRoute(map, routeGeoJson, expo);
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
    // user-added sources, layers, AND images — so addRouteLayer
    // is responsible for re-registering the arrow image too).
    // Reads the current refs rather than the closure values so
    // the casing / shadow / arrow colours pick up the *current*
    // basemap + theme combination on each style swap, not the
    // values captured when the effect first ran.
    map.on("style.load", () => {
      addRouteLayer(
        map,
        routeGeoJson,
        getRouteLineColor(),
        isBasemapDark(mapStyleRef.current, isDarkRef.current),
      );
    });

    // Resize after the first paint as a guard against the
    // container measuring 0 dimensions before layout settles.
    requestAnimationFrame(() => map.resize());

    return () => {
      if (expoMarkerRef.current) {
        removeMarkerWithTooltip(expoMarkerRef.current);
        expoMarkerRef.current = null;
      }
      endpointMarkersRef.current.forEach(removeMarkerWithTooltip);
      endpointMarkersRef.current = [];
      hoverMarkerRef.current?.remove();
      hoverMarkerRef.current = null;
      distanceMarkersRef.current.forEach(removeMarkerWithTooltip);
      distanceMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeGeoJson, expo, initialBounds, endpoints, elevationSeries]);

  // Swap style when the global theme flips OR the user picks
  // a new basemap. Doesn't recreate the map. Skip the very
  // first run — the map was constructed with the correct style
  // already, and Mapbox v3 doesn't no-op same-style setStyle
  // calls; it wipes everything and reloads. That wipe was
  // racing with our async arrow-image load on first paint and
  // triggering "source not found" when the arrow .then tried
  // to add its layer post-wipe. The style.load handler re-adds
  // route layers after every swap, so user style choices
  // survive automatically.
  //
  // Short-circuit when the resolved URL hasn't changed (e.g.
  // theme flip while on Satellite — both isDark values resolve
  // to the same satellite-streets-v12 style). Without the guard
  // the user gets a pointless full-style reload flicker every
  // time they toggle the theme on a non-default basemap.
  const initialStyleMount = useRef(true);
  const lastStyleUrlRef = useRef<string>(styleForMode(mapStyle, isDark));
  useEffect(() => {
    if (initialStyleMount.current) {
      initialStyleMount.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map) return;
    const next = styleForMode(mapStyle, isDark);
    if (next === lastStyleUrlRef.current) return;
    lastStyleUrlRef.current = next;
    map.setStyle(next);
  }, [isDark, mapStyle]);

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

  // Build / tear down the every-1-unit route markers. Re-runs
  // whenever the toggle flips or the unit system changes (each
  // mile / km set has different positions on the route). Bails
  // until the map is ready so we don't try to add markers before
  // the route + style are painted.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status.kind !== "ready" || !elevationSeries) return;

    if (!showDistanceMarkers) {
      distanceMarkersRef.current.forEach(removeMarkerWithTooltip);
      distanceMarkersRef.current = [];
      return;
    }

    distanceMarkersRef.current = buildDistanceMarkers(
      map,
      elevationSeries,
      useMetric,
    );

    return () => {
      distanceMarkersRef.current.forEach(removeMarkerWithTooltip);
      distanceMarkersRef.current = [];
    };
  }, [showDistanceMarkers, useMetric, elevationSeries, status.kind]);

  return (
    <>
      <div
        ref={containerRef}
        className="race-detail-map h-full w-full"
      />
      {status.kind === "ready" && (
        <MapControls
          mapRef={mapRef}
          initialBounds={initialBounds}
          fitBoundsPadding={fitBoundsPadding}
          showMilestoneToggle={!!elevationSeries}
          showDistanceMarkers={showDistanceMarkers}
          onToggleDistanceMarkers={() =>
            setShowDistanceMarkers((prev) => !prev)
          }
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
        />
      )}
      {status.kind === "ready" && expoCardOpen && expo && mapRef.current && (
        <ExpoCard
          map={mapRef.current}
          expo={expo}
          onClose={() => setExpoCardOpen(false)}
        />
      )}
      {status.kind === "loading" && <MapLoadingOverlay />}
      {status.kind === "error" && <StatusOverlay text={status.message} />}
    </>
  );
}

// ============================================================================
// Status overlays (loading / error / "no route" fallback)
// ============================================================================

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
export function MapLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:var(--ds-gray-100)]">
      <LoadingDots>Loading</LoadingDots>
    </div>
  );
}

// Error state: plain text on the same opaque surface. Distinct
// from the loading state so the difference reads instantly.
// Also used by the shell as the fallback when there's no route
// GeoJSON to load.
export function StatusOverlay({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:var(--ds-gray-100)] p-6 text-center text-copy-14 text-[color:var(--ds-gray-900)]">
      {text}
    </div>
  );
}

// ============================================================================
// React control overlay
// ============================================================================

// React-based map control overlay. Replaces Mapbox's IControl
// API with a normal React tree: the buttons compose with our DS
// Tooltip primitive, react to state directly, and don't need
// the CSS/cascade gymnastics that Mapbox's chip styling kept
// forcing on us. Absolute-positioned over the sticky map
// container; pointer-events on the wrapper is none so the map
// captures pan/zoom, while each button re-enables pointer
// events on itself.
interface MapControlsProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  initialBounds: RouteBounds | null;
  fitBoundsPadding: mapboxgl.PaddingOptions;
  showMilestoneToggle: boolean;
  showDistanceMarkers: boolean;
  onToggleDistanceMarkers: () => void;
  mapStyle: MapStyleChoice;
  onMapStyleChange: (next: MapStyleChoice) => void;
}

function MapControls({
  mapRef,
  initialBounds,
  fitBoundsPadding,
  showMilestoneToggle,
  showDistanceMarkers,
  onToggleDistanceMarkers,
  mapStyle,
  onMapStyleChange,
}: MapControlsProps) {
  const [styleSwitcherOpen, setStyleSwitcherOpen] = useState(false);
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleRecenter = () => {
    if (!initialBounds) return;
    mapRef.current?.fitBounds(initialBounds, {
      padding: fitBoundsPadding,
      duration: 600,
    });
  };

  return (
    <div className="pointer-events-none absolute bottom-4 right-4 z-[3] flex flex-col items-end gap-2">
      <div className="pointer-events-auto flex flex-col">
        <MapControlButton
          onClick={handleZoomIn}
          ariaLabel="Zoom in"
          position="top"
        >
          <Plus className="size-4" />
        </MapControlButton>
        <MapControlButton
          onClick={handleZoomOut}
          ariaLabel="Zoom out"
          position="bottom"
        >
          <Minus className="size-4" />
        </MapControlButton>
      </div>
      {initialBounds && (
        <MapControlButton
          onClick={handleRecenter}
          ariaLabel="Recenter route"
          className="pointer-events-auto"
        >
          <Crosshair className="size-4" />
        </MapControlButton>
      )}
      {showMilestoneToggle && (
        <MapControlButton
          onClick={onToggleDistanceMarkers}
          ariaLabel="Toggle distance markers"
          pressed={showDistanceMarkers}
          className="pointer-events-auto"
        >
          <MapPin className="size-4" />
        </MapControlButton>
      )}
      <div className="pointer-events-auto relative">
        <MapControlButton
          onClick={() => setStyleSwitcherOpen((prev) => !prev)}
          ariaLabel="Map style"
          pressed={styleSwitcherOpen ? true : undefined}
        >
          <Layers className="size-4" />
        </MapControlButton>
        {styleSwitcherOpen && (
          <MapStyleSwitcher
            value={mapStyle}
            onChange={(next) => {
              onMapStyleChange(next);
              setStyleSwitcherOpen(false);
            }}
            onClose={() => setStyleSwitcherOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

// Horizontal segmented control that expands left from the
// Layers button when opened. Pinned to the button's right edge
// (right-full) and bottom-aligned with the button so the chip
// row reads as a row connected to the trigger. Click outside or
// Escape closes.
interface MapStyleSwitcherProps {
  value: MapStyleChoice;
  onChange: (next: MapStyleChoice) => void;
  onClose: () => void;
}

function MapStyleSwitcher({
  value,
  onChange,
  onClose,
}: MapStyleSwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Map style"
      className="absolute bottom-0 right-full mr-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-1"
      style={{ boxShadow: "var(--ds-shadow-small)" }}
    >
      {MAP_STYLE_OPTIONS.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.Icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`flex h-6 items-center gap-1.5 rounded-full px-3 text-copy-13 transition-colors ${
              active
                ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]"
            }`}
          >
            <Icon className="size-4" strokeWidth={active ? 2.5 : 1.5} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Individual map-control button. Sits in one of three states:
//   - default: neutral surface, gray-1000 icon
//   - pressed (toggle on): inverted (gray-1000 surface, light icon)
//   - pressed=false (toggle off): muted icon at gray-700
// `position` lets the zoom buttons share a single chip — the
// 'top' button gets a flat bottom edge, 'bottom' gets a flat
// top edge, with a hairline divider in between via
// border-bottom on 'top'. Standalone buttons get full rounding.
interface MapControlButtonProps {
  onClick: () => void;
  ariaLabel: string;
  pressed?: boolean;
  position?: MapButtonPosition;
  className?: string;
  children: React.ReactNode;
}

function MapControlButton({
  onClick,
  ariaLabel,
  pressed,
  position = "standalone",
  className = "",
  children,
}: MapControlButtonProps) {
  const radius =
    position === "top"
      ? "rounded-t-md"
      : position === "bottom"
        ? "rounded-b-md"
        : "rounded-md";
  const divider = position === "top" ? "border-b" : "";

  // Two style modes: inactive (muted) when pressed === false,
  // inverted (filled gray-1000) when pressed === true, default
  // surface look otherwise.
  const colors =
    pressed === true
      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)] hover:bg-[color:var(--ds-gray-900)]"
      : pressed === false
        ? "bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-700)] hover:bg-[color:var(--ds-gray-200)] hover:text-[color:var(--ds-gray-1000)]"
        : "bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]";

  const isToggle = pressed !== undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      {...(isToggle ? { "aria-pressed": pressed } : {})}
      className={`flex h-8 w-8 items-center justify-center border border-[color:var(--ds-gray-400)] transition-colors active:scale-[0.98] ${radius} ${divider} ${colors} ${className}`.trim()}
      style={{ boxShadow: "var(--ds-shadow-small)" }}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Expo card — click-to-open rich popup over the map
// ============================================================================

// Expo card — rich popup that opens when the user clicks the
// expo marker. Renders as an absolute-positioned React overlay
// inside the map container, with its (x, y) projected from the
// expo's lng/lat via map.project() and re-projected on every
// map move/zoom so it stays glued to the marker through pan
// and scale. Closes on click outside (excluding the marker
// itself, which toggles via its own click handler) and ESC.
function ExpoCard({
  map,
  expo,
  onClose,
}: {
  map: mapboxgl.Map;
  expo: ExpoLocation;
  onClose: () => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Project + re-project on map move / zoom so the card tracks
  // the marker. We deliberately listen to the high-frequency
  // 'move' event (not just 'moveend') so the card glides with
  // the pan instead of teleporting at the end.
  useEffect(() => {
    const updatePos = () => {
      const p = map.project([expo.lng, expo.lat]);
      setPos({ x: p.x, y: p.y });
    };
    updatePos();
    map.on("move", updatePos);
    map.on("zoom", updatePos);
    return () => {
      map.off("move", updatePos);
      map.off("zoom", updatePos);
    };
  }, [map, expo]);

  // Close on click outside the card (the marker click handler
  // calls stopPropagation, so re-clicking the dot doesn't fire
  // this) and on ESC.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!cardRef.current) return;
      if (cardRef.current.contains(e.target as Node)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!pos) return null;

  // Google Maps location URL — opens with a pin at the place
  // (search view) rather than the directions view, so the user
  // sees the spot in context and can choose what to do next
  // (directions, save, share). lat/lng query rather than the
  // address text so the pin lands on the exact geocoded point
  // our marker uses.
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${expo.lat},${expo.lng}`;

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto absolute z-[3] w-[300px] rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-4"
      style={{
        left: pos.x,
        top: pos.y,
        // Centre horizontally on the dot, place card bottom 16
        // px above the dot's centre so it floats above the
        // marker with breathing room.
        transform: "translate(-50%, calc(-100% - 16px))",
        boxShadow: "var(--ds-shadow-menu)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {expo.venueName && (
            <h3 className="m-0 text-heading-16 text-[color:var(--ds-gray-1000)]">
              {expo.venueName}
            </h3>
          )}
          {expo.address && (
            <p
              className={`m-0 text-copy-13 text-[color:var(--ds-gray-900)] ${
                expo.venueName ? "mt-1" : ""
              }`}
            >
              {expo.address}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-1 flex size-7 shrink-0 items-center justify-center rounded text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-200)] hover:text-[color:var(--ds-gray-1000)]"
        >
          <X className="size-4" />
        </button>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-9 items-center justify-center gap-2 rounded-md border border-[color:var(--ds-gray-400)] text-copy-13 font-semibold text-[color:var(--ds-gray-1000)] no-underline transition-colors hover:bg-[color:var(--ds-gray-200)]"
      >
        Open in Google Maps
        <ExternalLink className="size-4" />
      </a>
    </div>
  );
}

// ============================================================================
// Style + colour helpers
// ============================================================================

function styleForMode(choice: MapStyleChoice, isDark: boolean): string {
  switch (choice) {
    case "satellite":
      return "mapbox://styles/mapbox/satellite-streets-v12";
    case "terrain":
      return "mapbox://styles/mapbox/outdoors-v12";
    case "default":
    default:
      return isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";
  }
}

// Whether the rendered basemap is dark — drives the route
// casing / shadow colour. Only the theme-following "default"
// choice can be dark; satellite + terrain always use the
// light casing palette since their tiles are colourful enough
// that a white casing always reads cleanly.
function isBasemapDark(choice: MapStyleChoice, isDark: boolean): boolean {
  return choice === "default" && isDark;
}

// Exported because the panel's elevation chart shares the
// same brand-pink line colour for visual continuity between
// the chart's area-fill and the map's route line.
export function getRouteLineColor(): string {
  if (typeof document === "undefined") return ROUTE_LINE_COLOR_FALLBACK;
  const triplet = getComputedStyle(document.documentElement)
    .getPropertyValue("--ds-pink-800-rgb")
    .trim();
  return triplet ? `rgb(${triplet})` : ROUTE_LINE_COLOR_FALLBACK;
}

// ============================================================================
// Mapbox layer / image helpers (route line, casing, arrows)
// ============================================================================

// Strava-style 4-layer route stack (matches the technique in
// src/components/RaceRouteMap.tsx). Layers are inserted *before*
// the first symbol/label layer so map labels (street names,
// places) render on top of the route — the route reads as part
// of the map, not pasted over it.
//
// Bottom → top:
//   1. race-route-shadow  — soft blurred dark line, slight depth
//   2. race-route-casing  — solid white (light) / dark grey
//      (dark) outline that gives the route definition against
//      any tile colour
//   3. race-route-line    — the brand-pink route itself
//   4. race-route-arrows  — chevrons placed along the line at
//      100 px intervals, zoom-responsive in size, rotated to
//      follow line direction
function addRouteLayer(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
  color: string,
  isDark: boolean,
): void {
  if (!map.getSource("race-route")) {
    map.addSource("race-route", { type: "geojson", data });
  }

  // Find the first text-label symbol layer so we can insert the
  // route layers immediately below it — the route paints above
  // every road / terrain / water layer, but place names and
  // road labels still read on top. The earlier heuristic
  // (first symbol layer of any kind) caught POI icon symbols on
  // the streets / outdoors basemaps, which sit *before* the
  // road network in those layer stacks; that landed the route
  // beneath all the road geometry. Restricting to symbol layers
  // whose id contains "label" matches Mapbox's naming
  // convention for text-bearing layers (road-label,
  // place-label, settlement-label, …) and skips the icon-only
  // POI symbols. Falls back to undefined (insert on top) if no
  // label layer is found.
  const layers = map.getStyle().layers;
  let firstSymbolId: string | undefined;
  for (const layer of layers ?? []) {
    if (layer.type === "symbol" && layer.id?.includes("label")) {
      firstSymbolId = layer.id;
      break;
    }
  }

  const casingColor = isDark ? "#2d2d2d" : "#ffffff";
  // Shadow flips with theme too: subtle dark fade in light mode
  // (drop-shadow effect against light tiles), subtle light glow
  // in dark mode (visible halo against dark tiles). The fixed
  // dark shadow we previously used was invisible on dark map
  // tiles — wasted layer.
  const shadowColor = isDark
    ? "rgba(255, 255, 255, 0.15)"
    : "rgba(0, 0, 0, 0.2)";

  if (!map.getLayer("race-route-shadow")) {
    map.addLayer(
      {
        id: "race-route-shadow",
        type: "line",
        source: "race-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": shadowColor,
          "line-width": 6,
          "line-blur": 3,
        },
      },
      firstSymbolId,
    );
  }
  if (!map.getLayer("race-route-casing")) {
    map.addLayer(
      {
        id: "race-route-casing",
        type: "line",
        source: "race-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": casingColor,
          "line-width": 6,
        },
      },
      firstSymbolId,
    );
  }
  if (!map.getLayer("race-route-line")) {
    map.addLayer(
      {
        id: "race-route-line",
        type: "line",
        source: "race-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": color,
          "line-width": 4,
        },
      },
      firstSymbolId,
    );
  }
  // Arrow image is loaded asynchronously (SVG → <img> → addImage)
  // and the symbol layer is added once the image is registered.
  // Defensive guard: if a style swap landed between us adding
  // the source and the image finishing, the source could be
  // gone by the time .then runs — skip rather than throw a
  // Mapbox "source not found" error. The next style.load will
  // re-add everything.
  ensureArrowImage(map, casingColor, color).then(() => {
    if (!map.getSource("race-route")) return;
    if (map.getLayer("race-route-arrows")) return;
    map.addLayer(
      {
        id: "race-route-arrows",
        type: "symbol",
        source: "race-route",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 100,
          "icon-image": "race-route-arrow",
          "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.7,
            14,
            0.9,
            18,
            1.0,
          ],
          "icon-rotation-alignment": "map",
          "icon-pitch-alignment": "map",
          "icon-ignore-placement": true,
          "icon-allow-overlap": true,
        },
      },
      firstSymbolId,
    );
  });
}

// Builds a chevron arrow that reads as part of the route-line
// family: pink inner stroke + the same solid casing colour as
// the line's outline. Chevron points RIGHT in icon-space; with
// `icon-rotation-alignment: map` Mapbox rotates it to align
// with the line's forward direction. Map images are wiped on
// setStyle, so we rebuild on each addRouteLayer call (no-op
// when the image is already registered).
function ensureArrowImage(
  map: mapboxgl.Map,
  casingColor: string,
  lineColor: string,
): Promise<void> {
  if (map.hasImage("race-route-arrow")) return Promise.resolve();
  // Chevron > pointing right. Two stacked paths: outer (casing
  // colour, wider) and inner (line colour, thinner) — same
  // outline + fill rhythm as the route line itself.
  const path = "M6 6 L13 10 L6 14";
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke-linecap="round" stroke-linejoin="round">',
    `<path d="${path}" stroke="${casingColor}" stroke-width="3"/>`,
    `<path d="${path}" stroke="${lineColor}" stroke-width="1.5"/>`,
    "</svg>",
  ].join("");
  const url = `data:image/svg+xml;base64,${btoa(svg)}`;
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.width = 20;
    img.height = 20;
    img.onload = () => {
      if (!map.hasImage("race-route-arrow")) {
        map.addImage("race-route-arrow", img);
      }
      resolve();
    };
    img.onerror = () => reject(new Error("arrow image load failed"));
    img.src = url;
  });
}

// Walks the geometry once, gathering a bounding box, then fits
// the map to it. Used as the bound-less fallback path when
// initialBounds isn't supplied (rare). The expo coord is also
// pulled in so the marker is always framed alongside the route.
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

  if (expo) visit([expo.lng, expo.lat]);

  if (!hasPoint) return false;
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
// Marker helpers — POI primitive, expo, endpoints, hover, distance
// ============================================================================

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

function addExpoMarker(
  map: mapboxgl.Map,
  expo: ExpoLocation,
  onClick: () => void,
): mapboxgl.Marker {
  const marker = addPoiMarker(map, [expo.lng, expo.lat], "Expo", {
    dotSize: EXPO_DOT_SIZE,
  });
  // Click on the dot or chip toggles the rich expo card popup
  // (rendered as a React overlay in <ExpoCard>). stopPropagation
  // so the document-level click handler in ExpoCard doesn't see
  // the same click and immediately close the card after opening.
  const el = marker.getElement();
  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  return marker;
}

// Endpoint markers — the start and finish dots ride on the
// route line itself. Each is a 20 px circle with a 2 px white
// border + drop shadow; the colour / pattern is the marker
// (no side chip). Universally legible:
//   - Start  Solid --ds-green-700 (reads as "go").
//   - Finish Tiled 6 px black-and-white checker (classic
//            finish-flag pattern).
// aria-label on the DOM keeps the markers identifiable to
// screen readers.
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
    // a 20 px dot.
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

  const marker = new mapboxgl.Marker(dot).setLngLat(lngLat).addTo(map);
  attachTextTooltip(map, marker, variant === "start" ? "Start" : "Finish");
  return marker;
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

function attachTextTooltip(
  map: mapboxgl.Map,
  marker: mapboxgl.Marker,
  text: string,
): void {
  const span = document.createElement("span");
  span.textContent = text;

  const popup = new mapboxgl.Popup({
    offset: 14,
    closeButton: false,
    closeOnClick: false,
    className: "map-marker-tooltip",
  })
    .setDOMContent(span)
    .setLngLat(marker.getLngLat());

  const el = marker.getElement();
  el.addEventListener("mouseenter", () => {
    popup.addTo(map);
    const popupEl = popup.getElement();
    // pointer-events:none on the popup wrapper so the cursor can
    // pass through it without stealing the marker's hover state
    // and causing flicker as the cursor crosses the popup edge.
    if (popupEl) popupEl.style.pointerEvents = "none";
  });
  el.addEventListener("mouseleave", () => {
    popup.remove();
  });

  (marker as MarkerWithTooltip)._tooltipPopup = popup;
}

function removeMarkerWithTooltip(marker: mapboxgl.Marker): void {
  (marker as MarkerWithTooltip)._tooltipPopup?.remove();
  marker.remove();
}

// Walks the elevation series and returns one Mapbox marker per
// integer kilometre or mile, matching the active unit system.
// Skips 0 and the route's max distance — those slots belong to
// the start/finish markers, and a "0" chip on top of the green
// Start dot would be visually muddy. Density is high (a
// marathon shows ~26 mi or ~42 km markers), but the toggle is
// off by default so users only see them when they opt in.
function buildDistanceMarkers(
  map: mapboxgl.Map,
  series: ElevationPoint[],
  useMetric: boolean,
): mapboxgl.Marker[] {
  if (series.length === 0) return [];
  const maxKm = series[series.length - 1].distance;
  const markers: mapboxgl.Marker[] = [];
  const unit = useMetric ? "km" : "mi";

  if (useMetric) {
    const interval = DISTANCE_MARKER_INTERVAL_KM;
    for (let km = interval; km < maxKm; km += interval) {
      const point = findPointAtDistance(series, km);
      if (point) markers.push(addDistanceMarker(map, point, km, unit));
    }
  } else {
    const interval = DISTANCE_MARKER_INTERVAL_MI;
    const maxMi = maxKm / 1.609344;
    for (let mi = interval; mi < maxMi; mi += interval) {
      const km = mi * 1.609344;
      const point = findPointAtDistance(series, km);
      if (point) markers.push(addDistanceMarker(map, point, mi, unit));
    }
  }

  return markers;
}

function addDistanceMarker(
  map: mapboxgl.Map,
  point: ElevationPoint,
  label: number,
  unit: "km" | "mi",
): mapboxgl.Marker {
  const dot = document.createElement("div");
  dot.style.cssText = [
    "width: 22px",
    "height: 22px",
    "border-radius: 50%",
    "background: var(--ds-gray-1000)",
    "color: var(--ds-background-100)",
    "font-size: 11px",
    "font-weight: 600",
    "display: flex",
    "align-items: center",
    "justify-content: center",
    "box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)",
    "border: 2px solid var(--ds-background-100)",
    "box-sizing: border-box",
    "cursor: default",
  ].join("; ");
  dot.textContent = String(label);
  const marker = new mapboxgl.Marker(dot)
    .setLngLat([point.lng, point.lat])
    .addTo(map);
  attachTextTooltip(map, marker, `${label} ${unit}`);
  return marker;
}
