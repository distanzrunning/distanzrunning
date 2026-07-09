"use client";

// ============================================================================
// House ad creatives — the "fill" our ad layer serves while AdSense is
// dark (and later, when a live unit goes unfilled). Each creative adapts
// to the slot's shape the same way AdSlot's ShakeoutAd does: compact
// inline row (mobile banner), wide row (leaderboard), stacked box (MPU/
// square/billboard). Creative fill is gray-100 so units read as real,
// occupied placements on any page background.
//
// pickHouseCreative is the pre-launch "ad server": deterministic per
// placement (stable across server render + hydration — no flicker, no
// mismatch), so different placements show different house creatives and
// the rotation changes as placements are added. When AdSense goes live
// it takes over deciding; these remain the no-fill fallback.

import { ChevronRight } from "lucide-react";

import { ShakeoutAd, type Dimensions } from "@/components/ui/AdSlot";
import type { PlacementName } from "./placements";

const ctaStyle: React.CSSProperties = {
  background: "hsl(var(--color-textDefault))",
  color: "hsl(var(--color-textInverted))",
};

function HouseCreativeFrame({
  href,
  kicker,
  line,
  boxTitle,
  cta,
  width,
  height,
}: {
  href: string;
  kicker: string;
  line: string;
  boxTitle: string;
  cta: string;
} & Dimensions) {
  const kickerEl = (
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-link">
      {kicker}
    </span>
  );

  // Very small mobile banner (≤ 60px tall) — single inline line.
  if (height <= 60) {
    return (
      <a
        href={href}
        className="flex h-full w-full items-center justify-center gap-2 rounded-sm bg-[var(--ds-gray-100)] px-4 no-underline"
      >
        <span className="text-[12px] font-semibold text-textDefault">
          {line}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-textSubtle" />
      </a>
    );
  }

  // Short + wide (leaderboard) — kicker + line + CTA in a row.
  if (height < 100) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-4 rounded-sm bg-[var(--ds-gray-100)] px-6 text-center">
        <div className="flex flex-col items-start gap-0.5 text-left">
          {kickerEl}
          <span className="text-[13px] font-medium text-textDefault">
            {line}
          </span>
        </div>
        <a
          href={href}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-sm px-3.5 font-sans text-[13px] font-semibold no-underline"
          style={ctaStyle}
        >
          {cta}
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Default — square / MPU / billboard / tall units: stacked box.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-sm bg-[var(--ds-gray-100)] p-6 text-center">
      {kickerEl}
      <h4 className="text-heading-16 text-textDefault">{boxTitle}</h4>
      <p className="max-w-[85%] text-[13px] leading-snug text-textSubtle">
        {line}
      </p>
      <a
        href={href}
        className="mt-1 inline-flex h-9 items-center gap-1.5 rounded-sm px-3.5 font-sans text-[13px] font-semibold no-underline transition-colors"
        style={ctaStyle}
      >
        {cta}
        <ChevronRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function RaceGuidesAd(dims: Dimensions) {
  return (
    <HouseCreativeFrame
      {...dims}
      href="/races"
      kicker="Race Guides"
      line="Interactive guides to the world's biggest races."
      boxTitle="Find your next race"
      cta="Explore races"
    />
  );
}

function AdFreeAd(dims: Dimensions) {
  return (
    <HouseCreativeFrame
      {...dims}
      href="/signup"
      kicker="Distanz Running"
      line="Support independent running journalism, ad-free."
      boxTitle="Go ad free"
      cta="Subscribe"
    />
  );
}

// The rotation pool. ShakeoutAd is AdSlot's own default creative, reused
// here so the pool and the no-fill default stay in step.
const HOUSE_CREATIVES: ReadonlyArray<(dims: Dimensions) => React.ReactNode> = [
  ShakeoutAd,
  RaceGuidesAd,
  AdFreeAd,
];

/** Deterministic creative choice per placement — the same placement
 *  always serves the same house creative within a build (stable through
 *  hydration), while different placements rotate through the pool. */
export function pickHouseCreative(
  placement: PlacementName,
  dims: Dimensions,
): React.ReactNode {
  let hash = 0;
  for (const ch of placement) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  const Creative = HOUSE_CREATIVES[hash % HOUSE_CREATIVES.length];
  return <Creative {...dims} />;
}
