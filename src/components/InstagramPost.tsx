'use client'

import React, { useRef, useEffect, useState } from 'react'
import { marathonData } from '@/constants/marathonData'

declare global {
  interface Window {
    mapboxgl: any
  }
}

type PostType = 'map' | 'stats'

interface InstagramPostProps {
  marathonId: string
  type: PostType
}

export function InstagramPost({ marathonId, type }: InstagramPostProps) {
  const marathon = marathonData.find(m => m.id === marathonId)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fix hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!marathon) return null
  if (!isMounted && type === 'map') return <div style={{ width: 1080, height: 1350 }} /> // Prevent hydration mismatch

  // Instagram dimensions: 1080x1350 (4:5 ratio)
  const instagramSize = { width: 1080, height: 1350 }

  useEffect(() => {
    if (type === 'map' && mapContainer.current && !mapInstance.current) {
      const init = async () => {
        // Load Mapbox
        if (!window.mapboxgl) {
          const link = document.createElement('link')
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css'
          link.rel = 'stylesheet'
          document.head.appendChild(link)

          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        if (!mapboxToken) {
          console.error('Mapbox token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.')
          setError('Mapbox token not configured')
          setIsLoading(false)
          return
        }

        window.mapboxgl.accessToken = mapboxToken

        mapInstance.current = new window.mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: marathon.center,
          zoom: 11,
          attributionControl: false,
          preserveDrawingBuffer: true // Important for screenshots
        })

        mapInstance.current.on('load', async () => {
          try {
            const response = await fetch(marathon.gpxUrl)
            const geojson = await response.json()
            const route = geojson.features?.find((f: any) => f.geometry.type === 'LineString')

            if (route?.geometry.coordinates) {
              const coordinates = route.geometry.coordinates

              // Add route
              mapInstance.current.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: { type: 'LineString', coordinates }
                }
              })

              // Route layers
              mapInstance.current.addLayer({
                id: 'route-shadow',
                type: 'line',
                source: 'route',
                paint: {
                  'line-color': 'rgba(0, 0, 0, 0.25)',
                  'line-width': 11,
                  'line-blur': 2
                }
              })

              mapInstance.current.addLayer({
                id: 'route-border',
                type: 'line',
                source: 'route',
                paint: {
                  'line-color': '#ffffff',
                  'line-width': 9
                }
              })

              mapInstance.current.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                paint: {
                  'line-color': '#e43c81',
                  'line-width': 7
                }
              })

              // Fit bounds
              const bounds = coordinates.reduce((bounds: any, coord: any) => {
                return bounds.extend(coord as [number, number])
              }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

              mapInstance.current.fitBounds(bounds, { padding: 80 })
            }

            setIsLoading(false)
          } catch (err) {
            console.error('Failed to load route:', err)
            setIsLoading(false)
          }
        })
      }

      init()
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [type, marathon])

  if (type === 'map') {
    // Prevent hydration mismatch by only rendering map content on client
    if (!isMounted) {
      return (
        <div
          className="relative bg-white overflow-hidden"
          style={{ width: `${instagramSize.width}px`, height: `${instagramSize.height}px` }}
        />
      )
    }

    return (
      <div
        className="relative bg-white overflow-hidden"
        style={{ width: `${instagramSize.width}px`, height: `${instagramSize.height}px` }}
      >
        {/* Map */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Overlay Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-12">
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-xl p-3 border border-neutral-200 w-28 h-28 flex items-center justify-center flex-shrink-0">
              <img
                src={marathon.logo}
                alt={`${marathon.name} Marathon`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white flex-1">
              <h1 className="quartr-font-features text-[56px] font-semibold leading-[1.15] mb-1">{marathon.name} Marathon</h1>
              <p className="quartr-font-features text-[28px] font-normal leading-[1.25]">{marathon.location}</p>
            </div>

            {/* Date Box */}
            <div className="bg-white rounded-xl border border-neutral-200 w-28 h-28 flex flex-col items-center justify-center flex-shrink-0">
              <div className="quartr-font-features text-[14px] font-medium text-neutral-600 uppercase tracking-wide">
                {marathon.date.month}
              </div>
              <div className="quartr-font-features text-[42px] font-bold text-neutral-900 leading-none mt-1">
                {marathon.date.day}
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12">
          <div className="text-white text-center">
            <p className="quartr-font-features text-[32px] font-semibold leading-tight tracking-wide">DISTANZ RUNNING</p>
            <p className="quartr-font-features text-[22px] mt-1 font-normal">distanzrunning.com</p>
          </div>
        </div>

        {isLoading && !error && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <p className="text-2xl">Loading map...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-2xl text-red-600 mb-2">Error Loading Map</p>
              <p className="text-xl text-gray-600">{error}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Stats post
  return (
    <div
      className="relative bg-neutral-50 p-16 overflow-hidden"
      style={{ width: `${instagramSize.width}px`, height: `${instagramSize.height}px` }}
    >
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-6 mb-6">
          <div className="bg-white rounded-xl p-3 border border-neutral-200 w-28 h-28 flex items-center justify-center flex-shrink-0">
            <img
              src={marathon.logo}
              alt={`${marathon.name} Marathon`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h1 className="quartr-font-features text-[52px] font-semibold text-neutral-900 leading-[1.15]">{marathon.name} Marathon</h1>
            <p className="quartr-font-features text-[26px] text-neutral-600 leading-[1.25] mt-1">{marathon.location}</p>
          </div>

          {/* Date Box */}
          <div className="bg-white rounded-xl border border-neutral-200 w-28 h-28 flex flex-col items-center justify-center flex-shrink-0">
            <div className="quartr-font-features text-[14px] font-medium text-neutral-600 uppercase tracking-wide">
              {marathon.date.month}
            </div>
            <div className="quartr-font-features text-[42px] font-bold text-neutral-900 leading-none mt-1">
              {marathon.date.day}
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        {marathon.stats.slice(0, 8).map((stat, index) => {
          const value = stat.static || stat.metric || stat.imperial || ''

          const getIconName = (title: string) => {
            switch(title) {
              case 'Distance': return 'arrow_range'
              case 'Surface': return 'road'
              case 'Profile': return 'elevation'
              case 'Elevation Gain': return 'arrow_drop_up'
              case 'Average Temp (high)': return 'device_thermostat'
              case 'Elevation Loss': return 'arrow_drop_down'
              case "Men's Course Record": return 'male'
              case "Women's Course Record": return 'female'
              default: return 'info'
            }
          }

          return (
            <div key={index} className="bg-white p-8 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-5">
                <div className="flex-1">
                  <div className="quartr-font-features text-[18px] font-medium text-neutral-600 mb-2 leading-tight">
                    {stat.title}
                  </div>
                  <div className="quartr-font-features text-[36px] font-semibold text-neutral-900 leading-[1.15]">
                    {value}
                  </div>
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center border border-neutral-300 flex-shrink-0">
                  <span className="material-symbols-outlined text-neutral-700 text-[40px]">
                    {getIconName(stat.title)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-16 left-16 right-16">
        <div className="bg-neutral-900 rounded-xl p-8 text-center border border-neutral-800">
          <p className="quartr-font-features text-[36px] font-semibold text-white leading-tight tracking-wide">DISTANZ RUNNING</p>
          <p className="quartr-font-features text-[22px] text-neutral-300 mt-1 font-normal">distanzrunning.com</p>
        </div>
      </div>
    </div>
  )
}
