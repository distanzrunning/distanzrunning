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
// Guide Overlay
// ============================================================================

function GridGuides({
  rows,
  columns,
  hideRowGuides,
  hideColumnGuides,
}: {
  rows: number;
  columns: number;
  hideRowGuides?: boolean;
  hideColumnGuides?: boolean;
}) {
  const guides = [];
  for (let y = 1; y <= rows; y++) {
    for (let x = 1; x <= columns; x++) {
      const isLastCol = x === columns;
      const isLastRow = y === rows;
      guides.push(
        <div
          key={`guide-${x}-${y}`}
          aria-hidden="true"
          style={{
            gridColumn: x,
            gridRow: y,
            borderRight:
              isLastCol || hideColumnGuides
                ? "none"
                : "1px solid var(--ds-gray-alpha-400)",
            borderBottom:
              isLastRow || hideRowGuides
                ? "none"
                : "1px solid var(--ds-gray-alpha-400)",
            pointerEvents: "none",
            minHeight: 0,
          }}
        />
      );
    }
  }
  return <>{guides}</>;
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
  children,
  className,
  style,
}: GridProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        position: "relative",
        width: "100%",
        ...(squareCells ? { aspectRatio: `${columns} / ${rows}` } : {}),
        ...style,
      }}
    >
      {showGuides && (
        <GridGuides
          rows={rows}
          columns={columns}
          hideRowGuides={hideRowGuides}
          hideColumnGuides={hideColumnGuides}
        />
      )}
      {children}
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        position: "relative",
        zIndex: 1,
        fontSize: "0.875rem",
        color: "var(--ds-gray-900)",
        ...(solid ? { backgroundColor: "var(--ds-background-100)" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
