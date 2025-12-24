'use client'

import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { DarkModeContext } from './DarkModeProvider'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import simplify from '@turf/simplify'
import { lineString } from '@turf/helpers'

interface RaceRouteMapProps {
  gpxUrl: string
  title: string
  height?: number // Optional height in pixels
  initialShowMarkers?: boolean // Initial marker visibility state
  initialUseMetric?: boolean // Initial unit preference
  onShowMarkersChange?: (show: boolean) => void // Callback when marker visibility changes
  onUseMetricChange?: (metric: boolean) => void // Callback when unit preference changes
  hoverDistance?: number | null // Distance to show hover marker at
  onHoverDistanceChange?: (distance: number | null) => void // Callback when hovering over route
}

// Mapbox implementation matching Google Maps style
export function RaceRouteMap({
  gpxUrl,
  title,
  height,
  initialShowMarkers = false,
  initialUseMetric = false,
  onShowMarkersChange,
  onUseMetricChange,
  hoverDistance,
  onHoverDistanceChange
}: RaceRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isDark, isInitialized } = useContext(DarkModeContext)

  // Use only refs for marker state - no React state to avoid setState on unmounted component
  const useMetricRef = useRef(initialUseMetric)
  const showMarkersRef = useRef(initialShowMarkers)
  const distanceMarkersRef = useRef<mapboxgl.Marker[]>([])
  const isMountedRef = useRef(true)

  // Hover marker and route data for bidirectional interaction
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const routeCoordinatesRef = useRef<number[][]>([])
  const routeDistancesRef = useRef<number[]>([]) // Cumulative distances at each coordinate

  // Safe setter that only notifies parent without updating local state
  const setShowMarkersSafe = useCallback((value: boolean) => {
    if (!isMountedRef.current) return
    showMarkersRef.current = value
    onShowMarkersChange?.(value)
  }, [onShowMarkersChange])

  const setUseMetricSafe = useCallback((value: boolean) => {
    if (!isMountedRef.current) return
    useMetricRef.current = value
    onUseMetricChange?.(value)
  }, [onUseMetricChange])

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((coord1: number[], coord2: number[]): number => {
    const R = 6371000 // Earth's radius in meters
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Returns meters
  }, [])

  // Helper function to find coordinate at a given distance
  const findCoordinateAtDistance = useCallback((targetDistance: number): number[] | null => {
    if (routeDistancesRef.current.length === 0 || routeCoordinatesRef.current.length === 0) {
      return null
    }

    // Find the segment containing the target distance
    for (let i = 0; i < routeDistancesRef.current.length - 1; i++) {
      const dist1 = routeDistancesRef.current[i]
      const dist2 = routeDistancesRef.current[i + 1]

      if (targetDistance >= dist1 && targetDistance <= dist2) {
        // Interpolate between the two coordinates
        const t = (targetDistance - dist1) / (dist2 - dist1)
        const coord1 = routeCoordinatesRef.current[i]
        const coord2 = routeCoordinatesRef.current[i + 1]

        return [
          coord1[0] + t * (coord2[0] - coord1[0]),
          coord1[1] + t * (coord2[1] - coord1[1])
        ]
      }
    }

    // If target distance is beyond the route, return the last coordinate
    if (targetDistance > routeDistancesRef.current[routeDistancesRef.current.length - 1]) {
      return routeCoordinatesRef.current[routeCoordinatesRef.current.length - 1]
    }

    // If target distance is before the route, return the first coordinate
    return routeCoordinatesRef.current[0]
  }, [])

  // Effect to handle hover distance changes from the chart
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (!hoverDistance || hoverDistance === null) {
      // Hide hover marker when no hover distance
      if (hoverMarkerRef.current) {
        const element = hoverMarkerRef.current.getElement()
        if (element) {
          element.style.opacity = '0'
        }
      }
      return
    }

    // Convert hover distance from km/mi to meters based on current unit
    const distanceInMeters = useMetricRef.current ? hoverDistance * 1000 : hoverDistance * 1609.34

    // Find coordinate at this distance
    const coordinate = findCoordinateAtDistance(distanceInMeters)
    if (!coordinate) {
      console.warn('[RaceRouteMap] Could not find coordinate for distance:', distanceInMeters)
      return
    }

    console.log('[RaceRouteMap] Hover distance:', hoverDistance, 'meters:', distanceInMeters, 'coordinate:', coordinate)

    // Create hover marker if it doesn't exist (matching start/finish marker size)
    if (!hoverMarkerRef.current) {
      const markerElement = document.createElement('div')
      markerElement.style.cssText = `
        background: #1e40af;
        border: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        transition: opacity 0.1s ease;
      `

      hoverMarkerRef.current = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([0, 0])
        .addTo(mapInstanceRef.current)

      console.log('[RaceRouteMap] Created hover marker')
    }

    // Update hover marker position and show it (smooth transition via CSS)
    hoverMarkerRef.current.setLngLat([coordinate[0], coordinate[1]])
    const element = hoverMarkerRef.current.getElement()
    if (element) {
      element.style.opacity = '1'
      console.log('[RaceRouteMap] Showing hover marker at', coordinate)
    }
  }, [hoverDistance, findCoordinateAtDistance])

  // Sync internal unit state with external prop changes
  useEffect(() => {
    // Only update if the external prop is different from our current state
    if (useMetricRef.current !== initialUseMetric && mapInstanceRef.current) {
      useMetricRef.current = initialUseMetric

      // Update the unit toggle button text if it exists
      const unitToggleButton = document.querySelector('[data-unit-toggle]') as HTMLButtonElement
      if (unitToggleButton) {
        unitToggleButton.textContent = initialUseMetric ? 'KM' : 'MI'
      }

      // Update markers if they're currently visible
      if (showMarkersRef.current && distanceMarkersRef.current.length > 0) {
        // Trigger the recreateMarkers event on the map instance
        const event = new CustomEvent('recreateMarkers')
        mapInstanceRef.current.getContainer().dispatchEvent(event)
      }
    }
  }, [initialUseMetric])

  useEffect(() => {
    // Wait for dark mode to be initialized
    if (!isInitialized) {
      return
    }

    // Add a small delay to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      const initMap = async () => {
        try {
          setIsLoading(true)
          setError(null)

          // Get Mapbox access token
          const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          if (!accessToken) {
            throw new Error('Mapbox access token is not configured')
          }

          mapboxgl.accessToken = accessToken

          // Check if container exists and is attached to DOM
          if (!mapRef.current || !mapRef.current.parentNode) {
            return
          }

        // Fetch and parse GPX or GeoJSON file
        const response = await fetch(gpxUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch route file')
        }

        const fileText = await response.text()

        // Try to parse as GeoJSON first (check if it starts with '{')
        let coordinates: [number, number][]
        let geoJsonData: any = null

        if (fileText.trim().startsWith('{')) {
          // Parse GeoJSON and keep the original for Mapbox
          const parsed = JSON.parse(fileText)
          coordinates = parseGeoJSON(fileText)
          geoJsonData = parsed
        } else {
          // Parse GPX to coordinates
          coordinates = parseGPX(fileText)
        }

        if (coordinates.length === 0) {
          throw new Error('No coordinates found in route file')
        }

        // Apply Douglas-Peucker simplification to remove GPS noise while preserving shape
        // This is key for smooth, professional-looking routes (Strava technique)
        const tolerance = 0.00005 // ~5 meters - balance between smoothness and accuracy
        const line = lineString(coordinates)
        const simplified = simplify(line, { tolerance, highQuality: true })
        const simplifiedCoords = simplified.geometry.coordinates as [number, number][]

        // Use simplified coordinates for rendering
        coordinates = simplifiedCoords

        // Store coordinates and calculate cumulative distances for hover interactions
        routeCoordinatesRef.current = coordinates
        const distances: number[] = [0] // First point is at distance 0
        let cumulativeDistance = 0

        for (let i = 1; i < coordinates.length; i++) {
          cumulativeDistance += calculateDistance(coordinates[i - 1], coordinates[i])
          distances.push(cumulativeDistance)
        }

        routeDistancesRef.current = distances

        // Calculate bounds from coordinates
        const lngs = coordinates.map(c => c[0])
        const lats = coordinates.map(c => c[1])
        const bounds: [number, number, number, number] = [
          Math.min(...lngs),
          Math.min(...lats),
          Math.max(...lngs),
          Math.max(...lats)
        ]

        // Calculate initial zoom from bounds to set min zoom limit
        const lngDiff = Math.max(...lngs) - Math.min(...lngs)
        const latDiff = Math.max(...lats) - Math.min(...lats)
        const maxDiff = Math.max(lngDiff, latDiff)
        // Set minZoom based on route size - prevent zooming out too far
        const minZoom = Math.max(10, 14 - Math.log2(maxDiff * 100))

        // Initialize Mapbox map with custom 2D monochrome styles
        const map = new mapboxgl.Map({
          container: mapRef.current,
          // Use custom Light/Dark 2D styles from Mapbox Studio (distanzrunning account)
          // Monochrome theme with minimal POIs, clean roads, optimized for route visualization
          style: isDark
            ? 'mapbox://styles/distanzrunning/cmj5rnjj3000d01pg8ngl0ld6'  // Custom Charcoal Dark
            : 'mapbox://styles/distanzrunning/cmj7ou5ik001c01sbcwkog5ff', // Custom Light with Grey Roads
          bounds,
          fitBoundsOptions: { padding: 40 },
          attributionControl: false,
          minZoom: minZoom,
          maxZoom: 18,
          // Disable rotation and pitch for flat 2D view
          pitchWithRotate: false,
          dragRotate: false,
          touchPitch: false,
          // Use Mercator projection (flat 2D, matching the style config)
          projection: { name: 'mercator' },
        })

        mapInstanceRef.current = map

        // Add minimal attribution control (more transparent)
        map.addControl(
          new mapboxgl.AttributionControl({
            compact: true,
            customAttribution: ''
          }),
          'bottom-left'
        )

        map.on('load', () => {
          if (!map) return

          // Add route source - use native GeoJSON if available, otherwise create from coordinates
          map.addSource('route', {
            type: 'geojson',
            data: geoJsonData || {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates }
            },
            lineMetrics: true
          })

          // Professional Strava-style route rendering with zoom-based widths
          // Uses line-gap-width for proper casing (outline) technique

          // Get the first symbol/label layer to insert route layers before labels
          // Look for symbol layers or layers with 'label' in their ID
          const layers = map.getStyle().layers
          let firstSymbolId: string | undefined

          for (const layer of layers || []) {
            if (layer.type === 'symbol' || (layer.id && layer.id.includes('label'))) {
              firstSymbolId = layer.id
              break
            }
          }

          // Clean Strava-inspired 3-layer route
          // 1. Casing (outline) - white in light mode, dark in dark mode
          map.addLayer({
            id: 'route-casing',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': isDark ? '#2d2d2d' : '#ffffff',
              'line-width': 6
            }
          }, firstSymbolId)

          // 2. Main route line (electric pink) - brighter in light mode
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': isDark ? '#e43c81' : '#ff4d94',
              'line-width': 4
            }
          }, firstSymbolId)

          // 3. Subtle shadow for depth
          map.addLayer({
            id: 'route-shadow',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': 'rgba(0, 0, 0, 0.2)',
              'line-width': 6,
              'line-blur': 3,
              'line-offset': 0
            }
          }, firstSymbolId)

          // 5. Direction arrows
          const addArrowLayer = () => {
            if (!map) return

            // Add directional arrows layer
            map.addLayer({
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
            }, firstSymbolId)
          }

          // Create and load arrow icon first
          if (!map.hasImage('arrow-right')) {
            const arrowOutlineColor = isDark ? '#2d2d2d' : '#ffffff'
            const arrowPinkColor = isDark ? '#e43c81' : '#ff4d94'
            const arrowSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fill="none" stroke="${arrowOutlineColor}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"
                      d="M6 6 L13 10 L6 14" />
                <path fill="none" stroke="${arrowPinkColor}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"
                      d="M6 6 L13 10 L6 14" />
              </svg>
            `

            const img = new Image(20, 20)
            img.onload = () => {
              if (map && !map.hasImage('arrow-right')) {
                map.addImage('arrow-right', img)
                // Now add the layer that uses the image
                addArrowLayer()
              }
            }
            img.src = 'data:image/svg+xml;base64,' + btoa(arrowSvg)
          } else {
            // Image already exists, just add the layer
            addArrowLayer()
          }

          // Add invisible hover zone for route interaction
          map.addLayer({
            id: 'route-hover-zone',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': 'rgba(255, 255, 255, 0)', // Completely transparent
              'line-width': 20 // Wider hover zone for easier interaction
            }
          }, firstSymbolId)

          // Add route hover event handlers
          map.on('mouseenter', 'route-hover-zone', () => {
            map.getCanvas().style.cursor = 'crosshair'
          })

          map.on('mouseleave', 'route-hover-zone', () => {
            map.getCanvas().style.cursor = ''
            onHoverDistanceChange?.(null)
          })

          map.on('mousemove', 'route-hover-zone', (e) => {
            if (!e.lngLat || routeCoordinatesRef.current.length === 0) return

            // Find closest point on route line segments to cursor (not just data points)
            const cursorLng = e.lngLat.lng
            const cursorLat = e.lngLat.lat
            let closestDistance = Infinity
            let closestSegmentIndex = 0
            let closestT = 0 // Parameter along segment (0 to 1)

            // Check each line segment
            for (let i = 0; i < routeCoordinatesRef.current.length - 1; i++) {
              const p1 = routeCoordinatesRef.current[i]
              const p2 = routeCoordinatesRef.current[i + 1]

              // Calculate closest point on line segment
              const dx = p2[0] - p1[0]
              const dy = p2[1] - p1[1]
              const lengthSquared = dx * dx + dy * dy

              if (lengthSquared === 0) continue // Skip zero-length segments

              // Calculate parameter t (0 = p1, 1 = p2)
              let t = ((cursorLng - p1[0]) * dx + (cursorLat - p1[1]) * dy) / lengthSquared
              t = Math.max(0, Math.min(1, t)) // Clamp to segment

              // Calculate closest point on segment
              const closestX = p1[0] + t * dx
              const closestY = p1[1] + t * dy

              // Calculate distance to this point
              const dist = Math.sqrt(
                Math.pow(closestX - cursorLng, 2) + Math.pow(closestY - cursorLat, 2)
              )

              if (dist < closestDistance) {
                closestDistance = dist
                closestSegmentIndex = i
                closestT = t
              }
            }

            // Interpolate distance along the route
            const dist1 = routeDistancesRef.current[closestSegmentIndex] || 0
            const dist2 = routeDistancesRef.current[closestSegmentIndex + 1] || dist1
            const distanceInMeters = dist1 + closestT * (dist2 - dist1)
            const distance = useMetricRef.current ? distanceInMeters / 1000 : distanceInMeters / 1609.34

            console.log('[RaceRouteMap] Route hover - distance:', distance, useMetricRef.current ? 'km' : 'mi', 'meters:', distanceInMeters, 'segment:', closestSegmentIndex, 't:', closestT)
            onHoverDistanceChange?.(distance)
          })

          // Create start marker (green) with hover tooltip
          const startMarkerEl = createMarkerPin('#00D464') // Volt Green
          const startMarker = new mapboxgl.Marker({ element: startMarkerEl })
            .setLngLat(coordinates[0])
            .addTo(map)

          // Add start tooltip
          const startPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 15,
            className: 'start-marker-popup'
          })

          startMarkerEl.addEventListener('mouseenter', () => {
            const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)'
            const tooltipColor = isDark ? 'rgb(250, 250, 250)' : 'rgb(23, 23, 23)'

            startPopup
              .setLngLat(coordinates[0])
              .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: ${tooltipColor}; font-size: 12px; padding: 4px;">Start</div>`)
              .addTo(map)

            // Apply styles immediately (synchronously)
            const popupEl = startPopup.getElement()
            if (popupEl) {
              popupEl.style.zIndex = '9999'
              // Style the popup container
              const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
              if (popupContent) {
                const contentEl = popupContent as HTMLElement
                contentEl.style.setProperty('background-color', tooltipBg, 'important')
                contentEl.style.setProperty('padding', '4px 8px', 'important')
                contentEl.style.setProperty('border-radius', '6px', 'important')
                contentEl.style.boxShadow = isDark
                  ? '0 2px 8px rgba(0, 0, 0, 0.5)'
                  : '0 2px 8px rgba(0, 0, 0, 0.15)'
              }
              // Style the popup tip (arrow)
              const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
              if (popupTip) {
                const tipColor = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)'
                const tipEl = popupTip as HTMLElement
                tipEl.style.setProperty('border-top-color', tipColor, 'important')
                tipEl.style.setProperty('border-bottom-color', tipColor, 'important')
              }
            }
          })

          startMarkerEl.addEventListener('mouseleave', () => {
            startPopup.remove()
          })

          // Create finish marker (checkered flag) with hover tooltip
          const finishMarkerEl = createCheckeredFinishMarker()
          const finishMarker = new mapboxgl.Marker({ element: finishMarkerEl })
            .setLngLat(coordinates[coordinates.length - 1])
            .addTo(map)

          // Add finish tooltip
          const finishPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 15,
            className: 'finish-marker-popup'
          })

          finishMarkerEl.addEventListener('mouseenter', () => {
            const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)'
            const tooltipColor = isDark ? 'rgb(250, 250, 250)' : 'rgb(23, 23, 23)'

            finishPopup
              .setLngLat(coordinates[coordinates.length - 1])
              .setHTML(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; color: ${tooltipColor}; font-size: 12px; padding: 4px;">Finish</div>`)
              .addTo(map)

            // Apply styles immediately (synchronously)
            const popupEl = finishPopup.getElement()
            if (popupEl) {
              popupEl.style.zIndex = '9999'
              // Style the popup container
              const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
              if (popupContent) {
                const contentEl = popupContent as HTMLElement
                contentEl.style.setProperty('background-color', tooltipBg, 'important')
                contentEl.style.setProperty('padding', '4px 8px', 'important')
                contentEl.style.setProperty('border-radius', '6px', 'important')
                contentEl.style.boxShadow = isDark
                  ? '0 2px 8px rgba(0, 0, 0, 0.5)'
                  : '0 2px 8px rgba(0, 0, 0, 0.15)'
              }
              // Style the popup tip (arrow)
              const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
              if (popupTip) {
                const tipColor = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)'
                const tipEl = popupTip as HTMLElement
                tipEl.style.setProperty('border-top-color', tipColor, 'important')
                tipEl.style.setProperty('border-bottom-color', tipColor, 'important')
              }
            }
          })

          finishMarkerEl.addEventListener('mouseleave', () => {
            finishPopup.remove()
          })

          // Create custom controls matching Google Maps style
          createCustomControls(
            map,
            isDark,
            bounds,
            showMarkersRef.current,
            setShowMarkersSafe,
            showMarkersRef,
            useMetricRef.current,
            setUseMetricSafe,
            useMetricRef,
            coordinates,
            distanceMarkersRef
          )

          // Hide loading after map is fully loaded
          setTimeout(() => {
            setIsLoading(false)
          }, 800)
        })

        map.on('error', (e: any) => {
          console.error('[RaceRouteMap] Map error:', e)
        })

      } catch (err) {
        console.error('[RaceRouteMap] Error loading map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

      initMap()
    }, 100) // Small delay to ensure DOM is ready

    // Cleanup
    return () => {
      clearTimeout(timeoutId)

      // Remove distance markers
      distanceMarkersRef.current.forEach(marker => marker.remove())
      distanceMarkersRef.current = []

      // Remove map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Clear the container to prevent "container should be empty" warning
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [gpxUrl, isDark, isInitialized])

  if (error) {
    return (
      <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm">
        Unable to load race route map
      </div>
    )
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 flex-shrink-0 transition-all duration-300"
      style={{ height: height ? `${height}px` : '320px' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 z-10">
          <div className="animate-pulse">
            <img
              src="/images/distanz_icon_black_round.png"
              alt="Loading"
              className="w-16 h-16 opacity-60"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      <style jsx global>{`
        /* Hide Mapbox logo and attribution */
        .mapboxgl-ctrl-logo {
          display: none !important;
        }

        /* Make attribution text small and subtle */
        .mapboxgl-ctrl-attrib {
          opacity: 0.3 !important;
          font-size: 10px !important;
        }

        /* Make attribution visible on hover */
        .mapboxgl-ctrl-attrib:hover {
          opacity: 1 !important;
        }

        /* Hide default Mapbox controls (we'll add custom ones) */
        .mapboxgl-ctrl-top-right .mapboxgl-ctrl,
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
          display: none;
        }

        /* Minimalist border for custom controls */
        .mapboxgl-ctrl-fullscreen,
        .mapboxgl-ctrl-recenter,
        .mapboxgl-ctrl-markers,
        .mapboxgl-ctrl-unit,
        .mapboxgl-ctrl-zoom {
          overflow: hidden !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
        }

        /* Dark mode border */
        @media (prefers-color-scheme: dark) {
          .mapboxgl-ctrl-fullscreen,
          .mapboxgl-ctrl-recenter,
          .mapboxgl-ctrl-markers,
          .mapboxgl-ctrl-unit,
          .mapboxgl-ctrl-zoom {
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
        }

        .mapboxgl-ctrl-fullscreen button,
        .mapboxgl-ctrl-recenter button,
        .mapboxgl-ctrl-markers button,
        .mapboxgl-ctrl-unit button,
        .mapboxgl-ctrl-zoom button {
          outline: none !important;
        }

        /* Remove gap and add padding for attribution in bottom-left */
        .mapboxgl-ctrl-bottom-left {
          margin: 0 !important;
          padding: 0 0 4px 4px !important;
        }

        .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
          margin: 0 !important;
        }
      `}</style>
    </div>
  )
}

// Helper function to create marker pin element
function createMarkerPin(color: string): HTMLElement {
  const pin = document.createElement('div')
  pin.style.width = '16px'
  pin.style.height = '16px'
  pin.style.borderRadius = '50%'
  pin.style.backgroundColor = color
  pin.style.border = '2px solid white'
  pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
  pin.style.zIndex = '100' // Higher z-index for start marker
  return pin
}

// Helper function to create checkered flag finish marker
function createCheckeredFinishMarker(): HTMLElement {
  const container = document.createElement('div')
  container.style.width = '16px'
  container.style.height = '16px'
  container.style.borderRadius = '50%'
  container.style.overflow = 'hidden'
  container.style.border = '2px solid white'
  container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
  container.style.zIndex = '50' // Lower z-index than start marker

  // Create checkered pattern using CSS gradient
  container.style.background = `
    linear-gradient(45deg, #000 25%, transparent 25%),
    linear-gradient(-45deg, #000 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #000 75%),
    linear-gradient(-45deg, transparent 75%, #000 75%)
  `
  container.style.backgroundSize = '8px 8px'
  container.style.backgroundPosition = '0 0, 0 4px, 4px -4px, -4px 0px'
  container.style.backgroundColor = '#fff'

  return container
}

// Create custom controls matching Google Maps style
function createCustomControls(
  map: mapboxgl.Map,
  isDark: boolean,
  bounds: mapboxgl.LngLatBoundsLike,
  showMarkers: boolean,
  setShowMarkers: (show: boolean) => void,
  showMarkersRef: React.MutableRefObject<boolean>,
  useMetric: boolean,
  setUseMetric: (metric: boolean) => void,
  useMetricRef: React.MutableRefObject<boolean>,
  coordinates: [number, number][],
  distanceMarkersRef: React.MutableRefObject<mapboxgl.Marker[]>
) {
  // Create fullscreen button (top-right)
  const fullscreenButton = document.createElement('button')
  fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen view')
  fullscreenButton.className = 'mapboxgl-ctrl-fullscreen'
  fullscreenButton.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border: none;
    border-radius: 2px;
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  `

  // Fullscreen icon SVG - thicker stroke
  fullscreenButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7V2h5M16 7V2h-5M16 11v5h-5M2 11v5h5"
            stroke="${isDark ? '#bbb' : '#666'}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `

  fullscreenButton.addEventListener('mouseenter', () => {
    fullscreenButton.style.backgroundColor = isDark ? '#3d3d3d' : '#f5f5f5'
  })
  fullscreenButton.addEventListener('mouseleave', () => {
    fullscreenButton.style.backgroundColor = isDark ? '#2d2d2d' : 'white'
  })
  fullscreenButton.addEventListener('click', () => {
    const mapContainer = map.getContainer()
    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  })

  // Create recenter button (fit route in view)
  const recenterButton = document.createElement('button')
  recenterButton.setAttribute('aria-label', 'Recenter map to route')
  recenterButton.className = 'mapboxgl-ctrl-recenter'
  recenterButton.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border: none;
    border-radius: 2px;
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s;
    position: absolute;
    top: 49px;
    right: 10px;
    z-index: 1;
  `

  // Target/crosshair icon SVG - thicker stroke
  recenterButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="5" stroke="${isDark ? '#bbb' : '#666'}" stroke-width="2" fill="none"/>
      <line x1="9" y1="0" x2="9" y2="3" stroke="${isDark ? '#bbb' : '#666'}" stroke-width="2" stroke-linecap="round"/>
      <line x1="9" y1="15" x2="9" y2="18" stroke="${isDark ? '#bbb' : '#666'}" stroke-width="2" stroke-linecap="round"/>
      <line x1="0" y1="9" x2="3" y2="9" stroke="${isDark ? '#bbb' : '#666'}" stroke-width="2" stroke-linecap="round"/>
      <line x1="15" y1="9" x2="18" y2="9" stroke="${isDark ? '#bbb' : '#666'}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `

  recenterButton.addEventListener('mouseenter', () => {
    recenterButton.style.backgroundColor = isDark ? '#3d3d3d' : '#f5f5f5'
  })
  recenterButton.addEventListener('mouseleave', () => {
    recenterButton.style.backgroundColor = isDark ? '#2d2d2d' : 'white'
  })
  recenterButton.addEventListener('click', () => {
    // Get current container dimensions
    const container = map.getContainer()
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    // Use 5-8% of the smaller dimension as padding, with min/max constraints
    const minDimension = Math.min(containerWidth, containerHeight)
    const padding = Math.max(20, Math.min(60, Math.round(minDimension * 0.06)))

    // Force map to resize first in case container changed
    map.resize()

    // Then fit bounds with appropriate padding
    map.fitBounds(bounds, {
      padding: padding,
      duration: 800, // Smooth animation
      maxZoom: 16 // Prevent zooming too close
    })
  })

  // Create zoom controls container - compact Strava-style
  const zoomContainer = document.createElement('div')
  zoomContainer.className = 'mapboxgl-ctrl-zoom'
  zoomContainer.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border-radius: 2px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1;
  `

  // Create zoom in button
  const zoomInButton = document.createElement('button')
  zoomInButton.setAttribute('aria-label', 'Zoom in')
  zoomInButton.style.cssText = `
    background-color: transparent;
    border: none;
    width: 29px;
    height: 29px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: ${isDark ? '#bbb' : '#666'};
    transition: background-color 0.15s;
  `
  zoomInButton.textContent = '+'
  zoomInButton.addEventListener('mouseenter', () => {
    zoomInButton.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  })
  zoomInButton.addEventListener('mouseleave', () => {
    zoomInButton.style.backgroundColor = 'transparent'
  })
  zoomInButton.addEventListener('click', () => {
    map.zoomIn()
  })

  // Create divider between zoom buttons
  const divider = document.createElement('div')
  divider.style.cssText = `
    height: 1px;
    background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    margin: 0 5px;
  `

  // Create zoom out button
  const zoomOutButton = document.createElement('button')
  zoomOutButton.setAttribute('aria-label', 'Zoom out')
  zoomOutButton.style.cssText = `
    background-color: transparent;
    border: none;
    width: 29px;
    height: 29px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: ${isDark ? '#bbb' : '#666'};
    transition: background-color 0.15s;
  `
  zoomOutButton.textContent = '−'
  zoomOutButton.addEventListener('mouseenter', () => {
    zoomOutButton.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  })
  zoomOutButton.addEventListener('mouseleave', () => {
    zoomOutButton.style.backgroundColor = 'transparent'
  })
  zoomOutButton.addEventListener('click', () => {
    map.zoomOut()
  })

  // Assemble zoom controls
  zoomContainer.appendChild(zoomInButton)
  zoomContainer.appendChild(divider)
  zoomContainer.appendChild(zoomOutButton)

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Helper function to create distance marker element (Strava-style pink with white text)
  const createDistanceMarkerElement = (number: string, isDark: boolean): HTMLElement => {
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: ${isDark ? '#e43c81' : '#ff4d94'};
      border: 2px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      box-shadow: ${isDark
        ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(228, 60, 129, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06)'};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      color: white;
    `
    markerElement.textContent = number

    return markerElement
  }

  // Create distance marker control container (marker button + unit toggle on hover)
  const markerControlContainer = document.createElement('div')
  markerControlContainer.className = 'mapboxgl-ctrl-markers-container'
  markerControlContainer.style.cssText = `
    position: absolute;
    top: 88px;
    right: 10px;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  `

  // Unit toggle button (appears on hover to the left)
  const unitToggleButton = document.createElement('button')
  unitToggleButton.setAttribute('aria-label', 'Toggle distance unit (km/mi)')
  unitToggleButton.setAttribute('data-unit-toggle', 'true')
  unitToggleButton.className = 'mapboxgl-ctrl-unit'

  const updateUnitToggleStyle = (markersActive: boolean) => {
    unitToggleButton.style.cssText = `
      background-color: ${isDark ? '#2d2d2d' : 'white'};
      border: none;
      border-radius: 2px;
      width: 29px;
      height: 29px;
      box-shadow: 0 0 0 2px rgba(0,0,0,.1);
      cursor: ${markersActive ? 'pointer' : 'not-allowed'};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s, background-color 0.15s;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: ${markersActive ? (isDark ? '#bbb' : '#666') : (isDark ? '#555' : '#aaa')};
      opacity: 0;
      pointer-events: none;
    `
  }

  updateUnitToggleStyle(showMarkers)

  unitToggleButton.textContent = useMetric ? 'KM' : 'MI'

  unitToggleButton.addEventListener('mouseenter', () => {
    unitToggleButton.style.backgroundColor = isDark ? '#3d3d3d' : '#f5f5f5'
  })
  unitToggleButton.addEventListener('mouseleave', () => {
    unitToggleButton.style.backgroundColor = isDark ? '#2d2d2d' : 'white'
  })
  unitToggleButton.addEventListener('click', () => {
    // Only allow toggle if markers are visible
    if (!showMarkersRef.current) return

    const newMetric = !useMetricRef.current
    setUseMetric(newMetric)
    useMetricRef.current = newMetric // Update ref immediately for marker button
    unitToggleButton.textContent = newMetric ? 'KM' : 'MI'

    // Only update markers if they're currently visible
    if (distanceMarkersRef.current.length > 0) {
      // Clear existing markers immediately
      distanceMarkersRef.current.forEach(marker => marker.remove())
      distanceMarkersRef.current = []

      // Recreate markers with new unit
      let cumulativeDistance = 0
      const interval = newMetric ? 1 : 1.609344 // 1 km or 1 mile in km

      for (let i = 1; i < coordinates.length; i++) {
        const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
        const prevCumulativeDistance = cumulativeDistance
        cumulativeDistance += segmentDistance

        const prevMarkerCount = Math.floor(prevCumulativeDistance / interval)
        const currentMarkerCount = Math.floor(cumulativeDistance / interval)

        if (currentMarkerCount > prevMarkerCount) {
          for (let j = prevMarkerCount + 1; j <= currentMarkerCount; j++) {
            const targetDistance = j * interval
            const ratio = (targetDistance - prevCumulativeDistance) / segmentDistance
            const lat = coordinates[i - 1][1] + ratio * (coordinates[i][1] - coordinates[i - 1][1])
            const lng = coordinates[i - 1][0] + ratio * (coordinates[i][0] - coordinates[i - 1][0])

            // Calculate display distance for marker number
            const displayDist = newMetric ? Math.round(targetDistance) : Math.round(targetDistance / 1.609344)
            const unitLabel = newMetric ? 'km' : 'mi'

            const markerEl = createDistanceMarkerElement(displayDist.toString(), isDark)
            const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
              .setLngLat([lng, lat])
              .addTo(map)

            // Add tooltip on hover (similar to start/end markers)

            const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'
            const tooltipColor = isDark ? '#ffffff' : '#333333'

            const distancePopup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: [0, -15],
              className: 'distance-marker-popup'
            })

            markerEl.addEventListener('mouseenter', () => {
              distancePopup
                .setLngLat([lng, lat])
                .setHTML(`<div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${tooltipColor}; font-size: 11px; padding: 4px;">${displayDist} ${unitLabel}</div>`)
                .addTo(map)

              // Apply styles immediately (synchronously)
              const popupEl = distancePopup.getElement()
              if (popupEl) {
                popupEl.style.zIndex = '9999'
                // Style the popup container
                const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
                if (popupContent) {
                  const contentEl = popupContent as HTMLElement
                  contentEl.style.setProperty('background-color', tooltipBg, 'important')
                  contentEl.style.setProperty('padding', '4px 8px', 'important')
                  contentEl.style.setProperty('border-radius', '6px', 'important')
                  contentEl.style.setProperty('backdrop-filter', 'blur(10px)', 'important')
                  contentEl.style.boxShadow = isDark
                    ? '0 2px 12px rgba(0, 0, 0, 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)'
                }
                // Style the popup tip (arrow)
                const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
                if (popupTip) {
                  const tipEl = popupTip as HTMLElement
                  tipEl.style.setProperty('border-top-color', tooltipBg, 'important')
                  tipEl.style.setProperty('border-bottom-color', tooltipBg, 'important')
                }
              }
            })

            markerEl.addEventListener('mouseleave', () => {
              distancePopup.remove()
            })

            distanceMarkersRef.current.push(marker)
          }
        }
      }
    }
  })

  // Marker toggle button
  const markerToggleButton = document.createElement('button')
  markerToggleButton.setAttribute('aria-label', 'Toggle distance markers')
  markerToggleButton.setAttribute('data-marker-toggle', 'true')
  markerToggleButton.className = 'mapboxgl-ctrl-markers'
  markerToggleButton.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border: none;
    border-radius: 2px;
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s;
    opacity: ${showMarkers ? '1' : '0.6'};
  `

  // Marker icon (location pin)
  markerToggleButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2C6.24 2 4 4.24 4 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
            fill="${showMarkers ? (isDark ? '#e43c81' : '#ff4d94') : (isDark ? '#bbb' : '#666')}"
            stroke="${isDark ? '#bbb' : '#666'}"
            stroke-width="0.5"/>
    </svg>
  `

  markerToggleButton.addEventListener('mouseenter', () => {
    markerToggleButton.style.backgroundColor = isDark ? '#3d3d3d' : '#f5f5f5'
    // Show unit toggle on hover
    unitToggleButton.style.opacity = '1'
    unitToggleButton.style.pointerEvents = 'auto'
  })
  markerToggleButton.addEventListener('mouseleave', () => {
    markerToggleButton.style.backgroundColor = isDark ? '#2d2d2d' : 'white'
  })

  // Keep unit toggle visible when hovering over it
  markerControlContainer.addEventListener('mouseleave', () => {
    unitToggleButton.style.opacity = '0'
    unitToggleButton.style.pointerEvents = 'none'
  })

  markerToggleButton.addEventListener('click', () => {
    const newShowMarkers = !showMarkersRef.current
    setShowMarkers(newShowMarkers)
    showMarkersRef.current = newShowMarkers // Update ref immediately
    markerToggleButton.style.opacity = newShowMarkers ? '1' : '0.6'
    markerToggleButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2C6.24 2 4 4.24 4 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="${newShowMarkers ? (isDark ? '#e43c81' : '#ff4d94') : (isDark ? '#bbb' : '#666')}"
              stroke="${isDark ? '#bbb' : '#666'}"
              stroke-width="0.5"/>
      </svg>
    `
    // Update unit toggle button styling based on marker state
    updateUnitToggleStyle(newShowMarkers)

    // Trigger marker update with current unit value from ref
    if (newShowMarkers) {
      // Clear existing markers immediately (synchronous)
      distanceMarkersRef.current.forEach(marker => marker.remove())
      distanceMarkersRef.current = []

      // Use ref to get current unit value
      const currentMetric = useMetricRef.current
      let cumulativeDistance = 0
      const interval = currentMetric ? 1 : 1.609344 // 1 km or 1 mile in km

      for (let i = 1; i < coordinates.length; i++) {
        const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
        const prevCumulativeDistance = cumulativeDistance
        cumulativeDistance += segmentDistance

        const prevMarkerCount = Math.floor(prevCumulativeDistance / interval)
        const currentMarkerCount = Math.floor(cumulativeDistance / interval)

        if (currentMarkerCount > prevMarkerCount) {
          for (let j = prevMarkerCount + 1; j <= currentMarkerCount; j++) {
            const targetDistance = j * interval
            const ratio = (targetDistance - prevCumulativeDistance) / segmentDistance
            const lat = coordinates[i - 1][1] + ratio * (coordinates[i][1] - coordinates[i - 1][1])
            const lng = coordinates[i - 1][0] + ratio * (coordinates[i][0] - coordinates[i - 1][0])

            // Calculate display distance for marker number
            const displayDist = currentMetric ? Math.round(targetDistance) : Math.round(targetDistance / 1.609344)
            const unitLabel = currentMetric ? 'km' : 'mi'

            const markerEl = createDistanceMarkerElement(displayDist.toString(), isDark)
            const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
              .setLngLat([lng, lat])
              .addTo(map)

            // Add tooltip on hover (similar to start/end markers)

            const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'
            const tooltipColor = isDark ? '#ffffff' : '#333333'

            const distancePopup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: [0, -15],
              className: 'distance-marker-popup'
            })

            markerEl.addEventListener('mouseenter', () => {
              distancePopup
                .setLngLat([lng, lat])
                .setHTML(`<div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${tooltipColor}; font-size: 11px; padding: 4px;">${displayDist} ${unitLabel}</div>`)
                .addTo(map)

              // Apply styles immediately (synchronously)
              const popupEl = distancePopup.getElement()
              if (popupEl) {
                popupEl.style.zIndex = '9999'
                // Style the popup container
                const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
                if (popupContent) {
                  const contentEl = popupContent as HTMLElement
                  contentEl.style.setProperty('background-color', tooltipBg, 'important')
                  contentEl.style.setProperty('padding', '4px 8px', 'important')
                  contentEl.style.setProperty('border-radius', '6px', 'important')
                  contentEl.style.setProperty('backdrop-filter', 'blur(10px)', 'important')
                  contentEl.style.boxShadow = isDark
                    ? '0 2px 12px rgba(0, 0, 0, 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)'
                }
                // Style the popup tip (arrow)
                const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
                if (popupTip) {
                  const tipEl = popupTip as HTMLElement
                  tipEl.style.setProperty('border-top-color', tooltipBg, 'important')
                  tipEl.style.setProperty('border-bottom-color', tooltipBg, 'important')
                }
              }
            })

            markerEl.addEventListener('mouseleave', () => {
              distancePopup.remove()
            })

            distanceMarkersRef.current.push(marker)
          }
        }
      }
    } else {
      // Clear markers
      distanceMarkersRef.current.forEach(marker => marker.remove())
      distanceMarkersRef.current = []
    }
  })

  // Assemble marker control container
  markerControlContainer.appendChild(unitToggleButton)
  markerControlContainer.appendChild(markerToggleButton)

  // Add controls to map container
  const mapContainer = map.getContainer()
  mapContainer.appendChild(fullscreenButton)
  mapContainer.appendChild(recenterButton)
  mapContainer.appendChild(markerControlContainer)
  mapContainer.appendChild(zoomContainer)

  // Add event listener for external unit changes
  mapContainer.addEventListener('recreateMarkers', () => {
    if (showMarkersRef.current && distanceMarkersRef.current.length > 0) {
      // Clear existing markers
      distanceMarkersRef.current.forEach(marker => marker.remove())
      distanceMarkersRef.current = []

      // Recreate markers with current unit preference
      const currentMetric = useMetricRef.current
      let cumulativeDistance = 0
      const interval = currentMetric ? 1 : 1.609344 // 1 km or 1 mile in km

      for (let i = 1; i < coordinates.length; i++) {
        const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
        const prevCumulativeDistance = cumulativeDistance
        cumulativeDistance += segmentDistance

        const prevMarkerCount = Math.floor(prevCumulativeDistance / interval)
        const currentMarkerCount = Math.floor(cumulativeDistance / interval)

        if (currentMarkerCount > prevMarkerCount) {
          for (let j = prevMarkerCount + 1; j <= currentMarkerCount; j++) {
            const targetDistance = j * interval
            const ratio = (targetDistance - prevCumulativeDistance) / segmentDistance
            const lat = coordinates[i - 1][1] + ratio * (coordinates[i][1] - coordinates[i - 1][1])
            const lng = coordinates[i - 1][0] + ratio * (coordinates[i][0] - coordinates[i - 1][0])

            const displayDist = currentMetric ? Math.round(targetDistance) : Math.round(targetDistance / 1.609344)
            const unitLabel = currentMetric ? 'km' : 'mi'

            const markerEl = createDistanceMarkerElement(displayDist.toString(), isDark)
            const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
              .setLngLat([lng, lat])
              .addTo(map)

            // Add tooltip on hover
            const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'
            const tooltipColor = isDark ? '#ffffff' : '#333333'

            const distancePopup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: [0, -15],
              className: 'distance-marker-popup'
            })

            markerEl.addEventListener('mouseenter', () => {
              distancePopup
                .setLngLat([lng, lat])
                .setHTML(`<div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${tooltipColor}; font-size: 11px; padding: 4px;">${displayDist} ${unitLabel}</div>`)
                .addTo(map)

              // Apply styles immediately (synchronously)
              const popupEl = distancePopup.getElement()
              if (popupEl) {
                popupEl.style.zIndex = '9999'
                // Style the popup container
                const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
                if (popupContent) {
                  const contentEl = popupContent as HTMLElement
                  contentEl.style.setProperty('background-color', tooltipBg, 'important')
                  contentEl.style.setProperty('padding', '4px 8px', 'important')
                  contentEl.style.setProperty('border-radius', '6px', 'important')
                  contentEl.style.setProperty('backdrop-filter', 'blur(10px)', 'important')
                  contentEl.style.boxShadow = isDark
                    ? '0 2px 12px rgba(0, 0, 0, 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)'
                }
                // Style the popup tip (arrow)
                const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
                if (popupTip) {
                  const tipEl = popupTip as HTMLElement
                  tipEl.style.setProperty('border-top-color', tooltipBg, 'important')
                  tipEl.style.setProperty('border-bottom-color', tooltipBg, 'important')
                }
              }
            })

            markerEl.addEventListener('mouseleave', () => {
              distancePopup.remove()
            })

            distanceMarkersRef.current.push(marker)
          }
        }
      }
    }
  })

  // Initialize markers if they were previously visible (e.g., after dark mode toggle)
  if (showMarkers) {
    const currentMetric = useMetric
    let cumulativeDistance = 0
    const interval = currentMetric ? 1 : 1.609344 // 1 km or 1 mile in km

    for (let i = 1; i < coordinates.length; i++) {
      const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
      const prevCumulativeDistance = cumulativeDistance
      cumulativeDistance += segmentDistance

      const prevMarkerCount = Math.floor(prevCumulativeDistance / interval)
      const currentMarkerCount = Math.floor(cumulativeDistance / interval)

      if (currentMarkerCount > prevMarkerCount) {
        for (let j = prevMarkerCount + 1; j <= currentMarkerCount; j++) {
          const targetDistance = j * interval
          const ratio = (targetDistance - prevCumulativeDistance) / segmentDistance
          const lat = coordinates[i - 1][1] + ratio * (coordinates[i][1] - coordinates[i - 1][1])
          const lng = coordinates[i - 1][0] + ratio * (coordinates[i][0] - coordinates[i - 1][0])

          // Calculate display distance for marker number
          const displayDist = currentMetric ? Math.round(targetDistance) : Math.round(targetDistance / 1.609344)
          const unitLabel = currentMetric ? 'km' : 'mi'

          const markerEl = createDistanceMarkerElement(displayDist.toString(), isDark)
          const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
            .setLngLat([lng, lat])
            .addTo(map)

          // Add tooltip on hover (similar to start/end markers)

          const tooltipBg = isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'
          const tooltipColor = isDark ? '#ffffff' : '#333333'

          const distancePopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: [0, -15],
            className: 'distance-marker-popup'
          })

          markerEl.addEventListener('mouseenter', () => {
            distancePopup
              .setLngLat([lng, lat])
              .setHTML(`<div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${tooltipColor}; font-size: 11px; padding: 4px;">${displayDist} ${unitLabel}</div>`)
              .addTo(map)

            // Apply styles immediately (synchronously)
            const popupEl = distancePopup.getElement()
            if (popupEl) {
              popupEl.style.zIndex = '9999'
              // Style the popup container
              const popupContent = popupEl.querySelector('.mapboxgl-popup-content')
              if (popupContent) {
                const contentEl = popupContent as HTMLElement
                contentEl.style.setProperty('background-color', tooltipBg, 'important')
                contentEl.style.setProperty('padding', '4px 8px', 'important')
                contentEl.style.setProperty('border-radius', '6px', 'important')
                contentEl.style.setProperty('backdrop-filter', 'blur(10px)', 'important')
                contentEl.style.boxShadow = isDark
                  ? '0 2px 12px rgba(0, 0, 0, 0.4)'
                  : '0 2px 8px rgba(0, 0, 0, 0.08)'
              }
              // Style the popup tip (arrow)
              const popupTip = popupEl.querySelector('.mapboxgl-popup-tip')
              if (popupTip) {
                const tipEl = popupTip as HTMLElement
                tipEl.style.setProperty('border-top-color', tooltipBg, 'important')
                tipEl.style.setProperty('border-bottom-color', tooltipBg, 'important')
              }
            }
          })

          markerEl.addEventListener('mouseleave', () => {
            distancePopup.remove()
          })

          distanceMarkersRef.current.push(marker)
        }
      }
    }
  }
}

