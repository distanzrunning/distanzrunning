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
//             so the pill sits flush with the hint baseline
//
// Interactivity:
//   - Pass `href` to render the tile as an <a>; the whole cell
//     becomes a hit target. Use it to filter the dashboard below
//     the tile group — set `active` on the matching tile and clear
//     by linking back to the un-filtered URL when active.

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
  /** When set, the tile renders as an <a> and the entire cell is
   *  clickable — used by dashboards to toggle a filter. */
  href?: string;
  /** Visual emphasis for the currently-applied filter / selection.
   *  Slightly darker background + ring; combine with `href` so the
   *  active tile links back to the un-filtered URL. */
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

const baseClass = "relative flex flex-col gap-2 p-6 transition-colors";
const linkClass =
  "no-underline outline-none cursor-pointer hover:bg-[var(--ds-gray-100)] focus-visible:bg-[var(--ds-gray-100)]";

export function StatTile({
  label,
  value,
  hint,
  change,
  href,
  active,
  anchorProps,
}: StatTileProps) {
  const background = active
    ? "var(--ds-gray-100)"
    : "var(--ds-background-100)";

  const body = (
    <>
      {/* Active accent — 2px top bar; positioned inside the tile so
          it doesn't fight the group's outer border. */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "var(--ds-gray-1000)",
          }}
        />
      )}
      <span className="text-label-12 font-medium uppercase tracking-wide text-[color:var(--ds-gray-700)]">
        {label}
      </span>
      <span className="text-heading-32 text-[color:var(--ds-gray-1000)]">
        {value}
      </span>
      {hint && (
        <span className="text-copy-13 text-[color:var(--ds-gray-700)] pr-16">
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
        style={{ background, color: "inherit" }}
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
