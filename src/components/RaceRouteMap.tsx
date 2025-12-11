'use client'

import { useEffect, useRef, useState, useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'

interface RaceRouteMapProps {
  gpxUrl: string
  title: string
}

// Map styling using cloud-based styles via Map ID
// Map ID: 5f71815e7cfcb0a2c8c865c0 (JavaScript Vector) with both light and dark styles configured
// Light mode: Monochrome with minimal POIs, city labels only
// Dark mode: Monochrome with minimal POIs, city labels only
// Switches between light/dark using colorScheme option (LIGHT or DARK)

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

        console.log('[RaceRouteMap] Initializing map with Map ID and colorScheme in', isDark ? 'DARK' : 'LIGHT', 'mode')

        // Initialize map with Map ID and minimal controls
        // Map ID (JavaScript Vector) has both light and dark styles configured
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapId: '5f71815e7cfcb0a2c8c865c0', // JavaScript Vector Map ID with cloud-based styles
          colorScheme: isDark ? 'DARK' : 'LIGHT', // Switch between light/dark cloud styles
          // Lock camera perspective to prevent tilt/rotate control
          tilt: 0,
          heading: 0,
          // Enable only essential controls
          zoomControl: true,
          fullscreenControl: true,
          // Disable all other controls
          scaleControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          rotateControl: false,
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

        // Wait for map tiles to fully load before hiding loading screen
        // Longer delay ensures tiles are loaded from center outward
        setTimeout(() => {
          console.log('[RaceRouteMap] Map initialization complete, hiding loading screen')
          setIsLoading(false)
        }, 1500)
      } catch (err) {
        console.error('[RaceRouteMap] Error loading map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

    console.log('[RaceRouteMap] Calling initMap...')
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
