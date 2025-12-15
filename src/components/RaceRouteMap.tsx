'use client'

import { useEffect, useRef, useState, useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import simplify from '@turf/simplify'
import { lineString } from '@turf/helpers'

interface RaceRouteMapProps {
  gpxUrl: string
  title: string
}

// Mapbox implementation matching Google Maps style
export function RaceRouteMap({ gpxUrl, title }: RaceRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isDark, isInitialized } = useContext(DarkModeContext)

  useEffect(() => {
    // Wait for dark mode to be initialized
    if (!isInitialized) {
      console.log('[RaceRouteMap] Waiting for dark mode initialization...')
      return
    }

    console.log('[RaceRouteMap] Dark mode initialized. isDark:', isDark)

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

        if (!mapRef.current) return

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

        console.log(`[RaceRouteMap] Simplified route: ${coordinates.length} → ${simplifiedCoords.length} points`)

        // Use simplified coordinates for rendering
        coordinates = simplifiedCoords

        // Calculate bounds from coordinates
        const lngs = coordinates.map(c => c[0])
        const lats = coordinates.map(c => c[1])
        const bounds: [number, number, number, number] = [
          Math.min(...lngs),
          Math.min(...lats),
          Math.max(...lngs),
          Math.max(...lats)
        ]

        console.log('[RaceRouteMap] Initializing Mapbox map in', isDark ? 'DARK' : 'LIGHT', 'mode')

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

          // Debug: log all layer IDs to help identify label layers
          console.log('[RaceRouteMap] All map layers:', layers?.map(l => `${l.id} (${l.type})`).join(', '))

          for (const layer of layers || []) {
            if (layer.type === 'symbol' || (layer.id && layer.id.includes('label'))) {
              firstSymbolId = layer.id
              console.log('[RaceRouteMap] Inserting route layers before:', layer.id)
              break
            }
          }

          if (!firstSymbolId) {
            console.warn('[RaceRouteMap] No symbol/label layer found, route will be on top of labels!')
          }

          // Strava-style 4-layer route (matching MarathonShowcase)
          // 1. Shadow layer (bottom) - subtle depth
          map.addLayer({
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
          }, firstSymbolId)

          // 2. Border layer (white casing)
          map.addLayer({
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
          }, firstSymbolId)

          // 3. Main route line (electric pink)
          map.addLayer({
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
          }, firstSymbolId)

          // 4. Highlight layer (white overlay for dimension)
          map.addLayer({
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
          }, firstSymbolId)

          // Create start marker (green)
          const startMarkerEl = createMarkerPin('#00D464') // Volt Green
          new mapboxgl.Marker({ element: startMarkerEl })
            .setLngLat(coordinates[0])
            .addTo(map)

          // Create finish marker (checkered flag)
          const finishMarkerEl = createCheckeredFinishMarker()
          new mapboxgl.Marker({ element: finishMarkerEl })
            .setLngLat(coordinates[coordinates.length - 1])
            .addTo(map)

          // Create custom controls matching Google Maps style
          createCustomControls(map, isDark)

          // Hide loading after map is fully loaded
          setTimeout(() => {
            console.log('[RaceRouteMap] Map initialization complete, hiding loading screen')
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

    console.log('[RaceRouteMap] Calling initMap...')
    initMap()

    // Cleanup
    return () => {
      console.log('[RaceRouteMap] Cleaning up map...')
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      console.log('[RaceRouteMap] Cleanup complete')
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
    <div className="relative w-full h-80 min-h-80 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 flex-shrink-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 z-10">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      <style jsx global>{`
        /* Make Mapbox attribution more transparent (matching Google Maps style) */
        .mapboxgl-ctrl-attrib,
        .mapboxgl-ctrl-logo {
          opacity: 0.5 !important;
        }

        /* Make them fully visible on hover */
        .mapboxgl-ctrl-attrib:hover,
        .mapboxgl-ctrl-logo:hover {
          opacity: 1 !important;
        }

        /* Hide default Mapbox controls (we'll add custom ones) */
        .mapboxgl-ctrl-top-right .mapboxgl-ctrl,
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
          display: none;
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
function createCustomControls(map: mapboxgl.Map, isDark: boolean) {
  // Create fullscreen button (top-right)
  const fullscreenButton = document.createElement('button')
  fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen view')
  fullscreenButton.className = 'mapboxgl-ctrl-fullscreen'
  fullscreenButton.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border: none;
    border-radius: 16px;
    width: 40px;
    height: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'});
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
  `

  // Fullscreen icon SVG
  fullscreenButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7V2h5M16 7V2h-5M16 11v5h-5M2 11v5h5"
            stroke="${isDark ? 'white' : '#333'}"
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

  // Create zoom controls container - single pill-shaped button
  const zoomContainer = document.createElement('div')
  zoomContainer.className = 'mapboxgl-ctrl-zoom'
  zoomContainer.style.cssText = `
    background-color: ${isDark ? '#2d2d2d' : 'white'};
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'});
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 1;
  `

  // Create zoom in button
  const zoomInButton = document.createElement('button')
  zoomInButton.setAttribute('aria-label', 'Zoom in')
  zoomInButton.style.cssText = `
    background-color: transparent;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 300;
    color: ${isDark ? 'white' : '#333'};
    transition: background-color 0.2s;
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
    margin: 0 8px;
  `

  // Create zoom out button
  const zoomOutButton = document.createElement('button')
  zoomOutButton.setAttribute('aria-label', 'Zoom out')
  zoomOutButton.style.cssText = `
    background-color: transparent;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 300;
    color: ${isDark ? 'white' : '#333'};
    transition: background-color 0.2s;
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

  // Add controls to map container
  const mapContainer = map.getContainer()
  mapContainer.appendChild(fullscreenButton)
  mapContainer.appendChild(zoomContainer)
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
