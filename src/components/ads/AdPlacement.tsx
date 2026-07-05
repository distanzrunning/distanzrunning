"use client";

// ============================================================================
// AdPlacement — the page-facing ad component. Pages say WHERE
// (<AdPlacement name="home-below-hero" />); the ad layer decides WHAT:
//   - size per breakpoint from the placement registry
//   - live AdSense unit when ADS_LIVE + the placement has a slot id
//   - a house creative otherwise (deterministic per placement), framed
//     and labelled exactly like a live unit
// Renders the mobile/desktop pair with CSS visibility (no JS breakpoint
// detection — SSR-stable, no layout shift).
// ============================================================================

import AdSlot, { SIZE_PRESETS } from "@/components/ui/AdSlot";
import { AD_PLACEMENTS, ADS_LIVE, type PlacementName } from "./placements";
import { pickHouseCreative } from "./houseAds";

export interface AdPlacementProps {
  name: PlacementName;
  className?: string;
}

export default function AdPlacement({ name, className }: AdPlacementProps) {
  const def = AD_PLACEMENTS[name];
  const live = ADS_LIVE && Boolean(def.adsenseSlot);

  const unit = (size: (typeof def)["desktop"], suffix: string) => (
    <AdSlot
      slot={def.adsenseSlot ?? `${name}${suffix}`}
      size={size}
      preview={!live}
      fallback={pickHouseCreative(name, SIZE_PRESETS[size])}
      className="mx-auto"
    />
  );

  if (!def.mobile || def.mobile === def.desktop) {
    return <div className={className}>{unit(def.desktop, "")}</div>;
  }

  return (
    <div className={className}>
      <div className="lg:hidden">{unit(def.mobile, "-mobile")}</div>
      <div className="hidden lg:block">{unit(def.desktop, "")}</div>
    </div>
  );
}
