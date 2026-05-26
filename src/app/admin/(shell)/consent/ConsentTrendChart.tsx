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
  currentCount: number;
  uniqueVisitors: number;
  windowDays: number;
}

const chartConfig = {
  count: {
    label: "Decisions",
    color: "var(--ds-blue-900)",
  },
} satisfies ChartConfig;

export default function ConsentTrendChart({
  trend,
  currentCount,
  uniqueVisitors,
  windowDays,
}: ConsentTrendChartProps) {
  return (
    <section
      style={{
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--ds-background-100)",
      }}
    >
      {/* Header — title on the left, two mini-stats on the right. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto auto",
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <div style={{ padding: "20px 24px" }}>
          <h2
            className="text-heading-16 m-0 text-[color:var(--ds-gray-1000)]"
          >
            Decisions per day
          </h2>
          <p
            className="text-copy-13 m-0"
            style={{ color: "var(--ds-gray-700)", marginTop: 4 }}
          >
            Showing the last {windowDays} days of consent decisions.
          </p>
        </div>
        <div
          style={{
            padding: "20px 24px",
            borderLeft: "1px solid var(--ds-gray-400)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "center",
          }}
        >
          <span
            className="text-label-12 font-medium uppercase tracking-wide"
            style={{ color: "var(--ds-gray-700)" }}
          >
            Decisions
          </span>
          <span
            className="text-heading-24"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            {currentCount.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            padding: "20px 24px",
            borderLeft: "1px solid var(--ds-gray-400)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "center",
          }}
        >
          <span
            className="text-label-12 font-medium uppercase tracking-wide"
            style={{ color: "var(--ds-gray-700)" }}
          >
            Visitors
          </span>
          <span
            className="text-heading-24"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            {uniqueVisitors.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ padding: 24 }}>
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
    </section>
  );
}
