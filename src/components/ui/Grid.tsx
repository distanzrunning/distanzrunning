"use client";

import React from "react";

// ============================================================================
// Grid — Geist's cell-and-guide layout system
// ============================================================================
// A two-dimensional grid that draws hairline *guides* between cells. Cells can
// span multiple rows/columns; the interior guide lines they cover are clipped
// automatically (matching Geist — solid just adds the opaque fill on top).
// `rows`/`columns` accept a single number or a responsive `{ sm, md, lg }`
// object, and the guide layers reflow with the grid at each breakpoint.
// Optional `cross` markers sit at grid-line intersections; `dashed` / `debug`
// switch the guide style.
//
//   <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
//     <GridCell column={{ sm: "1", md: "1 / 3" }} row={{ sm: "1 / 3" }} solid>
//       1 + 2
//     </GridCell>
//   </Grid>

// Breakpoints match the DS grid system (see CLAUDE.md): md ≥ 600px, lg ≥ 960px.
type Breakpoint = "sm" | "md" | "lg";
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export interface GridProps {
  /** Column count — number, or `{ sm, md, lg }` to reflow at breakpoints. */
  columns: Responsive<number>;
  /** Row count — number, or `{ sm, md, lg }` to reflow at breakpoints. */
  rows: Responsive<number>;
  /** Hide the horizontal (row) guide lines. */
  hideRowGuides?: boolean;
  /** Hide the vertical (column) guide lines. */
  hideColumnGuides?: boolean;
  /** Square cells (1fr rows + matching aspect-ratio) rather than auto height. */
  squareCells?: boolean;
  /** Dashed guides + frame (Geist `systemDashed`). */
  dashed?: boolean;
  /** Debug mode: amber guides with faint dashed frame edges. */
  debug?: boolean;
  /** Cross markers at grid-line intersections (1-based line indices). */
  cross?: Array<{ row: number; column: number }>;
  /** Draw the guide lines + frame border (default true). Off → plain block. */
  showGuides?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Applied to the outer frame element (border, background…). */
  style?: React.CSSProperties;
  /** Applied to the inner grid `<section>` (e.g. an explicit grid-template-rows). */
  gridStyle?: React.CSSProperties;
}

