"use client";

import { forwardRef } from "react";

export interface ProgressProps {
  /** Current progress value */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Foreground color of the progress bar (CSS color or variable) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  ({ value, max = 100, color = "var(--ds-gray-1000)", className = "" }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

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
            background: color,
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
  ({ value, max = 100, color = "var(--ds-blue-700)", stops, className = "" }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

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
              background: color,
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
              style={{ background: "var(--ds-background-100)" }}
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
