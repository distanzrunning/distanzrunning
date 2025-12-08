'use client'

import { useEffect, useRef, useState } from 'react'

interface RaceRouteMapProps {
  gpxUrl: string
  title: string
}

export function RaceRouteMap({ gpxUrl, title }: RaceRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let map: google.maps.Map | null = null
    let polyline: google.maps.Polyline | null = null

    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load Google Maps API if not already loaded
        if (!window.google) {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          if (!apiKey) {
            throw new Error('Google Maps API key is not configured')
          }

          await loadGoogleMapsScript(apiKey)
        }

        if (!mapRef.current) return

        // Fetch and parse GPX file
        const response = await fetch(gpxUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch GPX file')
        }

        const gpxText = await response.text()
        const coordinates = parseGPX(gpxText)

        if (coordinates.length === 0) {
          throw new Error('No coordinates found in GPX file')
        }

        // Calculate center from coordinates
        const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length
        const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length
        const center = { lat: centerLat, lng: centerLng }

        // Initialize map with custom Map ID from Google Maps Platform
        map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          // Use custom Map ID that handles both light and dark modes
          mapId: '5f71815e7cfcb0a23878760d',
        })

        // Draw route polyline
        polyline = new google.maps.Polyline({
          path: coordinates,
          geodesic: true,
          strokeColor: '#e43c81', // Electric Pink from Distanz brand
          strokeOpacity: 0.9,
          strokeWeight: 4,
        })

        polyline.setMap(map)

        // Fit map to route bounds using LatLngBounds literal
        const bounds = {
          north: Math.max(...coordinates.map(c => c.lat)),
          south: Math.min(...coordinates.map(c => c.lat)),
          east: Math.max(...coordinates.map(c => c.lng)),
          west: Math.min(...coordinates.map(c => c.lng))
        }
        map.fitBounds(bounds)

        // Add start marker (green) using PinElement
        const startPin = new google.maps.marker.PinElement({
          background: '#00D464',
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 1.2,
        })

        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: coordinates[0],
          title: 'Start',
          content: startPin.element,
        })

        // Add finish marker (red) using PinElement
        const finishPin = new google.maps.marker.PinElement({
          background: '#DC2626',
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 1.2,
        })

        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: coordinates[coordinates.length - 1],
          title: 'Finish',
          content: finishPin.element,
        })

        setIsLoading(false)
      } catch (err) {
        console.error('Error loading map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      // Cleanup
      if (polyline) polyline.setMap(null)
      if (map) map = null
    }
  }, [gpxUrl])

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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Loading map...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

// Global flag to prevent multiple script loads
let isLoadingGoogleMaps = false
let googleMapsPromise: Promise<void> | null = null

// Helper function to load Google Maps script
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Return existing promise if already loading
  if (isLoadingGoogleMaps && googleMapsPromise) {
    return googleMapsPromise
  }

  // Return resolved promise if already loaded
  if (window.google?.maps) {
    return Promise.resolve()
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript) {
    return new Promise((resolve) => {
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle)
          resolve()
        }
      }, 100)
    })
  }

  isLoadingGoogleMaps = true
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,geometry&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => {
      isLoadingGoogleMaps = false
      resolve()
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
