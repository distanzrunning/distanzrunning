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
  /** Additional CSS classes */
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
      className = "",
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const fillColor = resolveColor(percentage, color, dynamicColors);

    return (
      <div
        className={`relative w-full overflow-hidden rounded-full ${className}`}
        style={{ height: 10 }}
      >
        {/* Track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--ds-gray-alpha-200)" }}
        />
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            background: fillColor,
          }}
        />
        {/* Hidden native progress for accessibility */}
        <progress
          ref={ref}
          value={value}
          max={max}
          className="sr-only"
        >
          {Math.round(percentage)}%
        </progress>
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
      className = "",
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const fillColor = resolveColor(percentage, color, dynamicColors);

    return (
      <div
        ref={ref}
        className={`relative w-full ${className}`}
        style={{ height: 10 }}
      >
        {/* Track */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--ds-gray-alpha-200)" }}
          />
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${percentage}%`,
              background: fillColor,
            }}
          />
        </div>
        {/* Stops */}
        {stops.map((stop) => (
          <div
            key={stop.position}
            className="absolute top-0 bottom-0 flex items-center justify-center"
            style={{ left: `${stop.position}%`, transform: "translateX(-50%)" }}
          >
            <div
              className="w-px h-full"
              style={{ background: "var(--ds-gray-alpha-600)" }}
            />
            <div
              className="absolute w-px h-full"
              style={{ background: "rgb(var(--color-canvas))" }}
            />
          </div>
        ))}
        {/* Hidden native progress for accessibility */}
        <progress
          value={value}
          max={max}
          className="sr-only"
        >
          {Math.round(percentage)}%
        </progress>
      </div>
    );
  },
);

ProgressWithStops.displayName = "ProgressWithStops";
