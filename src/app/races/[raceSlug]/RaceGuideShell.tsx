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

import {
  MAP_STICKY_TOP,
  MAP_VIEWPORT_HEIGHT,
  PANEL_INSET,
} from "./_constants";
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
  return (
    // Single-cell grid: the sticky map and the editorial panel
    // both occupy row 1 / col 1. The cell auto-sizes to the
    // larger of the two children — so when the panel is taller
    // than the viewport, the grid (and therefore <main>) grows
    // tall enough to drive page scroll, while the map's
    // `position: sticky; top: 50px` keeps it pinned just under
    // the SiteHeader throughout that scroll.
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
          // Default state: sticky map below the SiteHeader.
          // Expanded state: pinned to the viewport via
          // position:fixed so the map fills the screen
          // regardless of where the user had scrolled before
          // toggling fullscreen — without this, a scrolled-down
          // user would see the page footer beneath the map.
          ...(mapExpanded
            ? {
                position: "fixed",
                top: MAP_STICKY_TOP,
                left: 0,
                right: 0,
                bottom: 0,
                // Above the global Footer (z-50) — same stacking
                // index would tie and the later-in-DOM footer
                // would win, painting its columns through the
                // map. Stays below SiteHeader (z-40 sticky)
                // but doesn't visually overlap it anyway since
                // the map starts at top:MAP_STICKY_TOP (50 px).
                zIndex: 60,
              }
            : {
                position: "sticky",
                top: MAP_STICKY_TOP,
                height: MAP_VIEWPORT_HEIGHT,
                // Explicitly below the panel's zIndex: 1 so the
                // loading cover (which lives inside this sticky
                // container) can never paint over the panel
                // cards' borders.
                zIndex: 0,
              }),
          // Match PageFrame's 6 px radius on the top corners so
          // the map tiles + loading overlay (clipped by the
          // overflow-hidden above) don't paint past the frame's
          // curve. Bottom corners stay flat: the map deliberately
          // extends past PageFrame's bottom margin to fill the
          // viewport (see MAP_VIEWPORT_HEIGHT), so a second curve
          // there would sit below PageFrame's own bottom corner.
          // In expanded mode the map fills the viewport edge-to-
          // edge, so we drop the rounding for a clean rectangle.
          borderTopLeftRadius: mapExpanded ? 0 : 6,
          borderTopRightRadius: mapExpanded ? 0 : 6,
        }}
      >
        {routeGeoJson ? (
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
          its own content stays interactive.
          When the map is expanded (fullscreen toggle), the panel
          is removed from the tree entirely so the page collapses
          to map-only and the route gets the full canvas. */}
      {(!mapExpanded || panelClosing) && (
        <div
          ref={panelRef}
          className={
            panelClosing
              ? "guide-panel-crt is-closing"
              : `guide-panel-crt${panelRevealed ? " is-revealed" : ""}`
          }
          style={
            {
              gridColumn: 1,
              gridRow: 1,
              padding: PANEL_INSET,
              pointerEvents: "none",
              position: "relative",
              zIndex: 1,
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
