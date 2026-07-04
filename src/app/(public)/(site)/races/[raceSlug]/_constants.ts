// src/app/races/[raceSlug]/_constants.ts
//
// Shared layout primitives for the race-detail page. Lives at
// the page-folder level (underscore-prefixed) so both the shell
// (panel column + sticky map cell) and the map (fitBounds
// padding math) can import without one module reaching into
// the other for what's really just shared geometry.

/** Sticky map sits just below the 50 px SiteHeader. */
export const MAP_STICKY_TOP = 50;

/** Map fills the viewport from below the SiteHeader to its bottom. */
export const MAP_VIEWPORT_HEIGHT = "calc(100vh - 50px)";

/** Editorial panel column width — drives both the panel layout
 *  and the map's left-side fitBounds padding so the route
 *  always frames clear of the panel. */
export const PANEL_WIDTH = 520;

/** Padding around the panel inside the sticky map cell, plus
 *  the same value used as breathing room in the map's left-
 *  side fitBounds padding. */
export const PANEL_INSET = 32;
