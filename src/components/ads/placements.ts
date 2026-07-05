// src/components/ads/placements.ts
//
// The ad placement registry — the single source of truth for where ads
// exist and what serves into them. Pages declare a placement by name
// (<AdPlacement name="home-below-hero" />); this registry decides the
// size per breakpoint and, once live, which AdSense unit fills it.
//
// Go-live path: create the unit in the AdSense dashboard, paste its
// data-ad-slot id into `adsenseSlot`, and set NEXT_PUBLIC_ADS_LIVE=true
// on the deployment. Until BOTH are true a placement serves the house
// creatives (see houseAds.tsx) — sized, framed, and labelled exactly
// like a live unit, so the layout never changes at go-live.

import type { AdSize } from "@/components/ui/AdSlot";

export type PlacementName =
  | "home-below-hero"
  | "race-detail-panel"
  | "article-inline";

export interface PlacementDef {
  /** Unit served at lg and up. */
  desktop: AdSize;
  /** Unit served below lg. Omit to serve the desktop unit everywhere. */
  mobile?: AdSize;
  /** AdSense data-ad-slot id — unset until the unit exists in the
      dashboard. Without it the placement always serves house fill. */
  adsenseSlot?: string;
}

export const AD_PLACEMENTS: Record<PlacementName, PlacementDef> = {
  // Homepage — leaderboard under the hero (404's latest-post__ad).
  "home-below-hero": { desktop: "leaderboard", mobile: "mobile-banner" },
  // Race guide side panel (currently unmounted; re-wire on the race
  // detail rebuild).
  "race-detail-panel": { desktop: "mpu", mobile: "mobile-banner" },
  // In-article unit for the article page rebuild.
  "article-inline": { desktop: "leaderboard", mobile: "mpu" },
};

/** Master switch — AdSense stays dark until the site is live. */
export const ADS_LIVE = process.env.NEXT_PUBLIC_ADS_LIVE === "true";
