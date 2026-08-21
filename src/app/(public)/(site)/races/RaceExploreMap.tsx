"use client";

// src/app/races/RaceExploreMap.tsx
//
// Full-bleed Mapbox island for the /races map view. Renders one
// marker per (geocoded) race with a click popup linking to the race
// guide. Follows RaceMap.tsx's conventions: mapbox-gl from npm, the
// house basemap pair (light-v11 / dark-v11) keyed to DarkModeContext,
// token from NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.
//
// The server geocodes (city, state, country) per race — 24h-cached
// via lib/geocode — so this island receives plain {lng, lat} props
// and does zero client-side geocoding. Filter changes round-trip
// through the server (URL-driven, like the grid) and arrive as a new
// `races` prop: markers rebuild and the camera refits.

import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
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
}

const LIGHT_STYLE = "mapbox://styles/mapbox/light-v11";
const DARK_STYLE = "mapbox://styles/mapbox/dark-v11";

/** Ink dot marker — theme-aware via the DS custom properties, which
 *  resolve inside the map container like anywhere else on the page. */
function buildMarkerEl(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "races-map-marker";
  return el;
}

function buildPopupEl(race: MapRace): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "flex flex-col gap-1";
  const meta = [race.dateLabel, race.location].filter(Boolean).join(" · ");
  el.innerHTML = `
    <a href="${race.href}" class="text-copy-14 font-medium text-textDefault no-underline hover:underline">${escapeHtml(race.title)}</a>
    ${meta ? `<span class="text-copy-13 text-textSubtle">${escapeHtml(meta)}</span>` : ""}
  `;
  return el;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default function RaceExploreMap({ races }: { races: MapRace[] }) {
  const { isDark } = useContext(DarkModeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  // First markers render must NOT refit the camera — the landing
  // view is the whole-earth globe (fitGlobe in the init effect);
  // only later filter round-trips zoom to their result set.
  const firstFitDoneRef = useRef(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  // Mapbox GL throws at construction without WebGL (old browsers,
  // headless shells) — that must degrade to the fallback panel, not
  // take the whole route down through the error boundary.
  const [initFailed, setInitFailed] = useState(false);
  // First-load gate: the canvas holds at opacity 0 over the recessed
  // gray tone (with the slim LoadingBar running) until Mapbox's
  // `load` fires, then fades up — tiles arrive as one settled frame
  // instead of popping in piecemeal (user call 2026-08-21).
  const [loaded, setLoaded] = useState(false);

  // Init once.
  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: isDark ? DARK_STYLE : LIGHT_STYLE,
        // The earth as a GLOBE (user call 2026-08-21) — fitGlobe
        // below sizes and centres the sphere in the strip of map
        // visible under the floating panel.
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

    // Initial camera: the WHOLE earth sphere fits between the
    // floating panel's bottom edge and the section bottom (which
    // MapViewport has already sized to end at the viewport edge, so
    // the corner controls are in view too). Mapbox's own
    // cameraForBounds does the globe maths — an analytic
    // zoom-from-diameter formula undershot because the sphere is a
    // perspective render, not a flat projection. No fog override:
    // the basemap keeps the house light/dark scheme (user call
    // 2026-08-21 — the space-and-stars atmosphere clashed with the
    // page). Runs pre-load — the canvas is still faded out, so the
    // jump is invisible.
    const fitGlobe = () => {
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
          padding: {
            top: panelBottom + 12,
            bottom: 24,
            left: 24,
            right: 24,
          },
          duration: 0,
        },
      );
    };
    fitGlobe();

    map.on("load", () => setLoaded(true));
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left",
    );
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // isDark deliberately not a dep — theme flips restyle the live
    // map below instead of tearing it down.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Theme flip — swap basemap style in place (DOM markers survive
  // setStyle; only canvas layers reset). Guarded by the last-set
  // style (RaceMap.tsx's lastStyleUrlRef move): the effect also runs
  // on mount, and re-setting the SAME style mid-load forced a full
  // style rebuild ("Unable to perform style diff" console noise).
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
    map.setStyle(next);
  }, [isDark]);

  // Markers — rebuild on data change (filter round-trips), then fit
  // the camera to the result set.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = races.map((race) => {
      const popup = new mapboxgl.Popup({
        offset: 14,
        closeButton: false,
        maxWidth: "280px",
      }).setDOMContent(buildPopupEl(race));
      return new mapboxgl.Marker({ element: buildMarkerEl() })
        .setLngLat([race.lng, race.lat])
        .setPopup(popup)
        .addTo(map);
    });

    // First render keeps the whole-earth globe (the landing moment);
    // only FILTER round-trips refit the camera to the result set.
    if (!firstFitDoneRef.current) {
      firstFitDoneRef.current = true;
    } else if (races.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      races.forEach((r) => bounds.extend([r.lng, r.lat]));
      map.fitBounds(bounds, {
        padding: { top: 220, bottom: 80, left: 80, right: 80 },
        maxZoom: 10,
        duration: 600,
      });
    }
  }, [races]);

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
      {!loaded && (
        <div className="absolute inset-x-0 top-0 z-10">
          <LoadingBar />
        </div>
      )}
      <div
        ref={containerRef}
        className={cn(
          "races-map h-full w-full transition-opacity duration-500 ease-out motion-reduce:transition-none",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
