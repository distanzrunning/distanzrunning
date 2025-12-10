'use client'

import { useEffect, useRef, useState, useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'

interface RaceRouteMapProps {
  gpxUrl: string
  title: string
}

// Map styling using integrated Navigation styles
// Light mode: Monochrome with minimal POIs, city labels only
// Dark mode: Monochrome with minimal POIs, city labels only
// Uses 'navigation' map type for clean, turn-by-turn optimized appearance

// Light mode styles - monochrome, minimal POIs
const LIGHT_MAP_STYLES = [
  { id: 'infrastructure.building.commercial', geometry: { visible: false } },
  { id: 'infrastructure.railwayTrack.commuter', geometry: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadDetail.directionArrow', label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadDetail.surface', geometry: { visible: false }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadSign', label: { visible: false } },
  { id: 'infrastructure.urbanArea', geometry: { visible: false } },
  { id: 'natural.archipelago', label: { visible: false } },
  { id: 'pointOfInterest', geometry: { visible: false }, label: { visible: false } },
  { id: 'pointOfInterest.foodAndDrink.bar', label: { visible: false } },
  { id: 'pointOfInterest.landmark', label: { visible: false } },
  { id: 'pointOfInterest.other.cemetery', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.beach', geometry: { visible: false }, label: { visible: false } },
  { id: 'pointOfInterest.recreation.golfCourse', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.natureReserve', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.park', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.sportsComplex', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.sportsField', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.zoo', geometry: { visible: false } },
  { id: 'pointOfInterest.transit.airport', geometry: { visible: false }, label: { visible: false } },
  { id: 'political.border', geometry: { visible: false }, label: { visible: false } },
  { id: 'political.city', label: { visible: true } },
  { id: 'political.reservation', label: { visible: false } },
  { id: 'political.stateOrProvince', geometry: { visible: false }, label: { visible: false } },
  { id: 'political.sublocality', label: { visible: false } }
]

// Dark mode styles - monochrome, minimal POIs
const DARK_MAP_STYLES = [
  { id: 'infrastructure.building.commercial', geometry: { visible: false } },
  { id: 'infrastructure.businessCorridor', geometry: { visible: false } },
  { id: 'infrastructure.railwayTrack.commuter', geometry: { visible: false } },
  { id: 'infrastructure.roadNetwork.noTraffic.pedestrianMall', geometry: { visible: false } },
  { id: 'infrastructure.roadNetwork.noTraffic.trail.paved', geometry: { visible: false } },
  { id: 'infrastructure.roadNetwork.noTraffic.trail.unpaved', geometry: { visible: false }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.ramp', geometry: { visible: false }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.road.arterial', geometry: { visible: true }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.road.highway', label: { visible: false } },
  { id: 'infrastructure.roadNetwork.road.local', label: { visible: false } },
  { id: 'infrastructure.roadNetwork.road.noOutlet', label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadDetail', geometry: { visible: false }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadDetail.directionArrow', label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadDetail.surface', geometry: { visible: false }, label: { visible: false } },
  { id: 'infrastructure.roadNetwork.roadSign', label: { visible: false } },
  { id: 'infrastructure.urbanArea', geometry: { visible: false } },
  { id: 'pointOfInterest', label: { visible: false } },
  { id: 'pointOfInterest.foodAndDrink.bar', label: { visible: false } },
  { id: 'pointOfInterest.landmark', label: { visible: false } },
  { id: 'pointOfInterest.other.cemetery', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.beach', geometry: { visible: false }, label: { visible: false } },
  { id: 'pointOfInterest.recreation.golfCourse', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.natureReserve', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.park', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.sportsComplex', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.sportsField', geometry: { visible: false } },
  { id: 'pointOfInterest.recreation.zoo', geometry: { visible: false } },
  { id: 'pointOfInterest.transit.airport', geometry: { visible: false }, label: { visible: false } },
  { id: 'political.border', label: { visible: false } },
  { id: 'political.reservation', label: { visible: false } },
  { id: 'political.stateOrProvince', label: { visible: false } },
  { id: 'political.sublocality', label: { visible: false } }
]

export function RaceRouteMap({ gpxUrl, title }: RaceRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
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

        // Load Google Maps API if not already loaded
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          throw new Error('Google Maps API key is not configured')
        }

        await loadGoogleMapsScript(apiKey)

        if (!mapRef.current) return

        // Fetch and parse GPX or GeoJSON file
        const response = await fetch(gpxUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch route file')
        }

        const fileText = await response.text()

        // Try to parse as GeoJSON first (check if it starts with '{')
        let coordinates: google.maps.LatLngLiteral[]
        if (fileText.trim().startsWith('{')) {
          coordinates = parseGeoJSON(fileText)
        } else {
          coordinates = parseGPX(fileText)
        }

        if (coordinates.length === 0) {
          throw new Error('No coordinates found in route file')
        }

        // Calculate center from coordinates
        const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length
        const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length
        const center = { lat: centerLat, lng: centerLng }

        console.log('[RaceRouteMap] Initializing map with Map ID and integrated styles in', isDark ? 'DARK' : 'LIGHT', 'mode')

        // Initialize map with Map ID (required for AdvancedMarkerElement) and integrated Navigation styles
        // Map ID enables Advanced Markers while local styles override the default appearance
        // Uses 'navigation' map type with monochrome styling
        // Switches between LIGHT_MAP_STYLES and DARK_MAP_STYLES based on theme
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapId: '5f71815e7cfcb0a23878760d', // Required for AdvancedMarkerElement
          mapTypeId: 'navigation', // Use Navigation map type (optimized for turn-by-turn guidance)
          styles: isDark ? DARK_MAP_STYLES : LIGHT_MAP_STYLES, // Apply integrated styles (override Map ID styles)
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true,
          // Minimize map controls and attributions
          disableDefaultUI: true, // Disable all default UI
          zoomControl: true, // Re-enable zoom control
          fullscreenControl: true, // Re-enable fullscreen control
          clickableIcons: false, // Disable clickable POI icons
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
        })

        mapInstanceRef.current = map

        // Draw route polyline
        const polyline = new google.maps.Polyline({
          path: coordinates,
          geodesic: true,
          strokeColor: '#e43c81', // Electric Pink from Distanz brand
          strokeOpacity: 0.9,
          strokeWeight: 4,
        })

        polyline.setMap(map)
        polylineRef.current = polyline

        // Fit map to route bounds using LatLngBounds literal
        const bounds = {
          north: Math.max(...coordinates.map(c => c.lat)),
          south: Math.min(...coordinates.map(c => c.lat)),
          east: Math.max(...coordinates.map(c => c.lng)),
          west: Math.min(...coordinates.map(c => c.lng))
        }
        map.fitBounds(bounds)

        // Helper function to create marker pin element
        const createMarkerPin = (color: string): HTMLElement => {
          const pin = document.createElement('div')
          pin.style.width = '16px'
          pin.style.height = '16px'
          pin.style.borderRadius = '50%'
          pin.style.backgroundColor = color
          pin.style.border = '2px solid white'
          pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
          return pin
        }

        // Add start marker (green) using AdvancedMarkerElement
        const startMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: coordinates[0],
          title: 'Start',
          content: createMarkerPin('#00D464'), // Volt Green
        })

        // Add finish marker (red) using AdvancedMarkerElement
        const finishMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: coordinates[coordinates.length - 1],
          title: 'Finish',
          content: createMarkerPin('#DC2626'), // Track Red
        })

        markersRef.current = [startMarker, finishMarker]

        // Small delay to allow Map ID styling to fully apply before showing map
        setTimeout(() => {
          setIsLoading(false)
        }, 300)
      } catch (err) {
        console.error('Error loading map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

    initMap()

    // Cleanup existing map before initializing new one
    return () => {
      console.log('[RaceRouteMap] Cleaning up map...')

      // Remove polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }

      // Remove markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          marker.setMap(null)
        })
        markersRef.current = []
      }

      // Clear map reference
      if (mapInstanceRef.current) {
        // Remove all event listeners and references
        google.maps.event.clearInstanceListeners(mapInstanceRef.current)
        mapInstanceRef.current = null
      }

      // Clear the map container
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
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
    <div className="relative w-full h-80 min-h-80 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 flex-shrink-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 z-10 transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-600 border-t-electric-pink rounded-full animate-spin"></div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Loading map...</div>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full transition-opacity duration-300 race-route-map"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      <style jsx>{`
        /* Minimize legal text and attributions */
        .race-route-map :global(.gm-style-cc),
        .race-route-map :global([style*="position: absolute"][style*="bottom"]:not(.gm-style-iw):not(.gmnoprint)) {
          opacity: 0.3;
          font-size: 9px;
        }
        .race-route-map :global(.gm-style-cc):hover {
          opacity: 0.6;
        }
        .race-route-map :global(a[href^="https://maps.google.com/maps"]) {
          font-size: 8px !important;
        }

        /* Target control containers */
        .race-route-map :global(div.gmnoprint) {
          margin: 8px !important;
        }

        /* Target all control buttons with better selectors */
        .race-route-map :global(div.gmnoprint button) {
          background: rgba(255, 255, 255, 0.95) !important;
          border-radius: 8px !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3) !important;
          border: none !important;
          margin: 2px !important;
        }

        /* Invert button icons for dark mode */
        .race-route-map :global(div.gmnoprint button img) {
          filter: ${isDark ? 'invert(1)' : 'none'} !important;
        }
      `}</style>
    </div>
  )
}

// Global flag to prevent multiple script loads
let isLoadingGoogleMaps = false
let googleMapsPromise: Promise<void> | null = null

// Helper function to load Google Maps script
async function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Return existing promise if already loading
  if (isLoadingGoogleMaps && googleMapsPromise) {
    return googleMapsPromise
  }

  // Return resolved promise if already loaded and initialized
  if (window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
    return Promise.resolve()
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript) {
    return new Promise((resolve) => {
      const checkGoogle = setInterval(() => {
        if (window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
          clearInterval(checkGoogle)
          resolve()
        }
      }, 100)
    })
  }

  isLoadingGoogleMaps = true
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=beta&loading=async`
    script.async = true
    script.onload = () => {
      // Wait for Google Maps to fully initialize
      const checkInit = setInterval(() => {
        if (window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
          clearInterval(checkInit)
          isLoadingGoogleMaps = false
          resolve()
        }
      }, 50)

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInit)
        isLoadingGoogleMaps = false
        googleMapsPromise = null
        reject(new Error('Google Maps initialization timeout'))
      }, 10000)
    }
    script.onerror = () => {
      isLoadingGoogleMaps = false
      googleMapsPromise = null
      reject(new Error('Failed to load Google Maps script'))
    }
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

