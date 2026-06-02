// src/components/ui/StatTileGroup.tsx
//
// Packs StatTile children into a single rounded bordered container
// with hairline internal dividers — the "connected stat row" pattern
// from the DS. Mirrors the canonical financial-dashboard treatment:
// the group owns the border; individual tiles are unbordered cells
// that paint dividers via CSS borders on themselves.

"use client";

import { Children, type ReactNode } from "react";

export interface StatTileGroupProps {
  /** StatTile children. */
  children: ReactNode;
  /** Tiles per row. Defaults to the number of children (single row). */
  columns?: number;
}

export function StatTileGroup({ children, columns }: StatTileGroupProps) {
  const items = Children.toArray(children);
  const cols = columns ?? items.length;

  return (
    <div
      style={{
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgb(var(--color-surface))",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {items.map((child, i) => {
          const isLastInRow = (i + 1) % cols === 0;
          const isInLastRow = i >= items.length - (items.length % cols || cols);
          return (
            <div
              key={i}
              style={{
                borderRight: isLastInRow
                  ? "none"
                  : "1px solid var(--ds-gray-400)",
                borderBottom: isInLastRow
                  ? "none"
                  : "1px solid var(--ds-gray-400)",
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatTileGroup;
