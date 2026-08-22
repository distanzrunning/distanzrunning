"use client";

// src/app/races/RaceExploreMap.tsx
//
// Full-bleed Mapbox island for the /races map view. Built for a
// 1000s-of-races dataset (user call 2026-08-22): pins are GPU-rendered
// GeoJSON LAYERS with Mapbox's native clustering, not DOM markers —
// thousands of DOM elements would jank the map, and clustering is the
// scalable answer to overlapping pins.
//
//   - clusters render as ink circles with a count; clicking one zooms
//     to its expansion zoom;
//   - SAME-COORDINATE stacks (city-level geocoding gives every race in
//     a city identical lng/lat) can never split by zooming — their
//     expansion zoom exceeds clusterMaxZoom, and clicking opens a
//     GROUPED POPUP listing every race at the location instead;
//   - single races keep the ink-dot look; Abbott World Marathon
//     Majors keep the gold star (now a symbol-layer image).
//
// Theme: layer colours resolve from the DS custom properties at
// (re)build time; a light/dark style swap wipes sources, so the
// `style.load` handler re-adds everything with freshly resolved
// colours. The server geocodes (city, state, country) per race —
// 24h-cached via lib/geocode — so this island receives plain
// {lng, lat} props and does zero client-side geocoding.

import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
import type { CountryBounds } from "@/lib/geocode";
import { cn } from "@/lib/utils";

import LoadingBar from "./LoadingBar";

export interface MapRace {
  _id: string;
  title: string;
  href: string;
  lng: number;
  lat: number;
  /** Pre-formatted display strings for the popup. */
  dateLabel?: string;
  location?: string;
  category?: string;
  /** Abbott World Marathon Major — gets the gold-star marker. */
  major?: boolean;
}

const LIGHT_STYLE = "mapbox://styles/mapbox/light-v11";
const DARK_STYLE = "mapbox://styles/mapbox/dark-v11";

const SOURCE_ID = "races";
const CLUSTER_LAYER = "races-clusters";
const CLUSTER_COUNT_LAYER = "races-cluster-count";
const DOT_LAYER = "races-dots";
const STAR_LAYER = "races-stars";
const STAR_IMAGE = "races-major-star";

// Beyond this zoom, points render unclustered unless they share
// coordinates — a cluster whose expansion zoom exceeds it IS a
// same-spot stack, and clicking it opens the grouped popup.
const CLUSTER_MAX_ZOOM = 14;

// The gold star (24-unit viewBox path, same glyph the DOM marker
// used). Drawn onto a canvas for the symbol layer.
const STAR_PATH =
  "M12 1.8l3.05 6.18 6.82.99-4.94 4.81 1.17 6.8L12 17.37l-6.1 3.21 1.17-6.8-4.94-4.81 6.82-.99L12 1.8z";

type RaceProps = Pick<
  MapRace,
  "title" | "href" | "dateLabel" | "location" | "category" | "major"
>;

/** Resolve a DS custom property to a concrete CSS colour, relative to
 *  an element inside the themed DOM (custom properties flip with the
 *  .dark class like everywhere else on the page). */
function resolveToken(el: HTMLElement, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || "#000";
}

function toFeatureCollection(
  races: MapRace[],
): GeoJSON.FeatureCollection<GeoJSON.Point, RaceProps> {
  return {
    type: "FeatureCollection",
    features: races.map((race) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [race.lng, race.lat] },
      properties: {
        title: race.title,
        href: race.href,
        dateLabel: race.dateLabel,
        location: race.location,
        category: race.category,
        major: Boolean(race.major),
      },
    })),
  };
}

/** Rasterise the gold star for the symbol layer — amber fill under a
 *  surface-tone outline (stroke first, fill over = the DOM version's
 *  paint-order: stroke), drawn at 2x for retina. */
function buildStarImage(fill: string, ring: string): ImageData {
  const SIZE = 20; // display px — matches the retired DOM star
  const SCALE = 2;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE * SCALE;
  canvas.height = SIZE * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new ImageData(SIZE * SCALE, SIZE * SCALE);
  const path = new Path2D(STAR_PATH);
  ctx.scale((SIZE * SCALE) / 24, (SIZE * SCALE) / 24);
  ctx.lineJoin = "round";
  // 6 viewBox units, half visible outside the fill = the ink dot's
  // 2.5px ring at display size.
  ctx.lineWidth = 6;
  ctx.strokeStyle = ring;
  ctx.stroke(path);
  ctx.fillStyle = fill;
  ctx.fill(path);
  return ctx.getImageData(0, 0, SIZE * SCALE, SIZE * SCALE);
}

