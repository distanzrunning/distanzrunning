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

const directionStyles: Record<
  StatTileChangeDirection,
  { bg: string; color: string }
> = {
  up: { bg: "var(--ds-green-200)", color: "var(--ds-green-900)" },
  down: { bg: "var(--ds-red-200)", color: "var(--ds-red-900)" },
  flat: { bg: "var(--ds-gray-200)", color: "var(--ds-gray-900)" },
};

const baseClass =
  "relative flex flex-col gap-2 p-6 transition-colors box-border";
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
  // Standalone: stay on the group's canvas (background-100).
  // Tab inactive: recess to background-200 with a muted title.
  // Tab active: pop to background-100 with a black bottom rule.
  const background = isTab
    ? active
      ? "var(--ds-background-100)"
      : "var(--ds-background-200)"
    : "var(--ds-background-100)";
  const muted = isTab && !active;

  const body = (
    <>
      <span
        className="text-label-12 font-medium uppercase tracking-wide text-[color:var(--ds-gray-700)]"
        style={muted ? { opacity: 0.8 } : undefined}
      >
        {label}
      </span>
      <span
        className="text-heading-32 text-[color:var(--ds-gray-1000)]"
        style={muted ? { opacity: 0.8 } : undefined}
      >
        {value}
      </span>
      {hint && (
        <span
          className="text-copy-13 text-[color:var(--ds-gray-700)] pr-16"
          style={muted ? { opacity: 0.8 } : undefined}
        >
          {hint}
        </span>
      )}
      {change && (
        <span
          aria-label={change.ariaLabel ?? change.value}
          className="text-label-12 font-medium absolute"
          style={{
            right: 16,
            bottom: 16,
            padding: "2px 8px",
            borderRadius: 9999,
            background: directionStyles[change.direction].bg,
            color: directionStyles[change.direction].color,
            whiteSpace: "nowrap",
          }}
        >
          {change.value}
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