// Helper function to parse GeoJSON and extract coordinates
function parseGeoJSON(geoJsonText: string): google.maps.LatLngLiteral[] {
  try {
    const geoJson = JSON.parse(geoJsonText)
    const coordinates: google.maps.LatLngLiteral[] = []

    // Handle FeatureCollection
    if (geoJson.type === 'FeatureCollection' && geoJson.features) {
      for (const feature of geoJson.features) {
        if (feature.geometry && feature.geometry.type === 'LineString') {
          // GeoJSON format is [longitude, latitude, elevation?]
          for (const coord of feature.geometry.coordinates) {
            coordinates.push({
              lng: coord[0],
              lat: coord[1]
            })
          }
        }
      }
    }
    // Handle single Feature
    else if (geoJson.type === 'Feature' && geoJson.geometry) {
      if (geoJson.geometry.type === 'LineString') {
        for (const coord of geoJson.geometry.coordinates) {
          coordinates.push({
            lng: coord[0],
            lat: coord[1]
          })
        }
      }
    }
    // Handle LineString directly
    else if (geoJson.type === 'LineString' && geoJson.coordinates) {
      for (const coord of geoJson.coordinates) {
        coordinates.push({
          lng: coord[0],
          lat: coord[1]
        })
      }
    }

    return coordinates
  } catch (error) {
    console.error('Error parsing GeoJSON:', error)
    return []
  }
}

// Helper function to parse GPX and extract coordinates
function parseGPX(gpxText: string): google.maps.LatLngLiteral[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml')
  const coordinates: google.maps.LatLngLiteral[] = []

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
      coordinates.push({ lat, lng: lon })
    }
  }

  return coordinates
}

// Extend window type for Google Maps
declare global {
  interface Window {
    google: typeof google
  }
}