export interface GridCellProps {
  /** Grid row placement (e.g. "1 / 3", "auto"), or `{ sm, md, lg }`. */
  row?: Responsive<string>;
  /** Grid column placement (e.g. "1 / 3", "auto"), or `{ sm, md, lg }`. */
  column?: Responsive<string>;
  /** Opaque fill (bg-surface) that sits over the guides it covers. */
  solid?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// Responsive helpers — resolve a value into { sm, md, lg } with md←sm, lg←md.
// ============================================================================

function resolveResp<T>(
  v: Responsive<T> | undefined,
  fallback: T,
): Record<Breakpoint, T> {
  if (v == null) return { sm: fallback, md: fallback, lg: fallback };
  if (typeof v === "object") {
    const o = v as Partial<Record<Breakpoint, T>>;
    const sm = (o.sm ?? fallback) as T;
    const md = (o.md ?? sm) as T;
    const lg = (o.lg ?? md) as T;
    return { sm, md, lg };
  }
  return { sm: v as T, md: v as T, lg: v as T };
}

// Parse a grid-placement string into [startLine, endLine] (1-based), honouring
// `span N` and negative line indices (`-1` = last line). Returns null for auto.
function parseSpan(v: string | undefined, count: number): [number, number] | null {
  if (!v || v === "auto") return null;
  const parts = v.split("/").map((s) => s.trim());
  let a = parseInt(parts[0], 10);
  if (Number.isNaN(a)) return null;
  if (a <= 0) a = count + 2 + a;
  let b: number;
  if (parts.length === 1) {
    b = a + 1;
  } else if (parts[1].startsWith("span")) {
    b = a + parseInt(parts[1].replace("span", "").trim(), 10);
  } else {
    b = parseInt(parts[1], 10);
    if (b <= 0) b = count + 2 + b;
  }
  if (Number.isNaN(b)) return null;
  return [a, b];
}

interface ResolvedCell {
  col: string;
  row: string;
  solid: boolean;
}

// Compute the set of guide borders to drop at one breakpoint: the interior
// lines covered by each *solid* cell's span (Geist only clips under `solid`
// cells — non-solid spanning cells let the guides draw through), plus
// everything when a guide axis is hidden.
function computeClips(
  cells: ResolvedCell[],
  cols: number,
  rows: number,
  hideRow?: boolean,
  hideColumn?: boolean,
) {
  const noRight = new Set<string>();
  const noBottom = new Set<string>();

  if (hideColumn) {
    for (let y = 1; y <= rows; y++)
      for (let x = 1; x <= cols; x++) noRight.add(`${x},${y}`);
  }
  if (hideRow) {
    for (let y = 1; y <= rows; y++)
      for (let x = 1; x <= cols; x++) noBottom.add(`${x},${y}`);
  }

  for (const cell of cells) {
    if (!cell.solid) continue;
    const colSpan = parseSpan(cell.col, cols);
    const rowSpan = parseSpan(cell.row, rows);
    if (!colSpan || !rowSpan) continue;
    const [ca, cb] = colSpan;
    const [ra, rb] = rowSpan;
    // Interior vertical lines: right border of guide cols ca..cb-2, rows ra..rb-1.
    for (let x = ca; x <= cb - 2; x++)
      for (let r = ra; r <= rb - 1; r++) noRight.add(`${x},${r}`);
    // Interior horizontal lines: bottom border of guide rows ra..rb-2, cols ca..cb-1.
    for (let y = ra; y <= rb - 2; y++)
      for (let c = ca; c <= cb - 1; c++) noBottom.add(`${c},${y}`);
  }

  return { noRight, noBottom };
}

// ============================================================================
// Scoped CSS — media queries + comma-bearing values can't live inline (our
// Tailwind v3 mis-compiles stacked arbitrary variants), so they go here.
// ============================================================================

const GRID_CSS = `
  .ds-grid-system {
    --ds-grid-guide-color: var(--ds-gray-400);
    --ds-grid-guide-style: solid;
    --guide-width: 1px;
    position: relative;
    width: 100%;
    border: var(--guide-width) var(--ds-grid-guide-style) var(--ds-grid-guide-color);
  }
  .ds-grid-system.ds-grid-dashed { --ds-grid-guide-style: dashed; }
  .ds-grid-system.ds-grid-debug { --ds-grid-guide-color: rgba(255, 204, 109, 0.7); }
  .ds-grid-system.ds-grid-no-frame { border: none; }

  .ds-grid {
    position: relative;
    display: grid;
    width: 100%;
    grid-template-columns: var(--sm-col-template);
    grid-template-rows: var(--sm-row-template);
    aspect-ratio: var(--sm-aspect);
    --cols: var(--sm-cols);
    --rows: var(--sm-rows);
  }
  @media (min-width: 600px) {
    .ds-grid {
      grid-template-columns: var(--md-col-template);
      grid-template-rows: var(--md-row-template);
      aspect-ratio: var(--md-aspect);
      --cols: var(--md-cols);
      --rows: var(--md-rows);
    }
  }
  @media (min-width: 960px) {
    .ds-grid {
      grid-template-columns: var(--lg-col-template);
      grid-template-rows: var(--lg-row-template);
      aspect-ratio: var(--lg-aspect);
      --cols: var(--lg-cols);
      --rows: var(--lg-rows);
    }
  }

  .ds-grid-cell {
    position: relative;
    z-index: 2;
    grid-column: var(--sm-col);
    grid-row: var(--sm-row);
    padding: 48px;
    overflow: hidden;
    font-size: 1rem;
    color: hsl(var(--color-textDefault));
  }
  @media (min-width: 600px) {
    .ds-grid-cell { grid-column: var(--md-col); grid-row: var(--md-row); }
  }
  @media (min-width: 960px) {
    .ds-grid-cell { grid-column: var(--lg-col); grid-row: var(--lg-row); }
  }
  .ds-grid-cell-solid { background: hsl(var(--color-surface)); }

  /* Guides are absolutely-positioned grid items in the same grid, so they align
     to the (possibly auto-height) cell rows. One layer per breakpoint. */
  .ds-grid-guide {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    border-right: var(--guide-width) var(--ds-grid-guide-style) var(--ds-grid-guide-color);
    border-bottom: var(--guide-width) var(--ds-grid-guide-style) var(--ds-grid-guide-color);
  }
  .ds-grid-guide[data-no-right] { border-right: none; }
  .ds-grid-guide[data-no-bottom] { border-bottom: none; }
  .ds-grid-guide[data-frame-right] { border-right: none; }
  .ds-grid-guide[data-frame-bottom] { border-bottom: none; }
  .ds-grid-debug .ds-grid-guide[data-frame-right] {
    border-right: var(--guide-width) dashed rgba(255, 204, 109, 0.15);
  }
  .ds-grid-debug .ds-grid-guide[data-frame-bottom] {
    border-bottom: var(--guide-width) dashed rgba(255, 204, 109, 0.15);
  }

  .ds-grid-guide-sm { display: block; }
  .ds-grid-guide-md, .ds-grid-guide-lg { display: none; }
  @media (min-width: 600px) {
    .ds-grid-guide-sm { display: none; }
    .ds-grid-guide-md { display: block; }
  }
  @media (min-width: 960px) {
    .ds-grid-guide-md { display: none; }
    .ds-grid-guide-lg { display: block; }
  }

  /* Cross markers — two perpendicular hairlines forming a + centred on a node.
     Sizes are Geist-verbatim (--cross-size 11px, half-size formula). */
  .ds-grid-cross {
    --cross-size: 11px;
    --cross-half-size: calc(var(--cross-size) / 2 + var(--guide-width) - 0.5px);
    position: absolute;
    z-index: 4;
    width: var(--cross-size);
    height: var(--cross-size);
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  .ds-grid-cross-line {
    position: absolute;
    top: 0;
    left: 0;
    border-color: var(--ds-grid-guide-color);
    border-style: var(--ds-grid-guide-style);
    border-width: 0;
  }
  .ds-grid-cross-line-v {
    width: var(--cross-half-size);
    height: var(--cross-size);
    border-right-width: var(--guide-width);
  }
  .ds-grid-cross-line-h {
    width: var(--cross-size);
    height: var(--cross-half-size);
    border-bottom-width: var(--guide-width);
  }
`;

// ============================================================================
// Guide layer
// ============================================================================

function GuideLayer({
  bp,
  cols,
  rows,
  clips,
}: {
  bp: Breakpoint;
  cols: number;
  rows: number;
  clips: { noRight: Set<string>; noBottom: Set<string> };
}) {
  const items: React.ReactNode[] = [];
  for (let y = 1; y <= rows; y++) {
    for (let x = 1; x <= cols; x++) {
      const key = `${x},${y}`;
      const frameRight = x === cols;
      const frameBottom = y === rows;
      items.push(
        <div
          key={`${bp}-${key}`}
          aria-hidden="true"
          className={`ds-grid-guide ds-grid-guide-${bp}`}
          data-no-right={!frameRight && clips.noRight.has(key) ? "" : undefined}
          data-no-bottom={!frameBottom && clips.noBottom.has(key) ? "" : undefined}
          data-frame-right={frameRight ? "" : undefined}
          data-frame-bottom={frameBottom ? "" : undefined}
          style={{ gridColumn: `${x} / ${x + 1}`, gridRow: `${y} / ${y + 1}` }}
        />,
      );
    }
  }
  return <>{items}</>;
}

// ============================================================================
// Grid
// ============================================================================

export function Grid({
  columns,
  rows,
  hideRowGuides = false,
  hideColumnGuides = false,
  squareCells = false,
  dashed = false,
  debug = false,
  cross,
  showGuides = true,
  children,
  className,
  style,
  gridStyle,
}: GridProps) {
  const C = resolveResp(columns, 1);
  const R = resolveResp(rows, 1);

  // Pull row/column off each GridCell child to compute per-breakpoint clipping.
  const cells: Record<Breakpoint, ResolvedCell>[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || child.type !== GridCell) return;
    const props = child.props as GridCellProps;
    const col = resolveResp(props.column, "auto");
    const row = resolveResp(props.row, "auto");
    const solid = Boolean(props.solid);
    cells.push({
      sm: { col: col.sm, row: row.sm, solid },
      md: { col: col.md, row: row.md, solid },
      lg: { col: col.lg, row: row.lg, solid },
    });
  });

  const bps: Breakpoint[] = ["sm", "md", "lg"];
  const clips = {
    sm: computeClips(
      cells.map((c) => c.sm),
      C.sm,
      R.sm,
      hideRowGuides,
      hideColumnGuides,
    ),
    md: computeClips(
      cells.map((c) => c.md),
      C.md,
      R.md,
      hideRowGuides,
      hideColumnGuides,
    ),
    lg: computeClips(
      cells.map((c) => c.lg),
      C.lg,
      R.lg,
      hideRowGuides,
      hideColumnGuides,
    ),
  };

  const colTemplate = (bp: Breakpoint) => `repeat(${C[bp]}, minmax(0, 1fr))`;
  const rowTemplate = (bp: Breakpoint) =>
    squareCells ? `repeat(${R[bp]}, minmax(0, 1fr))` : `repeat(${R[bp]}, auto)`;
  const aspect = (bp: Breakpoint) =>
    squareCells ? `${C[bp]} / ${R[bp]}` : "auto";

  const sectionStyle = {
    "--sm-cols": C.sm,
    "--md-cols": C.md,
    "--lg-cols": C.lg,
    "--sm-rows": R.sm,
    "--md-rows": R.md,
    "--lg-rows": R.lg,
    "--sm-col-template": colTemplate("sm"),
    "--md-col-template": colTemplate("md"),
    "--lg-col-template": colTemplate("lg"),
    "--sm-row-template": rowTemplate("sm"),
    "--md-row-template": rowTemplate("md"),
    "--lg-row-template": rowTemplate("lg"),
    "--sm-aspect": aspect("sm"),
    "--md-aspect": aspect("md"),
    "--lg-aspect": aspect("lg"),
    ...gridStyle,
  } as React.CSSProperties;

  return (
    <div
      className={`ds-grid-system${debug ? " ds-grid-debug" : ""}${
        dashed ? " ds-grid-dashed" : ""
      }${showGuides ? "" : " ds-grid-no-frame"}${className ? ` ${className}` : ""}`}
      style={style}
    >
      <style>{GRID_CSS}</style>
      <section className="ds-grid" style={sectionStyle}>
        {children}
        {cross?.map((c, i) => (
          <div
            key={`cross-${i}`}
            aria-hidden="true"
            className="ds-grid-cross"
            style={{
              left: `calc(100% * (${c.column} - 1) / var(--cols))`,
              top: `calc(100% * (${c.row} - 1) / var(--rows))`,
            }}
          >
            <span className="ds-grid-cross-line ds-grid-cross-line-v" />
            <span className="ds-grid-cross-line ds-grid-cross-line-h" />
          </div>
        ))}
        {showGuides &&
          bps.map((bp) => (
            <GuideLayer
              key={bp}
              bp={bp}
              cols={C[bp]}
              rows={R[bp]}
              clips={clips[bp]}
            />
          ))}
      </section>
    </div>
  );
}

// ============================================================================
// GridCell
// ============================================================================

export function GridCell({
  row,
  column,
  solid = false,
  children,
  className,
  style,
}: GridCellProps) {
  const C = resolveResp(column, "auto");
  const R = resolveResp(row, "auto");
  return (
    <div
      className={`ds-grid-cell${solid ? " ds-grid-cell-solid" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={
        {
          "--sm-col": C.sm,
          "--md-col": C.md,
          "--lg-col": C.lg,
          "--sm-row": R.sm,
          "--md-row": R.md,
          "--lg-row": R.lg,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
