"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// Layout shell for the race-detail page. Decides where the map
// and the editorial panel sit relative to each other (sticky
// overlay on desktop today; a stacked layout will follow on
// mobile) and owns the cross-cutting UI state — map ready,
// fullscreen toggle, the elevation-chart hover bridge, and the
// CRT-on / CRT-off panel-reveal animation.
//
// All editorial content lives in <GuidePanel>; the Mapbox island
// lives in <RaceMap>. This file just wires them together.

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type {
  ElevationPoint,
  RouteBounds,
  RouteEndpoint,
  RoutePoi,
} from "@/lib/gpxUtils";

import { MAP_STICKY_TOP } from "./_constants";
import RaceMap, { StatusOverlay, type ExpoLocation } from "./RaceMap";
import GuidePanel from "./RaceGuidePanel";
import type { RaceGuideMeta } from "./_types";

interface RaceGuideShellProps {
  race: RaceGuideMeta;
  routeGeoJson: GeoJSON.FeatureCollection | null;
  heroImageUrl: string | null;
  elevationSeries: ElevationPoint[] | null;
  routeBounds: RouteBounds | null;
  routeEndpoints: { start: RouteEndpoint; finish: RouteEndpoint } | null;
  routePois: RoutePoi[] | null;
  expo: ExpoLocation | null;
}

