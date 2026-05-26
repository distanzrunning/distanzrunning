"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";

interface TrendPoint {
  /** Full ISO YYYY-MM-DD — kept whole (rather than sliced to MM-DD)
   *  so the tick formatter can build "May 19" and the active-tick
   *  swap can compute "N days ago" without re-parsing. */
  date: string;
  value: number | null;
}

interface ConsentTrendChartProps {
  trend: TrendPoint[];
  metricLabel: string;
  format: "count" | "percent";
}

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
  // Future dates can't appear in our data, but fall back gracefully.
  return formatTickDate(iso);
}

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string; index: number };
  activeLabel: string | null;
}

// Renders each X-axis tick. When the hovered point's date matches the
// tick's date, swap the formatted date ("May 19") for the relative
// "N days ago". Comparing by date (Recharts' `activeLabel`) rather
// than by index avoids ambiguity when long windows trigger tick
// thinning — `payload.index` can refer to the tick's *rendered*
// position, not its data index, which broke the swap in practice.
function CustomTick({ x = 0, y = 0, payload, activeLabel }: CustomTickProps) {
  if (!payload) return null;
  const isActive = activeLabel !== null && payload.value === activeLabel;
  // When the day is active we hide the tick entirely — the custom
  // cursor draws the "N days ago" label at exactly this position, so
  // rendering the tick too would either duplicate or fight it.
  // Critically this also lets the cursor work for *thinned* days that
  // never had a tick to begin with: one label path covers both cases.
  if (isActive) return null;
  return (
    <text
      x={x}
      // dy="0.71em" matches Recharts' default tick baseline.
      y={y}
      dy="0.71em"
      textAnchor="middle"
      fontSize={12}
      fontWeight={400}
      fill="var(--ds-gray-700)"
      // pointer-events: none so hovering directly on the label lets
      // the mouse event reach the chart's onMouseMove handler instead
      // of being swallowed by the <text> element.
      style={{ pointerEvents: "none" }}
    >
      {formatTickDate(payload.value)}
    </text>
  );
}

// Custom cursor — replaces Recharts' default `.recharts-tooltip-cursor`
// element (which Chart.tsx forces to stroke gray-400 via a wrapper
// CSS rule that we can't override inline). Renders a solid gray-1000
// 2px vertical line plus a bold "N days ago" label at the bottom of
// the plot area, positioned where the X-axis tick would sit. The
// label appears for every hovered day, whether or not that day has
// a rendered tick (long windows thin the ticks; the cursor's label
// still surfaces "N days ago" in that case).
interface CursorPayloadEntry {
  payload?: { date?: string };
}
interface ActiveCursorProps {
  points?: { x: number; y: number }[];
  payload?: CursorPayloadEntry[];
  top?: number;
  height?: number;
}

// Has to match the XAxis tickMargin prop below — both numbers feed
// the same vertical position for tick + cursor text.
const TICK_MARGIN = 8;

function ActiveCursor({
  points,
  payload,
  top = 0,
  height = 0,
}: ActiveCursorProps) {
  if (!points || points.length < 2) return null;
  const iso = payload?.[0]?.payload?.date;
  if (!iso) return null;
  const x = points[0].x;
  const yTop = points[0].y;
  const yBottom = points[1].y;
  // Compute the tick-text y directly from the plot geometry
  // (top + height + tickMargin) rather than from points[1].y.
  // points[1].y is the cursor *line* terminus, which Recharts can
  // shift independently of where it positions axis tick text;
  // anchoring to top + height keeps the "N days ago" label sitting
  // in the exact row a tick would occupy.
  const tickTextY = top + height + TICK_MARGIN;

  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={x}
        y1={yTop}
        x2={x}
        y2={yBottom}
        stroke="var(--ds-gray-1000)"
        strokeWidth={2}
      />
      <text
        x={x}
        y={tickTextY}
        dy="0.71em"
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill="var(--ds-gray-1000)"
      >
        {daysAgoLabel(iso)}
      </text>
    </g>
  );
}

export default function ConsentTrendChart({
  trend,
  metricLabel,
  format,
}: ConsentTrendChartProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const chartConfig = {
    value: {
      label: metricLabel,
      color: "var(--ds-blue-900)",
    },
  } satisfies ChartConfig;

  const isPercent = format === "percent";
  const valueFormatter = (v: number) =>
    isPercent ? `${v.toFixed(1)}%` : v.toLocaleString();

  return (
    <div style={{ padding: "24px 24px 16px" }}>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={trend}
          // bottom margin reserves vertical room for the X-axis tick
          // labels so they render inside the SVG (not clipped) and
          // remain inside the chart's hover-detection rectangle.
          margin={{ left: 8, right: 12, top: 8, bottom: 24 }}
          onMouseMove={(state) => {
            const al = (state as unknown as { activeLabel?: string })
              .activeLabel;
            setActiveLabel(typeof al === "string" ? al : null);
          }}
          onMouseLeave={() => setActiveLabel(null)}
        >
          <defs>
            <linearGradient id="consent-trend-fill" x1="0" y1="0" x2="0" y2="1">
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
          <CartesianGrid vertical={false} stroke="var(--ds-gray-400)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={TICK_MARGIN}
            // Always show roughly seven ticks regardless of window
            // length — 7-day windows get every day, 30-day windows
            // get every fifth day, 90-day windows get every
            // ~thirteenth. Keeps the X-axis density predictable
            // instead of leaving the spacing to Recharts' built-in
            // collision-based thinning.
            interval={Math.max(0, Math.ceil(trend.length / 7) - 1)}
            tick={(props) => (
              <CustomTick
                {...(props as unknown as CustomTickProps)}
                activeLabel={activeLabel}
              />
            )}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickMargin={4}
            tick={{ fill: "var(--ds-gray-700)", fontSize: 12 }}
            domain={isPercent ? [0, 100] : ["auto", "auto"]}
            tickFormatter={(v: number) =>
              isPercent ? `${v}%` : v.toLocaleString()
            }
          />
          <ChartTooltip
            // Custom cursor element rather than the default-shaped
            // `{ stroke, strokeWidth }` config: see ActiveCursor's
            // header comment for why (wrapper CSS forces gray-400).
            cursor={<ActiveCursor />}
            content={
              <ChartTooltipContent
                hideLabel={false}
                labelFormatter={(label) => formatTickDate(String(label))}
                formatter={(value) => valueFormatter(value as number)}
              />
            }
          />
          <Area
            type="linear"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill="url(#consent-trend-fill)"
            connectNulls={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
