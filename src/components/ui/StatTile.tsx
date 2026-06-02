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
import Link from "next/link";

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

// Chip background + text per direction — Vercel's split-tone model:
//   up / down  → a lighter hue tint (600 @ --chip-alpha, 0.2 default →
//                0.5 on focus) behind the saturated semantic text (700,
//                the Geist success/error red-green). Two tones, not one,
//                so the low-opacity tint reads clean while the text stays
//                vivid. Both flip with the theme via the -value triplet.
//   flat       → a solid neutral pill (gray-200 bg / gray-700 text,
//                the Geist accents-2 / accents-4 equivalents). Solid, so
//                it doesn't respond to --chip-alpha — matches Vercel.
const directionStyles: Record<
  StatTileChangeDirection,
  { background: string; color: string }
> = {
  up: {
    background: "hsla(var(--ds-green-600-value), var(--chip-alpha))",
    color: "var(--ds-green-700)",
  },
  down: {
    background: "hsla(var(--ds-red-600-value), var(--chip-alpha))",
    color: "var(--ds-red-700)",
  },
  flat: {
    background: "var(--ds-gray-200)",
    color: "var(--ds-gray-700)",
  },
};

// Tiny focus-aware pill that holds the trend %. Bg alpha is driven
// by a custom property so the focus-visible bump can change it
// declaratively (CSS variable cascade) rather than via state.
function ChangeChip({ change }: { change: StatTileChange }) {
  const { background, color } = directionStyles[change.direction];
  const chip = (
    <span
      tabIndex={change.ariaLabel ? 0 : undefined}
      role={change.ariaLabel ? "button" : undefined}
      aria-label={change.ariaLabel ?? change.value}
      // Stop the click from bubbling into the parent <a> (when the
      // tile is acting as a tab) — clicking the chip should reveal
      // its tooltip, not navigate. preventDefault keeps the focus
      // ring visible without the parent link stealing the click.
      onClick={
        change.ariaLabel
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined
      }
      // Vercel uses :focus (mouse + keyboard) so clicking shows the
      // ring too — :focus-visible would skip the mouse case.
      className="font-semibold text-center outline-none focus:[--chip-alpha:0.5] focus:shadow-[0_0_0_1px_var(--ds-gray-1000)]"
      style={{
        minWidth: 46,
        padding: 6,
        borderRadius: 6,
        fontSize: 12,
        lineHeight: "16px",
        // Custom property defaults to 0.2; bumps to 0.5 on focus
        // via the className above (CSS variable cascade, no state).
        ["--chip-alpha" as string]: 0.2,
        background,
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
  // Standalone: paint surface (bg-100, the group's canvas).
  // Tab inactive: bg-canvas (bg-200, the recessed page tone) so the
  //   inactive tabs read as a recessed tray — Vercel's bg-background-200.
  // Tab active: pop to surface (bg-100) flush with the chart panel
  //   below, marked by a gray-1000 bottom rule.
  const background = isTab
    ? active
      ? "hsl(var(--color-surface))"
      : "hsl(var(--color-canvas))"
    : "hsl(var(--color-surface))";
  // Inactive tabs dim only the value number (Vercel keeps the title at
  // full strength), via opacity on that span alone — not the whole tile.
  const muted = isTab && !active;

  const body = (
    <>
      <span className="text-heading-14 text-textSubtle truncate" title={label}>
        {label}
      </span>
      <div className="flex flex-row items-center gap-4">
        <span
          className="text-heading-32 text-textDefault"
          style={muted ? { opacity: 0.8 } : undefined}
        >
          {value}
        </span>
        {change && <ChangeChip change={change} />}
      </div>
      {hint && (
        <span className="text-copy-13 text-textSubtler">{hint}</span>
      )}
    </>
  );

  if (href) {
    // Next's Link triggers an in-app transition (rather than a full
    // browser navigation), so child Suspense boundaries can stream
    // new data while the previous tile content stays visible —
    // letting NumberTicker tween between old and new values instead
    // of flashing a skeleton.
    // Bottom rule lives in classNames (not inline style) so the inactive
    // tab can show a gray-600 underline on focus — Vercel's
    // `focus:border-b-gray-600`. An inline borderBottom would outrank the
    // focus class and the underline would never appear.
    const borderClass = active
      ? "border-b-2 border-b-[var(--ds-gray-1000)]"
      : "border-b-2 border-b-transparent focus:border-b-[var(--ds-gray-600)]";
    return (
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        {...anchorProps}
        className={`${baseClass} ${linkClass} ${borderClass} ${anchorProps?.className ?? ""}`}
        style={{ background, color: "inherit" }}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className={baseClass} style={{ background }}>
      {body}
    </div>
  );
}

export default StatTile;
