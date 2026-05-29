"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveLinear } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { AreaClosed, Bar, Line, LinePath } from "@visx/shape";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";

import {
  businessTodayKey,
  diffBusinessDays,
  msUntilNextBusinessDay,
} from "@/components/admin/datePresets";

export interface TrendPoint {
  /** Full tz day-key "YYYY-MM-DD" — kept whole (rather than sliced
   *  to MM-DD) so the tick formatter can build "May 19" and the
   *  active overlay can compute "N days ago" without re-parsing. */
  date: string;
  value: number | null;
}

interface TrendChartProps {
  trend: TrendPoint[];
  metricLabel: string;
  format: "count" | "percent";
  /** IANA timezone — drives today-detection, tick-label formatting,
   *  and the days-ago pill. Loaded from site_settings server-side
   *  and passed down so server/client agree on a single tz. */
  tz: string;
}

// Total drawn height of the chart, including all margins / axes.
const CHART_HEIGHT = 400;
// SVG margins reserve room for axis labels.
const MARGIN = { top: 24, right: 32, bottom: 44, left: 56 };
// Fixed pixel gap between the top of the plot area and the top tick
// — gives the line visible headroom and lets a data value above the
// top tick visibly peak into that gap (range padding rather than
// domain inflation: doesn't compress the scaling). Only applied in
// count mode — percent mode is capped at 100% and can never peak
// above the top tick, so the headroom would just waste plot area.
const Y_RANGE_TOP_PADDING = 24;
// Shared axis tick styling. 12px isn't a DS text-copy-* slot — it's
// the chart-axis convention used across Vercel-style data viz. Both
// axes spread these into their tickLabelProps so any future change
// (e.g. swapping gray-700 for gray-800) happens in one place.
const AXIS_TICK_STYLE = {
  fill: "var(--ds-gray-700)",
  fontSize: 12,
} as const;