function buildSinglePopupEl(props: RaceProps): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "flex flex-col gap-1";
  const meta = [props.dateLabel, props.location].filter(Boolean).join(" · ");
  el.innerHTML = `
    <a href="${props.href}" class="text-copy-14 font-medium text-textDefault no-underline hover:underline">${escapeHtml(props.title)}</a>
    ${meta ? `<span class="text-copy-13 text-textSubtle">${escapeHtml(meta)}</span>` : ""}
  `;
  return el;
}

/** Grouped popup for a same-coordinate stack — every race at the
 *  location as its own linked row. Scrolls past ~5 rows. */
function buildClusterPopupEl(
  leaves: RaceProps[],
  location?: string,
): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "flex flex-col gap-2";
  const heading = location
    ? `<span class="text-label-12 text-textSubtle">${escapeHtml(location)} · ${leaves.length} races</span>`
    : `<span class="text-label-12 text-textSubtle">${leaves.length} races</span>`;
  const rows = leaves
    .map(
      (p) => `
        <a href="${p.href}" class="flex flex-col gap-0.5 no-underline">
          <span class="text-copy-14 font-medium text-textDefault hover:underline">${escapeHtml(p.title)}</span>
          ${p.dateLabel ? `<span class="text-copy-13 text-textSubtle">${escapeHtml(p.dateLabel)}</span>` : ""}
        </a>`,
    )
    .join("");
  el.innerHTML = `${heading}<div class="flex max-h-56 flex-col gap-2.5 overflow-y-auto pr-1">${rows}</div>`;
  return el;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Camera padding that keeps fitted content clear of the floating
 *  panel — measured, since the panel's height varies with wrapped
 *  filters. Shared by the filter/country fits and the reset control. */
function measureFitPadding(container: HTMLElement): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const box = container.getBoundingClientRect();
  const panel = document.querySelector("[data-races-panel]");
  const panelBottom = panel
    ? Math.max(0, panel.getBoundingClientRect().bottom - box.top)
    : 0;
  return { top: panelBottom + 24, bottom: 80, left: 80, right: 80 };
}

/** Reset-view control — one click flies back out to the landing frame
 *  (whole-earth globe, or the framed country while a Country filter
 *  is active). Lives in the bottom-right ctrl stack under the zoom
 *  buttons, styled as a native Mapbox control (lucide Globe glyph). */
class ResetViewControl implements mapboxgl.IControl {
  private container: HTMLDivElement | null = null;

  constructor(private readonly onReset: () => void) {}

