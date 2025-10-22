'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarathonSkeleton } from './MarathonSkeleton'
import { marathonData, type MarathonData, type PointOfInterest } from '@/constants/marathonData'
import { calculateDistance, calculateTotalDistance, calculateGrade, findCoordinateAtDistance } from '@/utils/marathonCalculations'
import {
  createAidStationMarker,
  createStravaStartMarker,
  createStravaFinishMarker,
  createStravaNumberMarker,
  createStravaFlagMarker
} from '@/utils/marathonMarkers'
import { useMarathonDataPreloader } from '@/hooks/useMarathonDataPreloader'

declare global {
  interface Window {
    mapboxgl: any
    Chart: any
  }
}


export const MarathonMajorsShowcaseMobile: React.FC = () => {
  // Use different ref names to avoid conflicts with desktop version
  const mobileMapContainer = useRef<HTMLDivElement>(null)
  const mobileChartContainer = useRef<HTMLCanvasElement>(null)
  const mobileMapInstance = useRef<any>(null)
  const mobileChartInstance = useRef<any>(null)
  
  const [selectedMarathon, setSelectedMarathon] = useState(marathonData[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isMetric, setIsMetric] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)
  // Add state for transition loading (shows skeleton during marathon switches)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Track which marathon we're transitioning TO (different from currently displayed)
  const [transitioningToMarathon, setTransitioningToMarathon] = useState<MarathonData | null>(null)

  // Add the preloader hook to load all marathon data into memory
  const { getPreloadedData } = useMarathonDataPreloader(marathonData)  

  // Mobile-specific refs
  const mobileRouteCoordinates = useRef<number[][]>([])
  const mobileStartMarker = useRef<any>(null)
  const mobileFinishMarker = useRef<any>(null)
  const mobileDistanceMarkers = useRef<any[]>([])
  const mobileHalfwayMarker = useRef<any>(null)
  const mobileAidStationMarkers = useRef<any[]>([])
  const mobileStoredAidStations = useRef<PointOfInterest[]>([])

  const hasUnitToggle = selectedMarathon.stats.some(stat => stat.metric && stat.imperial)

  // Store densified coordinates and precise distance data for mobile
  const mobileDensifiedCoordinates = useRef<number[][]>([])
  const mobilePreciseDistanceData = useRef<number[]>([])
  const mobileGradeData = useRef<number[]>([])

  useEffect(() => {
    setIsClient(true)
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  // Aid station detection function
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

  // Marker creation functions now imported from shared utilities

  // Add aid station markers to map
  const addAidStationMarkers = (aidStations: PointOfInterest[]) => {
    // Clear existing aid station markers
    mobileAidStationMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    mobileAidStationMarkers.current = []

    aidStations.forEach(aidStation => {
      const markerElement = createAidStationMarker('small')
      
      const marker = new window.mapboxgl.Marker(markerElement)
        .setLngLat(aidStation.coordinates)
        .addTo(mobileMapInstance.current)

      mobileAidStationMarkers.current.push(marker)

      const popup = new window.mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: -15
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
          .addTo(mobileMapInstance.current)
          
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
    })
  }

  // Marker and calculation functions now imported from shared utilities

  // Densify route for smoother interactions
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
    const densifiedCoords = densifyRouteForPrecision(coordinates, 100)
    
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

  // Create chart with mobile optimizations
  const createMobileChart = (coordinates: number[][], useMetric: boolean) => {
    if (!mobileChartContainer.current || !window.Chart) return

    if (mobileChartInstance.current) {
      mobileChartInstance.current.destroy()
    }

    const currentlyDark = document.documentElement.classList.contains('dark')

    const { distanceData, elevationData, densifiedCoords, calculatedGrades } = getChartDataPrecise(coordinates, useMetric)
    
    mobileDensifiedCoordinates.current = densifiedCoords
    mobilePreciseDistanceData.current = distanceData
    mobileGradeData.current = calculatedGrades
    
    const unitDistance = useMetric ? 'km' : 'mi'
    const unitElevation = useMetric ? 'm' : 'ft'

    const sampleInterval = Math.max(1, Math.floor(distanceData.length / 300)) // Fewer points for mobile
    const displayDistances = distanceData.filter((_, i) => i % sampleInterval === 0)
    const displayElevations = elevationData.filter((_, i) => i % sampleInterval === 0)

    mobileChartInstance.current = new window.Chart(mobileChartContainer.current, {
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
              size: 12,
              weight: '500'
            },
            bodyFont: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              size: 11,
              weight: '400'
            },
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items: any[]) => {
                const displayIndex = items[0].dataIndex
                const actualIndex = displayIndex * sampleInterval
                const preciseDistance = mobilePreciseDistanceData.current[actualIndex] || parseFloat(items[0].label)
                return `${preciseDistance.toFixed(2)} ${unitDistance}`
              },
              label: (context: any) => {
                const displayIndex = context.dataIndex
                const actualIndex = displayIndex * sampleInterval
                const elevation = Math.round(context.parsed.y)
                const grade = mobileGradeData.current[actualIndex]?.toFixed(1) || '0.0'
                
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
            title: { 
              display: true, 
              text: `Distance (${unitDistance})`,
              font: { size: 11 }
            },
            grid: { color: 'rgba(231, 231, 231, 0.6)' },
            ticks: { font: { size: 10 } }
          },
          y: {
            title: { 
              display: true, 
              text: `Elevation (${unitElevation})`,
              font: { size: 11 }
            },
            grid: { color: 'rgba(231, 231, 231, 0.6)' },
            ticks: { font: { size: 10 } }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
  }

  // Add distance markers
  const addDistanceMarkers = (coordinates: number[][], useMetric: boolean) => {
    // Clear existing markers
    mobileDistanceMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    mobileDistanceMarkers.current = []

    if (mobileHalfwayMarker.current) {
      mobileHalfwayMarker.current.remove()
      mobileHalfwayMarker.current = null
    }

    const unit = useMetric ? 'km' : 'mi'
    const totalDistance = calculateTotalDistance(coordinates, useMetric)
    const halfwayDistance = totalDistance / 2
    const markerInterval = useMetric ? 5 : 5

    // Add halfway marker
    const halfwayCoordinate = findCoordinateAtDistance(halfwayDistance, coordinates, useMetric)
    if (halfwayCoordinate) {
      const halfwayMarkerElement = createStravaFlagMarker('small')
      
      mobileHalfwayMarker.current = new window.mapboxgl.Marker(halfwayMarkerElement)
        .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
        .addTo(mobileMapInstance.current)

      const halfwayPopup = new window.mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: -15
      })

      halfwayMarkerElement.addEventListener('mouseenter', () => {
        halfwayPopup
          .setLngLat([halfwayCoordinate[0], halfwayCoordinate[1]])
          .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">Halfway</div>`)
          .addTo(mobileMapInstance.current)
      })

      halfwayMarkerElement.addEventListener('mouseleave', () => {
        halfwayPopup.remove()
      })
    }

    // Add distance markers
    let currentMarkerDistance = markerInterval
    while (currentMarkerDistance < totalDistance) {
      const markerCoordinate = findCoordinateAtDistance(currentMarkerDistance, coordinates, useMetric)
      
      if (markerCoordinate) {
        const markerElement = createStravaNumberMarker(`${currentMarkerDistance}`, 'small')
        
        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([markerCoordinate[0], markerCoordinate[1]])
          .addTo(mobileMapInstance.current)

        mobileDistanceMarkers.current.push(marker)

        const popup = new window.mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: -15
        })

        const markerDistance = currentMarkerDistance
        markerElement.addEventListener('mouseenter', () => {
          popup
            .setLngLat([markerCoordinate[0], markerCoordinate[1]])
            .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px; padding: 4px;">${markerDistance} ${unit}</div>`)
            .addTo(mobileMapInstance.current)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })
      }
      
      currentMarkerDistance += markerInterval
    }
  }

  // Load route data
  const loadRoute = async (marathon: MarathonData) => {
    try {
      // First, try to get preloaded data for instant transitions
      const preloadedData = getPreloadedData(marathon.id)

      if (preloadedData && preloadedData.coordinates.length > 0) {
        // Use preloaded data for instant transition
        mobileRouteCoordinates.current = preloadedData.coordinates
        mobileStoredAidStations.current = preloadedData.aidStations
        return preloadedData
      }

      // Fallback: fetch if not preloaded (shouldn't happen after initial load)
      const response = await fetch(marathon.gpxUrl)
      const geojson = await response.json()

      const route = geojson.features?.find((f: any) => f.geometry.type === 'LineString')
      if (!route?.geometry.coordinates) throw new Error('Invalid route data')

      const coordinates = route.geometry.coordinates
      mobileRouteCoordinates.current = coordinates

      const aidStations = extractAidStations(geojson)
      mobileStoredAidStations.current = aidStations

      return { coordinates, aidStations }
    } catch (err) {
      throw new Error(`Failed to load ${marathon.name} route`)
    }
  }

  // Add route to map
  const addRoute = (coordinates: number[][], aidStations: PointOfInterest[] = []) => {
    if (!mobileMapInstance.current || !coordinates.length) return

    // Remove existing route
    if (mobileMapInstance.current.getSource('mobile-route')) {
      const layersToRemove = ['mobile-route-arrows', 'mobile-route-highlight', 'mobile-route-line', 'mobile-route-border', 'mobile-route-shadow']
      layersToRemove.forEach(layerId => {
        if (mobileMapInstance.current.getLayer(layerId)) {
          mobileMapInstance.current.removeLayer(layerId)
        }
      })
      mobileMapInstance.current.removeSource('mobile-route')
    }

    // Remove existing markers
    if (mobileStartMarker.current) {
      mobileStartMarker.current.remove()
      mobileStartMarker.current = null
    }
    if (mobileFinishMarker.current) {
      mobileFinishMarker.current.remove()
      mobileFinishMarker.current = null
    }

    mobileDistanceMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    mobileDistanceMarkers.current = []

    if (mobileHalfwayMarker.current) {
      mobileHalfwayMarker.current.remove()
      mobileHalfwayMarker.current = null
    }

    mobileAidStationMarkers.current.forEach(marker => {
      if (marker) marker.remove()
    })
    mobileAidStationMarkers.current = []

    // Add route source
    mobileMapInstance.current.addSource('mobile-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates }
      },
      lineMetrics: true
    })

    // Add route layers
    mobileMapInstance.current.addLayer({
      id: 'mobile-route-shadow',
      type: 'line',
      source: 'mobile-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': 'rgba(0, 0, 0, 0.25)', 'line-width': 7, 'line-blur': 2 }
    })

    mobileMapInstance.current.addLayer({
      id: 'mobile-route-border',
      type: 'line',
      source: 'mobile-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 5 }
    })

    mobileMapInstance.current.addLayer({
      id: 'mobile-route-line',
      type: 'line',
      source: 'mobile-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#e43c81', 'line-width': 3 }
    })

    mobileMapInstance.current.addLayer({
      id: 'mobile-route-highlight',
      type: 'line',
      source: 'mobile-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': 'rgba(255, 255, 255, 0.4)', 'line-width': 1.5 }
    })

    // Add directional arrows
    mobileMapInstance.current.addLayer({
      id: 'mobile-route-arrows',
      type: 'symbol',
      source: 'mobile-route',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 60,
        'icon-image': 'mobile-arrow-right',
        'icon-size': 1.0,
        'icon-rotation-alignment': 'map',
        'icon-pitch-alignment': 'map',
        'icon-ignore-placement': true,
        'icon-allow-overlap': true
      },
      paint: { 'icon-opacity': 1.0 }
    })

    // Create arrow icon if it doesn't exist
    if (!mobileMapInstance.current.hasImage('mobile-arrow-right')) {
      const arrowSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" 
                d="M5 5 L12 9 L5 13" />
          <path fill="none" stroke="#e43c81" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" 
                d="M5 5 L12 9 L5 13" />
        </svg>
      `
      
      const img = new Image(18, 18)
      img.onload = () => {
        if (mobileMapInstance.current && !mobileMapInstance.current.hasImage('mobile-arrow-right')) {
          mobileMapInstance.current.addImage('mobile-arrow-right', img)
        }
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(arrowSvg)
    }

    // Add start and finish markers
    const startMarkerElement = createStravaStartMarker('small')
    mobileStartMarker.current = new window.mapboxgl.Marker(startMarkerElement)
      .setLngLat(coordinates[0])
      .addTo(mobileMapInstance.current)

    const finishMarkerElement = createStravaFinishMarker('small')
    mobileFinishMarker.current = new window.mapboxgl.Marker(finishMarkerElement)
      .setLngLat(coordinates[coordinates.length - 1])
      .addTo(mobileMapInstance.current)

    // Add aid station markers
    if (aidStations.length > 0) {
      addAidStationMarkers(aidStations)
    }

    // Add distance markers
    addDistanceMarkers(coordinates, isMetric)

    // Fit to bounds
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord as [number, number])
    }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

    mobileMapInstance.current.fitBounds(bounds, { padding: 30 })
  }

  // Switch marathon with smooth skeleton transition
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
      createMobileChart(routeData.coordinates, isMetric)

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
          mobileMapInstance.current.off('moveend', handleMoveEnd)
          checkCompletion()
        }

        const handleIdle = () => {
          idleFired = true
          mobileMapInstance.current.off('idle', handleIdle)
          checkCompletion()
        }

        const handleStyleData = () => {
          styleLoadFired = true
          mobileMapInstance.current.off('styledata', handleStyleData)
          checkCompletion()
        }

        if (!mobileMapInstance.current.isStyleLoaded()) {
          styleLoadFired = false
          mobileMapInstance.current.once('styledata', handleStyleData)
        }

        mobileMapInstance.current.once('moveend', handleMoveEnd)
        mobileMapInstance.current.once('idle', handleIdle)

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

  // Toggle units
  const toggleUnits = () => {
    const newIsMetric = !isMetric
    setIsMetric(newIsMetric)
    if (mobileRouteCoordinates.current.length > 0) {
      createMobileChart(mobileRouteCoordinates.current, newIsMetric)
      addDistanceMarkers(mobileRouteCoordinates.current, newIsMetric)
    }
  }

  // Initialize mobile map
  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window === 'undefined' || !mobileMapContainer.current) return

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

        const initialDarkMode = document?.documentElement?.classList?.contains('dark') || false
        
        window.mapboxgl.accessToken = "pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg"
        
        mobileMapInstance.current = new window.mapboxgl.Map({
          container: mobileMapContainer.current,
          style: initialDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11',
          center: selectedMarathon.center,
          zoom: 11,
          attributionControl: false
        })

        mobileMapInstance.current.on('load', async () => {
          try {
            const routeData = await loadRoute(selectedMarathon)
            addRoute(routeData.coordinates, routeData.aidStations)
            createMobileChart(routeData.coordinates, isMetric)
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

    if (mobileMapContainer.current && typeof window !== 'undefined') {
      init()
    }

    return () => {
      mobileDistanceMarkers.current.forEach(marker => {
        if (marker) marker.remove()
      })
      mobileDistanceMarkers.current = []
      
      if (mobileHalfwayMarker.current) {
        mobileHalfwayMarker.current.remove()
        mobileHalfwayMarker.current = null
      }
      
      if (mobileStartMarker.current) {
        mobileStartMarker.current.remove()
        mobileStartMarker.current = null
      }
      
      if (mobileFinishMarker.current) {
        mobileFinishMarker.current.remove()
        mobileFinishMarker.current = null
      }
      
      mobileAidStationMarkers.current.forEach(marker => {
        if (marker) marker.remove()
      })
      mobileAidStationMarkers.current = []
      
      mobileMapInstance.current?.remove()
      mobileChartInstance.current?.destroy()
    }
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => mobileMapInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dark mode tracking
  useEffect(() => {
    const updateDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark')
      setIsDarkMode(darkMode)
      
      if (mobileMapInstance.current && mobileMapInstance.current.isStyleLoaded()) {
        const newStyle = darkMode 
          ? 'mapbox://styles/mapbox/dark-v11' 
          : 'mapbox://styles/mapbox/streets-v11'
        
        mobileMapInstance.current.setStyle(newStyle)
        
        mobileMapInstance.current.once('styledata', () => {
          if (mobileRouteCoordinates.current.length > 0) {
            addRoute(mobileRouteCoordinates.current, mobileStoredAidStations.current)
          }
        })
      }
      
      if (mobileChartInstance.current && mobileRouteCoordinates.current.length > 0) {
        createMobileChart(mobileRouteCoordinates.current, isMetric)
      }
    }
    
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
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden transition-colors duration-300">
        
        {/* Mobile Tabs */}
        <nav className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-2 transition-colors duration-300">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {marathonData.map((marathon) => (
              <motion.button
                key={marathon.id}
                initial={false}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded cursor-pointer relative user-select-none transition-all duration-300 ${
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
                    layoutId="mobile-underline"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Skeleton overlay during marathon transitions */}
        <MarathonSkeleton
          isVisible={isTransitioning}
          marathonName={transitioningToMarathon?.name}
          marathonLogo={transitioningToMarathon?.logo}
          isDarkMode={isDarkMode ?? false}
        />

        {/* Mobile Stacked Layout */}
        <div className="flex flex-col">

          {/* Title Section */}
          <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedMarathon.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                {/* Logo */}
                <div className="flex-shrink-0 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 border dark:border-neutral-600 w-14 h-14 flex items-center justify-center transition-colors duration-300">
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
                  <h3 className="font-semibold text-lg leading-tight text-neutral-900 dark:text-white transition-colors duration-300">
                    {selectedMarathon.name} Marathon
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-tight transition-colors duration-300">
                    {selectedMarathon.location}
                  </p>
                </div>
                
                {/* Date */}
                <div className="flex-shrink-0 text-center bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600 w-14 h-14 flex flex-col items-center justify-center transition-colors duration-300">                  <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wide transition-colors duration-300">
                    {selectedMarathon.date.month}
                  </div>
                  <div className="text-base font-bold text-neutral-900 dark:text-white leading-none mt-0.5 transition-colors duration-300">
                    {selectedMarathon.date.day}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Map Section */}
          <div className="h-64 border-b border-neutral-200 dark:border-neutral-700 relative">
            <div ref={mobileMapContainer} className="w-full h-full" />
          </div>
          
          {/* Chart Section */}
          <div className="flex flex-col bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
            <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors duration-300">
                Elevation Profile
              </h4>
              {hasUnitToggle && (
                <button
                  onClick={toggleUnits}
                  className="text-xs bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
                >
                  {isMetric ? 'Metric' : 'Imperial'}
                </button>
              )}
            </div>
            <div className="bg-white dark:bg-neutral-900 h-48 p-3 transition-colors duration-300">
              <canvas ref={mobileChartContainer} className="w-full h-full" />
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 transition-colors duration-300">
            <div className="grid grid-cols-2 gap-3">
              {selectedMarathon.stats.map((stat, index) => {
                const value = stat.static || 
                  (stat.metric && stat.imperial ? (isMetric ? stat.metric : stat.imperial) : 
                  stat.metric || stat.imperial || '')
                
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
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 leading-tight mb-1 transition-colors duration-300">
                          {stat.title}
                        </div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white leading-none transition-colors duration-300">
                          {value}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {isWorldAthleticsLabel ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img src="/images/platinum_label.svg" alt="" className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-600 dark:to-neutral-700 backdrop-blur-sm rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-500 border-opacity-50 shadow-sm transition-colors duration-300">
                            <span className="material-symbols-outlined text-neutral-700 dark:text-neutral-200 text-base transition-colors duration-300">
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
      </div>
    </div>
  )
}