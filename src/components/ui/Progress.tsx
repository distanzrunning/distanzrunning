"use client";

import { forwardRef } from "react";

/**
 * A single threshold/color pair for `dynamicColors`. Thresholds are
 * percentages of `value / max` × 100. The component picks the highest
 * threshold the percentage is >= to.
 */
export interface ProgressColorStop {
  /** Percentage threshold (0–100) at which this color kicks in */
  threshold: number;
  /** CSS color or var to apply once `percentage >= threshold` */
  color: string;
}

export interface ProgressProps {
  /** Current progress value */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Foreground color of the progress bar (CSS color or variable) */
  color?: string;
  /**
   * Threshold/color pairs that auto-swap based on the resolved
   * percentage. The component picks the highest threshold the
   * percentage is >= to; falls back to `color` (or its default) when
   * none match. Codifies the "warning at the same threshold a quota
   * note fires" rule into the API.
   *
   * @example
   * dynamicColors={[
   *   { threshold: 80, color: "var(--ds-amber-700)" },
   *   { threshold: 95, color: "var(--ds-red-700)" },
   * ]}
   */
  dynamicColors?: ProgressColorStop[];
  /** Bar width (any CSS length). Default `100%`. */
  width?: number | string;
  /** Bar height (any CSS length). Default `10` (px). */
  height?: number | string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * Resolve the effective fill color from the value/max + dynamicColors.
 * Picks the highest threshold the percentage is >= to. Falls back to
 * the base `color` when none match (or when dynamicColors is omitted).
 */
function resolveColor(
  percentage: number,
  baseColor: string,
  dynamicColors: ProgressColorStop[] | undefined,
): string {
  if (!dynamicColors || dynamicColors.length === 0) return baseColor;
  // Sort by threshold descending and pick the first that matches so
  // callers can pass them in any order.
  const sorted = [...dynamicColors].sort((a, b) => b.threshold - a.threshold);
  for (const stop of sorted) {
    if (percentage >= stop.threshold) return stop.color;
  }
  return baseColor;
}

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      color = "var(--ds-gray-1000)",
      dynamicColors,
      width = "100%",
      height = 10,
      className = "",
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const fillColor = resolveColor(percentage, color, dynamicColors);

    // Geist styles a native <progress> directly (track + ::-progress-value
    // fill), so it carries the role/value semantics for free.
    return (
      <div className={`relative ${className}`.trim()} style={{ width, height }}>
        <progress
          ref={ref}
          className="ds-progress"
          value={value}
          max={max}
          style={
            {
              width: "100%",
              height,
              ["--fg" as string]: fillColor,
            } as React.CSSProperties
          }
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";

export interface ProgressStop {
  /** Position as a percentage (0-100) */
  position: number;
  /** Optional label for the stop */
  label?: string;
}

export interface ProgressWithStopsProps extends ProgressProps {
  /** Array of stop positions to display on the progress bar */
  stops: ProgressStop[];
}

export const ProgressWithStops = forwardRef<HTMLDivElement, ProgressWithStopsProps>(
  (
    {
      value,
      max = 100,
      color = "var(--ds-blue-700)",
      dynamicColors,
      stops,
      width = "100%",
      height = 10,
      className = "",
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const fillColor = resolveColor(percentage, color, dynamicColors);

    return (
      <div
        ref={ref}
        className={`relative ${className}`.trim()}
        style={{ width, height }}
      >
        {/* `data-stops` squares off the fill so the notches sit flush. */}
        <progress
          data-stops=""
          className="ds-progress"
          value={value}
          max={max}
          style={
            {
              width: "100%",
              height,
              ["--fg" as string]: fillColor,
            } as React.CSSProperties
          }
        />
        {/* Notch per stop: a gray hairline next to a surface hairline, like
            Geist, offset so the line centres on its position. */}
        {stops.map((stop) => (
          <div
            key={stop.position}
            className="absolute top-0 bottom-0 z-10 flex items-center justify-center"
            style={{ left: `${stop.position}%`, transform: "translateX(-50%)" }}
            aria-label={stop.label}
          >
            <div className="w-px h-full bg-[var(--ds-gray-alpha-600)]" />
            <div className="w-px h-full bg-surface" />
          </div>
        ))}
      </div>
    );
  },
);

ProgressWithStops.displayName = "ProgressWithStops";
