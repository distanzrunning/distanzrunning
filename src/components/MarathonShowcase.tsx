'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarathonSkeleton } from './MarathonSkeleton'
import { marathonData, type MarathonData, type PointOfInterest } from '@/constants/marathonData'
import {
  calculateDistance,
  calculateTotalDistance,
  calculateGrade,
  findCoordinateAtDistance,
  calculateDistanceAtFractionalIndex,
  calculateDistanceAtIndex,
  findCoordinateAtDistancePrecise
} from '@/utils/marathonCalculations'
import {
  createAidStationMarker,
  createStravaStartMarker,
  createStravaFinishMarker,
  createStravaNumberMarker,
  createStravaFlagMarker,
  createHoverMarkerElement
} from '@/utils/marathonMarkers'
import { createVerticalLinePlugin } from '@/utils/chartPlugins'
import { useMarathonDataPreloader } from '@/hooks/useMarathonDataPreloader'

declare global {
  interface Window {
    mapboxgl: any
    Chart: any
  }
}


export const MarathonMajorsShowcase: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const chartContainer = useRef<HTMLCanvasElement>(null)
  const mapInstance = useRef<any>(null)
  const chartInstance = useRef<any>(null)
  
  const [selectedMarathon, setSelectedMarathon] = useState(marathonData[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isMetric, setIsMetric] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Fix: Initialize as null and set after hydration
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)
  // Add state for transition loading (shows skeleton during marathon switches)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Track which marathon we're transitioning TO (different from currently displayed)
  const [transitioningToMarathon, setTransitioningToMarathon] = useState<MarathonData | null>(null)

  // Add the preloader hook to load all marathon data into memory
  const { getPreloadedData } = useMarathonDataPreloader(marathonData)
  // Fix: Handle client-side hydration properly
  useEffect(() => {
    setIsClient(true)
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const routeCoordinates = useRef<number[][]>([])
  const startMarker = useRef<any>(null)
  const finishMarker = useRef<any>(null)
  const distanceMarkers = useRef<any[]>([])
  const halfwayMarker = useRef<any>(null)
  const hoverMarker = useRef<any>(null)
  // Add aid station markers ref
  const aidStationMarkers = useRef<any[]>([])
  const storedAidStations = useRef<PointOfInterest[]>([])
  
  const isHovering = useRef<boolean>(false)
  const hasUnitToggle = selectedMarathon.stats.some(stat => stat.metric && stat.imperial)

  // Store densified coordinates and precise distance data
  const densifiedCoordinates = useRef<number[][]>([])
  const preciseDistanceData = useRef<number[]>([])
  const gradeData = useRef<number[]>([])
  const verticalLinePlugin = useRef<any>(null)

  // Store original bounds for recenter functionality
  const originalBounds = useRef<any>(null)

  // State for marker visibility toggles
  const [showDistanceMarkers, setShowDistanceMarkers] = useState(true)
  const [showAidStations, setShowAidStations] = useState(true)

  // Recenter map to original course view
  const recenterMap = () => {
    if (mapInstance.current && originalBounds.current) {
      mapInstance.current.fitBounds(originalBounds.current, {
        padding: 50,
        duration: 1000 // Smooth animation
      })
    }
  }

  // Toggle distance markers visibility
  const toggleDistanceMarkers = () => {
    const newVisibility = !showDistanceMarkers
    setShowDistanceMarkers(newVisibility)

    // Toggle all distance markers
    distanceMarkers.current.forEach(marker => {
      if (marker) {
        const element = marker.getElement()
        if (element) {
          element.style.visibility = newVisibility ? 'visible' : 'hidden'
          element.style.opacity = newVisibility ? '1' : '0'
          element.style.pointerEvents = newVisibility ? 'auto' : 'none'
        }
      }
    })

    // Toggle halfway marker
    if (halfwayMarker.current) {
      const element = halfwayMarker.current.getElement()
      if (element) {
        element.style.visibility = newVisibility ? 'visible' : 'hidden'
        element.style.opacity = newVisibility ? '1' : '0'
        element.style.pointerEvents = newVisibility ? 'auto' : 'none'
      }
    }
  }

  // Toggle aid station markers visibility
  const toggleAidStations = () => {
    const newVisibility = !showAidStations
    setShowAidStations(newVisibility)

    // Toggle all aid station markers
    aidStationMarkers.current.forEach(marker => {
      if (marker) {
        const element = marker.getElement()
        if (element) {
          element.style.visibility = newVisibility ? 'visible' : 'hidden'
          element.style.opacity = newVisibility ? '1' : '0'
          element.style.pointerEvents = newVisibility ? 'auto' : 'none'
        }
      }
    })
  }

  // Aid station detection function (from RaceMapComponent)
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

  // Extract aid stations from GeoJSON (from RaceMapComponent)
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

  // Marker creation functions now imported from shared utilities

  // Add aid station markers to map (from RaceMapComponent)
  const addAidStationMarkers = (aidStations: PointOfInterest[]) => {
    // Clear existing aid station markers
    aidStationMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    aidStationMarkers.current = []

    aidStations.forEach(aidStation => {
      const markerElement = createAidStationMarker('large')
      
      const marker = new window.mapboxgl.Marker(markerElement)
        .setLngLat(aidStation.coordinates)
        .addTo(mapInstance.current)

      aidStationMarkers.current.push(marker)

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
            popupEl.style.zIndex = '9999'
            
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

    console.log(`Aid stations added: ${aidStations.length}`)
  }

  // Create vertical line plugin for chart using shared utility
  const createDesktopVerticalLinePlugin = () => {
    verticalLinePlugin.current = createVerticalLinePlugin('verticalLine')
  }

  // Create hover marker for chart interactions
  const createHoverMarker = () => {
    if (hoverMarker.current || !mapInstance.current) return

    const markerElement = createHoverMarkerElement()

    hoverMarker.current = new window.mapboxgl.Marker(markerElement)
      .setLngLat([0, 0])
      .addTo(mapInstance.current)
  }

  // Update hover marker position and visibility
  const updateHoverMarker = (coordinate: number[]) => {
    if (!mapInstance.current || !hoverMarker.current) return

    hoverMarker.current.setLngLat(coordinate)
    const element = hoverMarker.current.getElement()
    if (element) {
      element.style.opacity = '1'
    }
  }

  // Hide hover marker
  const removeHoverMarker = () => {
    if (hoverMarker.current) {
      const element = hoverMarker.current.getElement()
      if (element) {
        element.style.opacity = '0'
      }
    }
  }

  // Project cursor to route and find closest point
  const projectCursorToRoute = (mouseEvent: any) => {
    if (!mapInstance.current || !routeCoordinates.current.length) return null

    const cursorLngLat = mouseEvent.lngLat
    let closestPoint: number[] | null = null
    let minDistance = Infinity
    let closestIndex = 0

    for (let i = 0; i < routeCoordinates.current.length; i++) {
      const coord = routeCoordinates.current[i]
      const distance = Math.sqrt(
        Math.pow(coord[0] - cursorLngLat.lng, 2) + 
        Math.pow(coord[1] - cursorLngLat.lat, 2)
      )

      if (distance < minDistance) {
        minDistance = distance
        closestPoint = coord
        closestIndex = i
      }
    }

    if (!closestPoint) return null
    
    return { coordinate: closestPoint, index: closestIndex }
  }

  // Smooth projection to line segment (from RaceMapComponent)
  const projectPointToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1
    const dy = y2 - y1
    
    if (dx === 0 && dy === 0) {
      return {
        lng: x1,
        lat: y1,
        t: 0,
        distance: Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1))
      }
    }
    
    const segmentLengthSquared = dx * dx + dy * dy
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / segmentLengthSquared))
    
    const projectedLng = x1 + t * dx
    const projectedLat = y1 + t * dy
    
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

  // Accurate cursor-to-route projection with smooth interpolation
  const projectCursorToRouteAccurate = (mouseEvent: any) => {
    if (!mapInstance.current || !routeCoordinates.current.length) return null

    const cursorLngLat = mouseEvent.lngLat
    let closestPoint: number[] | null = null
    let minDistance = Infinity
    let bestSegmentIndex = -1
    let bestT = 0

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
        
        const projectedEle = ele1 + projection.t * (ele2 - ele1)
        
        closestPoint = [
          projection.lng,
          projection.lat,
          projectedEle
        ]
      }
    }

    if (!closestPoint || bestSegmentIndex < 0) return null

    const fractionalIndex = bestSegmentIndex + bestT
    return { coordinate: closestPoint, fractionalIndex: fractionalIndex }
  }

  // Update chart hover based on map interaction with higher precision
  const updateChartFromMapHover = (mouseEvent: any) => {
    if (!chartInstance.current || !routeCoordinates.current.length) return

    isHovering.current = true

    // Use smooth projection on original route
    const routePoint = projectCursorToRouteAccurate(mouseEvent)
    if (!routePoint) return

    // Update hover marker position
    updateHoverMarker(routePoint.coordinate)

    // Calculate precise distance using fractional index on original route
    const chartIsMetric = chartInstance.current.options.scales.x.title.text.includes('km')
    const targetDistance = calculateDistanceAtFractionalIndex(routePoint.fractionalIndex, routeCoordinates.current, chartIsMetric)
    
    // Find closest index in the precise distance data for chart highlighting
    if (preciseDistanceData.current.length > 0) {
      let closestIndex = 0
      let minDiff = Math.abs(preciseDistanceData.current[0] - targetDistance)
      
      for (let i = 1; i < preciseDistanceData.current.length; i++) {
        const diff = Math.abs(preciseDistanceData.current[i] - targetDistance)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = i
        }
      }

      // Convert precise index to display index
      const sampleInterval = Math.max(1, Math.floor(preciseDistanceData.current.length / 500))
      const displayIndex = Math.floor(closestIndex / sampleInterval)
      
      // Update chart hover state
      const meta = chartInstance.current.getDatasetMeta(0)
      const element = meta.data[displayIndex]
      
      if (element) {
        const activeElements = [{
          datasetIndex: 0,
          index: displayIndex,
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
    }
  }

  // Clear chart hover state completely
  const clearChartHover = () => {
    if (!chartInstance.current) return

    // Clear active elements
    chartInstance.current._active = []
    chartInstance.current.active = []
    
    // Reset hover state
    if (chartInstance.current.options.onHover) {
      chartInstance.current.options.onHover({ type: 'mouseleave' }, [])
    }
    
    // Clear tooltip
    const tooltip = chartInstance.current.tooltip
    if (tooltip) {
      tooltip._active = []
      tooltip.opacity = 0
    }
    
    // Force chart update and redraw to clear all visual elements
    chartInstance.current.update('none')
    chartInstance.current.draw()
  }

  // Debounced cleanup to prevent multiple calls
  const cleanupTimeout = useRef<NodeJS.Timeout | null>(null)
  
  const scheduleCleanup = (delay: number = 100) => {
    if (cleanupTimeout.current) {
      clearTimeout(cleanupTimeout.current)
    }
    
    cleanupTimeout.current = setTimeout(() => {
      if (!isHovering.current) {
        removeHoverMarker()
        clearChartHover()
      }
    }, delay)
  }

  // Densify route for smoother interactions (higher density for 0.01 precision)
  const densifyRouteForPrecision = (coordinates: number[][], targetPointsPerKm: number = 100) => {
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
    
    return densified
  }

  // Enhanced chart data calculation with higher precision
  const getChartDataPrecise = (coordinates: number[][], useMetric: boolean) => {
    // First densify the route for higher precision
    const densifiedCoords = densifyRouteForPrecision(coordinates, 100) // 100 points per km
    
    let distance = 0
    const distanceData: number[] = []
    const elevationData: number[] = []
    const calculatedGrades: number[] = []

    densifiedCoords.forEach((coord, i) => {
      const [lng, lat, ele = 0] = coord
      
      if (i > 0) {
        distance += calculateDistance(densifiedCoords[i - 1], coord)
      }

      const grade = calculateGrade(densifiedCoords, i)
      
      distanceData.push(useMetric ? distance / 1000 : distance / 1609.34)
      elevationData.push(useMetric ? ele : ele * 3.28084)
      calculatedGrades.push(grade)
    })

    return { distanceData, elevationData, densifiedCoords, calculatedGrades }
  }

  // Add distance markers (uses current isMetric state)
  const addDistanceMarkers = (coordinates: number[][]) => {
    addDistanceMarkersWithUnits(coordinates, isMetric)
  }

  // Simplified chart data calculation
  const getChartData = (coordinates: number[][], useMetric: boolean) => {
    let distance = 0
    const distanceData: number[] = []
    const elevationData: number[] = []

    coordinates.forEach((coord, i) => {
      const [lng, lat, ele = 0] = coord
      
      if (i > 0) {
        distance += calculateDistance(coordinates[i - 1], coord)
      }

      distanceData.push(useMetric ? distance / 1000 : distance / 1609.34)
      elevationData.push(useMetric ? ele : ele * 3.28084)
    })

    return { distanceData, elevationData }
  }

  // Simplified chart creation (uses current isMetric state)
  const createChart = (coordinates: number[][]) => {
    createChartWithUnits(coordinates, isMetric)
  }

  // Updated route loading to include aid stations
  const loadRoute = async (marathon: MarathonData) => {
    try {
      // First, try to get preloaded data for instant transitions
      const preloadedData = getPreloadedData(marathon.id)

      if (preloadedData && preloadedData.coordinates.length > 0) {
        // Use preloaded data for instant transition
        routeCoordinates.current = preloadedData.coordinates
        storedAidStations.current = preloadedData.aidStations
        return preloadedData
      }

      // Fallback: fetch if not preloaded (shouldn't happen after initial load)
      const response = await fetch(marathon.gpxUrl)
      const geojson = await response.json()

      const route = geojson.features?.find((f: any) => f.geometry.type === 'LineString')
      if (!route?.geometry.coordinates) throw new Error('Invalid route data')

      const coordinates = route.geometry.coordinates
      routeCoordinates.current = coordinates

      // Extract aid stations from the GeoJSON data
      const aidStations = extractAidStations(geojson)
      storedAidStations.current = aidStations

      return { coordinates, aidStations }
    } catch (err) {
      throw new Error(`Failed to load ${marathon.name} route`)
    }
  }

  // Updated route addition to include aid stations
  const addRoute = (coordinates: number[][], aidStations: PointOfInterest[] = []) => {
    if (!mapInstance.current || !coordinates.length) return

    // Remove existing route
    if (mapInstance.current.getSource('route')) {
      // Remove event listeners first
      try {
        mapInstance.current.off('mouseenter', 'route-hover-zone')
        mapInstance.current.off('mouseleave', 'route-hover-zone') 
        mapInstance.current.off('mousemove', 'route-hover-zone')
      } catch (e) {
        // Event listeners might not exist
      }

      // Remove layers in proper order
      const layersToRemove = ['route-arrows', 'route-highlight', 'route-line', 'route-border', 'route-shadow', 'route-hover-zone']
      layersToRemove.forEach(layerId => {
        if (mapInstance.current.getLayer(layerId)) {
          mapInstance.current.removeLayer(layerId)
        }
      })
      
      mapInstance.current.removeSource('route')
    }

    // Remove existing markers
    if (startMarker.current) {
      startMarker.current.remove()
      startMarker.current = null
    }
    if (finishMarker.current) {
      finishMarker.current.remove()
      finishMarker.current = null
    }

    // Remove existing distance markers
    distanceMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    distanceMarkers.current = []

    if (halfwayMarker.current) {
      halfwayMarker.current.remove()
      halfwayMarker.current = null
    }

    // Remove existing aid station markers
    aidStationMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    aidStationMarkers.current = []

    // Add new route source with line metrics for arrows
      mapInstance.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates }
        },
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

      // Add invisible wider hover layer for better interaction
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

      // Create arrow icon if it doesn't exist
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

    // Add route hover interactions
    mapInstance.current.on('mouseenter', 'route-hover-zone', () => {
      mapInstance.current.getCanvas().style.cursor = 'crosshair'
      isHovering.current = true
    })

    mapInstance.current.on('mouseleave', 'route-hover-zone', () => {
      mapInstance.current.getCanvas().style.cursor = ''
      isHovering.current = false
      scheduleCleanup(100)
    })

    // Also add mouseleave to the map container itself as a fallback
    if (mapContainer.current) {
      const handleMapContainerLeave = () => {
        if (isHovering.current) {
          isHovering.current = false
          scheduleCleanup(100)
        }
      }
      
      mapContainer.current.addEventListener('mouseleave', handleMapContainerLeave)
    }

    mapInstance.current.on('mousemove', 'route-hover-zone', updateChartFromMapHover)

    // Ensure city labels appear above the route by finding and moving all text layers
    // Wait for the map to be fully loaded before reordering layers
    mapInstance.current.once('idle', () => {
      const style = mapInstance.current.getStyle()
      const allLayers = style.layers
      
      // Find all text/symbol layers, prioritizing major city labels
      const majorCityLayers = allLayers.filter((layer: any) => 
        layer.type === 'symbol' && 
        (layer.id.includes('major') || 
         layer.id.includes('capital') ||
         layer.id.includes('country-label') ||
         layer.id.includes('state-label'))
      )
      
      const allTextLayers = allLayers.filter((layer: any) => 
        layer.type === 'symbol' && 
        (layer.id.includes('label') || 
         layer.id.includes('text') ||
         layer.id.includes('place') ||
         layer.id.includes('settlement') ||
         layer.id.includes('city'))
      )
      
      // Move all text layers to the top first
      allTextLayers.forEach((layer: any) => {
        try {
          mapInstance.current.moveLayer(layer.id)
        } catch (e) {
          // Layer might not exist anymore, ignore
        }
      })
      
      // Then move major city layers to ensure they're on top
      majorCityLayers.forEach((layer: any) => {
        try {
          mapInstance.current.moveLayer(layer.id)
        } catch (e) {
          // Layer might not exist anymore, ignore
        }
      })
      
      // Also try common major city layer names
      const commonMajorLayers = [
        'settlement-subdivision-label',
        'settlement-major-label', 
        'place-city-large-s',
        'place-city-medium-s',
        'place-city-large-n',
        'place-city-medium-n'
      ]
      
      commonMajorLayers.forEach((layerId: string) => {
        try {
          if (mapInstance.current.getLayer(layerId)) {
            mapInstance.current.moveLayer(layerId)
          }
        } catch (e) {
          // Layer might not exist, ignore
        }
      })
    })

    // Add start marker
    const startMarkerElement = createStravaStartMarker('large')
    startMarker.current = new window.mapboxgl.Marker(startMarkerElement)
      .setLngLat(coordinates[0])
      .addTo(mapInstance.current)

    const startPopup = new window.mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'start-marker-popup'
    })

    startMarkerElement.addEventListener('mouseenter', () => {
      startPopup
        .setLngLat(coordinates[0])
        .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">Start</div>`)
        .addTo(mapInstance.current)
        
      setTimeout(() => {
        const popupEl = startPopup.getElement()
        if (popupEl) {
          popupEl.style.zIndex = '9999'
        }
      }, 0)
    })

    startMarkerElement.addEventListener('mouseleave', () => {
      startPopup.remove()
    })

    // Add finish marker
    const finishMarkerElement = createStravaFinishMarker('large')
    finishMarker.current = new window.mapboxgl.Marker(finishMarkerElement)
      .setLngLat(coordinates[coordinates.length - 1])
      .addTo(mapInstance.current)

    const finishPopup = new window.mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'finish-marker-popup'
    })

    finishMarkerElement.addEventListener('mouseenter', () => {
      finishPopup
        .setLngLat(coordinates[coordinates.length - 1])
        .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">End</div>`)
        .addTo(mapInstance.current)
        
      setTimeout(() => {
        const popupEl = finishPopup.getElement()
        if (popupEl) {
          popupEl.style.zIndex = '9999'
        }
      }, 0)
    })

    finishMarkerElement.addEventListener('mouseleave', () => {
      finishPopup.remove()
    })

    // Add aid station markers if available
    if (aidStations.length > 0) {
      console.log(`Adding ${aidStations.length} aid station markers`)
      addAidStationMarkers(aidStations)
    }

    // Add distance markers
    addDistanceMarkers(coordinates)

    // Fit to bounds
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord as [number, number])
    }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

    // Store original bounds for recenter functionality
    originalBounds.current = bounds

    mapInstance.current.fitBounds(bounds, { padding: 50 })
  }

  // Updated marathon switching to handle aid stations with smooth skeleton transition
  const switchMarathon = async (marathon: MarathonData) => {
    if (marathon.id === selectedMarathon.id) return

    setError(null)

    try {
      // Set which marathon we're transitioning to (for skeleton logo)
      setTransitioningToMarathon(marathon)
      // Show skeleton overlay for smooth transition
      setIsTransitioning(true)

      // Small delay to allow skeleton to render
      await new Promise(resolve => setTimeout(resolve, 100))

      // Load route data (will use preloaded data if available)
      const routeData = await loadRoute(marathon)

      // Update map and chart (but NOT selectedMarathon yet - that happens after skeleton hides)
      addRoute(routeData.coordinates, routeData.aidStations)
      createChart(routeData.coordinates)

      // Create a promise that resolves when map operations are complete
      const mapOperationsComplete = new Promise<void>((resolve) => {
        let moveEndFired = false
        let idleFired = false
        let styleLoadFired = true

        const checkCompletion = () => {
          if (moveEndFired && idleFired && styleLoadFired) {
            resolve()
          }
        }

        const handleMoveEnd = () => {
          moveEndFired = true
          mapInstance.current.off('moveend', handleMoveEnd)
          checkCompletion()
        }

        const handleIdle = () => {
          idleFired = true
          mapInstance.current.off('idle', handleIdle)
          checkCompletion()
        }

        const handleStyleData = () => {
          styleLoadFired = true
          mapInstance.current.off('styledata', handleStyleData)
          checkCompletion()
        }

        if (!mapInstance.current.isStyleLoaded()) {
          styleLoadFired = false
          mapInstance.current.once('styledata', handleStyleData)
        }

        mapInstance.current.once('moveend', handleMoveEnd)
        mapInstance.current.once('idle', handleIdle)

        setTimeout(() => {
          if (!moveEndFired || !idleFired || !styleLoadFired) {
            console.warn('Map settling timeout reached')
            resolve()
          }
        }, 3000) // Reduced from 5000ms to 3000ms for faster transitions
      })

      // Wait for map operations to complete
      await mapOperationsComplete

      // Small delay before hiding skeleton for smooth visual transition
      await new Promise(resolve => setTimeout(resolve, 150))

      // NOW update the displayed marathon (after skeleton hides, prevents flash)
      setSelectedMarathon(marathon)
      // Hide skeleton overlay
      setIsTransitioning(false)
      setTransitioningToMarathon(null)
    } catch (err) {
      setIsTransitioning(false)
      setTransitioningToMarathon(null)
      setError(err instanceof Error ? err.message : 'Failed to switch marathon')
    }
  }

  // Simplified unit toggle
  const toggleUnits = () => {
    const newIsMetric = !isMetric
    setIsMetric(newIsMetric)
    if (routeCoordinates.current.length > 0) {
      // Use the new value directly instead of relying on state
      createChartWithUnits(routeCoordinates.current, newIsMetric)
      addDistanceMarkersWithUnits(routeCoordinates.current, newIsMetric)
    }
  }

  // Helper functions that accept the unit parameter directly
  const createChartWithUnits = (coordinates: number[][], useMetric: boolean) => {
    if (!chartContainer.current || !window.Chart) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Add this line here - check current dark mode state directly
    const currentlyDark = document.documentElement.classList.contains('dark')

    // Create vertical line plugin if not exists
    if (!verticalLinePlugin.current) {
      createDesktopVerticalLinePlugin()
    }

    const { distanceData, elevationData, densifiedCoords, calculatedGrades } = getChartDataPrecise(coordinates, useMetric)
    
    // Store for precise interactions
    densifiedCoordinates.current = densifiedCoords
    preciseDistanceData.current = distanceData
    gradeData.current = calculatedGrades
    
    const unitDistance = useMetric ? 'km' : 'mi'
    const unitElevation = useMetric ? 'm' : 'ft'

    // Sample data for display (every 10th point to keep chart readable)
    const sampleInterval = Math.max(1, Math.floor(distanceData.length / 500)) // Keep ~500 display points
    const displayDistances = distanceData.filter((_, i) => i % sampleInterval === 0)
    const displayElevations = elevationData.filter((_, i) => i % sampleInterval === 0)

    chartInstance.current = new window.Chart(chartContainer.current, {
      type: 'line',
      data: {
        labels: displayDistances.map(d => d.toFixed(1)),
        datasets: [{
          label: `Elevation (${unitElevation})`,
          data: displayElevations,
          borderColor: '#e43c81',
          backgroundColor: 'rgba(228, 60, 129, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHoverBorderWidth: 0,
          pointHoverBorderColor: 'transparent',
          pointHoverBackgroundColor: 'transparent',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event: any, activeElements: any[]) => {
          // Clear any existing timeout
          if (cleanupTimeout.current) {
            clearTimeout(cleanupTimeout.current)
          }

          if (activeElements.length > 0 && densifiedCoordinates.current.length > 0) {
            const displayIndex = activeElements[0].index
            const actualIndex = displayIndex * sampleInterval
            const distance = preciseDistanceData.current[actualIndex] || displayDistances[displayIndex]
            
            // Set active elements for vertical line plugin - but only take the first one
            const singleActiveElement = [activeElements[0]]
            chartInstance.current._active = singleActiveElement
            chartInstance.current.active = singleActiveElement
            
            // Only update map marker if hover originated from chart (not from map)
            if (!isHovering.current) {
              const coordinate = findCoordinateAtDistancePrecise(distance, densifiedCoordinates.current, preciseDistanceData.current)
              updateHoverMarker(coordinate)
            }
            
          } else {
            // Clear active elements for plugin
            chartInstance.current._active = []
            chartInstance.current.active = []
            
            // Schedule cleanup instead of immediate cleanup
            scheduleCleanup(50)
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: currentlyDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: currentlyDark ? 'rgb(250, 250, 250)' : 'rgb(23, 23, 23)',
            bodyColor: currentlyDark ? 'rgb(250, 250, 250)' : 'rgb(64, 64, 64)',
            borderColor: currentlyDark ? 'rgba(115, 115, 115, 0.3)' : 'rgba(212, 212, 212, 0.8)',
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
              title: (items: any[]) => {
                const displayIndex = items[0].dataIndex
                const actualIndex = displayIndex * sampleInterval
                const preciseDistance = preciseDistanceData.current[actualIndex] || parseFloat(items[0].label)
                return `${preciseDistance.toFixed(2)} ${unitDistance}`
              },
              label: (context: any) => {
                const displayIndex = context.dataIndex
                const actualIndex = displayIndex * sampleInterval
                const elevation = Math.round(context.parsed.y)
                const grade = gradeData.current[actualIndex]?.toFixed(1) || '0.0'
                
                return [
                  `Elevation: ${elevation} ${unitElevation}`,
                  `Grade: ${grade}%`
                ]
              }
            }
          },
          // Register the vertical line plugin directly here
          verticalLine: verticalLinePlugin.current
        },
        scales: {
          x: {
            title: { display: true, text: `Distance (${unitDistance})` },
            grid: { color: 'rgba(231, 231, 231, 0.6)' }
          },
          y: {
            title: { display: true, text: `Elevation (${unitElevation})` },
            grid: { color: 'rgba(231, 231, 231, 0.6)' }
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
      },
      plugins: [verticalLinePlugin.current]
    })

    // Add chart container mouse leave handler
    if (chartContainer.current) {
      // Add crosshair cursor to chart canvas
      chartContainer.current.style.cursor = 'crosshair'
      
      const handleChartMouseLeave = () => {
        // Schedule cleanup instead of immediate cleanup
        scheduleCleanup(100)
      }
      
      chartContainer.current.addEventListener('mouseleave', handleChartMouseLeave)
    }
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

    const unit = useMetric ? 'km' : 'mi'
    const totalDistance = calculateTotalDistance(coordinates, useMetric)
    const halfwayDistance = totalDistance / 2

    // Set marker intervals based on unit system
    const markerInterval = useMetric ? 5 : 5 // 5km or 5mi intervals

    // Add halfway marker first
    const halfwayCoordinate = findCoordinateAtDistance(halfwayDistance, coordinates, useMetric)
    if (halfwayCoordinate) {
      const halfwayMarkerElement = createStravaFlagMarker('large')

      halfwayMarker.current = new window.mapboxgl.Marker(halfwayMarkerElement)
        .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
        .addTo(mapInstance.current)

      // Apply current visibility state
      if (!showDistanceMarkers) {
        halfwayMarkerElement.style.visibility = 'hidden'
        halfwayMarkerElement.style.opacity = '0'
        halfwayMarkerElement.style.pointerEvents = 'none'
      }

      const halfwayPopup = new window.mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: 'distance-marker-popup'
      })

      halfwayMarkerElement.addEventListener('mouseenter', () => {
        halfwayPopup
          .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
          .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">Halfway</div>`)
          .addTo(mapInstance.current)

        setTimeout(() => {
          const popupEl = halfwayPopup.getElement()
          if (popupEl) {
            popupEl.style.zIndex = '9999'
          }
        }, 0)
      })

      halfwayMarkerElement.addEventListener('mouseleave', () => {
        halfwayPopup.remove()
      })
    }

    // Add distance markers at regular intervals
    let currentMarkerDistance = markerInterval
    while (currentMarkerDistance < totalDistance) {
      const markerCoordinate = findCoordinateAtDistance(currentMarkerDistance, coordinates, useMetric)

      if (markerCoordinate) {
        const markerElement = createStravaNumberMarker(`${currentMarkerDistance}`, 'large')

        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([markerCoordinate[0], markerCoordinate[1]])
          .addTo(mapInstance.current)

        distanceMarkers.current.push(marker)

        // Apply current visibility state
        if (!showDistanceMarkers) {
          markerElement.style.visibility = 'hidden'
          markerElement.style.opacity = '0'
          markerElement.style.pointerEvents = 'none'
        }

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
            .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segue UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">${markerDistance} ${unit}</div>`)
            .addTo(mapInstance.current)

          setTimeout(() => {
            const popupEl = popup.getElement()
            if (popupEl) {
              popupEl.style.zIndex = '9999'
            }
          }, 0)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })
      }

      currentMarkerDistance += markerInterval
    }
  }

  // Simplified initialization
  useEffect(() => {
    const init = async () => {
      try {
        // Ensure we're on the client side
        if (typeof window === 'undefined' || !mapContainer.current) {
          return
        }

        // Load external libraries
        if (!window.mapboxgl) {
          const link = document.createElement('link')
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
          link.rel = 'stylesheet'
          document.head.appendChild(link)

          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (!window.Chart) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        // Initialize map with safe dark mode detection
        const initialDarkMode = document?.documentElement?.classList?.contains('dark') || false

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        if (!mapboxToken) {
          throw new Error('Mapbox access token is not configured')
        }

        window.mapboxgl.accessToken = mapboxToken

        mapInstance.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: initialDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11',
          center: selectedMarathon.center,
          zoom: 12,
          attributionControl: false
        })

        mapInstance.current.on('load', async () => {
          try {
            // Create hover marker after map loads
            createHoverMarker()
            
            const routeData = await loadRoute(selectedMarathon)
            addRoute(routeData.coordinates, routeData.aidStations)
            createChart(routeData.coordinates)
          } catch (err) {
            console.error('Route loading error:', err)
            setError(err instanceof Error ? err.message : 'Failed to load initial route')
          } finally {
            setIsLoading(false)
          }
        })

      } catch (err) {
        console.error('Initialization error:', err)
        setError('Failed to initialize')
        setIsLoading(false)
      }
    }

    // Only initialize if we have a container and we're on the client
    if (mapContainer.current && typeof window !== 'undefined') {
      init()
    }

    return () => {
      // Clean up hover marker
      if (hoverMarker.current) {
        hoverMarker.current.remove()
        hoverMarker.current = null
      }
      
      // Clean up other markers
      distanceMarkers.current.forEach(marker => {
        if (marker) marker.remove()
      })
      distanceMarkers.current = []
      
      if (halfwayMarker.current) {
        halfwayMarker.current.remove()
        halfwayMarker.current = null
      }
      
      if (startMarker.current) {
        startMarker.current.remove()
        startMarker.current = null
      }
      
      if (finishMarker.current) {
        finishMarker.current.remove()
        finishMarker.current = null
      }
      
      // Clean up aid station markers
      aidStationMarkers.current.forEach(marker => {
        if (marker) marker.remove()
      })
      aidStationMarkers.current = []
      
      mapInstance.current?.remove()
      chartInstance.current?.destroy()
    }
  }, [])

  // Simplified resize handling
  useEffect(() => {
    const handleResize = () => mapInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Add the dark mode tracking useEffect here:
  useEffect(() => {
    const updateDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark')
      setIsDarkMode(darkMode)
      
      // Update map style if map is initialized
      if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
        const newStyle = darkMode 
          ? 'mapbox://styles/mapbox/dark-v11' 
          : 'mapbox://styles/mapbox/streets-v11'
        
        mapInstance.current.setStyle(newStyle)
        
        // Re-add the route after style loads
        mapInstance.current.once('styledata', () => {
          if (routeCoordinates.current.length > 0) {
            addRoute(routeCoordinates.current, storedAidStations.current)
          }
        })
      }
      
      // ADD THIS: Recreate chart with new colors when dark mode changes
      if (chartInstance.current && routeCoordinates.current.length > 0) {
        createChart(routeCoordinates.current)
      }
    }
    
    // Listen for changes only - don't run on initial load
    const observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])


  return (
    <div className="my-8 relative">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden transition-colors duration-300">
        {/* Tabs */}
        <nav className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-2 transition-colors duration-300">
          <ul className="flex gap-1">
            {marathonData.map((marathon) => (
              <motion.li
                key={marathon.id}
                initial={false}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded cursor-pointer relative user-select-none flex items-center justify-center transition-all duration-300 ${
                  marathon.id === selectedMarathon.id 
                    ? 'bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100' 
                    : 'bg-transparent text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                onClick={() => switchMarathon(marathon)}
              >
                {marathon.name}
                {marathon.id === selectedMarathon.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                    layoutId="underline"
                  />
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="h-[760px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-neutral-900 flex items-center justify-center z-50 transition-colors duration-300">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">Loading {selectedMarathon.name} Marathon...</p>
            </div>
          )}

          {/* Skeleton overlay during marathon transitions */}
          <MarathonSkeleton
            isVisible={isTransitioning}
            marathonName={transitioningToMarathon?.name}
            marathonLogo={transitioningToMarathon?.logo}
            isDarkMode={isDarkMode ?? false}
          />

          <div className="hidden lg:grid h-full" style={{ gridTemplateColumns: '3fr 2fr', gridTemplateRows: '495px 265px' }}>
            {/* Map */}
            <div className="border-r border-b border-neutral-200 dark:border-neutral-700 relative">
              <div ref={mapContainer} className="w-full h-full" />

              {/* Map Controls */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {/* Recenter Button */}
                <button
                  onClick={recenterMap}
                  className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-md p-2 shadow-sm hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md transition-all duration-200 w-9 h-9 flex items-center justify-center"
                  title="Re-center"
                  aria-label="Re-center"
                >
                  <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-300 text-[18px] leading-none">
                    my_location
                  </span>
                </button>

                {/* Distance Markers Toggle */}
                <button
                  onClick={toggleDistanceMarkers}
                  className={`backdrop-blur-sm border rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 w-9 h-9 flex items-center justify-center ${
                    showDistanceMarkers
                      ? 'bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800'
                      : 'bg-neutral-50/90 dark:bg-neutral-700/90 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100/90 dark:hover:bg-neutral-700'
                  }`}
                  title="Distance markers"
                  aria-label="Distance markers"
                >
                  <span className={`material-symbols-outlined text-[18px] leading-none transition-colors duration-200 ${
                    showDistanceMarkers
                      ? 'text-neutral-600 dark:text-neutral-300'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}>
                    arrow_range
                  </span>
                </button>

                {/* Aid Stations Toggle */}
                <button
                  onClick={toggleAidStations}
                  className={`backdrop-blur-sm border rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 w-9 h-9 flex items-center justify-center ${
                    showAidStations
                      ? 'bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800'
                      : 'bg-neutral-50/90 dark:bg-neutral-700/90 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100/90 dark:hover:bg-neutral-700'
                  }`}
                  title="Aid station markers"
                  aria-label="Aid station markers"
                >
                  <span className={`material-symbols-outlined text-[18px] leading-none transition-colors duration-200 ${
                    showAidStations
                      ? 'text-neutral-600 dark:text-neutral-300'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}>
                    water_drop
                  </span>
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden transition-colors duration-300">
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors duration-300">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedMarathon.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between w-full"
                  >
                    {/* Left side: Logo + Name/Location */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Logo Box */}
                      <div className="flex-shrink-0 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1 border dark:border-neutral-600 w-16 h-16 flex items-center justify-center transition-colors duration-300">
                        <img 
                          src={isDarkMode ? selectedMarathon.logo.replace('.svg', '_white.svg') : selectedMarathon.logo}
                          alt={`${selectedMarathon.name} Marathon`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                      
                      {/* Name and Location */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl leading-tight text-neutral-900 dark:text-white transition-colors duration-300">{selectedMarathon.name} Marathon</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-tight transition-colors duration-300">{selectedMarathon.location}</p>
                      </div>
                    </div>
                    
                    {/* Right side: Date Box */}
                    <div className="flex-shrink-0 text-center bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600 w-16 h-16 flex flex-col items-center justify-center transition-colors duration-300">
                      <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wide transition-colors duration-300">
                        {selectedMarathon.date.month}
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-white leading-none mt-1 transition-colors duration-300">
                        {selectedMarathon.date.day}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex-1 flex items-center p-3 min-h-0">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {selectedMarathon.stats.map((stat, index) => {
                    const value = stat.static || 
                      (stat.metric && stat.imperial ? (isMetric ? stat.metric : stat.imperial) : 
                      stat.metric || stat.imperial || '')
                    
                    // Icon mapping for Google Font Icons
                    const getIconName = (title: string) => {
                      switch(title) {
                        case 'Distance': return 'arrow_range'
                        case 'Surface': return 'road'
                        case 'Profile': return 'elevation'
                        case 'Elevation Gain': return 'arrow_drop_up'
                        case 'Average Temp (high)': return 'device_thermostat'
                        case 'Elevation Loss': return 'arrow_drop_down'
                        case "Men's Course Record": return 'male'
                        case "Women's Course Record": return 'female'
                        case 'Finishers (2024)': return 'groups'
                        default: return 'info'
                      }
                    }
                    
                    const isWorldAthleticsLabel = stat.title === 'World Athletics Label'
                    
                    return (
                      <div key={index} className="bg-white dark:bg-neutral-700 p-3 rounded border dark:border-neutral-600 hover:shadow-sm transition-all duration-300" title={stat.tooltip}>
                        <div className="flex items-center gap-3">
                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 leading-tight mb-1 transition-colors duration-300">
                              {stat.title}
                            </div>
                            <div className="text-base font-bold text-neutral-900 dark:text-white leading-none transition-colors duration-300">
                              {value}
                            </div>
                          </div>
                          
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {isWorldAthleticsLabel ? (
                              <div className="w-10 h-10 flex items-center justify-center">
                                <img src="/images/platinum_label.svg" alt="" className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-600 dark:to-neutral-700 backdrop-blur-sm rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-500 border-opacity-50 shadow-lg transition-colors duration-300">
                                <span className="material-symbols-outlined text-neutral-700 dark:text-neutral-200 text-lg transition-colors duration-300">
                                  {getIconName(stat.title)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="col-span-3 flex flex-col">
              <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 px-4 py-2 flex items-center justify-between flex-shrink-0 transition-colors duration-300">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors duration-300">Elevation Profile</h4>
                {hasUnitToggle && (
                  <button
                    onClick={toggleUnits}
                    className="text-xs bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
                  >
                    {isMetric ? 'Metric' : 'Imperial'}
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-neutral-900 flex-1 p-4 min-h-0 transition-colors duration-300">
                <canvas ref={chartContainer} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}