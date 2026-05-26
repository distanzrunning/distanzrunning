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
  activeIndex: number | null;
}

// Renders each X-axis tick. When the hovered data index matches the
// tick's data index, swap the formatted date ("May 19") for the
// relative "N days ago" — matches the Vercel analytics pattern.
// Note: when long windows trigger Recharts' minTickGap thinning,
// some days don't have a rendered tick to swap; the tooltip still
// carries the date so the info isn't lost.
function CustomTick({ x = 0, y = 0, payload, activeIndex }: CustomTickProps) {
  if (!payload) return null;
  const isActive = activeIndex !== null && payload.index === activeIndex;
  const text = isActive
    ? daysAgoLabel(payload.value)
    : formatTickDate(payload.value);
  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isActive ? 600 : 400}
      fill={isActive ? "var(--ds-gray-1000)" : "var(--ds-gray-700)"}
    >
      {text}
    </text>
  );
}

export default function ConsentTrendChart({
  trend,
  metricLabel,
  format,
}: ConsentTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
          margin={{ left: 8, right: 12, top: 8, bottom: 0 }}
          onMouseMove={(state) => {
            const idx = (
              state as unknown as { activeTooltipIndex?: number }
            ).activeTooltipIndex;
            setActiveIndex(typeof idx === "number" ? idx : null);
          }}
          onMouseLeave={() => setActiveIndex(null)}
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
            tickMargin={8}
            minTickGap={24}
            tick={(props) => (
              <CustomTick
                {...(props as unknown as CustomTickProps)}
                activeIndex={activeIndex}
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
            cursor={{
              stroke: "var(--ds-gray-500)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
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