export default function RaceGuideShell({
  race,
  routeGeoJson,
  heroImageUrl,
  elevationSeries,
  routeBounds,
  routeEndpoints,
  routePois,
  expo,
}: RaceGuideShellProps) {
  // Drive the panel's enter animation off the map's ready state.
  // Races without a route asset have nothing to wait for — the
  // panel reveals immediately. Races with a map keep the panel
  // at opacity 0 until RaceMap reports it has drawn the route,
  // then a transition fades + slides it in so the reveal feels
  // sequenced with the map.
  const [mapReady, setMapReady] = useState(false);
  const panelRevealed = !routeGeoJson || mapReady;
  // Track the lg breakpoint here too (RaceMap also tracks it
  // for fitBoundsPadding, but the shell needs it to decide
  // *where* the map goes — desktop sticky-overlay sibling vs.
  // inline slot inside the panel content). SSR returns true so
  // server-rendered HTML matches a desktop client; mobile
  // clients see a one-frame layout flicker on hydration as the
  // useEffect updates the state.
  const [isLgBreakpoint, setIsLgBreakpoint] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsLgBreakpoint(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  // Bidirectional bridge between the elevation chart and the
  // map: the chart reports the hovered distance (km along the
  // route) and the map drops a blue marker at the matching
  // coordinate. null = no hover.
  const [hoverDistance, setHoverDistance] = useState<number | null>(null);
  // Map "expanded" state: when true the editorial panel is
  // hidden and the map gets the full canvas. Toggled from
  // inside the map via a fullscreen control; lifted here so
  // the shell can conditionally remove the panel column.
  const [mapExpanded, setMapExpanded] = useState(false);
  // Plays the CRT-on animation in reverse — set true right
  // before mapExpanded flips to true, cleared after the
  // animation lands. The panel stays mounted while closing
  // is true so the keyframes have something to animate; once
  // the timeout fires we both mark closing as done and flip
  // the map to fullscreen, so the close animation and the
  // fullscreen swap feel like one motion.
  const [panelClosing, setPanelClosing] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  // Position of the CRT animation's slit, in panel-element
  // coordinates, expressed in pixels. Drives --crt-slit-top
  // on the panel element so the keyframes anchor the slit at
  // the user's viewport centre regardless of scroll. We
  // approximate "viewport centre in element coords" as
  // `scrollY + viewportHeight / 2 − panelTopOffset`, with the
  // panel's offset taken from its DOM position once mounted.
  // null until the first client measurement runs, to avoid a
  // hydration mismatch (server can't read scrollY).
  const [slitTop, setSlitTop] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const computeSlitTop = () => {
    if (typeof window === "undefined") return 0;
    const offset = panelRef.current?.offsetTop ?? 0;
    return Math.max(0, window.scrollY + window.innerHeight / 2 - offset);
  };
  // Capture the slit position on first client paint so the
  // CRT-on animation that runs once mapReady flips uses a
  // viewport-centred slit. useLayoutEffect (over useEffect) so
  // the variable lands before the browser paints the
  // is-revealed class for the first time.
  useLayoutEffect(() => {
    setSlitTop(computeSlitTop());
  }, []);

  const handleToggleExpanded = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Recompute the slit position on every toggle so the
    // animation anchors at the user's *current* viewport
    // centre — they may have scrolled since the last toggle.
    setSlitTop(computeSlitTop());
    if (mapExpanded) {
      // Exiting fullscreen: drop fullscreen immediately so
      // the panel re-mounts and its CRT-on animation plays
      // (handled by the existing is-revealed class).
      setMapExpanded(false);
      setPanelClosing(false);
      return;
    }
    setPanelClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setPanelClosing(false);
      setMapExpanded(true);
      closeTimeoutRef.current = null;
    }, 750);
  };

  // While the map is expanded:
  //
  //   1. Lock body scroll. Otherwise a user who'd scrolled
  //      down to read the panel before clicking fullscreen
  //      lands on a scroll position past the (now much shorter)
  //      <main>, and the page footer slides into view beneath
  //      the map.
  //
  //   2. Drop the `container-type: inline-size` on PageFrame
  //      (the <main>). CSS Containment makes any element with
  //      a non-normal container-type a containing block for
  //      position:fixed descendants — so the map's fullscreen
  //      `position: fixed` was scoping to PageFrame's box
  //      rather than the viewport. That left the footer visible
  //      above the map, the page background showing below, and
  //      the bottom-right controls landing wherever PageFrame's
  //      bottom edge happened to fall (often well off-screen,
  //      so they read as "not clickable"). Restoring the value
  //      on cleanup keeps the @container queries working
  //      everywhere else.
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapExpanded) return;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = shellRef.current?.closest("main") as HTMLElement | null;
    const prevContainerType = main?.style.containerType ?? "";
    if (main) main.style.containerType = "normal";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      if (main) main.style.containerType = prevContainerType;
    };
  }, [mapExpanded]);
  // Build the map node once; the layout below decides where it
  // mounts. React renders it in only one location per render,
  // so on breakpoint flips Mapbox tears down + re-initialises
  // — acceptable cost for a session-rare resize.
  const mapNode = routeGeoJson ? (
    <RaceMap
      routeGeoJson={routeGeoJson}
      initialBounds={routeBounds}
      endpoints={routeEndpoints}
      pois={routePois}
      expo={expo}
      elevationSeries={elevationSeries}
      hoverDistance={hoverDistance}
      raceName={race.title}
      raceSlug={race.slug ?? race.title.toLowerCase().replace(/\s+/g, "-")}
      expanded={mapExpanded}
      onToggleExpanded={handleToggleExpanded}
      onReady={() => setMapReady(true)}
    />
  ) : (
    <StatusOverlay text="Route map coming soon." />
  );

  // Mobile / tablet (< lg): single-column flow. The map sits
  // inline inside GuidePanel between TOC and Stats via the
  // mapSlot prop; cards drop their floating-surface chrome
  // (handled in RaceGuidePanel via lg-prefixed classes).
  if (!isLgBreakpoint) {
    const mobileMap = (
      <div
        className={
          mapExpanded
            ? "overflow-hidden"
            : "h-[60vh] overflow-hidden rounded-md border border-[color:var(--ds-gray-400)]"
        }
        style={
          mapExpanded
            ? {
                position: "fixed",
                top: MAP_STICKY_TOP,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
              }
            : {}
        }
      >
        {mapNode}
      </div>
    );
    return (
      <div
        ref={shellRef}
        className="relative w-full px-4 pt-6 pb-8"
        aria-label={`${race.title} route guide`}
      >
        <GuidePanel
          race={race}
          heroImageUrl={heroImageUrl}
          elevationSeries={elevationSeries}
          onHoverDistance={setHoverDistance}
          mapSlot={mobileMap}
        />
      </div>
    );
  }

  // Desktop (≥ lg): single-cell grid — the sticky map and the
  // editorial panel both occupy row 1 / col 1. The cell
  // auto-sizes to the larger of the two children, so when the
  // panel is taller than the viewport the grid (and <main>)
  // grow tall enough to drive page scroll while the map's
  // `position: sticky; top: 50px` pins it under the
  // SiteHeader throughout.
  return (
    <div
      ref={shellRef}
      className="relative grid w-full"
      style={{ gridTemplateColumns: "1fr", gridTemplateRows: "auto" }}
      aria-label={`${race.title} route guide`}
    >
      <div
        className="overflow-hidden"
        style={{
          gridColumn: 1,
          gridRow: 1,
          ...(mapExpanded
            ? {
                position: "fixed",
                top: MAP_STICKY_TOP,
                left: 0,
                right: 0,
                bottom: 0,
                // Above the global Footer (z-50) — same
                // stacking index would tie and the later-in-DOM
                // footer would win, painting its columns
                // through the map.
                zIndex: 60,
              }
            : {
                position: "sticky",
                top: MAP_STICKY_TOP,
                height: "calc(100vh - 50px)",
                // Below the panel's z-index: 1 so the loading
                // cover (which lives inside this sticky
                // container) can never paint over the panel
                // cards' borders.
                zIndex: 0,
              }),
          // 6 px radius on top corners matches PageFrame; flat
          // bottom because the map deliberately extends past
          // PageFrame's bottom margin to fill the viewport.
          // Dropped in expanded mode for a clean edge-to-edge
          // rectangle.
          borderTopLeftRadius: mapExpanded ? 0 : 6,
          borderTopRightRadius: mapExpanded ? 0 : 6,
        }}
      >
        {mapNode}
      </div>

      {/* Panel layer over the same grid cell. position:
          relative + zIndex lifts above the sticky map; padded
          by PANEL_INSET so the cards sit clear of the map's
          edges; pointer-events:none on the wrapper so the
          empty area around the cards passes clicks through to
          the map (GuidePanel re-enables pointer events on its
          own column). When the map is expanded, the panel is
          removed entirely so the page collapses to map-only. */}
      {(!mapExpanded || panelClosing) && (
        <div
          ref={panelRef}
          className={`relative z-[1] p-8 pointer-events-none ${
            panelClosing
              ? "guide-panel-crt is-closing"
              : `guide-panel-crt${panelRevealed ? " is-revealed" : ""}`
          }`}
          style={
            {
              gridColumn: 1,
              gridRow: 1,
              ...(slitTop !== null
                ? { "--crt-slit-top": `${slitTop}px` }
                : {}),
            } as React.CSSProperties
          }
        >
          <GuidePanel
            race={race}
            heroImageUrl={heroImageUrl}
            elevationSeries={elevationSeries}
            onHoverDistance={setHoverDistance}
          />
        </div>
      )}
    </div>
  );
}
