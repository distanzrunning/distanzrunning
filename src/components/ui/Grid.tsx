"use client";

import React from "react";

// ============================================================================
// Types
// ============================================================================

export interface GridProps {
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Show guide lines (default true) */
  showGuides?: boolean;
  /** Hide horizontal row guide lines */
  hideRowGuides?: boolean;
  /** Hide vertical column guide lines */
  hideColumnGuides?: boolean;
  /** Use square aspect ratio for cells based on columns/rows */
  squareCells?: boolean;
  /** Debug mode: amber guide lines with dashed edges */
  debug?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface GridCellProps {
  /** Grid row placement (e.g. "1 / 3", "auto") */
  row?: string;
  /** Grid column placement (e.g. "1 / 3", "auto") */
  column?: string;
  /** Whether this cell has a solid background that occludes guides */
  solid?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// Guide colors
// ============================================================================

const GUIDE_COLOR = "var(--ds-gray-400)";
const DEBUG_COLOR = "rgba(255, 204, 109, 0.7)";
const DEBUG_EDGE_COLOR = "rgba(255, 204, 109, 0.1)";

// ============================================================================
// Guide Overlay
// ============================================================================

function GridGuides({
  rows,
  columns,
  hideRowGuides,
  hideColumnGuides,
  debug,
}: {
  rows: number;
  columns: number;
  hideRowGuides?: boolean;
  hideColumnGuides?: boolean;
  debug?: boolean;
}) {
  const guides = [];
  for (let y = 1; y <= rows; y++) {
    for (let x = 1; x <= columns; x++) {
      const isLastCol = x === columns;
      const isLastRow = y === rows;
      const hideRight = isLastCol || hideColumnGuides;
      const hideBottom = isLastRow || hideRowGuides;

      let borderRight: string;
      let borderBottom: string;

      if (debug) {
        borderRight = hideRight
          ? `1px dashed ${DEBUG_EDGE_COLOR}`
          : `1px solid ${DEBUG_COLOR}`;
        borderBottom = hideBottom
          ? `1px dashed ${DEBUG_EDGE_COLOR}`
          : `1px solid ${DEBUG_COLOR}`;
      } else {
        borderRight = hideRight ? "none" : `1px solid ${GUIDE_COLOR}`;
        borderBottom = hideBottom ? "none" : `1px solid ${GUIDE_COLOR}`;
      }

      guides.push(
        <div
          key={`guide-${x}-${y}`}
          aria-hidden="true"
          style={{
            gridColumn: x,
            gridRow: y,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRight,
              borderBottom,
              pointerEvents: "none",
            }}
          />
        </div>
      );
    }
  }
  return (
    <div aria-hidden="true" style={{ display: "contents", pointerEvents: "none" }}>
      {guides}
    </div>
  );
}

// ============================================================================
// Grid Component
// ============================================================================

export function Grid({
  rows,
  columns,
  showGuides = true,
  hideRowGuides = false,
  hideColumnGuides = false,
  squareCells = false,
  debug = false,
  children,
  className,
  style,
}: GridProps) {
  const borderColor = debug ? DEBUG_COLOR : GUIDE_COLOR;

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        position: "relative",
        width: "100%",
        border: `1px solid ${borderColor}`,
        ...(squareCells ? { aspectRatio: `${columns} / ${rows}` } : {}),
        ...style,
      }}
    >
      {/* Cells first, then guides — matches Geist DOM order */}
      {children}
      {showGuides && (
        <GridGuides
          rows={rows}
          columns={columns}
          hideRowGuides={hideRowGuides}
          hideColumnGuides={hideColumnGuides}
          debug={debug}
        />
      )}
    </div>
  );
}

// ============================================================================
// GridCell Component
// ============================================================================

export function GridCell({
  row,
  column,
  solid = false,
  children,
  className,
  style,
}: GridCellProps) {
  return (
    <div
      className={className}
      style={{
        gridRow: row || "auto",
        gridColumn: column || "auto",
        display: "block",
        padding: 48,
        marginRight: 1,
        marginBottom: 1,
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
        fontSize: "1rem",
        color: "var(--ds-gray-1000)",
        ...(solid ? { backgroundColor: "var(--ds-background-100)" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
