// Shared calculation utilities for marathon route visualization
// Used by both desktop and mobile MarathonShowcase components

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param coord1 - First coordinate [lng, lat, elevation?]
 * @param coord2 - Second coordinate [lng, lat, elevation?]
 * @returns Distance in meters
 */
export const calculateDistance = (coord1: number[], coord2: number[]): number => {
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

/**
 * Calculate total distance along a route
 * @param coordinates - Array of coordinates
 * @param useMetric - If true, return km; if false, return miles
 * @returns Total distance in km or miles
 */
export const calculateTotalDistance = (coordinates: number[][], useMetric: boolean): number => {
  let totalDistance = 0
  for (let i = 1; i < coordinates.length; i++) {
    const distance = calculateDistance(coordinates[i - 1], coordinates[i])
    totalDistance += distance
  }
  return useMetric ? totalDistance / 1000 : totalDistance / 1609.34
}

/**
 * Calculate grade (slope percentage) between points
 * @param coordinates - Array of coordinates with elevation data
 * @param index - Current point index
 * @returns Grade as percentage
 */
export const calculateGrade = (coordinates: number[][], index: number): number => {
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

/**
 * Find coordinate at specific distance along route
 * @param targetDistance - Target distance in km or miles
 * @param coordinates - Array of coordinates
 * @param useMetric - If true, targetDistance is in km; if false, in miles
 * @returns Interpolated coordinate [lng, lat, elevation]
 */
export const findCoordinateAtDistance = (
  targetDistance: number,
  coordinates: number[][],
  useMetric: boolean
): number[] => {
  let cumulativeDistance = 0

  // Handle edge cases
  if (targetDistance <= 0) {
    return coordinates[0]
  }

  for (let i = 1; i < coordinates.length; i++) {
    const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
    const segmentDistanceUnit = useMetric ? segmentDistance / 1000 : segmentDistance / 1609.34

    if (cumulativeDistance + segmentDistanceUnit >= targetDistance) {
      // Interpolate within this segment
      const remainingDistance = targetDistance - cumulativeDistance
      const ratio = segmentDistanceUnit > 0 ? remainingDistance / segmentDistanceUnit : 0

      const coord1 = coordinates[i - 1]
      const coord2 = coordinates[i]

      return [
        coord1[0] + (coord2[0] - coord1[0]) * ratio,
        coord1[1] + (coord2[1] - coord1[1]) * ratio,
        coord1[2] ? coord1[2] + ((coord2[2] || 0) - coord1[2]) * ratio : 0
      ]
    }

    cumulativeDistance += segmentDistanceUnit
  }

  // If we've gone past the end, return the last coordinate
  return coordinates[coordinates.length - 1]
}

/**
 * Calculate distance at a fractional index along the route
 * Used for precise distance calculations in desktop version
 * @param fractionalIndex - Index with fractional part (e.g., 10.5)
 * @param coordinates - Array of coordinates
 * @param useMetric - If true, return km; if false, return miles
 * @returns Distance in km or miles
 */
export const calculateDistanceAtFractionalIndex = (
  fractionalIndex: number,
  coordinates: number[][],
  useMetric: boolean
): number => {
  let distance = 0
  const wholeIndex = Math.floor(fractionalIndex)
  const fraction = fractionalIndex - wholeIndex

  // Calculate distance up to the whole index
  for (let i = 1; i <= wholeIndex && i < coordinates.length; i++) {
    distance += calculateDistance(coordinates[i - 1], coordinates[i])
  }

  // Add fractional distance within the current segment
  if (wholeIndex < coordinates.length - 1 && fraction > 0) {
    const segmentDistance = calculateDistance(coordinates[wholeIndex], coordinates[wholeIndex + 1])
    distance += segmentDistance * fraction
  }

  return useMetric ? distance / 1000 : distance / 1609.34
}

/**
 * Calculate distance at a specific index along the route
 * @param index - Coordinate index
 * @param coordinates - Array of coordinates
 * @param useMetric - If true, return km; if false, return miles
 * @returns Distance in km or miles
 */
export const calculateDistanceAtIndex = (
  index: number,
  coordinates: number[][],
  useMetric: boolean
): number => {
  let distance = 0
  for (let i = 1; i <= index && i < coordinates.length; i++) {
    distance += calculateDistance(coordinates[i - 1], coordinates[i])
  }
  return useMetric ? distance / 1000 : distance / 1609.34
}

/**
 * Find coordinate at distance using pre-calculated distance data
 * More efficient than findCoordinateAtDistance when distance array is available
 * @param targetDistance - Target distance in km or miles
 * @param coordinates - Array of coordinates
 * @param distanceData - Pre-calculated cumulative distances
 * @returns Interpolated coordinate [lng, lat, elevation]
 */
export const findCoordinateAtDistancePrecise = (
  targetDistance: number,
  coordinates: number[][],
  distanceData: number[]
): number[] => {
  if (targetDistance <= 0) return coordinates[0]
  if (targetDistance >= distanceData[distanceData.length - 1]) return coordinates[coordinates.length - 1]

  // Find the segment that contains our target distance
  let segmentIndex = 0
  for (let i = 1; i < distanceData.length; i++) {
    if (distanceData[i] >= targetDistance) {
      segmentIndex = i - 1
      break
    }
  }

  // Interpolate within this segment
  const distance1 = distanceData[segmentIndex]
  const distance2 = distanceData[segmentIndex + 1]
  const ratio = distance2 > distance1 ? (targetDistance - distance1) / (distance2 - distance1) : 0

  const coord1 = coordinates[segmentIndex]
  const coord2 = coordinates[segmentIndex + 1]

  return [
    coord1[0] + (coord2[0] - coord1[0]) * ratio,
    coord1[1] + (coord2[1] - coord1[1]) * ratio,
    coord1[2] ? coord1[2] + ((coord2[2] || 0) - coord1[2]) * ratio : 0
  ]
}
