"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendPoint {
  date: string;
  count: number;
}

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="consentTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ds-blue-900)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--ds-blue-900)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--ds-gray-400)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--ds-gray-700)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--ds-gray-400)" }}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--ds-gray-700)" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: "var(--ds-background-100)",
              border: "1px solid var(--ds-gray-400)",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--ds-gray-1000)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--ds-blue-900)"
            strokeWidth={2}
            fill="url(#consentTrend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
