"use client";

import { useCallback, useMemo } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveLinear } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { AreaClosed, Bar, Line, LinePath } from "@visx/shape";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";

interface TrendPoint {
  /** Full ISO YYYY-MM-DD — kept whole (rather than sliced to MM-DD)
   *  so the tick formatter can build "May 19" and the active overlay
   *  can compute "N days ago" without re-parsing. */
  date: string;
  value: number | null;
}

interface ConsentTrendChartProps {
  trend: TrendPoint[];
  metricLabel: string;
  format: "count" | "percent";
}

// Total drawn height of the chart, including all margins / axes.
const CHART_HEIGHT = 400;
// SVG margins reserve room for axis labels.
const MARGIN = { top: 24, right: 32, bottom: 44, left: 56 };
// Fixed pixel gap between the top of the plot area and the top tick
// — gives the line visible headroom and lets a data value above the
// top tick visibly peak into that gap (range padding rather than
// domain inflation: doesn't compress the scaling).
const Y_RANGE_TOP_PADDING = 24;

function formatTickDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function daysAgoLabel(iso: string): string {
  const target = new Date(`${iso}T00:00:00.000Z`);
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);
  const days = Math.round(
    (todayUTC.getTime() - target.getTime()) / 86_400_000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1) return `${days} days ago`;
  return formatTickDate(iso);
}

// Build integer-only Y-axis ticks Vercel-style: pick a nice step
// (1, 2, 5, 10, 20, …) targeting ~5 ticks and let the tick count fall
// out. A fixed tick-count algorithm inflates the upper bound on small
// ranges (max=2 ends up 0,1,2,3,4).
function niceIntegerTicks(points: TrendPoint[]): number[] {
  const dataMax = points.reduce(
    (max, p) => (p.value != null && p.value > max ? p.value : max),
    0,
  );
  if (dataMax <= 0) return [0, 1];
  const targetTicks = 5;
  const rawStep = Math.max(dataMax / (targetTicks - 1), 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  let niceNorm: number;
  if (normalized <= 1) niceNorm = 1;
  else if (normalized <= 2) niceNorm = 2;
  else if (normalized <= 5) niceNorm = 5;
  else niceNorm = 10;
  const step = Math.max(1, Math.round(niceNorm * magnitude));
  const max = Math.ceil(dataMax / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);
  return ticks;
}

export default function ConsentTrendChart(props: ConsentTrendChartProps) {
  return (
    // No outer padding — Vercel's chart panel runs SVG flush against
    // the tile-row's bottom border. Breathing room is provided by the
    // SVG's own MARGIN values.
    <div style={{ position: "relative", height: CHART_HEIGHT }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <ChartInner {...props} width={width} height={CHART_HEIGHT} />
          ) : null
        }
      </ParentSize>
    </div>
  );
}

interface ChartInnerProps extends ConsentTrendChartProps {
  width: number;
  height: number;
}

