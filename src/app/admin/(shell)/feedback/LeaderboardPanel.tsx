"use client";

import { useState } from "react";

import { Tabs, type TabItem } from "@/components/ui/Tabs";

import CopyPathButton from "./CopyPathButton";

// Row shape consumed by the panel. Keeps the rendering generic
// across Pages (path is a link, copyable) and Topics (text only).
export interface LeaderRow {
  /** Stable React key — usually the same as `label`. */
  key: string;
  /** Displayed text. */
  label: string;
  /** Bar magnitude. */
  total: number;
  /** When set, the label renders as an anchor opening in a new tab
   *  on the same host (so admins can investigate the env they're
   *  looking at, not always production). */
  href?: string;
  /** When set, a hover-revealed copy chip floats against the right
   *  edge of the row. */
  copyValue?: string;
  /** Italic + gray-700 fallback (used for "(no path)" / "(no topic)"
   *  bucket rows). Suppresses href + copy chip. */
  italic?: boolean;
}

export interface LeaderboardTab {
  /** Tab id used by the DS Tabs component's value/onChange. */
  value: string;
  /** Tab label (Title Case, 1–2 words). */
  title: string;
  /** Up-to-N rows pre-sorted server-side. */
  rows: LeaderRow[];
  /** Sentence shown inside the tab when rows.length === 0. */
  emptyMessage: string;
}

interface LeaderboardPanelProps {
  tabs: LeaderboardTab[];
  /** Uppercase column header on the right of the tab strip, e.g.
   *  `Feedback` or `Visitors`. */
  columnHeader: string;
}

export default function LeaderboardPanel({
  tabs,
  columnHeader,
}: LeaderboardPanelProps) {
  const [active, setActive] = useState(tabs[0]?.value ?? "");
  const activeTab = tabs.find((t) => t.value === active) ?? tabs[0];
  const rows = activeTab?.rows ?? [];
  // Bar widths scale to the largest row in the active tab so the
  // leader anchors at full width and the rest scale relative.
  const topTotal = rows[0]?.total ?? 0;

  const dsTabs: TabItem[] = tabs.map((t) => ({
    value: t.value,
    title: t.title,
  }));

  return (
    <div
      style={{
        background: "hsl(var(--color-surface))",
        border: "1px solid hsl(var(--color-borderDefault))",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          padding: "4px 20px 0",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tabs
            tabs={dsTabs}
            value={active}
            onChange={setActive}
            aria-label="Leaderboard categories"
          />
        </div>
        {/* Column header — sits on the same 48px row as the tab strip,
            its bottom edge aligns with the Tabs container's own
            inset-shadow rule so the bottom border reads continuous
            across the panel width. */}
        <span
          style={{
            minWidth: 50,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 1,
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "hsl(var(--color-textSubtle))",
            // Same 1px line the Tabs container's inset shadow paints
            // (gray-200, matching Geist's accents-2 baseline) — extended
            // across the column-header gap to the right edge of the panel.
            boxShadow: "var(--ds-gray-200) 0px -1px 0px 0px inset",
          }}
        >
          {columnHeader}
        </span>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", margin: "8px 0" }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              padding: "24px 32px",
              textAlign: "center",
              color: "hsl(var(--color-textSubtler))",
              fontSize: 14,
              lineHeight: "20px",
            }}
          >
            {activeTab?.emptyMessage ?? "No data in this window."}
          </div>
        ) : (
          rows.map((row) => (
            <LeaderboardRow key={row.key} row={row} topTotal={topTotal} />
          ))
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({
  row,
  topTotal,
}: {
  row: LeaderRow;
  topTotal: number;
}) {
  const widthRatio = topTotal === 0 ? 0 : row.total / topTotal;
  const showLink = !row.italic && !!row.href;
  const showCopy = !row.italic && !!row.copyValue;
  return (
    <div
      className="group/row"
      style={{ position: "relative", width: "100%", padding: "4px 12px" }}
    >
      <div
        style={{
          position: "relative",
          height: 32,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${widthRatio * 100}%`,
            borderRadius: 6,
            background: "var(--ds-gray-200)",
            opacity: 0.4,
            transition: "width 300ms ease",
          }}
          aria-hidden
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            padding: "0 12px",
            gap: 16,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 8,
              overflow: "hidden",
              flex: 1,
              minWidth: 0,
            }}
          >
            {showLink ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener"
                style={{
                  fontSize: 14,
                  lineHeight: "32px",
                  color: "hsl(var(--color-textDefault))",
                  textDecoration: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                  display: "block",
                }}
                title={row.label}
              >
                {row.label}
              </a>
            ) : (
              <span
                style={{
                  fontSize: 14,
                  lineHeight: "32px",
                  color: row.italic
                    ? "hsl(var(--color-textSubtler))"
                    : "hsl(var(--color-textDefault))",
                  fontStyle: row.italic ? "italic" : "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                }}
                title={row.label}
              >
                {row.label}
              </span>
            )}
            {showCopy && (
              <div
                className="opacity-0 group-hover/row:opacity-100"
                style={{
                  position: "absolute",
                  top: 4,
                  bottom: 4,
                  right: 4,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                  background: "hsl(var(--color-surface))",
                  borderRadius: 6,
                  transition: "opacity 0.15s ease",
                }}
              >
                <CopyPathButton value={row.copyValue!} />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              minWidth: 50,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 14,
                lineHeight: "20px",
                fontWeight: 600,
                color: "hsl(var(--color-textDefault))",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {row.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
