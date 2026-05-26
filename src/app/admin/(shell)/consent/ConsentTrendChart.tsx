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

// Outer-wrapper padding (must match the inline style on the wrapping
// <div> below). Used to translate Recharts' chart-relative cursor X
// into outer-div coordinates for the HTML overlay.
const WRAPPER_PADDING_LEFT = 24;
const WRAPPER_PADDING_TOP = 24;

// Chart layout — chart height + bottom margin reserved for the
// X-axis row. Kept here so the HTML overlay can compute its vertical
// position deterministically (rather than guessing from Recharts'
// rendered output).
const CHART_HEIGHT = 240;
const CHART_BOTTOM_MARGIN = 24;
const TICK_MARGIN = 8;
// Recharts' tickSize default (6) factors into tick text y even when
// tickLine is hidden.
const TICK_SIZE = 6;

// Y position of the X-axis tick text within the chart SVG, relative
// to its top. Plot bottom + tickSize + tickMargin. Used by the HTML
// overlay to land at the same row as the regular ticks.
const TICK_TEXT_Y =
  CHART_HEIGHT - CHART_BOTTOM_MARGIN + TICK_SIZE + TICK_MARGIN;

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

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string; index: number };
  activeLabel: string | null;
}

// Renders each X-axis tick. When the hovered point's date matches the
// tick's date, we hide the tick — the HTML overlay below the chart
// renders the "N days ago" label at exactly this position instead,
// with a solid background that masks any neighbouring tick text that
// would otherwise show through. Comparing by date (not by index)
// matters because Recharts' tick index can refer to rendered position
// rather than data index once interval thinning kicks in.
function CustomTick({ x = 0, y = 0, payload, activeLabel }: CustomTickProps) {
  if (!payload) return null;
  const isActive = activeLabel !== null && payload.value === activeLabel;
  if (isActive) return null;
  return (
    <text
      x={x}
      y={y}
      dy="0.71em"
      textAnchor="middle"
      fontSize={12}
      fontWeight={400}
      fill="var(--ds-gray-700)"
      // pointer-events: none so hovering the label lets the mouse
      // event reach the chart's onMouseMove handler rather than being
      // swallowed by the <text> element.
      style={{ pointerEvents: "none" }}
    >
      {formatTickDate(payload.value)}
    </text>
  );
}

// SVG cursor — just the vertical line. The "N days ago" label is no
// longer rendered in SVG; it's an HTML overlay sibling of the chart
// (see ConsentTrendChart's return JSX) so it always stacks above the
// chart's SVG content regardless of how Recharts orders cursor vs
// axis elements internally.
interface CursorLineProps {
  points?: { x: number; y: number }[];
}

function CursorLine({ points }: CursorLineProps) {
  if (!points || points.length < 2) return null;
  const x = points[0].x;
  return (
    <line
      x1={x}
      y1={points[0].y}
      x2={x}
      y2={points[1].y}
      stroke="var(--ds-gray-1000)"
      strokeWidth={2}
      style={{ pointerEvents: "none" }}
    />
  );
}

export default function ConsentTrendChart({
  trend,
  metricLabel,
  format,
}: ConsentTrendChartProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  // Cursor x position within the chart SVG (chart-relative pixels).
  // Captured from Recharts' activeCoordinate so we can place the HTML
  // overlay at the same column the cursor line draws on.
  const [cursorX, setCursorX] = useState<number | null>(null);

  const chartConfig = {
    value: {
      label: metricLabel,
      color: "var(--ds-blue-900)",
    },
  } satisfies ChartConfig;

  const isPercent = format === "percent";
  const valueFormatter = (v: number) =>
    isPercent ? `${v.toFixed(1)}%` : v.toLocaleString();

  const showOverlay = activeLabel !== null && cursorX !== null;

  return (
    <div
      style={{
        padding: `${WRAPPER_PADDING_TOP}px ${WRAPPER_PADDING_LEFT}px 16px`,
        position: "relative",
      }}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={trend}
          margin={{ left: 8, right: 12, top: 8, bottom: CHART_BOTTOM_MARGIN }}
          onMouseMove={(state) => {
            const s = state as unknown as {
              activeLabel?: string;
              activeCoordinate?: { x?: number };
            };
            setActiveLabel(
              typeof s.activeLabel === "string" ? s.activeLabel : null,
            );
            const x = s.activeCoordinate?.x;
            setCursorX(typeof x === "number" ? x : null);
          }}
          onMouseLeave={() => {
            setActiveLabel(null);
            setCursorX(null);
          }}
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
            cursor={<CursorLine />}
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

      {showOverlay && (
        <div
          // Pill-shaped HTML overlay for the "N days ago" label —
          // matches Vercel's chart tooltip styling (fully rounded
          // background, subtle drop shadow, 12/16 medium text). Sits
          // outside the SVG so it stacks above every chart element
          // by default; no z-order tug-of-war with Recharts. The
          // pill's solid background reliably masks any X-axis tick
          // label sitting underneath.
          style={{
            position: "absolute",
            left: WRAPPER_PADDING_LEFT + (cursorX ?? 0),
            top: WRAPPER_PADDING_TOP + TICK_TEXT_Y,
            transform: "translate(-50%, -25%)",
            background: "var(--ds-background-100)",
            color: "var(--ds-gray-1000)",
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: 999,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {daysAgoLabel(activeLabel)}
        </div>
      )}
    </div>
  );
}
