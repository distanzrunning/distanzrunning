"use client";

import { useLayoutEffect, useRef, useState } from "react";
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

// Chart bottom margin reserved for the X-axis row.
const CHART_BOTTOM_MARGIN = 24;
const TICK_MARGIN = 8;

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

// Custom tooltip — mirrors Vercel's chart tooltip:
//   [● Label  Value]
//   [    Date     ]
// 6px rounded box, ds-shadow-tooltip (1px border layer + soft drop),
// 8/16 padding. Value is rendered in the mono family so single-digit
// vs multi-digit numbers don't shuffle layout when hovering.
interface TooltipPayloadEntry {
  value?: number;
}
interface TrendTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  metricLabel: string;
  format: "count" | "percent";
}

function TrendTooltip({
  active,
  payload,
  label,
  metricLabel,
  format,
}: TrendTooltipProps) {
  if (!active || !payload?.[0] || payload[0].value == null) return null;
  const v = payload[0].value;
  const formattedValue =
    format === "percent" ? `${v.toFixed(1)}%` : v.toLocaleString();
  const formattedDate = label ? formatTickDate(label) : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 16px",
        borderRadius: 6,
        background: "var(--ds-background-100)",
        boxShadow: "var(--ds-shadow-tooltip)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        fontSize: 14,
        lineHeight: "20px",
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
            background: "var(--ds-blue-900)",
          }}
        />
        <span style={{ fontWeight: 400 }}>{metricLabel}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
          {formattedValue}
        </span>
      </div>
      <span style={{ color: "var(--ds-gray-900)" }}>{formattedDate}</span>
    </div>
  );
}

function CursorLine({ points }: CursorLineProps) {
  if (!points || points.length < 2) return null;
  const x = points[0].x;
  return (
    <line
      x1={x}
      y1={points[0].y}
      x2={x}
      // Extend 7px past plot bottom into the X-axis area so the
      // line visually anchors the pill label sitting just below —
      // matches Vercel's chart cursor (y2 = plotBottom + 7).
      y2={points[1].y + 7}
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

  // Outer-relative top of the X-axis tick text row, measured from a
  // real rendered SVG tick element. We let the overlay size to its
  // content vertically — constraining height by the measured tick
  // rect collapsed the box in some cases and hid the text.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tickRowTop, setTickRowTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    let raf = 0;

    const measure = () => {
      const tick = wrapper.querySelector(
        ".recharts-xAxis .recharts-cartesian-axis-tick text",
      );
      if (!tick) {
        // Recharts' ResponsiveContainer paints async after measuring
        // its own size, so the SVG may not be in the DOM on the first
        // layout pass. Retry next frame until we find a tick — the
        // wrapper itself never resizes, so we can't rely on the
        // ResizeObserver to catch this.
        raf = requestAnimationFrame(measure);
        return;
      }
      const wrapperRect = wrapper.getBoundingClientRect();
      const tickRect = tick.getBoundingClientRect();
      setTickRowTop(tickRect.top - wrapperRect.top);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [trend]);

  const chartConfig = {
    value: {
      label: metricLabel,
      color: "var(--ds-blue-900)",
    },
  } satisfies ChartConfig;

  const isPercent = format === "percent";

  const showOverlay =
    activeLabel !== null && cursorX !== null && tickRowTop !== null;

  return (
    <div
      ref={wrapperRef}
      style={{
        padding: `${WRAPPER_PADDING_TOP}px ${WRAPPER_PADDING_LEFT}px 16px`,
        position: "relative",
      }}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[400px] w-full"
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
            // Integer ticks only — without this Recharts picks 0.5
            // increments when the count range is small (e.g. 0–3),
            // which reads as "0.5 visitors" nonsense.
            allowDecimals={false}
            tickFormatter={(v: number) =>
              isPercent ? `${v}%` : v.toLocaleString()
            }
          />
          <ChartTooltip
            cursor={<CursorLine />}
            content={
              <TrendTooltip
                metricLabel={metricLabel}
                format={format}
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
            // Solid blue dot at the hovered data point — no ring,
            // matches Vercel's visx-circle (4px radius, primary fill
            // only).
            activeDot={{
              r: 4,
              fill: "var(--ds-blue-900)",
              stroke: "none",
            }}
          />
        </AreaChart>
      </ChartContainer>

      {showOverlay && (
        <div
          // Flat HTML knockout for the "N days ago" label — same
          // background as the panel, slight rounded corners, no
          // shadow, no border. Sits in the X-axis tick row;
          // background-100 fill masks any underlying tick label
          // without an obvious "tooltip" treatment.
          //
          // `top` is the measured top of the SVG tick text rect; the
          // box sizes to its content vertically so the text always
          // renders. SVG <text dy="0.71em"> and HTML <div lineHeight:1>
          // share a near-identical glyph-top, so anchoring by top
          // lands the label on the tick row without a magic offset.
          style={{
            position: "absolute",
            left: WRAPPER_PADDING_LEFT + (cursorX ?? 0),
            top: tickRowTop ?? 0,
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
          {daysAgoLabel(activeLabel)}
        </div>
      )}
    </div>
  );
}
