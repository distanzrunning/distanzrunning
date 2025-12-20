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
          createCustomControls(map, isDark, bounds)

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
        .mapboxgl-ctrl-zoom {
          overflow: hidden !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        /* Dark mode border */
        @media (prefers-color-scheme: dark) {
          .mapboxgl-ctrl-fullscreen,
          .mapboxgl-ctrl-recenter,
          .mapboxgl-ctrl-zoom {
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
        }

        .mapboxgl-ctrl-fullscreen button,
        .mapboxgl-ctrl-recenter button,
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
function createCustomControls(map: mapboxgl.Map, isDark: boolean, bounds: mapboxgl.LngLatBoundsLike) {
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
    map.fitBounds(bounds, { padding: 40 })
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

  // Add controls to map container
  const mapContainer = map.getContainer()
  mapContainer.appendChild(fullscreenButton)
  mapContainer.appendChild(recenterButton)
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
