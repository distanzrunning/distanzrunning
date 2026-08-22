// src/app/races/LoadingBar.tsx
//
// Slim indeterminate loading bar — a 2px blue block growing from the
// left, decelerating to hold near-complete until the work lands and
// the bar unmounts (the NProgress/YouTube convention), for work of
// unknown duration (view-switch round-trips, map tile loading). The
// DS Progress component is determinate-only, and a made-up percent
// would lie; the asymptotic fill is the honest affordance. Blue-700
// per the colour system's functional-accent rule.
//
// Always pinned to the very top of the viewport OVER the masthead
// (z above the header's 50 — the GitHub/YouTube top-bar convention,
// which also sidesteps the header's variable condensed height). One
// shared rail: every /races loading state (view switch, map tiles,
// theme restyle) reports here, and callers coordinate so at most one
// bar is mounted — two lines at once read as duplicate loaders
// (user call 2026-08-22).

export default function LoadingBar() {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 w-full overflow-hidden"
    >
      <div className="races-loading-fill h-full w-full bg-[var(--ds-blue-700)]" />
    </div>
  );
}
