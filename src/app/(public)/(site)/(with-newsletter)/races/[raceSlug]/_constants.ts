// src/app/races/[raceSlug]/_constants.ts
//
// Shared layout primitives for the race-detail page. Lives at
// the page-folder level (underscore-prefixed) so both the shell
// (panel column + sticky map cell) and the map (fitBounds
// padding math) can import without one module reaching into
// the other for what's really just shared geometry.

/** Sticky map pins at the CONDENSED masthead's painted bottom
 *  edge — 57px, headlessly measured: the 73px top tier ALSO
 *  translates up 16px as part of the condense motion. Pinning
 *  any lower left a canvas strip between the condensed chrome
 *  and the map (user call 2026-08-22). While uncondensed, the
 *  opaque tiers simply cover the map's top strip — the map cell
 *  is pulled up under them by MAP_PULL_UP so the canvas is
 *  flush from first paint. */
export const MAP_STICKY_TOP = 57;

/** The masthead's LAYOUT bottom (73px top tier + 40px nav slot —
 *  the slot keeps its height while condensed, only its paint
 *  empties). The map cell's negative top margin spans the
 *  difference so the map's in-flow top sits at MAP_STICKY_TOP
 *  in document space: pinned and viewport-flush from scroll 0,
 *  corner controls never below the fold. */
export const MAP_PULL_UP = 113 - MAP_STICKY_TOP;

/** Map fills the viewport from the condensed chrome's bottom
 *  edge down. */
export const MAP_VIEWPORT_HEIGHT = `calc(100vh - ${MAP_STICKY_TOP}px)`;

/** Editorial panel column width — drives both the panel layout
 *  and the map's left-side fitBounds padding so the route
 *  always frames clear of the panel. */
export const PANEL_WIDTH = 520;

/** Padding around the panel inside the sticky map cell, plus
 *  the same value used as breathing room in the map's left-
 *  side fitBounds padding. */
export const PANEL_INSET = 32;