  onAdd(): HTMLElement {
    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Reset map view");
    button.title = "Reset map view";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>`;
    button.addEventListener("click", this.onReset);
    container.appendChild(button);
    this.container = container;
    return container;
  }

  onRemove(): void {
    this.container?.remove();
    this.container = null;
  }
}

export default function RaceExploreMap({
  races,
  countryBounds,
}: {
  races: MapRace[];
  /** Active country filter's bbox — when set, the camera frames the
   *  whole country instead of the pin cluster. */
  countryBounds?: CountryBounds | null;
}) {
  const { isDark } = useContext(DarkModeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Latest data — style.load re-adds the source from here after a
  // theme swap wipes it.
  const dataRef = useRef(toFeatureCollection(races));
  // Latest country frame for the reset control (created once at init,
  // so it reads through a ref).
  const countryBoundsRef = useRef(countryBounds ?? null);
  // First data render must NOT refit the camera — the landing view is
  // the whole-earth globe (fitGlobe in the init effect); only later
  // filter round-trips zoom to their result set.
  const firstFitDoneRef = useRef(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  // Mapbox GL throws at construction without WebGL (old browsers,
  // headless shells) — that must degrade to the fallback panel, not
  // take the whole route down through the error boundary.
  const [initFailed, setInitFailed] = useState(false);
  // First-load gate: the canvas holds at opacity 0 over the recessed
  // gray tone (with the slim LoadingBar running) until Mapbox's
  // `load` fires, then fades up — tiles arrive as one settled frame
  // instead of popping in piecemeal.
  const [loaded, setLoaded] = useState(false);

  // Init once.
  useEffect(() => {
    const container = containerRef.current;
    if (!token || !container || mapRef.current) return;
    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container,
        style: isDark ? DARK_STYLE : LIGHT_STYLE,
        // The earth as a GLOBE — fitGlobe below sizes and centres the
        // sphere in the strip of map visible under the floating panel.
        projection: "globe",
        center: [10, 22],
        zoom: 1,
        attributionControl: false,
      });
    } catch (err) {
      console.error("[races-map] Mapbox init failed:", err);
      setInitFailed(true);
      return;
    }

    // Source + layers, (re)added on every style load — the initial
    // one AND after each theme setStyle (which wipes sources). Colours
    // resolve from the DS tokens at build time so each theme's pass
    // picks up its own values.
    const ensureLayers = () => {
      if (map.getSource(SOURCE_ID)) return;
      const ink = resolveToken(container, "--ds-gray-1000");
      const surface = resolveToken(container, "--ds-background-100");
      const gold = resolveToken(container, "--ds-amber-600");

      if (map.hasImage(STAR_IMAGE)) map.removeImage(STAR_IMAGE);
      map.addImage(STAR_IMAGE, buildStarImage(gold, surface), {
        pixelRatio: 2,
      });

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: dataRef.current,
        cluster: true,
        clusterMaxZoom: CLUSTER_MAX_ZOOM,
        clusterRadius: 50,
      });

      // Cluster bubble — ink circle with the dot family's surface
      // ring, radius stepped by member count.
      map.addLayer({
        id: CLUSTER_LAYER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ink,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            14,
            25,
            18,
            100,
            22,
          ],
          "circle-stroke-width": 2.5,
          "circle-stroke-color": surface,
        },
      });
      map.addLayer({
        id: CLUSTER_COUNT_LAYER,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 12,
          "text-allow-overlap": true,
        },
        paint: { "text-color": surface },
      });

      // Single races — the ink dot (circle 4.5 + 2.5 ring = the
      // retired 14px DOM marker).
      map.addLayer({
        id: DOT_LAYER,
        type: "circle",
        source: SOURCE_ID,
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["!=", ["get", "major"], true],
        ],
        paint: {
          "circle-color": ink,
          "circle-radius": 4.5,
          "circle-stroke-width": 2.5,
          "circle-stroke-color": surface,
        },
      });

      // Abbott World Marathon Majors — the gold star.
      map.addLayer({
        id: STAR_LAYER,
        type: "symbol",
        source: SOURCE_ID,
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "major"], true],
        ],
        layout: {
          "icon-image": STAR_IMAGE,
          "icon-allow-overlap": true,
        },
      });
    };

    map.on("style.load", ensureLayers);

    // Initial camera: the WHOLE earth sphere fits between the floating
    // panel's bottom edge and the section bottom (MapViewport already
    // sized the section to end at the viewport edge, so the corner
    // controls are in view too). Mapbox's cameraForBounds does the
    // globe maths. Runs pre-load — the canvas is still faded out.
    const fitGlobe = (duration = 0) => {
      const el = containerRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const panel = document.querySelector("[data-races-panel]");
      const panelBottom = panel
        ? Math.max(0, panel.getBoundingClientRect().bottom - box.top)
        : 0;
      map.fitBounds(
        [
          [-180, -75],
          [180, 75],
        ],
        {
          padding: { top: panelBottom + 12, bottom: 24, left: 24, right: 24 },
          duration,
        },
      );
    };
    fitGlobe();

    map.on("load", () => setLoaded(true));

    // ---- Interactions (registered once; layer-scoped listeners are
    // resolved at event time, so they survive style swaps). ----------
    const popupOpts = { offset: 14, closeButton: false };

    map.on("click", CLUSTER_LAYER, (e) => {
      const feature = e.features?.[0];
      const clusterId = feature?.properties?.cluster_id as number | undefined;
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
      if (!feature || clusterId === undefined || !source) return;
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;
        if (zoom > CLUSTER_MAX_ZOOM) {
          // Same-coordinate stack — zooming can never split it (the
          // city-level geocode gives co-located races identical
          // coords). Grouped popup instead.
          const count = (feature.properties?.point_count as number) ?? 10;
          source.getClusterLeaves(clusterId, count, 0, (leafErr, leaves) => {
            if (leafErr || !leaves) return;
            const props = leaves.map((l) => l.properties as RaceProps);
            const location = (
              leaves[0]?.properties as RaceProps & {
                location?: string;
              }
            )?.location;
            new mapboxgl.Popup({ ...popupOpts, maxWidth: "320px" })
              .setLngLat(coords)
              .setDOMContent(buildClusterPopupEl(props, location))
              .addTo(map);
          });
        } else {
          map.easeTo({ center: coords, zoom: zoom + 0.25, duration: 500 });
        }
      });
    });

    const openSinglePopup = (e: mapboxgl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];
      new mapboxgl.Popup({ ...popupOpts, maxWidth: "280px" })
        .setLngLat(coords)
        .setDOMContent(buildSinglePopupEl(feature.properties as RaceProps))
        .addTo(map);
    };
    map.on("click", DOT_LAYER, openSinglePopup);
    map.on("click", STAR_LAYER, openSinglePopup);

    for (const layer of [CLUSTER_LAYER, DOT_LAYER, STAR_LAYER]) {
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    // Under the zoom buttons: fly back out to the landing frame
    // (globe, or the framed country while that filter is active) —
    // the zoom-fully-out affordance (user call 2026-08-22).
    map.addControl(
      new ResetViewControl(() => {
        const el = containerRef.current;
        const bounds = countryBoundsRef.current;
        if (bounds && el) {
          map.fitBounds(bounds, {
            padding: measureFitPadding(el),
            maxZoom: 10,
            duration: 800,
          });
        } else {
          fitGlobe(800);
        }
      }),
      "bottom-right",
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left",
    );
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // isDark deliberately not a dep — theme flips restyle the live
    // map below instead of tearing it down.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Theme flip — swap basemap style in place. Guarded by the last-set
  // style: the effect also runs on mount, and re-setting the SAME
  // style mid-load forced a full style rebuild. The style.load
  // handler above re-adds source + layers with re-resolved colours.
  const lastStyleRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const next = isDark ? DARK_STYLE : LIGHT_STYLE;
    if (lastStyleRef.current === null) {
      // First run — the constructor already applied this style.
      lastStyleRef.current = next;
      return;
    }
    if (lastStyleRef.current === next) return;
    lastStyleRef.current = next;
    // setStyle repaints from scratch — for a few frames the canvas
    // shows the bare new-style background while the page has already
    // flipped, which reads as a flash. Reuse the first-load treatment:
    // hide the canvas instantly (the recessed tone behind it is
    // already in the new theme), swap, fade back up once the restyled
    // map has fully rendered.
    setLoaded(false);
    map.setStyle(next);
    map.once("idle", () => setLoaded(true));
  }, [isDark]);

  // Data — push filter round-trip results into the source, then fit
  // the camera.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    dataRef.current = toFeatureCollection(races);
    (map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined)?.setData(
      dataRef.current,
    );

    countryBoundsRef.current = countryBounds ?? null;

    // Camera. Padding keeps the frame clear of the floating panel
    // (measured, like fitGlobe — a static constant undershot it).
    const fitPadding = containerRef.current
      ? measureFitPadding(containerRef.current)
      : { top: 220, bottom: 80, left: 80, right: 80 };

    if (countryBounds) {
      // Country filter active → frame the WHOLE country, not the pin
      // cluster. Also applies on a deep-linked first render (instant),
      // replacing the globe landing — arriving at ?country=X&view=map
      // should show X.
      map.fitBounds(countryBounds, {
        padding: fitPadding,
        maxZoom: 10,
        duration: firstFitDoneRef.current ? 600 : 0,
      });
      firstFitDoneRef.current = true;
    } else if (!firstFitDoneRef.current) {
      // First render, no country — keep the whole-earth globe landing.
      firstFitDoneRef.current = true;
    } else if (races.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      races.forEach((r) => bounds.extend([r.lng, r.lat]));
      map.fitBounds(bounds, {
        padding: fitPadding,
        maxZoom: 10,
        duration: 600,
      });
    }
  }, [races, countryBounds]);

  if (!token || initFailed) {
    // Graceful fallback (dev without the key, misconfigured deploy,
    // no-WebGL browser) — the floating panel above stays fully
    // functional.
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color:var(--ds-gray-100)]">
        <p className="text-copy-14 text-textSubtle">
          {token
            ? "Map unavailable — your browser can't render it."
            : "Map unavailable — missing Mapbox access token."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[color:var(--ds-gray-100)]">
      {/* Fixed = the top-of-viewport rail ALL /races loading shares
          (ViewSwitch uses the same slot for map→grid). One rail, one
          line — an in-flow bar under the navbar next to the fixed
          navigation bar read as two loaders. */}
      {!loaded && <LoadingBar />}
      <div
        ref={containerRef}
        className={cn(
          // Fade-in only: hiding must be INSTANT (first load, and the
          // theme-swap restyle — a 500ms fade-out would let the
          // setStyle flash show through it).
          "races-map h-full w-full",
          loaded
            ? "opacity-100 transition-opacity duration-500 ease-out motion-reduce:transition-none"
            : "opacity-0",
        )}
      />
    </div>
  );
}
