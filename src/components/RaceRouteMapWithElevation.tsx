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

  // Sync metric preference between map and chart
  const handleUseMetricChange = (metric: boolean) => {
    setUseMetric(metric)
    onUseMetricChange?.(metric)
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
      />

      {/* Elevation Chart - only show if we have data */}
      {elevationData.length > 0 && (
        <ElevationChart
          elevationData={elevationData}
          useMetric={useMetric}
          isDark={isDark}
        />
      )}
    </div>
  )
}
