'use client'

import React, { useEffect, useRef, useState } from 'react'

// Declare global types for Mapbox and Chart.js
declare global {
  interface Window {
    mapboxgl: any
    Chart: any
  }
}

// Props interface for the Race Map Component
interface RaceMapComponentProps {
  token: string
  gpxUrl?: string
  center?: [number, number]
  city?: string
}

// Interface for Points of Interest
interface PointOfInterest {
  name: string
  coordinates: [number, number]
  type: 'aid_station'
  description?: string | null
}

// Interface for route bounds
interface RouteBounds {
  southwest: [number, number]
  northeast: [number, number]
}

// Race Map Component that loads GPX/GeoJSON route data
export const RaceMapComponent: React.FC<RaceMapComponentProps> = ({ 
  token,
  gpxUrl = "https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/tokyo_marathon_geo.json",
  center = [139.6917, 35.6895], // Default to Tokyo
  city = "Tokyo"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const chartContainer = useRef<HTMLCanvasElement>(null)
  const mapInstance = useRef<any>(null)
  const chartInstance = useRef<any>(null)
  const verticalLinePlugin = useRef<any>(null)
  const cleanupTimeout = useRef<any>(null)
  const isHovering = useRef<boolean>(false)
  const mapCleanupListener = useRef<(() => void) | null>(null)
  const chartCleanupListener = useRef<(() => void) | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [routeLoaded, setRouteLoaded] = useState(false)
  const [chartLoaded, setChartLoaded] = useState(false)
  const [chartJsLoaded, setChartJsLoaded] = useState(false)
  const [isMetric, setIsMetric] = useState(true)
  const [currentMapStyle, setCurrentMapStyle] = useState('streets-v11')
  const [error, setError] = useState<string | null>(null)
  const routeCoordinates = useRef<number[][]>([])
  const densifiedRoute = useRef<number[][]>([])
  const storedAidStations = useRef<PointOfInterest[]>([])
  const hoverMarker = useRef<any>(null)
  const scaleControl = useRef<any>(null)
  const navigationControl = useRef<any>(null)
  const attributionControl = useRef<any>(null)
  const distanceMarkers = useRef<any[]>([])
  const halfwayMarker = useRef<any>(null)
  const poiMarkers = useRef<any[]>([])
  const startMarker = useRef<any>(null)
  const finishMarker = useRef<any>(null)
  
  // NEW: Store calculated route bounds
  const routeBounds = useRef<RouteBounds | null>(null)
  
  const cumulativeDistances = useRef<number[]>([])
  const gradeData = useRef<number[]>([])
  
  // NEW: Store precise distances for smooth hover
  const preciseDistances = useRef<number[]>([])
  
  // Store route distance mapping for smooth interpolation
  const routeDistanceMap = useRef<number[]>([]) // Cumulative distances for each point

  // NEW: Function to calculate bounds from coordinates
  const calculateRouteBounds = (coordinates: number[][]): RouteBounds => {
    if (coordinates.length === 0) {
      return {
        southwest: center,
        northeast: center
      }
    }

    let minLng = coordinates[0][0]
    let maxLng = coordinates[0][0]
    let minLat = coordinates[0][1]
    let maxLat = coordinates[0][1]

    coordinates.forEach(coord => {
      const [lng, lat] = coord
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    })

    return {
      southwest: [minLng, minLat],
      northeast: [maxLng, maxLat]
    }
  }

  // NEW: Function to calculate center and zoom from bounds
  const calculateMapView = (bounds: RouteBounds) => {
    const centerLng = (bounds.southwest[0] + bounds.northeast[0]) / 2
    const centerLat = (bounds.southwest[1] + bounds.northeast[1]) / 2
    
    // Calculate approximate zoom level based on bounds
    // This is a rough estimation - Mapbox will fine-tune it with fitBounds
    const lngDiff = Math.abs(bounds.northeast[0] - bounds.southwest[0])
    const latDiff = Math.abs(bounds.northeast[1] - bounds.southwest[1])
    const maxDiff = Math.max(lngDiff, latDiff)
    
    let zoom = 10 // default
    if (maxDiff > 1) zoom = 8
    else if (maxDiff > 0.5) zoom = 9
    else if (maxDiff > 0.1) zoom = 11
    else if (maxDiff > 0.05) zoom = 12
    else zoom = 13
    
    return {
      center: [centerLng, centerLat] as [number, number],
      zoom
    }
  }

  // Function to determine if a POI should be shown as an aid station
  const isAidStation = (name: string): boolean => {
    const lowerName = name.toLowerCase()
    
    const aidStationKeywords = [
      'water', 'fluid', 'gatorade', 'lucozade', 'buxton', 'drink', 'hydration',
      'energy', 'gel', 'banana', 'food', 'nutrition', 'fuel',
      'aid', 'station', 'medical', 'medic', 'first aid',
      'biofreeze', 'pain relief', 'massage', 'treatment', 'refreshments', 
      'maurten', 'Maurten Sports Gels','sports gels', 'Food & First Aid', 'Refreshments & First Aid'
    ]
    
    return aidStationKeywords.some(keyword => lowerName.includes(keyword))
  }

  // Function to calculate grade between two points
  const calculateGrade = (coordinates: number[][], index: number) => {
    if (index === 0 || index >= coordinates.length - 1) return 0

    const prevCoord = coordinates[index - 1]
    const currentCoord = coordinates[index]
    const nextCoord = coordinates[index + 1]

    const distance1 = calculateDistance(prevCoord, currentCoord)
    const distance2 = calculateDistance(currentCoord, nextCoord)
    const totalDistance = distance1 + distance2

    if (totalDistance === 0) return 0

    const elevationChange = (nextCoord[2] || 0) - (prevCoord[2] || 0)
    const grade = (elevationChange / totalDistance) * 100

    return grade
  }

  // More accurate haversine distance calculation
  const calculateDistance = (coord1: number[], coord2: number[]) => {
    const R = 6371000 // Earth radius in meters
    const lat1 = coord1[1] * Math.PI / 180
    const lat2 = coord2[1] * Math.PI / 180
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Build comprehensive route distance mapping
  const buildRouteDistanceMapping = (coordinates: number[][], useMetric: boolean) => {
    const distances: number[] = [0]
    let cumulative = 0
    
    for (let i = 1; i < coordinates.length; i++) {
      const distance = calculateDistance(coordinates[i - 1], coordinates[i])
      cumulative += distance
      distances.push(useMetric ? cumulative / 1000 : cumulative / 1609.34)
    }
    
    routeDistanceMap.current = distances
    cumulativeDistances.current = distances
    return distances
  }

  // Precise point-to-line projection with better math
  const projectPointToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1
    const dy = y2 - y1
    
    // Handle degenerate case where points are identical
    if (dx === 0 && dy === 0) {
      return {
        lng: x1,
        lat: y1,
        t: 0,
        distance: Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1))
      }
    }
    
    // Calculate parameter t for projection
    const segmentLengthSquared = dx * dx + dy * dy
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / segmentLengthSquared))
    
    // Calculate projection point
    const projectedLng = x1 + t * dx
    const projectedLat = y1 + t * dy
    
    // Calculate distance from original point to projection
    const distance = Math.sqrt(
      (px - projectedLng) * (px - projectedLng) + 
      (py - projectedLat) * (py - projectedLat)
    )
    
    return {
      lng: projectedLng,
      lat: projectedLat,
      t: t,
      distance: distance
    }
  }

  // More accurate cursor-to-route projection
  const projectCursorToRouteAccurate = (mouseEvent: any) => {
    if (!mapInstance.current || !routeCoordinates.current.length) return null

    const cursorLngLat = mouseEvent.lngLat
    let closestPoint = null
    let minDistance = Infinity
    let bestSegmentIndex = -1
    let bestT = 0

    // Use ORIGINAL route coordinates for projection to avoid mapping issues
    const coordinates = routeCoordinates.current

    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lng1, lat1, ele1 = 0] = coordinates[i]
      const [lng2, lat2, ele2 = 0] = coordinates[i + 1]
      
      const projection = projectPointToLineSegment(
        cursorLngLat.lng, cursorLngLat.lat,
        lng1, lat1,
        lng2, lat2
      )

      if (projection.distance < minDistance) {
        minDistance = projection.distance
        bestSegmentIndex = i
        bestT = projection.t
        
        // Interpolate elevation
        const projectedEle = ele1 + projection.t * (ele2 - ele1)
        
        closestPoint = {
          lng: projection.lng,
          lat: projection.lat,
          ele: projectedEle,
          segmentIndex: i,
          t: projection.t,
          distance: projection.distance
        }
      }
    }

    if (closestPoint && bestSegmentIndex >= 0) {
      // Calculate exact fractional index in original route
      const fractionalIndex = bestSegmentIndex + bestT
      
      return {
        ...closestPoint,
        fractionalIndex: fractionalIndex
      }
    }

    return null
  }

  // Smooth distance calculation using fractional indices
  const calculateDistanceAtFractionalIndex = (fractionalIndex: number, useMetric: boolean) => {
    if (!routeDistanceMap.current.length) {
      buildRouteDistanceMapping(routeCoordinates.current, useMetric)
    }
    
    const wholeIndex = Math.floor(fractionalIndex)
    const fraction = fractionalIndex - wholeIndex
    
    // Boundary checks
    if (wholeIndex >= routeDistanceMap.current.length - 1) {
      return routeDistanceMap.current[routeDistanceMap.current.length - 1]
    }
    
    if (wholeIndex < 0) {
      return 0
    }
    
    // Linear interpolation between two distance points
    const distance1 = routeDistanceMap.current[wholeIndex]
    const distance2 = routeDistanceMap.current[wholeIndex + 1]
    
    return distance1 + (distance2 - distance1) * fraction
  }

  // Enhanced map hover handler with smooth projection
  const updateChartFromMapHoverSmooth = (mouseEvent: any) => {
    if (!chartInstance.current || !routeCoordinates.current.length) return

    isHovering.current = true

    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current)
      cleanupTimeout.current = null
    }

    // Get precise projection onto ORIGINAL route
    const routePoint = projectCursorToRouteAccurate(mouseEvent)
    if (!routePoint) return

    // Place marker at exact projection point
    updateHoverMarker([routePoint.lng, routePoint.lat])

    // Calculate distance at this exact position
    const chartIsMetric = chartInstance.current.options.scales.x.title.text.includes('km')
    const distance = calculateDistanceAtFractionalIndex(routePoint.fractionalIndex, chartIsMetric)
    
    // NEW: Use smooth chart hover with interpolation
    triggerSmoothChartHover(distance)
  }

  // Better chart index finding with interpolation support
  const findClosestChartIndexSmooth = (targetDistance: number, chartLabels: string[]) => {
    let closestIndex = 0
    let minDiff = Math.abs(parseFloat(chartLabels[0]) - targetDistance)
    
    for (let i = 1; i < chartLabels.length; i++) {
      const labelDistance = parseFloat(chartLabels[i])
      const diff = Math.abs(labelDistance - targetDistance)
      
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }
    
    return closestIndex
  }

  // Enhanced densify function with consistent spacing
  const densifyRouteEnhanced = (coordinates: number[][], targetPointsPerKm: number = 50) => {
    const densified: number[][] = []
    densified.push([...coordinates[0]])
    
    for (let i = 1; i < coordinates.length; i++) {
      const start = coordinates[i - 1]
      const end = coordinates[i]
      
      const segmentDistanceM = calculateDistance(start, end)
      const segmentDistanceKm = segmentDistanceM / 1000
      
      const targetPoints = Math.max(1, Math.ceil(segmentDistanceKm * targetPointsPerKm))
      
      if (targetPoints > 1) {
        for (let j = 1; j < targetPoints; j++) {
          const t = j / targetPoints
          const interpolated = [
            start[0] + t * (end[0] - start[0]),
            start[1] + t * (end[1] - start[1]),
            start[2] ? start[2] + t * ((end[2] || 0) - start[2]) : 0
          ]
          densified.push(interpolated)
        }
      }
      
      densified.push([...end])
    }
    
    console.log(`✅ Route enhanced: ${coordinates.length} → ${densified.length} points (${targetPointsPerKm} pts/km)`)
    return densified
  }

  // UPDATED: Function to calculate chart data with precise distances
  const calculateChartData = (coordinates: number[][], useMetric: boolean) => {
    const distanceData: number[] = []
    const elevationData: number[] = []
    const calculatedGrades: number[] = []
    const preciseDists: number[] = [] // Store precise values
    let cumulativeDistance = 0

    for (let i = 0; i < coordinates.length; i++) {
      const [lng, lat, ele] = coordinates[i]
      const elevation = ele || 0

      if (i > 0) {
        const distance = calculateDistance(coordinates[i - 1], coordinates[i])
        cumulativeDistance += distance
      }

      const grade = calculateGrade(coordinates, i)
      const preciseDistance = useMetric ? cumulativeDistance / 1000 : cumulativeDistance / 1609.34

      distanceData.push(preciseDistance) // Keep precise for calculations
      preciseDists.push(preciseDistance) // Store precise values
      elevationData.push(useMetric ? elevation : elevation * 3.28084)
      calculatedGrades.push(grade)
    }

    // Store precise distances for smooth hover
    preciseDistances.current = preciseDists
    gradeData.current = calculatedGrades
    buildRouteDistanceMapping(coordinates, useMetric)

    return { distanceData, elevationData, gradeData: calculatedGrades }
  }

  // Function to load Chart.js
  const loadChartJS = async () => {
    if (window.Chart) {
      if (!verticalLinePlugin.current) {
        createVerticalLinePlugin()
      }
      setChartJsLoaded(true)
      return
    }

    try {
      console.log('📊 Loading Chart.js...')
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
        script.onload = () => {
          console.log('✅ Chart.js loaded successfully')
          createVerticalLinePlugin()
          setChartJsLoaded(true)
          resolve(true)
        }
        script.onerror = (e) => {
          console.error('❌ Failed to load Chart.js:', e)
          reject(e)
        }
        document.head.appendChild(script)
      })
    } catch (err) {
      console.error('❌ Chart.js loading error:', err)
      setError('Failed to load Chart.js library')
      throw err
    }
  }

  // Function to create vertical line plugin
  const createVerticalLinePlugin = () => {
    verticalLinePlugin.current = {
      id: 'verticalLine',
      afterDatasetsDraw: (chart: any) => {
        if (chart.active && chart.active.length > 0) {
          const ctx = chart.ctx
          const activePoint = chart.active[0]
          
          // Handle both regular and interpolated elements
          const x = activePoint.element.x
          const topY = chart.scales.y.top
          const bottomY = chart.scales.y.bottom

          ctx.save()
          ctx.strokeStyle = '#e43c81'
          ctx.lineWidth = 1.5
          ctx.setLineDash([4, 4])
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.moveTo(x, topY)
          ctx.lineTo(x, bottomY)
          ctx.stroke()
          ctx.restore()
        }
      }
    }
    
    if (window.Chart) {
      window.Chart.register(verticalLinePlugin.current)
    }
  }

  // NEW: Smooth chart hover with interpolated positioning
  const triggerSmoothChartHover = (targetDistance: number) => {
    if (!chartInstance.current || !chartContainer.current) return

    const chartArea = chartInstance.current.chartArea
    const xScale = chartInstance.current.scales.x
    const yScale = chartInstance.current.scales.y
    
    if (!chartArea || !xScale || !yScale) return

    // Find the two nearest data points for interpolation
    const distances = preciseDistances.current
    let lowerIndex = 0
    let upperIndex = distances.length - 1

    // Find bounding indices
    for (let i = 0; i < distances.length - 1; i++) {
      if (distances[i] <= targetDistance && distances[i + 1] >= targetDistance) {
        lowerIndex = i
        upperIndex = i + 1
        break
      }
    }

    // Handle edge cases
    if (targetDistance <= distances[0]) {
      lowerIndex = 0
      upperIndex = 0
    } else if (targetDistance >= distances[distances.length - 1]) {
      lowerIndex = distances.length - 1
      upperIndex = distances.length - 1
    }

    // Calculate interpolation ratio
    let ratio = 0
    if (upperIndex !== lowerIndex) {
      const lowerDistance = distances[lowerIndex]
      const upperDistance = distances[upperIndex]
      ratio = (targetDistance - lowerDistance) / (upperDistance - lowerDistance)
    }

    // Interpolate elevation
    const elevationData = chartInstance.current.data.datasets[0].data
    const lowerElevation = elevationData[lowerIndex]
    const upperElevation = elevationData[upperIndex]
    const interpolatedElevation = lowerElevation + (upperElevation - lowerElevation) * ratio

    // Calculate pixel positions for interpolated point
    const lowerXPixel = xScale.getPixelForValue(lowerIndex)
    const upperXPixel = xScale.getPixelForValue(upperIndex)
    const interpolatedXPixel = lowerXPixel + (upperXPixel - lowerXPixel) * ratio
    const interpolatedYPixel = yScale.getPixelForValue(interpolatedElevation)

    // Get the dataset meta to create a proper element
    const meta = chartInstance.current.getDatasetMeta(0)
    
    // Create a Chart.js compatible virtual element
    const virtualElement = {
      x: interpolatedXPixel,
      y: interpolatedYPixel,
      // Required Chart.js properties
      hasValue: () => true,
      tooltipPosition: () => ({ x: interpolatedXPixel, y: interpolatedYPixel }),
      getCenterPoint: () => ({ x: interpolatedXPixel, y: interpolatedYPixel }),
      // Custom properties for our interpolation
      interpolated: true,
      interpolatedDistance: targetDistance,
      interpolatedElevation: interpolatedElevation,
      interpolatedGrade: gradeData.current[lowerIndex] + (gradeData.current[upperIndex] - gradeData.current[lowerIndex]) * ratio,
      // Chart.js element properties
      $context: {
        dataIndex: lowerIndex,
        datasetIndex: 0,
        parsed: {
          x: lowerIndex + ratio,
          y: interpolatedElevation
        },
        raw: interpolatedElevation
      }
    }

    const activeElements = [{
      datasetIndex: 0,
      index: lowerIndex,
      element: virtualElement
    }]

    // Update chart state
    chartInstance.current._active = activeElements
    chartInstance.current.active = activeElements

    // Store original tooltip callbacks
    const tooltip = chartInstance.current.tooltip
    if (tooltip) {
      // Get current unit info from chart
      const unitDistance = chartInstance.current.options.scales.x.title.text.includes('km') ? 'km' : 'mi'
      const unitElevation = chartInstance.current.options.scales.y.title.text.includes('m') ? 'm' : 'ft'
      
      // Store current callbacks (they might have been updated by unit toggle)
      const currentCallbacks = { ...tooltip.options.callbacks }
      
      // Temporarily override tooltip callbacks for interpolated values
      tooltip.options.callbacks.title = () => {
        return `${targetDistance.toFixed(2)} ${unitDistance}`
      }
      
      tooltip.options.callbacks.label = () => {
        const elevation = Math.round(interpolatedElevation)
        const grade = virtualElement.interpolatedGrade.toFixed(1)
        
        return [
          `Elevation: ${elevation} ${unitElevation}`,
          `Grade: ${grade}%`
        ]
      }
      
      tooltip._active = activeElements
      tooltip.update(true, false)
      tooltip.opacity = 1
      
      // Restore current callbacks (not original) after a short delay
      setTimeout(() => {
        if (tooltip.options.callbacks) {
          tooltip.options.callbacks.title = currentCallbacks.title
          tooltip.options.callbacks.label = currentCallbacks.label
        }
      }, 50)
    }

    chartInstance.current.update('none')
  }

  // Keep the original function for direct chart hover
  const triggerChartHover = (chartIndex: number) => {
    if (!chartInstance.current || !chartContainer.current) return

    const chartArea = chartInstance.current.chartArea
    const xScale = chartInstance.current.scales.x
    const yScale = chartInstance.current.scales.y
    
    if (!chartArea || !xScale || !yScale) return

    const xPixel = xScale.getPixelForValue(chartIndex)
    const chartElevationData = chartInstance.current.data.datasets[0].data
    const chartElevation = chartElevationData[chartIndex]
    const yPixel = yScale.getPixelForValue(chartElevation)

    const meta = chartInstance.current.getDatasetMeta(0)
    const element = meta.data[chartIndex]
    
    if (!element) return

    element.x = xPixel
    element.y = yPixel

    const activeElements = [{
      datasetIndex: 0,
      index: chartIndex,
      element: element
    }]

    chartInstance.current._active = activeElements
    chartInstance.current.active = activeElements

    const tooltip = chartInstance.current.tooltip
    if (tooltip) {
      tooltip._active = activeElements
      tooltip.update(true, false)
      tooltip.opacity = 1
    }

    chartInstance.current.update('none')
  }

  // Function to clear Chart.js native hover state
  const clearChartHover = (force: boolean = false) => {
    if (!chartInstance.current) return

    chartInstance.current._active = []
    chartInstance.current.active = []
    
    if (chartInstance.current.options.onHover) {
      chartInstance.current.options.onHover({ type: 'mouseleave' }, [])
    }
    
    const tooltip = chartInstance.current.tooltip
    if (tooltip) {
      tooltip._active = []
      tooltip.opacity = 0
      if (force) {
        tooltip.draw()
      }
    }
    
    chartInstance.current.update('none')
    if (force) {
      chartInstance.current.draw()
    }
  }

  // Cleanup function
  const performCompleteCleanup = () => {
    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current)
      cleanupTimeout.current = null
    }

    isHovering.current = false
    removeHoverMarker()
    clearChartHover(true)

    if (chartInstance.current) {
      chartInstance.current.active = []
      chartInstance.current._active = []
      
      const tooltip = chartInstance.current.tooltip
      if (tooltip) {
        tooltip._active = []
        tooltip.opacity = 0
        tooltip.draw()
      }
      
      chartInstance.current.update('none')
      chartInstance.current.draw()
    }
  }

  // Debounced cleanup
  const scheduleCleanup = (delay: number = 50) => {
    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current)
    }
    
    cleanupTimeout.current = setTimeout(() => {
      if (!isHovering.current) {
        performCompleteCleanup()
      }
    }, delay)
  }

  // More accurate coordinate finding with smooth interpolation
  const findCoordinateAtDistance = (targetDistance: number, coordinates: number[][], useMetric: boolean) => {
    // Ensure we have fresh distance mapping for current unit system
    if (!routeDistanceMap.current.length || routeDistanceMap.current.length !== coordinates.length) {
      buildRouteDistanceMapping(coordinates, useMetric)
    }
    
    // Handle edge cases
    if (targetDistance <= 0) {
      return coordinates[0]
    }
    
    const maxDistance = routeDistanceMap.current[routeDistanceMap.current.length - 1]
    if (targetDistance >= maxDistance) {
      return coordinates[coordinates.length - 1]
    }
    
    // Find the segment that contains our target distance
    let segmentIndex = 0
    for (let i = 1; i < routeDistanceMap.current.length; i++) {
      if (routeDistanceMap.current[i] >= targetDistance) {
        segmentIndex = i - 1
        break
      }
    }
    
    // Handle boundary cases
    if (segmentIndex >= coordinates.length - 1) {
      return coordinates[coordinates.length - 1]
    }
    
    if (segmentIndex < 0) {
      return coordinates[0]
    }
    
    // Calculate interpolation ratio
    const distance1 = routeDistanceMap.current[segmentIndex]
    const distance2 = routeDistanceMap.current[segmentIndex + 1]
    const ratio = distance2 > distance1 ? (targetDistance - distance1) / (distance2 - distance1) : 0
    
    // Clamp ratio to [0, 1] to avoid extrapolation
    const clampedRatio = Math.max(0, Math.min(1, ratio))
    
    // Interpolate between coordinates
    const coord1 = coordinates[segmentIndex]
    const coord2 = coordinates[segmentIndex + 1]
    
    return [
      coord1[0] + (coord2[0] - coord1[0]) * clampedRatio,
      coord1[1] + (coord2[1] - coord1[1]) * clampedRatio,
      coord1[2] ? coord1[2] + ((coord2[2] || 0) - coord1[2]) * clampedRatio : 0
    ]
  }

  // UPDATED: Function to initialize elevation chart with precise distances
  const initializeChart = async (coordinates: number[][]) => {
    if (!chartContainer.current || !chartJsLoaded) {
      console.warn('⚠️ Chart container or Chart.js not available')
      return
    }

    try {
      console.log('📊 Initializing elevation chart...')

      const { distanceData, elevationData } = calculateChartData(coordinates, isMetric)
      const unitDistance = isMetric ? 'km' : 'mi'
      const unitElevation = isMetric ? 'm' : 'ft'

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new window.Chart(chartContainer.current, {
        type: 'line',
        data: {
          // Use rounded labels for clean display
          labels: distanceData.map(d => d.toFixed(1)),
          datasets: [{
            label: `Elevation (${unitElevation})`,
            data: elevationData,
            borderColor: '#e43c81',
            backgroundColor: 'rgba(228, 60, 129, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#e43c81',
          }]
        },
        plugins: [verticalLinePlugin.current],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 12,
              right: 12,
              bottom: 8,
              left: 8
            }
          },
          onHover: (event: any, activeElements: any[]) => {
            if (activeElements.length > 0 && routeCoordinates.current.length > 0) {
              const index = activeElements[0].index
              
              // Use PRECISE distance instead of rounded label
              const preciseDistance = preciseDistances.current[index]
              
              chartInstance.current.active = activeElements
              
              const coordinate = findCoordinateAtDistance(preciseDistance, routeCoordinates.current, isMetric)
              updateHoverMarker(coordinate)
              
              chartInstance.current.draw()
            } else {
              chartInstance.current.active = []
              removeHoverMarker()
              chartInstance.current.draw()
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: 'rgb(249, 250, 250)',
              bodyColor: 'rgb(249, 250, 250)',
              borderColor: 'rgba(231, 231, 231, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              titleFont: {
                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 13,
                weight: '500'
              },
              bodyFont: {
                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 12,
                weight: '400'
              },
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (tooltipItems: any[]) => {
                  const index = tooltipItems[0].dataIndex
                  const preciseDistance = preciseDistances.current[index]
                  return `${preciseDistance.toFixed(2)} ${unitDistance}` // Show 2 decimal places in tooltip
                },
                label: (context: any) => {
                  const index = context.dataIndex
                  const elevation = Math.round(context.parsed.y)
                  const grade = gradeData.current[index]?.toFixed(1) || '0.0'
                  
                  return [
                    `Elevation: ${elevation} ${unitElevation}`,
                    `Grade: ${grade}%`
                  ]
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              border: {
                display: false
              },
              title: {
                display: true,
                text: `Distance (${unitDistance})`,
                color: 'rgb(107, 114, 128)',
                font: {
                  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  size: 12,
                  weight: '400'
                },
                padding: {
                  top: 8
                }
              },
              grid: {
                color: 'rgba(231, 231, 231, 0.6)',
                drawBorder: false,
                lineWidth: 0.5
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                font: {
                  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  size: 11,
                  weight: '400'
                },
                maxTicksLimit: 8,
                padding: 6
              }
            },
            y: {
              display: true,
              border: {
                display: false
              },
              title: {
                display: true,
                text: `Elevation (${unitElevation})`,
                color: 'rgb(107, 114, 128)',
                font: {
                  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  size: 12,
                  weight: '400'
                },
                padding: {
                  bottom: 8
                }
              },
              grid: {
                color: 'rgba(231, 231, 231, 0.6)',
                drawBorder: false,
                lineWidth: 0.5
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                font: {
                  family: '-apple-system, BlinkMacSystemFont, "Segue UI", Roboto, sans-serif',
                  size: 11,
                  weight: '400'
                },
                padding: 6
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              hoverRadius: 5
            }
          }
        }
      })

      if (chartContainer.current) {
        const handleChartMouseLeave = () => {
          isHovering.current = false
          scheduleCleanup(100)
        }
        
        chartContainer.current.addEventListener('mouseleave', handleChartMouseLeave)
        chartCleanupListener.current = handleChartMouseLeave
      }

      console.log('✅ Elevation chart initialized successfully')
      setChartLoaded(true)
    } catch (err) {
      console.error('❌ Chart initialization error:', err)
      setError(`Chart initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Create hover marker
  const createHoverMarker = () => {
    if (hoverMarker.current || !mapInstance.current) {
      console.log('⚠️ Hover marker already exists or map not ready')
      return
    }

    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: #1e40af;
      border: 2px solid white;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      opacity: 0;
      pointer-events: none;
      z-index: 1;
    `

    hoverMarker.current = new window.mapboxgl.Marker(markerElement)
      .setLngLat(center)
      .addTo(mapInstance.current)

    console.log('✅ Hover marker created with proper layering at:', center)
  }

  // Updated hover marker functions
  const updateHoverMarker = (coordinate: number[]) => {
    if (!mapInstance.current || !hoverMarker.current) {
      console.warn('⚠️ Map instance or hover marker not available')
      return
    }

    hoverMarker.current.setLngLat(coordinate)
    const element = hoverMarker.current.getElement()
    if (element) {
      element.style.opacity = '1'
    }
  }

  const removeHoverMarker = () => {
    if (hoverMarker.current) {
      const element = hoverMarker.current.getElement()
      if (element) {
        element.style.opacity = '0'
      }
    }
  }

  // Update chart when toggling units
  const updateChart = (coordinates: number[][]) => {
    updateChartWithUnits(coordinates, isMetric)
  }

  // UPDATED: Update chart with units using precise distances
  const updateChartWithUnits = (coordinates: number[][], useMetric: boolean) => {
    if (!chartInstance.current) return

    const { distanceData, elevationData } = calculateChartData(coordinates, useMetric)
    const unitDistance = useMetric ? 'km' : 'mi'
    const unitElevation = useMetric ? 'm' : 'ft'

    // Update chart data with rounded labels but precise internal data
    chartInstance.current.data.labels = distanceData.map(d => d.toFixed(1))
    chartInstance.current.data.datasets[0].data = elevationData
    chartInstance.current.data.datasets[0].label = `Elevation (${unitElevation})`

    chartInstance.current.options.scales.x.title.text = `Distance (${unitDistance})`
    chartInstance.current.options.scales.y.title.text = `Elevation (${unitElevation})`

    // Update tooltip callbacks with proper restoration
    const originalTitle = chartInstance.current.options.plugins.tooltip.callbacks.title
    const originalLabel = chartInstance.current.options.plugins.tooltip.callbacks.label

    chartInstance.current.options.plugins.tooltip.callbacks.title = (tooltipItems: any[]) => {
      const index = tooltipItems[0].dataIndex
      const preciseDistance = preciseDistances.current[index]
      return `${preciseDistance.toFixed(2)} ${unitDistance}` // Show 2 decimal places in tooltip
    }
    
    chartInstance.current.options.plugins.tooltip.callbacks.label = (context: any) => {
      const index = context.dataIndex
      const elevation = Math.round(context.parsed.y)
      const grade = gradeData.current[index]?.toFixed(1) || '0.0'
      
      return [
        `Elevation: ${elevation} ${unitElevation}`,
        `Grade: ${grade}%`
      ]
    }

    // Update hover handler to use precise distances
    chartInstance.current.options.onHover = (event: any, activeElements: any[]) => {
      if (activeElements.length > 0 && routeCoordinates.current.length > 0) {
        const index = activeElements[0].index
        const preciseDistance = preciseDistances.current[index] // Use precise value
        
        chartInstance.current.active = activeElements
        
        const coordinate = findCoordinateAtDistance(preciseDistance, routeCoordinates.current, useMetric)
        updateHoverMarker(coordinate)
        
        chartInstance.current.draw()
      } else {
        chartInstance.current.active = []
        removeHoverMarker()
        chartInstance.current.draw()
      }
    }

    chartInstance.current.update('none')
    console.log('✅ Chart updated for', useMetric ? 'metric' : 'imperial', 'units')
  }

  // Marker creation functions
  const createStravaNumberMarker = (number: string) => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: white;
      border: 2px solid #e43c81;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-weight: 600;
      font-size: 11px;
      color: #e43c81;
      cursor: pointer;
      z-index: 10;
    `
    markerElement.textContent = number
    return markerElement
  }

  const createStravaFlagMarker = () => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: white;
      border: 2px solid #e43c81;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 8;
    `
    
    const flagSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    flagSvg.setAttribute("fill", "none")
    flagSvg.setAttribute("viewBox", "0 0 16 16")
    flagSvg.setAttribute("width", "8")
    flagSvg.setAttribute("height", "8")
    
    const flagPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    flagPath.setAttribute("d", "M3 3.5a.5.5 0 011 0V5h8V3.5a.5.5 0 011 0V13h-1V9H4v4H3V5.667v-.019z")
    flagPath.setAttribute("fill", "#e43c81")
    
    flagSvg.appendChild(flagPath)
    markerElement.appendChild(flagSvg)
    
    return markerElement
  }

  const createStravaStartMarker = () => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: #22c55e;
      border: 2px solid white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      z-index: 5;
    `
    return markerElement
  }

  const createStravaFinishMarker = () => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      border: 2px solid white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      overflow: hidden;
      position: relative;
      z-index: 5;
    `
    
    const flagPattern = document.createElement('div')
    flagPattern.style.cssText = `
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(45deg, #000 25%, transparent 25%), 
        linear-gradient(-45deg, #000 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #000 75%), 
        linear-gradient(-45deg, transparent 75%, #000 75%);
      background-size: 4px 4px;
      background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
      background-color: white;
    `
    
    markerElement.appendChild(flagPattern)
    return markerElement
  }

  const createAidStationMarker = () => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: #60a5fa;
      border: 2px solid white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 6;
    `
    
    const dropSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    dropSvg.setAttribute("fill", "none")
    dropSvg.setAttribute("viewBox", "0 0 12 12")
    dropSvg.setAttribute("width", "10")
    dropSvg.setAttribute("height", "10")
    
    const dropPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    dropPath.setAttribute("d", "M6 1.5c-1.2 1.6-3.2 3.6-3.2 5.6a3.2 3.2 0 0 0 6.4 0c0-2-2-4-3.2-5.6z")
    dropPath.setAttribute("fill", "white")
    
    dropSvg.appendChild(dropPath)
    markerElement.appendChild(dropSvg)
    
    return markerElement
  }

  // Extract aid stations from GeoJSON
  const extractAidStations = (geojsonData: any): PointOfInterest[] => {
    const aidStations: PointOfInterest[] = []
    
    if (geojsonData.features) {
      geojsonData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Point' && feature.properties && feature.properties.name) {
          const name = feature.properties.name
          
          if (isAidStation(name)) {
            const coordinates = feature.geometry.coordinates
            
            aidStations.push({
              name,
              coordinates: [coordinates[0], coordinates[1]],
              type: 'aid_station',
              description: feature.properties.desc || feature.properties.description || null
            })
          }
        }
      })
    }
    
    return aidStations
  }

  // Calculate total route distance
  const calculateTotalDistance = (coordinates: number[][], useMetric: boolean) => {
    let totalDistance = 0
    for (let i = 1; i < coordinates.length; i++) {
      const distance = calculateDistance(coordinates[i - 1], coordinates[i])
      totalDistance += distance
    }
    return useMetric ? totalDistance / 1000 : totalDistance / 1609.34
  }

  // Add distance markers
  const addDistanceMarkers = (coordinates: number[][]) => {
    addDistanceMarkersWithUnits(coordinates, isMetric)
  }

  const addDistanceMarkersWithUnits = (coordinates: number[][], useMetric: boolean) => {
    // Clear existing markers
    distanceMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    distanceMarkers.current = []

    if (halfwayMarker.current) {
      halfwayMarker.current.remove()
      halfwayMarker.current = null
    }

    // Rebuild distance mapping for the current unit system
    buildRouteDistanceMapping(coordinates, useMetric)
    
    const unit = useMetric ? 'km' : 'mi'
    const totalDistance = calculateTotalDistance(coordinates, useMetric)
    const halfwayDistance = totalDistance / 2
    
    // Set marker intervals based on unit system
    const markerInterval = useMetric ? 5 : 5 // 5km or 5mi intervals
    let halfwayMarkerAdded = false

    // Add halfway marker first
    const halfwayCoordinate = findCoordinateAtDistance(halfwayDistance, coordinates, useMetric)
    if (halfwayCoordinate) {
      const halfwayMarkerElement = createStravaFlagMarker()
      
      halfwayMarker.current = new window.mapboxgl.Marker(halfwayMarkerElement)
        .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
        .addTo(mapInstance.current)

      const halfwayPopup = new window.mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: 'halfway-marker-popup'
      })

      halfwayMarkerElement.addEventListener('mouseenter', () => {
        halfwayPopup
          .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
          .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">Halfway</div>`)
          .addTo(mapInstance.current)
          
        setTimeout(() => {
          const popupEl = halfwayPopup.getElement()
          if (popupEl) {
            popupEl.style.zIndex = '999'
          }
        }, 0)
      })

      halfwayMarkerElement.addEventListener('mouseleave', () => {
        halfwayPopup.remove()
      })

      halfwayMarkerAdded = true
    }

    // Add distance markers at regular intervals
    let currentMarkerDistance = markerInterval
    while (currentMarkerDistance < totalDistance) {
      const markerCoordinate = findCoordinateAtDistance(currentMarkerDistance, coordinates, useMetric)
      
      if (markerCoordinate) {
        const markerElement = createStravaNumberMarker(`${currentMarkerDistance}`)
        
        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([markerCoordinate[0], markerCoordinate[1]])
          .addTo(mapInstance.current)

        distanceMarkers.current.push(marker)

        const popup = new window.mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15,
          className: 'distance-marker-popup'
        })

        // Capture the current distance value in the closure
        const markerDistance = currentMarkerDistance
        markerElement.addEventListener('mouseenter', () => {
          popup
            .setLngLat([markerCoordinate[0], markerCoordinate[1]])
            .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">${markerDistance} ${unit}</div>`)
            .addTo(mapInstance.current)
            
          setTimeout(() => {
            const popupEl = popup.getElement()
            if (popupEl) {
              popupEl.style.zIndex = '999'
            }
          }, 0)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })
      }
      
      currentMarkerDistance += markerInterval
    }

    console.log(`✅ Created ${distanceMarkers.current.length} distance markers and ${halfwayMarkerAdded ? 1 : 0} halfway marker for ${unit} units`)
  }

  // Add aid station markers
  const addAidStationMarkers = (aidStations: PointOfInterest[]) => {
    poiMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    poiMarkers.current = []

    aidStations.forEach(aidStation => {
      const markerElement = createAidStationMarker()
      
      const marker = new window.mapboxgl.Marker(markerElement)
        .setLngLat(aidStation.coordinates)
        .addTo(mapInstance.current)

      poiMarkers.current.push(marker)

      const popup = new window.mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15
      })

      markerElement.addEventListener('mouseenter', () => {
        const cleanedName = aidStation.name
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/\t+/g, ' ')
          .trim()

        const cleanedDescription = aidStation.description 
          ? aidStation.description
              .replace(/\s+/g, ' ')
              .replace(/\n+/g, ' ')
              .replace(/\t+/g, ' ')
              .trim()
          : null
        
        let tooltipContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; padding: 6px 8px; line-height: 1.2;">
          <div style="font-weight: 600; font-size: 12px; margin: 0; padding: 0;">${cleanedName}</div>`
        
        if (cleanedDescription) {
          tooltipContent += `<div style="font-weight: 400; font-size: 11px; color: #6b7280; margin: 2px 0 0 0; padding: 0; line-height: 1.3;">${cleanedDescription}</div>`
        }
        
        tooltipContent += '</div>'

        popup
          .setLngLat(aidStation.coordinates)
          .setHTML(tooltipContent)
          .addTo(mapInstance.current)
          
        setTimeout(() => {
          const popupEl = popup.getElement()
          if (popupEl) {
            popupEl.style.zIndex = '999'
            
            const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
            if (popupContent) {
              popupContent.style.padding = '0'
              popupContent.style.margin = '0'
              popupContent.style.minWidth = '0'
              popupContent.style.maxWidth = '300px'
              popupContent.style.width = 'auto'
            }
          }
        }, 0)
      })

      markerElement.addEventListener('mouseleave', () => {
        popup.remove()
      })
    })

    console.log(`✅ Created ${aidStations.length} aid station markers`)
  }

  // Helper function to safely remove existing route data
  const removeExistingRouteData = () => {
    if (!mapInstance.current) return

    console.log('🧹 Cleaning up existing route data...')

    const routeEvents = ['mouseenter', 'mouseleave', 'mousemove']
    routeEvents.forEach(eventType => {
      try {
        mapInstance.current.off(eventType, 'route-line')
        mapInstance.current.off(eventType, 'route-hover-zone') // Also clean up hover zone events
      } catch (e) {
        // Event listener might not exist
      }
    })

    const layersToRemove = ['route-arrows', 'route-highlight', 'route-line', 'route-border', 'route-shadow', 'route-hover-zone']
    layersToRemove.forEach(layerId => {
      if (mapInstance.current.getLayer(layerId)) {
        console.log(`🧹 Removing layer: ${layerId}`)
        mapInstance.current.removeLayer(layerId)
      }
    })

    const sourcesToRemove = ['route']
    sourcesToRemove.forEach(sourceId => {
      if (mapInstance.current.getSource(sourceId)) {
        console.log(`🧹 Removing source: ${sourceId}`)
        mapInstance.current.removeSource(sourceId)
      }
    })

    if (hoverMarker.current) {
      const element = hoverMarker.current.getElement()
      if (element) {
        element.style.opacity = '0'
      }
    }

    console.log('🧹 Removing existing markers...')
    
    distanceMarkers.current.forEach((marker, index) => {
      if (marker) {
        console.log(`🧹 Removing distance marker ${index}`)
        marker.remove()
      }
    })
    distanceMarkers.current = []

    if (halfwayMarker.current) {
      console.log('🧹 Removing halfway marker')
      halfwayMarker.current.remove()
      halfwayMarker.current = null
    }

    poiMarkers.current.forEach((marker, index) => {
      if (marker) {
        console.log(`🧹 Removing POI marker ${index}`)
        marker.remove()
      }
    })
    poiMarkers.current = []

    if (startMarker.current) {
      console.log('🧹 Removing start marker')
      startMarker.current.remove()
      startMarker.current = null
    }
    if (finishMarker.current) {
      console.log('🧹 Removing finish marker')
      finishMarker.current.remove()
      finishMarker.current = null
    }

    console.log('✅ Route data cleanup completed')
  }

  // Helper function to safely add map controls
  const addMapControls = () => {
    if (!mapInstance.current) return

    if (!navigationControl.current) {
      navigationControl.current = new window.mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true
      })
      mapInstance.current.addControl(navigationControl.current, 'top-left')
    }

    if (!scaleControl.current) {
      scaleControl.current = new window.mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: isMetric ? 'metric' : 'imperial'
      })
      mapInstance.current.addControl(scaleControl.current, 'bottom-left')
    }

    if (!attributionControl.current) {
      attributionControl.current = new window.mapboxgl.AttributionControl({
        compact: true
      })
      mapInstance.current.addControl(attributionControl.current, 'bottom-right')
    }
  }

  // Helper function to remove all controls
  const removeMapControls = () => {
    if (!mapInstance.current) return

    if (navigationControl.current) {
      mapInstance.current.removeControl(navigationControl.current)
      navigationControl.current = null
    }

    if (scaleControl.current) {
      mapInstance.current.removeControl(scaleControl.current)
      scaleControl.current = null
    }

    if (attributionControl.current) {
      mapInstance.current.removeControl(attributionControl.current)
      attributionControl.current = null
    }
  }

  // Main route addition function with smooth hover interaction
  const addRouteToMap = (coordinates: number[][], aidStations: PointOfInterest[] = []) => {
    if (!mapInstance.current) return

    console.log(`🗺️ Adding route to map with ${coordinates.length} coordinates and ${aidStations.length} aid stations`)

    removeExistingRouteData()

    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }]
    }
    
    mapInstance.current.addSource('route', {
      type: 'geojson',
      data: geojson,
      lineMetrics: true
    })

    // Add Strava-style route layers
    mapInstance.current.addLayer({
      id: 'route-shadow',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'rgba(0, 0, 0, 0.25)',
        'line-width': 9,
        'line-blur': 2
      }
    })

    mapInstance.current.addLayer({
      id: 'route-border',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 7
      }
    })

    mapInstance.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#e43c81',
        'line-width': 5
      }
    })

    mapInstance.current.addLayer({
      id: 'route-highlight',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'rgba(255, 255, 255, 0.4)',
        'line-width': 2.5
      }
    })

    // NEW: Add invisible wider hover layer for better interaction
    mapInstance.current.addLayer({
      id: 'route-hover-zone',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'rgba(255, 255, 255, 0)', // Completely transparent
        'line-width': 25 // Much wider hover zone
      }
    })

    // Enhanced route hover interaction with smooth projection
    // Use the wider hover zone for better UX
    mapInstance.current.on('mouseenter', 'route-hover-zone', () => {
      mapInstance.current.getCanvas().style.cursor = 'crosshair'
      isHovering.current = true
      
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current)
        cleanupTimeout.current = null
      }
    })

    mapInstance.current.on('mouseleave', 'route-hover-zone', () => {
      mapInstance.current.getCanvas().style.cursor = ''
      isHovering.current = false
      scheduleCleanup(100)
    })

    // Use the improved smooth hover handler on the wider zone
    mapInstance.current.on('mousemove', 'route-hover-zone', updateChartFromMapHoverSmooth)

    if (mapContainer.current) {
      const handleMapMouseLeave = () => {
        isHovering.current = false
        scheduleCleanup(50)
      }
      
      mapContainer.current.addEventListener('mouseleave', handleMapMouseLeave)
      mapCleanupListener.current = handleMapMouseLeave
    }

    // Add directional arrows
    mapInstance.current.addLayer({
      id: 'route-arrows',
      type: 'symbol',
      source: 'route',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 80,
        'icon-image': 'arrow-right',
        'icon-size': 1.2,
        'icon-rotation-alignment': 'map',
        'icon-pitch-alignment': 'map',
        'icon-ignore-placement': true,
        'icon-allow-overlap': true
      },
      paint: {
        'icon-opacity': 1.0
      }
    })

    if (!mapInstance.current.hasImage('arrow-right')) {
      const arrowSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" 
                d="M6 6 L13 10 L6 14" />
          <path fill="none" stroke="#e43c81" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" 
                d="M6 6 L13 10 L6 14" />
        </svg>
      `
      
      const img = new Image(20, 20)
      img.onload = () => {
        if (mapInstance.current && !mapInstance.current.hasImage('arrow-right')) {
          mapInstance.current.addImage('arrow-right', img)
        }
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(arrowSvg)
    }

    // Add markers using ORIGINAL coordinates
    const originalCoords = routeCoordinates.current.length > 0 ? routeCoordinates.current : coordinates
    console.log('🗺️ Adding markers in proper order...')

    // Start marker
    const startMarkerElement = createStravaStartMarker()
    startMarker.current = new window.mapboxgl.Marker(startMarkerElement)
      .setLngLat(originalCoords[0])
      .addTo(mapInstance.current)

    const startPopup = new window.mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'start-marker-popup'
    })

    startMarkerElement.addEventListener('mouseenter', () => {
      startPopup
        .setLngLat(originalCoords[0])
        .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">Start</div>`)
        .addTo(mapInstance.current)
        
      setTimeout(() => {
        const popupEl = startPopup.getElement()
        if (popupEl) {
          popupEl.style.zIndex = '999'
        }
      }, 0)
    })

    startMarkerElement.addEventListener('mouseleave', () => {
      startPopup.remove()
    })

    // Finish marker
    const finishMarkerElement = createStravaFinishMarker()
    finishMarker.current = new window.mapboxgl.Marker(finishMarkerElement)
      .setLngLat(originalCoords[originalCoords.length - 1])
      .addTo(mapInstance.current)

    const finishPopup = new window.mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'finish-marker-popup'
    })

    finishMarkerElement.addEventListener('mouseenter', () => {
      finishPopup
        .setLngLat(originalCoords[originalCoords.length - 1])
        .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">End</div>`)
        .addTo(mapInstance.current)
        
      setTimeout(() => {
        const popupEl = finishPopup.getElement()
        if (popupEl) {
          popupEl.style.zIndex = '999'
        }
      }, 0)
    })

    finishMarkerElement.addEventListener('mouseleave', () => {
      finishPopup.remove()
    })

    // Add aid station markers
    if (aidStations.length > 0) {
      console.log(`🗺️ Adding ${aidStations.length} aid station markers`)
      addAidStationMarkers(aidStations)
    }

    // Add distance markers using original coordinates
    console.log('🗺️ Adding distance and halfway markers')
    addDistanceMarkersWithUnits(originalCoords, isMetric)

    console.log('✅ Route and all markers added successfully with enhanced cursor accuracy')
  }

  // Function to change map style
  const changeMapStyle = (styleId: string) => {
    if (mapInstance.current && styleId !== currentMapStyle) {
      console.log(`🎨 Changing map style from ${currentMapStyle} to ${styleId}`)
      setCurrentMapStyle(styleId)
      mapInstance.current.setStyle(`mapbox://styles/mapbox/${styleId}`)
      
      mapInstance.current.once('styledata', () => {
        console.log(`🎨 Map style changed to ${styleId}, restoring route and markers...`)
        
        if (hoverMarker.current) {
          hoverMarker.current.remove()
          hoverMarker.current = null
        }
        createHoverMarker()
        
        if (routeLoaded && densifiedRoute.current.length > 0) {
          console.log(`🎨 Restoring route with ${storedAidStations.current.length} aid stations`)
          addRouteToMap(densifiedRoute.current, storedAidStations.current)
        }
      })
    }
  }

  // Function to toggle between metric and imperial
  const toggleUnits = () => {
    const newIsMetric = !isMetric
    setIsMetric(newIsMetric)
    
    // Update scale control
    if (scaleControl.current && mapInstance.current) {
      mapInstance.current.removeControl(scaleControl.current)
      scaleControl.current = new window.mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: newIsMetric ? 'metric' : 'imperial'
      })
      mapInstance.current.addControl(scaleControl.current, 'bottom-left')
    }
    
    // Clear and rebuild distance mapping for new unit system
    routeDistanceMap.current = []
    cumulativeDistances.current = []
    
    // Update distance markers if route is loaded
    if (routeLoaded && mapInstance.current && mapInstance.current.getSource('route')) {
      const coordinates = routeCoordinates.current
      // Rebuild distance markers with proper cleanup
      addDistanceMarkersWithUnits(coordinates, newIsMetric)
    }

    // Update chart if loaded
    if (chartLoaded && routeCoordinates.current.length > 0) {
      updateChartWithUnits(routeCoordinates.current, newIsMetric)
    }
    
    console.log(`✅ Units toggled to ${newIsMetric ? 'metric' : 'imperial'}`)
  }

  // NEW: Function to load route data and calculate bounds
  const loadRouteData = async () => {
    try {
      console.log(`📍 Loading ${city} route data...`)
      
      const response = await fetch(gpxUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch route data: ${response.status}`)
      }
      
      const geojson = await response.json()
      console.log(`📍 ${city} route data loaded:`, geojson)

      if (!geojson.features || !geojson.features[0] || !geojson.features[0].geometry) {
        throw new Error('Invalid GeoJSON structure')
      }

      const mainRoute = geojson.features.find((feature: any) => 
        feature.geometry.type === 'LineString'
      )
      
      if (!mainRoute) {
        throw new Error('No LineString route found in GeoJSON')
      }

      const coordinates = mainRoute.geometry.coordinates
      console.log(`📍 ${city} route coordinates count:`, coordinates.length)

      // Store ORIGINAL coordinates for chart (not densified)
      routeCoordinates.current = coordinates
      
      // Calculate bounds from original coordinates
      const bounds = calculateRouteBounds(coordinates)
      routeBounds.current = bounds
      console.log(`📍 Calculated route bounds:`, bounds)

      // Use moderate densification - balance between smoothness and performance
      const densified = densifyRouteEnhanced(coordinates, 50) // 50 points per km
      densifiedRoute.current = densified

      const aidStations = extractAidStations(geojson)
      console.log(`📍 Found ${aidStations.length} aid stations in ${city} route data`)
      storedAidStations.current = aidStations

      return { coordinates, densified, aidStations, bounds }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Route loading error:', err)
      setError(`Route error: ${errorMsg}`)
      throw err
    }
  }

  // UPDATED: Main initialization effect with proper bounds handling
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadChartJS()

        if (!window.mapboxgl) {
          console.log('🗺️ Loading Mapbox...')
          const link = document.createElement('link')
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
          link.rel = 'stylesheet'
          document.head.appendChild(link)

          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
            script.onload = () => {
              console.log('✅ Mapbox loaded successfully')
              resolve(true)
            }
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        window.mapboxgl.accessToken = token
        console.log('✅ Mapbox token set')

        // NEW: Load route data first to get proper bounds
        let mapCenter = center
        let mapZoom = 10
        
        try {
          const routeData = await loadRouteData()
          if (routeData && routeData.bounds) {
            const mapView = calculateMapView(routeData.bounds)
            mapCenter = mapView.center
            mapZoom = mapView.zoom
            console.log(`📍 Using calculated map view - center: ${mapCenter}, zoom: ${mapZoom}`)
          }
        } catch (err) {
          console.log('⚠️ Using fallback center/zoom due to route loading error')
        }

        // Initialize map with calculated center and zoom
        mapInstance.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: mapCenter,
          zoom: mapZoom,
          attributionControl: false
        })

        mapInstance.current.on('load', async () => {
          console.log(`✅ ${city} map loaded successfully!`)
          setMapLoaded(true)
          
          addMapControls()
          createHoverMarker()
          
          // If route data was loaded successfully, add it to the map
          if (routeBounds.current && densifiedRoute.current.length > 0) {
            console.log(`🗺️ Adding pre-loaded route data`)
            removeExistingRouteData()
            addRouteToMap(densifiedRoute.current, storedAidStations.current)
            
            // Fine-tune the bounds with some padding
            const bounds = routeBounds.current
            mapInstance.current.fitBounds([
              bounds.southwest,
              bounds.northeast
            ], { 
              padding: 50,
              duration: 0 // No animation to avoid visible movement
            })
            
            console.log(`✅ ${city} route loaded successfully!`)
            setRouteLoaded(true)

            // Initialize chart with original coordinates
            if (chartJsLoaded) {
              await initializeChart(routeCoordinates.current)
            }
          } else {
            // Fallback: try loading route again if it failed earlier
            await loadRoute()
          }
        })

        mapInstance.current.on('error', (e: any) => {
          console.error('❌ Map error:', e.error)
          setError(`Map error: ${e.error?.message || 'Unknown error'}`)
        })

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('❌ Setup error:', err)
        setError(`Setup error: ${errorMsg}`)
      }
    }

    // Fallback route loading function (for backward compatibility)
    const loadRoute = async () => {
      try {
        if (routeCoordinates.current.length > 0) {
          // Route already loaded
          return
        }

        const routeData = await loadRouteData()
        if (!routeData) return

        removeExistingRouteData()

        // Add route to map using densified route for rendering
        addRouteToMap(routeData.densified, routeData.aidStations)

        const bounds = routeData.bounds
        mapInstance.current.fitBounds([
          bounds.southwest,
          bounds.northeast
        ], { 
          padding: 50,
          duration: 2000
        })

        console.log(`✅ ${city} route loaded successfully!`)
        setRouteLoaded(true)

        // Initialize chart with original coordinates
        if (chartJsLoaded) {
          await initializeChart(routeData.coordinates)
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('❌ Route loading error:', err)
        setError(`Route error: ${errorMsg}`)
      }
    }

    if (mapContainer.current) {
      initMap()
    }

    // Cleanup
    return () => {
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current)
      }
      
      if (mapInstance.current) {
        try {
          mapInstance.current.off('mouseenter', 'route-line')
          mapInstance.current.off('mouseleave', 'route-line') 
          mapInstance.current.off('mousemove', 'route-line')
        } catch (e) {
          // Event listeners might not exist
        }
        
        if (hoverMarker.current) {
          hoverMarker.current.remove()
        }
        distanceMarkers.current.forEach(marker => {
          if (marker) marker.remove()
        })
        if (halfwayMarker.current) {
          halfwayMarker.current.remove()
        }
        poiMarkers.current.forEach(marker => {
          if (marker) marker.remove()
        })
        if (startMarker.current) {
          startMarker.current.remove()
        }
        if (finishMarker.current) {
          finishMarker.current.remove()
        }
        removeMapControls()
        mapInstance.current.remove()
      }
      
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      
      if (mapContainer.current && mapCleanupListener.current) {
        mapContainer.current.removeEventListener('mouseleave', mapCleanupListener.current)
        mapCleanupListener.current = null
      }
      
      if (chartContainer.current && chartCleanupListener.current) {
        chartContainer.current.removeEventListener('mouseleave', chartCleanupListener.current)
        chartCleanupListener.current = null
      }
    }
  }, [token, gpxUrl, center, city])

  // Effect to initialize chart when Chart.js loads and route is ready
  useEffect(() => {
    if (chartJsLoaded && routeLoaded && routeCoordinates.current.length > 0 && !chartLoaded) {
      initializeChart(routeCoordinates.current)
    }
  }, [chartJsLoaded, routeLoaded, chartLoaded])

  return (
    <div className="my-8 relative" style={{ isolation: 'isolate' }}>
      <style jsx>{`
        .map-component-container {
          position: relative;
          z-index: 0;
          isolation: isolate;
        }
        
        .map-component-container .mapboxgl-ctrl-group {
          z-index: 100 !important;
        }
        
        .map-component-container .mapboxgl-ctrl {
          z-index: 100 !important;
        }
        
        .map-component-container .custom-map-controls {
          z-index: 101 !important;
        }
        
        .map-component-container .mapboxgl-popup {
          z-index: 999 !important;
        }
        
        .map-component-container .mapboxgl-popup-content {
          z-index: 999 !important;
        }
        
        .map-component-container .mapboxgl-popup-tip {
          z-index: 999 !important;
        }
        
        .map-component-container .mapboxgl-marker {
          z-index: auto !important;
        }
        
        .map-component-container .mapboxgl-marker:first-child {
          z-index: 1 !important;
        }
      `}</style>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="relative border border-gray-200 rounded-lg overflow-hidden map-component-container">
        {routeLoaded && (
          <div className="absolute top-4 right-4 custom-map-controls flex gap-2">
            <select
              value={currentMapStyle}
              onChange={(e) => changeMapStyle(e.target.value)}
              className="mapboxgl-ctrl mapboxgl-ctrl-group bg-white text-gray-800 border-0 rounded shadow-sm text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '12px',
                padding: '6px 8px',
                minWidth: '120px'
              }}
            >
              <option value="streets-v11">Standard Map</option>
              <option value="satellite-v9">Satellite Map</option>
              <option value="satellite-streets-v11">Hybrid Map</option>
            </select>
            
            <button
              onClick={toggleUnits}
              className="mapboxgl-ctrl mapboxgl-ctrl-group bg-white text-gray-800 border-0 rounded shadow-sm text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '12px',
                padding: '6px 8px',
                minWidth: '80px'
              }}
            >
              {isMetric ? 'Metric' : 'Imperial'}
            </button>
          </div>
        )}
        
        <div 
          ref={mapContainer}
          className="w-full h-96 bg-gray-200"
        />

        <div className="h-48 bg-white border-t border-gray-200">
          <canvas ref={chartContainer} className="w-full h-full" />
          {!chartLoaded && chartJsLoaded && routeLoaded && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-sm font-medium">Loading elevation chart...</div>
            </div>
          )}
          {!chartJsLoaded && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-sm font-medium">Loading Chart.js library...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export individual race map components
export const TokyoMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/tokyo_marathon_geo.json"
    center={[139.6917, 35.6895]}
    city="Tokyo"
  />
}

export const BerlinMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/berlin_marathon.json"
    center={[13.4050, 52.5200]}
    city="Berlin"
  />
}

export const BostonMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/boston_marathon.json"
    center={[-71.0589, 42.3601]}
    city="Boston"
  />
}

export const LondonMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/london_marathon_1.json"
    center={[0.0022, 51.4769]}
    city="London"
  />
}

export const ChicagoMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/chicargo_marathon.json"
    center={[-87.6298, 41.8781]}
    city="Chicago"
  />
}

export const NewYorkCityMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/new_york_city_marathon.json"
    center={[-74.0060, 40.7128]}
    city="New York City"
  />
}