// Helper function to parse GeoJSON and extract coordinates
function parseGeoJSON(geoJsonText: string): [number, number][] {
  try {
    const geoJson = JSON.parse(geoJsonText)
    const coordinates: [number, number][] = []

    // Handle FeatureCollection
    if (geoJson.type === 'FeatureCollection' && geoJson.features) {
      for (const feature of geoJson.features) {
        if (feature.geometry && feature.geometry.type === 'LineString') {
          // GeoJSON format is [longitude, latitude, elevation?]
          for (const coord of feature.geometry.coordinates) {
            coordinates.push([coord[0], coord[1]])
          }
        }
      }
    }
    // Handle single Feature
    else if (geoJson.type === 'Feature' && geoJson.geometry) {
      if (geoJson.geometry.type === 'LineString') {
        for (const coord of geoJson.geometry.coordinates) {
          coordinates.push([coord[0], coord[1]])
        }
      }
    }
    // Handle LineString directly
    else if (geoJson.type === 'LineString' && geoJson.coordinates) {
      for (const coord of geoJson.coordinates) {
        coordinates.push([coord[0], coord[1]])
      }
    }

    return coordinates
  } catch (error) {
    console.error('Error parsing GeoJSON:', error)
    return []
  }
}

// Helper function to parse GPX and extract coordinates
function parseGPX(gpxText: string): [number, number][] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml')
  const coordinates: [number, number][] = []

  // Try to get track points (trkpt) first, then route points (rtept), then waypoints (wpt)
  const trackPoints = xmlDoc.getElementsByTagName('trkpt')
  const routePoints = xmlDoc.getElementsByTagName('rtept')
  const waypoints = xmlDoc.getElementsByTagName('wpt')

  const points = trackPoints.length > 0
    ? trackPoints
    : routePoints.length > 0
    ? routePoints
    : waypoints

  for (let i = 0; i < points.length; i++) {
    const lat = parseFloat(points[i].getAttribute('lat') || '0')
    const lon = parseFloat(points[i].getAttribute('lon') || '0')
    if (lat && lon) {
      coordinates.push([lon, lat]) // Mapbox uses [lng, lat] format
    }
  }

  return coordinates
}
