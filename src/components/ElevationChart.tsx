'use client'

import { useMemo, useRef, useCallback } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Settings2 } from 'lucide-react'

interface ElevationChartProps {
  elevationData: Array<{ distance: number; elevation: number }>
  useMetric?: boolean
  isDark?: boolean
  onUseMetricChange?: (metric: boolean) => void
  hoverDistance?: number | null
  onHoverDistanceChange?: (distance: number | null) => void
}

export function ElevationChart({
  elevationData,
  useMetric = false,
  isDark = false,
  onUseMetricChange,
  hoverDistance,
  onHoverDistanceChange
}: ElevationChartProps) {
  console.log('[ElevationChart] Rendered with:', {
    dataPoints: elevationData.length,
    useMetric,
    hoverDistance,
    hasHoverCallback: !!onHoverDistanceChange
  })

  // Ref for the chart container to calculate mouse position
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Calculate fixed domains based on raw data (always in metric/km)
  // This ensures the axes don't move when toggling units
  const { distanceDomainKm, elevationDomainMeters } = useMemo(() => {
    if (elevationData.length === 0) return {
      distanceDomainKm: [0, 10] as [number, number],
      elevationDomainMeters: [0, 100] as [number, number]
    }

    const distances = elevationData.map(d => d.distance)
    const elevations = elevationData.map(d => d.elevation)

    const maxDistance = Math.max(...distances)
    const minElevation = Math.min(...elevations)
    const maxElevation = Math.max(...elevations)

    return {
      distanceDomainKm: [0, Math.ceil(maxDistance)] as [number, number],
      elevationDomainMeters: [
        Math.floor(minElevation),
        Math.ceil(maxElevation)
      ] as [number, number]
    }
  }, [elevationData])

  // Convert domains to current unit system
  const distanceDomain: [number, number] = useMemo(() => {
    return useMetric
      ? distanceDomainKm
      : [distanceDomainKm[0] / 1.609344, distanceDomainKm[1] / 1.609344]
  }, [distanceDomainKm, useMetric])

  // Calculate fixed elevation domain in metric (stays constant)
  const elevationDomainMetric: [number, number] = useMemo(() => {
    const minMeters = elevationDomainMeters[0]
    const maxMeters = elevationDomainMeters[1]
    const rangeMeters = maxMeters - minMeters

    // Determine interval in meters
    let intervalMeters: number
    if (rangeMeters <= 50) intervalMeters = 10
    else if (rangeMeters <= 100) intervalMeters = 20
    else if (rangeMeters <= 200) intervalMeters = 50
    else if (rangeMeters <= 500) intervalMeters = 100
    else intervalMeters = 200

    // Round to interval in meters
    const startMeters = Math.floor(minMeters / intervalMeters) * intervalMeters
    const endMeters = Math.ceil(maxMeters / intervalMeters) * intervalMeters

    return [startMeters, endMeters] as [number, number]
  }, [elevationDomainMeters])

  // Convert to current unit system (maintains exact proportions to prevent chart movement)
  const elevationDomain: [number, number] = useMemo(() => {
    if (useMetric) {
      return elevationDomainMetric
    } else {
      // Convert the fixed metric domain to feet
      return [
        elevationDomainMetric[0] * 3.28084,
        elevationDomainMetric[1] * 3.28084
      ] as [number, number]
    }
  }, [elevationDomainMetric, useMetric])

  // Generate distance ticks based on unit
  const distanceTicks = useMemo(() => {
    const ticks: number[] = []
    const interval = useMetric ? 5 : 2 // 5km or 2mi intervals
    const maxDistance = Math.ceil(distanceDomain[1])

    for (let i = 0; i <= maxDistance; i += interval) {
      ticks.push(i)
    }
    return ticks
  }, [distanceDomain, useMetric])

  // Generate elevation ticks based on domain and unit
  const elevationTicks = useMemo(() => {
    const ticks: number[] = []
    const min = elevationDomain[0]
    const max = elevationDomain[1]
    const range = max - min

    // Determine appropriate interval based on range
    let interval: number
    if (useMetric) {
      // For meters
      if (range <= 50) interval = 10
      else if (range <= 100) interval = 20
      else if (range <= 200) interval = 50
      else if (range <= 500) interval = 100
      else interval = 200
    } else {
      // For feet
      if (range <= 150) interval = 25
      else if (range <= 300) interval = 50
      else if (range <= 600) interval = 100
      else if (range <= 1500) interval = 250
      else interval = 500
    }

    // Start from a rounded value and generate ticks
    const start = Math.ceil(min / interval) * interval

    // Generate ticks but limit to ~5 ticks max to avoid clutter
    for (let i = start; i <= max; i += interval) {
      ticks.push(i)
      // Stop if we have enough ticks
      if (ticks.length >= 5) break
    }

    return ticks
  }, [elevationDomain, useMetric])

  // Convert data based on unit preference
  const chartData = useMemo(() => {
    return elevationData.map(point => ({
      distance: useMetric ? point.distance : point.distance / 1.609344, // Convert km to miles if needed
      elevation: useMetric ? point.elevation : point.elevation * 3.28084, // Convert meters to feet if needed
    }))
  }, [elevationData, useMetric])

  // Handle mouse move over chart area (similar to Chart.js onHover)
  const handleChartMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current || chartData.length === 0) return

    const rect = chartContainerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left

    // Account for chart margins (left margin is ~45px for Y-axis, right margin is ~10px)
    const chartLeftMargin = 45
    const chartRightMargin = 10
    const chartWidth = rect.width - chartLeftMargin - chartRightMargin

    // Calculate relative position (0 to 1)
    const relativeX = (mouseX - chartLeftMargin) / chartWidth

    // Clamp to valid range
    if (relativeX < 0 || relativeX > 1) return

    // Find the distance at this position
    const minDistance = distanceDomain[0]
    const maxDistance = distanceDomain[1]
    const distance = minDistance + (relativeX * (maxDistance - minDistance))

    console.log('[ElevationChart] Overlay mouse move at distance:', distance, useMetric ? 'km' : 'mi')
    onHoverDistanceChange?.(distance)
  }, [chartData, distanceDomain, useMetric, onHoverDistanceChange])

  const distanceUnit = useMetric ? 'km' : 'mi'
  const elevationUnit = useMetric ? 'm' : 'ft'

  // Find elevation at hover distance for custom tooltip
  const hoverElevation = useMemo(() => {
    if (hoverDistance === null || hoverDistance === undefined || chartData.length === 0) {
      return null
    }

    // Find the closest data point to the hover distance
    let closestIndex = 0
    let closestDiff = Math.abs(chartData[0].distance - hoverDistance)

    for (let i = 1; i < chartData.length; i++) {
      const diff = Math.abs(chartData[i].distance - hoverDistance)
      if (diff < closestDiff) {
        closestDiff = diff
        closestIndex = i
      }
    }

    return chartData[closestIndex].elevation
  }, [hoverDistance, chartData])

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

  // Calculate tooltip position for map hover
  const tooltipPosition = useMemo(() => {
    if (!hoverDistance || hoverDistance === null || !chartContainerRef.current) {
      return null
    }

    const minDistance = distanceDomain[0]
    const maxDistance = distanceDomain[1]
    const relativeX = (hoverDistance - minDistance) / (maxDistance - minDistance)

    // Account for margins
    const chartLeftMargin = 45
    const chartRightMargin = 10
    const chartWidth = chartContainerRef.current.offsetWidth - chartLeftMargin - chartRightMargin
    const xPos = chartLeftMargin + (relativeX * chartWidth)

    return { x: xPos }
  }, [hoverDistance, distanceDomain])

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm flex-shrink-0">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Elevation Profile
          </h3>

          {/* Unit Toggle */}
          <div className="relative group">
            <button
              onClick={() => onUseMetricChange?.(!useMetric)}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              aria-label="Toggle units"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
              {useMetric ? 'Change to Imperial (mi/ft)' : 'Change to Metric (km/m)'}
              <div className="absolute bottom-full right-4 w-2 h-2 bg-neutral-900 dark:bg-neutral-100 transform rotate-45 translate-y-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        className="px-4 py-6"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          ref={chartContainerRef}
          style={{ position: 'relative', cursor: 'crosshair' }}
          onMouseMove={handleChartMouseMove}
          onMouseLeave={() => {
            console.log('[ElevationChart] Container mouse leave')
            onHoverDistanceChange?.(null)
          }}
        >
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
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={distanceDomain}
              ticks={distanceTicks}
              allowDataOverflow={false}
              tick={{
                fill: isDark ? '#a3a3a3' : '#737373',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={(value) => `${Math.round(value)}${distanceUnit}`}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={elevationDomain}
              ticks={elevationTicks}
              allowDataOverflow={false}
              width={45}
              tick={{
                fill: isDark ? '#a3a3a3' : '#737373',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={(value) => `${Math.round(value)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '3 3' }} />
            {/* Show reference line when hovering from map (matches cursor style) */}
            {hoverDistance !== null && hoverDistance !== undefined && (
              <ReferenceLine
                x={hoverDistance}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="3 3"
                label=""
              />
            )}
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

        {/* Custom floating tooltip for map hover */}
        {tooltipPosition && hoverElevation !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x}px`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                {hoverDistance?.toFixed(2)} {distanceUnit}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-mono">{Math.round(hoverElevation)}</span> {elevationUnit}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
