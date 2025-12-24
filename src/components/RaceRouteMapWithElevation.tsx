'use client'

import { RaceRouteMap } from './RaceRouteMap'
import { ElevationChart } from './ElevationChart'
import { useState, useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'

interface RaceRouteMapWithElevationProps {
  gpxUrl: string
  title: string
  height?: number
  initialShowMarkers?: boolean
  initialUseMetric?: boolean
  onShowMarkersChange?: (show: boolean) => void
  onUseMetricChange?: (metric: boolean) => void
  elevationData?: Array<{ distance: number; elevation: number }>
}

/**
 * Wrapper component that displays both the route map and elevation chart
 * with synchronized hover interactions
 */
export function RaceRouteMapWithElevation({
  gpxUrl,
  title,
  height,
  initialShowMarkers = false,
  initialUseMetric = false,
  onShowMarkersChange,
  onUseMetricChange,
  elevationData = []
}: RaceRouteMapWithElevationProps) {
  const { isDark } = useContext(DarkModeContext)
  const [useMetric, setUseMetric] = useState(initialUseMetric)

  // Hover state for bidirectional interaction between map and chart
  const [hoverDistance, setHoverDistance] = useState<number | null>(null)

  // Track which component is being hovered to prevent tooltip sticking
  const [hoverSource, setHoverSource] = useState<'map' | 'chart' | null>(null)

  // Sync metric preference between map and chart
  const handleUseMetricChange = (metric: boolean) => {
    setUseMetric(metric)
    onUseMetricChange?.(metric)
  }

  // Handle hover distance changes with source tracking
  const handleMapHoverChange = (distance: number | null) => {
    setHoverDistance(distance)
    setHoverSource(distance !== null ? 'map' : null)
  }

  const handleChartHoverChange = (distance: number | null) => {
    setHoverDistance(distance)
    setHoverSource(distance !== null ? 'chart' : null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Map */}
      <RaceRouteMap
        gpxUrl={gpxUrl}
        title={title}
        height={height}
        initialShowMarkers={initialShowMarkers}
        initialUseMetric={useMetric}
        onShowMarkersChange={onShowMarkersChange}
        onUseMetricChange={handleUseMetricChange}
        hoverDistance={hoverSource === 'chart' ? hoverDistance : null}
        onHoverDistanceChange={handleMapHoverChange}
      />

      {/* Elevation Chart - only show if we have data */}
      {elevationData.length > 0 && (
        <ElevationChart
          elevationData={elevationData}
          useMetric={useMetric}
          isDark={isDark}
          onUseMetricChange={handleUseMetricChange}
          hoverDistance={hoverSource === 'map' ? hoverDistance : null}
          onHoverDistanceChange={handleChartHoverChange}
        />
      )}
    </div>
  )
}
