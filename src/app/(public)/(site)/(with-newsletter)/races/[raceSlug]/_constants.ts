// src/app/races/[raceSlug]/_constants.ts
//
// Shared layout primitives for the race-detail page. Lives at
// the page-folder level (underscore-prefixed) so both the shell
// (panel column + sticky map cell) and the map (fitBounds
// padding math) can import without one module reaching into
// the other for what's really just shared geometry.

/** Sticky map pins at the CONDENSED masthead's bottom edge (top
 *  tier: py-3 + h-12 wordmark ≈ 73px; measured, see Masthead).
 *  The masthead's 40px nav slot below is a constant-height slot
 *  that empties on scroll-condense, so pinning here lets the map
 *  slide up beneath the folding nav row exactly the way page
 *  content scrolls through the empty slot everywhere else. While
 *  uncondensed the opaque nav row simply covers the map's top
 *  strip. (Old value 50 was the retired pre-rebuild SiteHeader.) */
export const MAP_STICKY_TOP = 73;

/** Map fills the viewport from the condensed chrome's bottom
 *  edge down. */
export const MAP_VIEWPORT_HEIGHT = "calc(100vh - 73px)";

/** Editorial panel column width — drives both the panel layout
 *  and the map's left-side fitBounds padding so the route
 *  always frames clear of the panel. */
export const PANEL_WIDTH = 520;

/** Padding around the panel inside the sticky map cell, plus
 *  the same value used as breathing room in the map's left-
 *  side fitBounds padding. */
export const PANEL_INSET = 32;