function formatTickDate(iso: string, tz: string): string {
  // `iso` is a tz day-key. Render the label in the same tz — noon
  // UTC is a safe representative of that day at almost any offset
  // (well inside the same calendar day at UTC±12).
  const d = new Date(`${iso}T12:00:00.000Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function daysAgoLabel(iso: string, tz: string): string {
  // `iso` and `businessTodayKey(tz)` are both tz day-keys, so
  // diffBusinessDays gives a clean calendar-day diff (no DST drift).
  const todayKey = businessTodayKey(tz);
  const days = diffBusinessDays(todayKey, iso);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 1) return formatTickDate(iso, tz);
  // Calendar-exact month/year promotion: only label a date as
  // "N months ago" if it actually sits N calendar months back
  // (same day-of-month). A 60-day historical view no longer
  // misreads as "2 months ago" — it stays "60 days ago".
  const [ty, tm, td] = todayKey.split("-").map(Number);
  const [iy, im, id] = iso.split("-").map(Number);
  if (td === id) {
    const monthDiff = (ty - iy) * 12 + (tm - im);
    if (monthDiff > 0 && monthDiff % 12 === 0) {
      const years = monthDiff / 12;
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
    if (monthDiff > 0) {
      return monthDiff === 1 ? "1 month ago" : `${monthDiff} months ago`;
    }
  }
  if (days % 7 === 0) {
    const weeks = days / 7;
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  return `${days} days ago`;
}

// Predicate that decides whether a Brussels day-key qualifies as an
// X-axis tick. Cadence widens with window length so the axis never
// holds more than ~15 labels.
function pickTickCadence(lengthDays: number): (iso: string) => boolean {
  if (lengthDays < 120) {
    return (iso) =>
      // Noon-UTC representative — same Brussels day at UTC+1/+2.
      // getUTCDay: 0=Sun, 1=Mon, …, 6=Sat.
      new Date(`${iso}T12:00:00.000Z`).getUTCDay() === 1;
  }
  if (lengthDays < 730) {
    return (iso) => iso.slice(8, 10) === "01";
  }
  return (iso) => {
    const month = iso.slice(5, 7);
    return iso.slice(8, 10) === "01" && (month === "01" || month === "07");
  };
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

export default function TrendChart(props: TrendChartProps) {
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

interface ChartInnerProps extends TrendChartProps {
  width: number;
  height: number;
}

function ChartInner({
  trend,
  metricLabel,
  format,
  tz,
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

  const yRangeTop = isPercent ? 0 : Y_RANGE_TOP_PADDING;
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, yDomainMax],
        // Range tops out at yRangeTop instead of 0, so the top tick
        // sits that many pixels below the plot area's top and the
        // line has room to peak above the top tick. Zero in percent
        // mode (no peaking possible past 100%).
        range: [plotHeight, yRangeTop],
        nice: false,
      }),
    [yDomainMax, plotHeight, yRangeTop],
  );

  // Visible X-axis tick dates. Anchored on real calendar boundaries
  // (Mondays / month starts / half-year starts) rather than walked
  // back from "today", so a historical custom range gets the same
  // clean cadence as a trailing-today range.
  //   - ≤ 10 points: every day, edges included
  //   - < ~120 days: every Monday (EU week start)
  //   - < ~730 days: 1st of each month
  //   - longer: Jan 1 / Jul 1
  // EDGE_GAP drops ticks within 2 days of either edge so labels
  // don't crowd the chart border.
  const xTickValues = useMemo(() => {
    if (trend.length <= 2) return trend.map((p) => p.date);
    if (trend.length <= 10) return trend.map((p) => p.date);
    const EDGE_GAP = 2;
    const matches = pickTickCadence(trend.length);
    const indices: number[] = [];
    for (let i = 0; i < trend.length; i++) {
      if (!matches(trend[i].date)) continue;
      if (i < EDGE_GAP) continue;
      if (i > trend.length - 1 - EDGE_GAP) continue;
      indices.push(i);
    }
    return indices.map((i) => trend[i].date);
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

  // Today's segment is dashed (Vercel convention) — today's bucket is
  // still filling, so the slope into it isn't final. Only dash when
  // the trend actually ends today; a historical custom range stays
  // fully solid. "Today" is the tz day, matching how the dashboard
  // buckets rows. A one-shot timer fires at the next tz midnight so
  // a long-open tab rolls over instead of
  // sticking on yesterday.
  const [todayIso, setTodayIso] = useState<string>(() => businessTodayKey(tz));
  useEffect(() => {
    // +1s buffer so we read businessTodayKey(tz) *after* the
    // boundary — avoids a race where the timer fires a few ms
    // early and re-reads the same key.
    const timer = setTimeout(() => {
      setTodayIso(businessTodayKey(tz));
    }, msUntilNextBusinessDay(tz) + 1000);
    return () => clearTimeout(timer);
  }, [todayIso, tz]);
  const lastIsToday =
    trend.length >= 2 && trend[trend.length - 1].date === todayIso;
  const solidTrend = lastIsToday ? trend.slice(0, -1) : trend;
  const dashedTrend = lastIsToday ? trend.slice(-2) : [];

  // Empty state — every bucket is null. Only happens in rate mode
  // (a window with zero traffic in every day), since count mode
  // backfills 0 for empty days. We keep the axes drawn for context
  // and overlay a centred message instead of swapping in a blank
  // panel.
  const isEmpty =
    trend.length === 0 || trend.every((p) => p.value === null);

  // SVG description for screen readers. Falls back gracefully when
  // empty.
  const ariaLabel = useMemo(() => {
    if (trend.length === 0) return `${metricLabel} chart, no data`;
    const first = formatTickDate(trend[0].date, tz);
    const last = formatTickDate(trend[trend.length - 1].date, tz);
    return isEmpty
      ? `${metricLabel} from ${first} to ${last}, no data`
      : `${metricLabel} from ${first} to ${last}`;
  }, [trend, metricLabel, isEmpty, tz]);

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{ display: "block" }}
        role="img"
        aria-label={ariaLabel}
      >
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
            // rgba(token-rgb, alpha) is the project's preferred shape
            // for theme-aware semi-transparent fills (per CLAUDE.md).
            // --ds-blue-700-rgb flips with the .dark class so the
            // tint stays balanced against either background.
            fill="rgba(var(--ds-blue-700-rgb), 0.10)"
            curve={curveLinear}
            defined={(d) => d.value != null}
          />
          <LinePath<TrendPoint>
            data={solidTrend}
            x={(d) => xScale(d.date) ?? 0}
            y={(d) => (d.value != null ? yScale(d.value) : yScale(0))}
            stroke="var(--ds-blue-700)"
            strokeWidth={2}
            curve={curveLinear}
            defined={(d) => d.value != null}
          />
          {dashedTrend.length === 2 && (
            <LinePath<TrendPoint>
              data={dashedTrend}
              x={(d) => xScale(d.date) ?? 0}
              y={(d) => (d.value != null ? yScale(d.value) : yScale(0))}
              stroke="var(--ds-blue-700)"
              strokeWidth={2}
              strokeDasharray="4 8"
              strokeLinecap="round"
              curve={curveLinear}
              defined={(d) => d.value != null}
            />
          )}
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
              ...AXIS_TICK_STYLE,
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
            tickFormat={(d) => formatTickDate(d as string, tz)}
            tickLabelProps={() => ({
              ...AXIS_TICK_STYLE,
              textAnchor: "middle",
              // Match Vercel's visx pattern: text `y={20}` inside the
              // visx-text wrapper's `y="0.25em"` shim renders the
              // baseline at plotHeight + 23 (≈ optical centre +19).
              // The pill below anchors to that same +19 so the two
              // strings sit on a single row.
              y: 20,
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
            <g pointerEvents="none">
              {/* Pulsing ring only when the hovered point is today —
                  signals the in-progress bucket. SMIL <animate> keeps
                  the animation local to the SVG. */}
              {tooltipData?.date === todayIso && (
                <circle
                  cx={activeX}
                  cy={activeY}
                  r={4}
                  fill="var(--ds-blue-700)"
                  opacity={0.4}
                >
                  <animate
                    attributeName="r"
                    values="4;12;12"
                    keyTimes="0;0.7;1"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0"
                    keyTimes="0;0.7;1"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={activeX}
                cy={activeY}
                r={4}
                fill="var(--ds-blue-700)"
              />
            </g>
          )}
          <Bar
            x={0}
            y={0}
            width={plotWidth}
            // Extend the hit area down through the bottom margin so
            // the date row / pill region is hoverable too — without
            // this the cursor "loses" the tooltip the moment it drops
            // below the plot onto the x-axis labels. Skip handlers
            // when empty so hovers don't surface "—" tooltips.
            height={plotHeight + MARGIN.bottom}
            fill="transparent"
            onMouseMove={isEmpty ? undefined : handleMouseMove}
            onMouseLeave={isEmpty ? undefined : hideTooltip}
          />
        </Group>
      </svg>

      {isEmpty && (
        <div
          // Centred over the plot area (not the full chart) so the
          // axes still anchor the message in context. Pointer-events
          // off so it doesn't capture the cursor.
          style={{
            position: "absolute",
            left: MARGIN.left,
            top: MARGIN.top,
            width: Math.max(width - MARGIN.left - MARGIN.right, 0),
            height: Math.max(height - MARGIN.top - MARGIN.bottom, 0),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            className="text-copy-14"
            style={{ color: "var(--ds-gray-700)" }}
          >
            No decisions in this range
          </span>
        </div>
      )}

      {!isEmpty && tooltipData && tooltipLeft != null && (
        <TooltipWithBounds
          // Drop the tooltip a touch into the plot so it doesn't sit
          // flush with the panel's top edge. visx's flip logic still
          // mirrors it left of the cursor when it would overflow.
          top={MARGIN.top + 12}
          left={tooltipLeft}
          // Symmetric gap on both sides of the cursor: TooltipWithBounds
          // applies offsetLeft as +offsetLeft when placed right and
          // -offsetLeft when flipped left, so passing the gap here
          // (instead of adding +8 to `left`) keeps both sides equal.
          offsetLeft={8}
          offsetTop={0}
          // No `material-tooltip` className — that utility layers a
          // 1px gray-400 border on top of --ds-shadow-tooltip, which
          // already opens with a `0 0 0 1px rgba(0,0,0,0.08)`
          // hairline. The shipped DS Tooltip (src/components/ui/
          // Tooltip.tsx) follows the same shadow-only pattern.
          // `unstyled` would drop the style prop entirely — but visx
          // also writes positional `top`/`left` into the same style
          // prop, so the tooltip would end up un-positioned. Keep
          // it off.
          style={{
            position: "absolute",
            background: "var(--ds-background-100)",
            boxShadow: "var(--ds-shadow-tooltip)",
            borderRadius: 6,
            padding: "8px 16px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {/* Typography lives on this inner div: text-copy-14 wins
              cleanly here without competing with visx's inline
              font defaults. */}
          <div
            className="text-copy-14"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: "var(--ds-gray-1000)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "var(--ds-blue-700)",
                }}
              />
              <span style={{ fontWeight: 400 }}>{metricLabel}</span>
              <span className="font-mono" style={{ fontWeight: 500 }}>
                {tooltipData.value != null
                  ? isPercent
                    ? `${tooltipData.value.toFixed(1)}%`
                    : tooltipData.value.toLocaleString()
                  : "—"}
              </span>
            </div>
            <span style={{ color: "var(--ds-gray-900)" }}>
              {formatTickDate(tooltipData.date, tz)}
            </span>
          </div>
        </TooltipWithBounds>
      )}

      {!isEmpty && tooltipData && tooltipLeft != null && (
        <div
          // Floating "N days ago" pill — sits on the SAME row as the
          // SVG tick labels. Its solid background (matches the panel
          // surface) masks any tick text underneath, so the pill and
          // the date row can share the same baseline without the two
          // strings reading as overlapping. Centred on the tick label's
          // optical centre (visx renders the label baseline at
          // plotHeight + 23 via y=20 + the 0.25em wrapper shim, so
          // 12px Geist puts the optical centre at ~+19).
          style={{
            position: "absolute",
            left: tooltipLeft,
            top: MARGIN.top + plotHeight + 19,
            transform: "translate(-50%, -50%)",
            background: "var(--ds-background-100)",
            color: "var(--ds-gray-1000)",
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: 9999,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {daysAgoLabel(tooltipData.date, tz)}
        </div>
      )}
    </>
  );
}
