"use client";

import React from "react";

// ============================================================================
// Types
// ============================================================================

export interface GaugeProps {
  /** The current value (0-100) */
  value: number;
  /** Rendered size in pixels */
  size?: 20 | 32 | 64 | 128;
  /** Primary arc color (defaults to auto color scale based on value) */
  color?: string;
  /** Secondary (background) arc color */
  secondaryColor?: string;
  /** Show value label in the center */
  showLabel?: boolean;
  /** Gap percentage between arc ends */
  gapPercent?: number;
  /** Arc priority: "primary" gives more space to primary arc, "equal" splits evenly */
  arcPriority?: "primary" | "equal";
  /** Whether the gauge is in indeterminate/loading state */
  indeterminate?: boolean;
  /** Content to render in the center (overrides default label) */
  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Color scale helper
// ============================================================================

function getDefaultColor(value: number): string {
  if (value <= 25) return "var(--ds-red-800)";
  if (value <= 50) return "var(--ds-amber-700)";
  return "var(--ds-green-700)";
}

// ============================================================================
// Size configs
// ============================================================================

interface SizeConfig {
  radius: number;
  strokeWidth: number;
  defaultGap: number;
}

const sizeConfigs: Record<number, SizeConfig> = {
  20: { radius: 42.5, strokeWidth: 15, defaultGap: 9 },
  32: { radius: 45, strokeWidth: 10, defaultGap: 6 },
  64: { radius: 45, strokeWidth: 10, defaultGap: 5 },
  128: { radius: 45, strokeWidth: 10, defaultGap: 5 },
};

// ============================================================================
// Label font sizes
// ============================================================================

function getLabelStyle(size: number): React.CSSProperties {
  if (size <= 32) {
    return { fontSize: "0.6875rem", fontWeight: 500, lineHeight: 1 };
  }
  if (size <= 64) {
    return {
      fontSize: "1.125rem",
      lineHeight: "1.5rem",
      fontWeight: 500,
    };
  }
  return {
    fontSize: "2rem",
    lineHeight: "2.5rem",
    letterSpacing: "-0.049375rem",
    fontWeight: 600,
  };
}

// ============================================================================
// Gauge Component
// ============================================================================

export function Gauge({
  value,
  size = 32,
  color,
  secondaryColor = "var(--ds-gray-alpha-400)",
  showLabel = false,
  gapPercent,
  arcPriority = "primary",
  indeterminate = false,
  children,
  className,
}: GaugeProps) {
  const config = sizeConfigs[size] || sizeConfigs[32];
  const gap = gapPercent ?? config.defaultGap;
  const circumference = 2 * Math.PI * config.radius;
  const percentToPx = circumference / 100;
  const clampedValue = Math.max(0, Math.min(100, value));

  const resolvedColor = color || getDefaultColor(clampedValue);

  // Calculate stroke percentages
  const offsetFactor = arcPriority === "equal" ? 0.5 : 0;

  let primaryPercent: number;
  let secondaryPercent: number;

  if (indeterminate) {
    primaryPercent = 25;
    secondaryPercent = 100 - primaryPercent - gap * 2;
  } else if (clampedValue === 0) {
    primaryPercent = 0;
    secondaryPercent = 100 - gap;
  } else if (clampedValue === 100 && gap === 0) {
    primaryPercent = 100;
    secondaryPercent = 0;
  } else {
    primaryPercent = clampedValue;
    secondaryPercent = 100 - clampedValue - gap * 2;
    if (arcPriority === "equal") {
      const availableArc = 100 - gap * 2;
      const primaryArc = (clampedValue / 100) * availableArc;
      primaryPercent = primaryArc;
      secondaryPercent = availableArc - primaryArc;
    }
  }

  // Dasharray calculations
  const primaryDash = (primaryPercent / 100) * circumference;
  const primaryGap = circumference - primaryDash;
  const secondaryDash = (secondaryPercent / 100) * circumference;
  const secondaryGap = circumference - secondaryDash;

  // Offset for secondary arc (starts after primary + gap)
  const primaryOffset = 0;
  const gapPx = (gap / 100) * circumference;
  const secondaryOffset = -(primaryDash + gapPx);

  const hasContent = showLabel || children || indeterminate;

  return (
    <div
      className={`gauge-circle ${indeterminate ? "gauge-indeterminate" : ""} ${className || ""}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      {...(!indeterminate ? { "aria-valuenow": clampedValue } : {})}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height={size}
        width={size}
        viewBox="0 0 100 100"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Secondary (background) arc */}
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          strokeWidth={config.strokeWidth}
          stroke={secondaryColor}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${secondaryDash} ${secondaryGap}`}
          strokeDashoffset={secondaryOffset}
          style={{
            opacity: secondaryPercent <= 0 ? 0 : 1,
            transition: "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease, opacity 0.3s ease",
          }}
        />
        {/* Primary (foreground) arc */}
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          strokeWidth={config.strokeWidth}
          stroke={resolvedColor}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${primaryDash} ${primaryGap}`}
          strokeDashoffset={primaryOffset}
          style={{
            opacity: primaryPercent <= 0 ? 0 : 1,
            transition: "stroke-dasharray 0.5s ease, opacity 0.3s ease",
          }}
        />
      </svg>

      {/* Center content */}
      {hasContent && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {children ? (
            children
          ) : indeterminate ? (
            <IndeterminateIcon size={size} />
          ) : showLabel ? (
            <span style={getLabelStyle(size)}>{clampedValue}</span>
          ) : null}
        </div>
      )}

      <style>{`
        .gauge-circle {
          animation: gaugeAppear 0.5s ease forwards;
        }
        .gauge-indeterminate svg {
          animation: gaugeIndeterminateSpin 2s linear infinite;
        }
        @keyframes gaugeAppear {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gaugeIndeterminateSpin {
          from { transform: rotate(-90deg); }
          to { transform: rotate(270deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Indeterminate Icon (heartbeat/activity line)
// ============================================================================

function IndeterminateIcon({ size }: { size: number }) {
  const iconSize = Math.max(10, size * 0.5);
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{
        width: iconSize,
        height: iconSize,
        color: "var(--ds-gray-900)",
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.51324 3.62367L3.76375 8.34731C3.61845 8.7396 3.24433 8.99999 2.826 8.99999H0.75H0V7.49999H0.75H2.47799L4.56666 1.86057C4.88684 0.996097 6.10683 0.988493 6.43776 1.84891L10.5137 12.4463L12.2408 8.1286C12.3926 7.74894 12.7604 7.49999 13.1693 7.49999H15.25H16V8.99999H15.25H13.5078L11.433 14.1868C11.0954 15.031 9.8976 15.023 9.57122 14.1744L5.51324 3.62367Z"
        fill="currentColor"
      />
    </svg>
  );
}
