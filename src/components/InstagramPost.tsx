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

  if (!marathon) return null

  // Instagram dimensions: 1080x1080 (square)
  const instagramSize = { width: 1080, height: 1080 }

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
        if (!mapboxToken) return

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
    return (
      <div
        className="relative bg-white overflow-hidden"
        style={{ width: `${instagramSize.width}px`, height: `${instagramSize.height}px` }}
      >
        {/* Map */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Overlay Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-12">
          <div className="flex items-center gap-6">
            <img
              src={marathon.logo}
              alt={`${marathon.name} Marathon`}
              className="w-32 h-32 object-contain bg-white p-4 rounded-2xl"
            />
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-2">{marathon.name}</h1>
              <p className="text-3xl">{marathon.location}</p>
              <p className="text-2xl mt-2">{marathon.date.month} {marathon.date.day}</p>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12">
          <div className="text-white text-center">
            <p className="text-3xl font-semibold">DISTANZ RUNNING</p>
            <p className="text-2xl mt-2">distanzrunning.com</p>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <p className="text-2xl">Loading map...</p>
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
        <div className="flex items-center gap-6 mb-8">
          <img
            src={marathon.logo}
            alt={`${marathon.name} Marathon`}
            className="w-28 h-28 object-contain bg-white p-4 rounded-2xl border-2 border-neutral-200"
          />
          <div>
            <h1 className="text-5xl font-bold text-neutral-900">{marathon.name} Marathon</h1>
            <p className="text-3xl text-neutral-600 mt-2">{marathon.location}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-neutral-200 inline-block">
          <div className="text-center">
            <div className="text-2xl font-medium text-neutral-600 uppercase tracking-wide">
              {marathon.date.month}
            </div>
            <div className="text-6xl font-bold text-neutral-900 leading-none mt-2">
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
            <div key={index} className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-5">
                <div className="flex-1">
                  <div className="text-xl font-medium text-neutral-600 mb-3">
                    {stat.title}
                  </div>
                  <div className="text-4xl font-bold text-neutral-900">
                    {value}
                  </div>
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center border-2 border-neutral-300 shadow-lg flex-shrink-0">
                  <span className="material-symbols-outlined text-neutral-700 text-4xl">
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
        <div className="bg-neutral-900 rounded-2xl p-8 text-center">
          <p className="text-4xl font-semibold text-white">DISTANZ RUNNING</p>
          <p className="text-2xl text-neutral-300 mt-2">distanzrunning.com</p>
        </div>
      </div>
    </div>
  )
}
