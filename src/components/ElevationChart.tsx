'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ElevationChartProps {
  elevationData: Array<{ distance: number; elevation: number }>
  useMetric?: boolean
  isDark?: boolean
}

export function ElevationChart({ elevationData, useMetric = false, isDark = false }: ElevationChartProps) {
  // Convert data based on unit preference
  const chartData = useMemo(() => {
    return elevationData.map(point => ({
      distance: useMetric ? point.distance : point.distance / 1.609344, // Convert km to miles if needed
      elevation: useMetric ? point.elevation : point.elevation * 3.28084, // Convert meters to feet if needed
    }))
  }, [elevationData, useMetric])

  // Calculate min/max for better chart scaling
  const { minElevation, maxElevation, elevationGain, totalDistance } = useMemo(() => {
    if (chartData.length === 0) return { minElevation: 0, maxElevation: 0, elevationGain: 0, totalDistance: 0 }

    const elevations = chartData.map(d => d.elevation)
    const min = Math.min(...elevations)
    const max = Math.max(...elevations)

    // Calculate total elevation gain
    let gain = 0
    for (let i = 1; i < chartData.length; i++) {
      const diff = chartData[i].elevation - chartData[i - 1].elevation
      if (diff > 0) gain += diff
    }

    const distance = chartData[chartData.length - 1]?.distance || 0

    return {
      minElevation: Math.floor(min),
      maxElevation: Math.ceil(max),
      elevationGain: Math.round(gain),
      totalDistance: distance.toFixed(1)
    }
  }, [chartData])

  const distanceUnit = useMetric ? 'km' : 'mi'
  const elevationUnit = useMetric ? 'm' : 'ft'

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
            {payload[0].payload.distance.toFixed(2)} {distanceUnit}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-mono">{Math.round(payload[0].value)}</span> {elevationUnit}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-6 flex items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No elevation data available</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm flex-shrink-0">
      {/* Header with stats */}
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Elevation Profile
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Elevation Gain</p>
            <p className="text-lg font-mono font-semibold text-neutral-900 dark:text-white">
              {elevationGain.toLocaleString()} {elevationUnit}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Min / Max</p>
            <p className="text-lg font-mono font-semibold text-neutral-900 dark:text-white">
              {minElevation} / {maxElevation} {elevationUnit}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Distance</p>
            <p className="text-lg font-mono font-semibold text-neutral-900 dark:text-white">
              {totalDistance} {distanceUnit}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-6">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isDark ? '#e43c81' : '#ff4d94'}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={isDark ? '#e43c81' : '#ff4d94'}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#404040' : '#e5e5e5'}
              vertical={false}
            />
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{
                fill: isDark ? '#a3a3a3' : '#737373',
                fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={(value) => `${value.toFixed(0)} ${distanceUnit}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fill: isDark ? '#a3a3a3' : '#737373',
                fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={(value) => `${Math.round(value)}`}
              domain={[
                (dataMin: number) => Math.floor(dataMin * 0.95),
                (dataMax: number) => Math.ceil(dataMax * 1.05)
              ]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke={isDark ? '#e43c81' : '#ff4d94'}
              strokeWidth={2}
              fill="url(#elevationGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
