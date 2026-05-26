"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";

interface TrendPoint {
  date: string;
  count: number;
}

interface ConsentTrendChartProps {
  trend: TrendPoint[];
  /** Drives both the legend label and the tooltip header. */
  metricLabel: string;
}

export default function ConsentTrendChart({
  trend,
  metricLabel,
}: ConsentTrendChartProps) {
  const chartConfig = {
    count: {
      label: metricLabel,
      color: "var(--ds-blue-900)",
    },
  } satisfies ChartConfig;

  return (
    <div style={{ padding: "24px 24px 16px" }}>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={trend}
          margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--ds-gray-400)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(v: string) => v}
          />
          <ChartTooltip
            cursor={{ fill: "var(--ds-gray-100)" }}
            content={<ChartTooltipContent hideLabel={false} />}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
