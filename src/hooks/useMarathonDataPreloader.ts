import { useEffect, useRef, useState } from 'react'
import { type MarathonData } from '@/constants/marathonData'

interface PreloadedRouteData {
  coordinates: number[][]
  aidStations: any[]
}

/**
 * Hook to preload all marathon route data into memory
 * This eliminates network delays when switching between marathons
 */
export function useMarathonDataPreloader(marathons: MarathonData[]) {
  const preloadedData = useRef<Map<string, PreloadedRouteData>>(new Map())
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)

  useEffect(() => {
    const preloadAllRoutes = async () => {
      setIsPreloading(true)

      try {
        // Preload all marathon routes in parallel
        const preloadPromises = marathons.map(async (marathon, index) => {
          try {
            const response = await fetch(marathon.geojsonUrl)
            if (!response.ok) {
              throw new Error(`Failed to fetch ${marathon.name}`)
            }

            const geojsonData = await response.json()

            // Extract coordinates
            let coordinates: number[][] = []
            if (geojsonData.features && geojsonData.features[0]) {
              const geometry = geojsonData.features[0].geometry
              if (geometry.type === 'LineString') {
                coordinates = geometry.coordinates
              } else if (geometry.type === 'MultiLineString') {
                coordinates = geometry.coordinates.flat()
              }
            }

            // Extract aid stations
            const aidStations: any[] = []
            if (geojsonData.features) {
              geojsonData.features.forEach((feature: any) => {
                if (feature.geometry.type === 'Point' && feature.properties?.name) {
                  const name = feature.properties.name
                  const lowerName = name.toLowerCase()

                  const aidStationKeywords = [
                    'water', 'fluid', 'gatorade', 'lucozade', 'buxton', 'drink', 'hydration',
                    'energy', 'gel', 'banana', 'food', 'nutrition', 'fuel',
                    'aid', 'station', 'medical', 'medic', 'first aid',
                    'biofreeze', 'pain relief', 'massage', 'treatment', 'refreshments',
                    'maurten', 'sports gels', 'Food & First Aid', 'Refreshments & First Aid'
                  ]

                  const isAidStation = aidStationKeywords.some(keyword => lowerName.includes(keyword))

                  if (isAidStation) {
                    aidStations.push({
                      name,
                      coordinates: feature.geometry.coordinates
                    })
                  }
                }
              })
            }

            // Store in preloaded data map
            preloadedData.current.set(marathon.id, {
              coordinates,
              aidStations
            })

            // Update progress
            setPreloadProgress(((index + 1) / marathons.length) * 100)
          } catch (error) {
            console.error(`Failed to preload ${marathon.name}:`, error)
          }
        })

        await Promise.all(preloadPromises)
      } catch (error) {
        console.error('Error preloading marathon data:', error)
      } finally {
        setIsPreloading(false)
      }
    }

    // Start preloading after a short delay to not block initial render
    const preloadTimeout = setTimeout(() => {
      preloadAllRoutes()
    }, 100)

    return () => clearTimeout(preloadTimeout)
  }, [marathons])

  /**
   * Get preloaded route data for a specific marathon
   * Returns null if not yet preloaded
   */
  const getPreloadedData = (marathonId: string): PreloadedRouteData | null => {
    return preloadedData.current.get(marathonId) || null
  }

  /**
   * Check if a specific marathon's data is preloaded
   */
  const isMarathonPreloaded = (marathonId: string): boolean => {
    return preloadedData.current.has(marathonId)
  }

  return {
    isPreloading,
    preloadProgress,
    getPreloadedData,
    isMarathonPreloaded
  }
}
