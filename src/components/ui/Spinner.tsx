"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

// Geist's per-size spinner params. Bar width is always size/4 and the angular
// step is 360/bars; bar count, bar height, and duration come from this table
// (entries match Tailwind size-3/4/5/6/8/10/14 → 12/16/20/24/32/40/56px). An
// arbitrary size snaps to the nearest entry.
const SIZE_TABLE = [
  { size: 12, bars: 8, h: 1.5, duration: 1000 },
  { size: 16, bars: 10, h: 1.5, duration: 1000 },
  { size: 20, bars: 12, h: 2, duration: 1200 },
  { size: 24, bars: 12, h: 2.5, duration: 1200 },
  { size: 32, bars: 15, h: 2.5, duration: 1200 },
  { size: 40, bars: 15, h: 3, duration: 1200 },
  { size: 56, bars: 18, h: 3.5, duration: 1300 },
] as const;

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  const entry = SIZE_TABLE.reduce((best, e) =>
    Math.abs(e.size - size) < Math.abs(best.size - size) ? e : best,
  );
  const barCount = entry.bars;
  const step = 360 / barCount;
  const duration = entry.duration;
  const barH = entry.h;
  const barW = size / 4;

  return (
    <div
      // Default ink is gray-700; pass a `text-*` class to recolour (cn/twMerge
      // lets the caller's colour win). Bars use currentColor.
      className={cn(
        "ds-spinner relative inline-block text-gray-700",
        className,
      )}
      style={{ height: size, width: size }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="ds-spinner-bar absolute rounded-full will-change-transform"
          style={{
            top: "50%",
            left: "50%",
            height: barH,
            width: barW,
            background: "currentColor",
            animation: `ds-spinner-opacity ${duration}ms linear infinite`,
            animationDelay: `${-duration + ((i + 1) * duration) / barCount}ms`,
            // Centre the bar on the ring, then rotate it onto its spoke and
            // push it out by 146% of its width (Geist's exact transform).
            transform: `translate(-50%, -50%) rotate(${i * step}deg) translate(146%)`,
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
