// src/lib/raceUtils.ts

/**
 * Calculate net elevation from elevation gain and loss
 * @param elevationGain - Elevation gain in meters
 * @param elevationLoss - Elevation loss in meters
 * @returns Net elevation (absolute value of gain - loss)
 */
export function calculateNetElevation(
  elevationGain: number = 0,
  elevationLoss: number = 0
): number {
  return Math.abs(elevationGain - elevationLoss)
}
