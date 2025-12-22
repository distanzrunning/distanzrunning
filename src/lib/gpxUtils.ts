/**
 * Utility functions for parsing GPX files and extracting elevation data
 */

export interface ElevationPoint {
  distance: number // in kilometers
  elevation: number // in meters
}

/**
 * Parse a GPX file and extract coordinates with elevation data
 */
export function parseGPXWithElevation(gpxText: string): {
  coordinates: [number, number][]
  elevations: number[]
} {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml')
  const coordinates: [number, number][] = []
  const elevations: number[] = []

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

      // Extract elevation if available
      const eleElement = points[i].getElementsByTagName('ele')[0]
      const elevation = eleElement ? parseFloat(eleElement.textContent || '0') : 0
      elevations.push(elevation)
    }
  }

  return { coordinates, elevations }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371 // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Create elevation profile data from coordinates and elevations
 */
export function createElevationProfile(
  coordinates: [number, number][],
  elevations: number[],
  sampleInterval: number = 0.1 // Sample every 100 meters
): ElevationPoint[] {
  if (coordinates.length === 0 || elevations.length === 0) {
    return []
  }

  const elevationProfile: ElevationPoint[] = []
  let cumulativeDistance = 0
  let nextSampleDistance = 0

  for (let i = 0; i < coordinates.length; i++) {
    if (i > 0) {
      cumulativeDistance += calculateDistance(coordinates[i - 1], coordinates[i])
    }

    // Add point if we've reached the sample interval or it's the first/last point
    if (cumulativeDistance >= nextSampleDistance || i === 0 || i === coordinates.length - 1) {
      elevationProfile.push({
        distance: cumulativeDistance,
        elevation: elevations[i] || 0
      })
      nextSampleDistance = cumulativeDistance + sampleInterval
    }
  }

  return elevationProfile
}

/**
 * Parse GeoJSON and extract coordinates with elevation data
 */
export function parseGeoJSONWithElevation(geoJsonText: string): {
  coordinates: [number, number][]
  elevations: number[]
} {
  const coordinates: [number, number][] = []
  const elevations: number[] = []

  try {
    const geoJson = JSON.parse(geoJsonText)

    // Handle FeatureCollection
    if (geoJson.type === 'FeatureCollection' && geoJson.features) {
      for (const feature of geoJson.features) {
        if (feature.geometry?.type === 'LineString' && feature.geometry.coordinates) {
          for (const coord of feature.geometry.coordinates) {
            if (coord.length >= 2) {
              coordinates.push([coord[0], coord[1]])
              // Extract elevation if available (third coordinate)
              elevations.push(coord.length >= 3 ? coord[2] : 0)
            }
          }
        }
      }
    }
    // Handle single Feature
    else if (geoJson.type === 'Feature' && geoJson.geometry?.type === 'LineString') {
      for (const coord of geoJson.geometry.coordinates) {
        if (coord.length >= 2) {
          coordinates.push([coord[0], coord[1]])
          elevations.push(coord.length >= 3 ? coord[2] : 0)
        }
      }
    }
    // Handle direct LineString
    else if (geoJson.type === 'LineString' && geoJson.coordinates) {
      for (const coord of geoJson.coordinates) {
        if (coord.length >= 2) {
          coordinates.push([coord[0], coord[1]])
          elevations.push(coord.length >= 3 ? coord[2] : 0)
        }
      }
    }
  } catch (error) {
    console.error('Error parsing GeoJSON:', error)
  }

  return { coordinates, elevations }
}

/**
 * Fetch and parse a route file (GPX or GeoJSON) from a URL, returning elevation profile data
 */
export async function fetchGPXElevationData(gpxUrl: string): Promise<ElevationPoint[]> {
  try {
    const response = await fetch(gpxUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch route file')
    }

    const fileText = await response.text()
    let coordinates: [number, number][]
    let elevations: number[]

    // Check if it's GeoJSON or GPX
    if (fileText.trim().startsWith('{')) {
      // Parse as GeoJSON
      const result = parseGeoJSONWithElevation(fileText)
      coordinates = result.coordinates
      elevations = result.elevations
    } else {
      // Parse as GPX
      const result = parseGPXWithElevation(fileText)
      coordinates = result.coordinates
      elevations = result.elevations
    }

    if (coordinates.length === 0) {
      return []
    }

    return createElevationProfile(coordinates, elevations)
  } catch (error) {
    console.error('Error fetching elevation data:', error)
    return []
  }
}