function ChartInner({
  trend,
  metricLabel,
  format,
  width,
  height,
}: ChartInnerProps) {
  const isPercent = format === "percent";
  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const plotHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 0);

  // Y-axis: nice integer ticks (counts) or fixed 0/25/50/75/100
  // (percent). Domain ends exactly at the top tick value — visible
  // headroom above the highest labelled value comes from the SVG's
  // top margin, not from inflating the domain. Inflating the domain
  // pushes the top tick well below the chart edge and squashes the
  // line; Vercel matches the top tick with the top of the plot
  // area and lets the top margin be the breathing room.
  const yTicks = useMemo(
    () => (isPercent ? [0, 25, 50, 75, 100] : niceIntegerTicks(trend)),
    [isPercent, trend],
  );
  const yDomainMax = isPercent ? 100 : (yTicks[yTicks.length - 1] ?? 1);

  const xScale = useMemo(
    () =>
      scalePoint<string>({
        domain: trend.map((p) => p.date),
        range: [0, plotWidth],
      }),
    [trend, plotWidth],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, yDomainMax],
        // Range tops out at Y_RANGE_TOP_PADDING instead of 0, so the
        // top tick sits that many pixels below the plot area's top
        // and the line has room to peak above the top tick.
        range: [plotHeight, Y_RANGE_TOP_PADDING],
        nice: false,
      }),
    [yDomainMax, plotHeight],
  );

  // Visible X-axis tick dates: every ~7th data point, skipping the
  // very first and very last so the row of dates doesn't crowd the
  // chart's left/right edges.
  const xTickValues = useMemo(() => {
    if (trend.length <= 2) return [];
    const interval = Math.max(1, Math.ceil(trend.length / 7));
    return trend
      .map((p) => p.date)
      .filter((_, i, arr) => {
        if (i === 0 || i === arr.length - 1) return false;
        return i % interval === 0;
      });
  }, [trend]);

  const {
    tooltipData,
    tooltipLeft,
    showTooltip,
    hideTooltip,
  } = useTooltip<TrendPoint>();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const point = localPoint(e);
      if (!point || trend.length === 0) return;
      // Snap to nearest data point by x (scalePoint puts data at
      // even steps across [0, plotWidth]).
      const xInPlot = point.x - MARGIN.left;
      const step = plotWidth / Math.max(trend.length - 1, 1);
      const i = Math.round(xInPlot / step);
      const clamped = Math.max(0, Math.min(trend.length - 1, i));
      const d = trend[clamped];
      const x = xScale(d.date) ?? 0;
      showTooltip({
        tooltipData: d,
        tooltipLeft: MARGIN.left + x,
        tooltipTop: MARGIN.top,
      });
    },
    [plotWidth, trend, xScale, showTooltip],
  );

  const activeX = tooltipData ? (xScale(tooltipData.date) ?? 0) : null;
  const activeY =
    tooltipData && tooltipData.value != null ? yScale(tooltipData.value) : null;

  return (
    <>
      <svg width={width} height={height} style={{ display: "block" }}>
        <defs>
          <linearGradient
            id="consent-trend-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--ds-blue-900)"
              stopOpacity={0.22}
            />
            <stop
              offset="100%"
              stopColor="var(--ds-blue-900)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <GridRows
            scale={yScale}
            width={plotWidth}
            tickValues={yTicks}
            stroke="var(--ds-gray-400)"
            strokeWidth={1}
          />
          <AreaClosed<TrendPoint>
            data={trend}
            x={(d) => xScale(d.date) ?? 0}
            y={(d) => (d.value != null ? yScale(d.value) : yScale(0))}
            yScale={yScale}
            fill="url(#consent-trend-fill)"
            curve={curveLinear}
            defined={(d) => d.value != null}
          />
          <LinePath<TrendPoint>
            data={trend}
            x={(d) => xScale(d.date) ?? 0}
            y={(d) => (d.value != null ? yScale(d.value) : yScale(0))}
            stroke="var(--ds-blue-900)"
            strokeWidth={2}
            curve={curveLinear}
            defined={(d) => d.value != null}
          />
          <AxisLeft
            scale={yScale}
            tickValues={yTicks}
            hideAxisLine
            hideTicks
            tickFormat={(v) =>
              isPercent
                ? `${v as number}%`
                : (v as number).toLocaleString()
            }
            tickLabelProps={() => ({
              fill: "var(--ds-gray-700)",
              fontSize: 12,
              textAnchor: "end",
              dx: -8,
              dy: 4,
            })}
          />
          <AxisBottom
            top={plotHeight}
            scale={xScale}
            hideAxisLine
            hideTicks
            tickValues={xTickValues}
            tickFormat={(d) => formatTickDate(d as string)}
            tickLabelProps={(d) => ({
              fill: "var(--ds-gray-700)",
              fontSize: 12,
              textAnchor: "middle",
              dy: 12,
              // Hide the tick at the hovered x — the HTML overlay
              // below replaces it with "N days ago".
              opacity:
                tooltipData && tooltipData.date === d ? 0 : 1,
            })}
          />
          {activeX != null && (
            <Line
              from={{ x: activeX, y: 0 }}
              to={{ x: activeX, y: plotHeight + 7 }}
              stroke="var(--ds-gray-1000)"
              strokeWidth={2}
              pointerEvents="none"
            />
          )}
          {activeX != null && activeY != null && (
            <circle
              cx={activeX}
              cy={activeY}
              r={4}
              fill="var(--ds-blue-900)"
              pointerEvents="none"
            />
          )}
          <Bar
            x={0}
            y={0}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>

      {tooltipData && tooltipLeft != null && (
        <TooltipWithBounds
          top={MARGIN.top}
          left={tooltipLeft}
          // Symmetric gap on both sides of the cursor: TooltipWithBounds
          // applies offsetLeft as +offsetLeft when placed right and
          // -offsetLeft when flipped left, so passing the gap here
          // (instead of adding +8 to `left`) keeps both sides equal.
          offsetLeft={8}
          offsetTop={0}
          // `unstyled` on visx Tooltip suppresses the style prop
          // entirely (`!unstyled && style`), so we must NOT set it
          // — otherwise our custom styles below never apply and the
          // tooltip box ends up un-positioned and invisible.
          style={{
            position: "absolute",
            background: "var(--ds-background-100)",
            boxShadow: "var(--ds-shadow-tooltip)",
            borderRadius: 6,
            padding: "8px 16px",
            color: "var(--ds-gray-1000)",
            fontSize: 14,
            lineHeight: "20px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "var(--ds-blue-900)",
                }}
              />
              <span style={{ fontWeight: 400 }}>{metricLabel}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                }}
              >
                {tooltipData.value != null
                  ? isPercent
                    ? `${tooltipData.value.toFixed(1)}%`
                    : tooltipData.value.toLocaleString()
                  : "—"}
              </span>
            </div>
            <span style={{ color: "var(--ds-gray-900)" }}>
              {formatTickDate(tooltipData.date)}
            </span>
          </div>
        </TooltipWithBounds>
      )}

      {tooltipData && tooltipLeft != null && (
        <div
          // "N days ago" overlay — flat HTML knockout that replaces
          // the SVG tick at the hovered x. background-100 fill masks
          // any underlying tick label without an obvious tooltip
          // treatment.
          style={{
            position: "absolute",
            left: tooltipLeft,
            top: MARGIN.top + plotHeight + 12,
            transform: "translateX(-50%)",
            background: "var(--ds-background-100)",
            color: "var(--ds-gray-1000)",
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 600,
            padding: "0 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {daysAgoLabel(tooltipData.date)}
        </div>
      )}
    </>
  );
}
