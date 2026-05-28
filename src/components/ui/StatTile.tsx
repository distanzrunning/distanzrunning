// src/components/ui/StatTile.tsx
//
// Dashboard stat tile — designed to be packed into a StatTileGroup
// so multiple tiles share a single outer border with hairline
// internal dividers. The tile itself has no border; the group
// supplies that.
//
// Anatomy:
//   - label   small uppercase column header
//   - value   primary number / percentage
//   - hint    optional secondary line below the value
//   - change  optional trend pill (green = up, red = down,
//             gray = flat) absolute-positioned to the bottom-right
//
// Two modes:
//   - Standalone (no `href`)  — passive display tile.
//   - Tab (`href` set)        — clickable; renders as <a>. Inactive
//                                tabs sit on background-200 with a
//                                muted title; the active tab pops to
//                                background-100 with a gray-1000 bar
//                                along its bottom edge, the canonical
//                                "selected" treatment that pairs with
//                                a chart / detail surface below.

"use client";

import { type AnchorHTMLAttributes, type ReactNode } from "react";

import { Tooltip } from "./Tooltip";

export type StatTileChangeDirection = "up" | "down" | "flat";

export interface StatTileChange {
  /** Display text — e.g. "+8.4%", "-1.2%", "0%". */
  value: string;
  /** Drives the pill color. */
  direction: StatTileChangeDirection;
  /** Accessible description — e.g. "8.4% increase vs last month". */
  ariaLabel?: string;
}

export interface StatTileProps {
  /** Small uppercase column header. */
  label: string;
  /** Primary stat value. */
  value: ReactNode;
  /** Optional secondary line below the value. */
  hint?: ReactNode;
  /** Optional change pill (positive / negative / flat). */
  change?: StatTileChange;
  /** When set, the tile renders as an <a> and is a clickable tab. */
  href?: string;
  /** Marks the currently-selected tab — pairs with `href`. */
  active?: boolean;
  /** Forwarded to the underlying <a> for analytics, rel, target. */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

// Chip color per direction. Background uses the `-rgb` companion of
// the same hue's 900 token, scaled by --chip-alpha (0.2 default, 0.5
// on focus) — matches Vercel's `rgba(R,G,B,var(--trend-background-
// opacity))` pattern and flips correctly in dark mode.
const directionStyles: Record<
  StatTileChangeDirection,
  { rgb: string; color: string }
> = {
  up: { rgb: "var(--ds-green-900-rgb)", color: "var(--ds-green-900)" },
  down: { rgb: "var(--ds-red-900-rgb)", color: "var(--ds-red-900)" },
  flat: { rgb: "var(--ds-gray-900-rgb)", color: "var(--ds-gray-900)" },
};

// Tiny focus-aware pill that holds the trend %. Bg alpha is driven
// by a custom property so the focus-visible bump can change it
// declaratively (CSS variable cascade) rather than via state.
function ChangeChip({ change }: { change: StatTileChange }) {
  const { rgb, color } = directionStyles[change.direction];
  const chip = (
    <span
      tabIndex={change.ariaLabel ? 0 : undefined}
      aria-label={change.ariaLabel ?? change.value}
      className="font-semibold text-center outline-none focus-visible:[--chip-alpha:0.5] focus-visible:shadow-[0_0_0_1px_var(--ds-gray-1000)]"
      style={{
        minWidth: 46,
        padding: 6,
        borderRadius: 6,
        fontSize: 12,
        lineHeight: "16px",
        // Custom property defaults to 0.2; bumps to 0.5 on
        // focus-visible via the className above.
        ["--chip-alpha" as string]: 0.2,
        background: `rgba(${rgb}, var(--chip-alpha))`,
        color,
        whiteSpace: "nowrap",
        cursor: change.ariaLabel ? "pointer" : "default",
      }}
    >
      {change.value}
    </span>
  );
  if (!change.ariaLabel) return chip;
  return (
    <Tooltip content={change.ariaLabel} side="top" align="center">
      {chip}
    </Tooltip>
  );
}

const baseClass =
  "relative flex flex-col gap-2 p-4 transition-colors box-border";
const linkClass =
  "no-underline outline-none cursor-pointer focus-visible:bg-[var(--ds-gray-100)]";

export function StatTile({
  label,
  value,
  hint,
  change,
  href,
  active,
  anchorProps,
}: StatTileProps) {
  const isTab = !!href;
  // Standalone: paint background-100 (the group's canvas).
  // Tab inactive: transparent — let the parent tab-row's bg-200
  //   show through so all inactive tabs share one continuous canvas.
  // Tab active: pop to background-100 with a black bottom rule.
  const background = isTab
    ? active
      ? "var(--ds-background-100)"
      : "transparent"
    : "var(--ds-background-100)";
  const muted = isTab && !active;

  const body = (
    <>
      <span
        className="text-heading-14 text-[color:var(--ds-gray-900)] truncate"
        style={muted ? { opacity: 0.8 } : undefined}
        title={label}
      >
        {label}
      </span>
      <div
        className="flex flex-row items-center gap-4"
        style={muted ? { opacity: 0.8 } : undefined}
      >
        <span className="text-heading-32 text-[color:var(--ds-gray-1000)]">
          {value}
        </span>
        {change && <ChangeChip change={change} />}
      </div>
      {hint && (
        <span
          className="text-copy-13 text-[color:var(--ds-gray-700)]"
          style={muted ? { opacity: 0.8 } : undefined}
        >
          {hint}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-current={active ? "true" : undefined}
        {...anchorProps}
        className={`${baseClass} ${linkClass} ${anchorProps?.className ?? ""}`}
        style={{
          background,
          color: "inherit",
          borderBottom: active
            ? "2px solid var(--ds-gray-1000)"
            : "2px solid transparent",
        }}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={baseClass} style={{ background }}>
      {body}
    </div>
  );
}

export default StatTile;
