"use client";

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
  date: string;
  value: number | null;
}

interface ConsentTrendChartProps {
  trend: TrendPoint[];
  /** Drives both the legend label and the tooltip header. */
  metricLabel: string;
  /** "count" = raw decisions per day, "percent" = rate 0–100. Controls
   *  the Y-axis tick formatter, tooltip suffix, and Y-domain. */
  format: "count" | "percent";
}

export default function ConsentTrendChart({
  trend,
  metricLabel,
  format,
}: ConsentTrendChartProps) {
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
        >
          <defs>
            {/* Soft top-to-bottom fade under the line — matches the
                Vercel analytics look. Two stops so the fill thins
                toward the X-axis without going fully transparent. */}
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
            tick={{ fill: "var(--ds-gray-700)", fontSize: 12 }}
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
                formatter={(value) => valueFormatter(value as number)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill="url(#consent-trend-fill)"
            // `connectNulls=false` so the line breaks on zero-traffic
            // days in rate mode rather than implying continuous data.
            connectNulls={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
