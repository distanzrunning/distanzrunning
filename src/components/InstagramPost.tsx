'use client'

import React, { useEffect, useRef } from 'react'
import { MarathonData } from '@/constants/marathonData'

interface InstagramPostProps {
  marathon: MarathonData
  type: 'map' | 'stats'
}

export const InstagramPost: React.FC<InstagramPostProps> = ({ marathon, type }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  // Load route and render map for 'map' type posts
  useEffect(() => {
    if (type !== 'map' || !mapContainer.current || typeof window === 'undefined') {
      return
    }

    const initMap = async () => {
      // Load Mapbox if not already loaded
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
        console.error('Mapbox access token is not configured')
        return
      }

      window.mapboxgl.accessToken = mapboxToken

      // Initialize map
      mapInstance.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: marathon.center,
        zoom: 12,
        attributionControl: false,
        interactive: false // Make it static for Instagram
      })

      mapInstance.current.on('load', async () => {
        try {
          // Load route data
          const response = await fetch(marathon.gpxUrl)
          const geojson = await response.json()

          const route = geojson.features?.find((f: any) => f.geometry.type === 'LineString')
          if (!route?.geometry.coordinates) {
            console.error('Invalid route data')
            return
          }

          const coordinates = route.geometry.coordinates

          // Add route to map
          mapInstance.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates }
            }
          })

          // Add route layers
          mapInstance.current.addLayer({
            id: 'route-border',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ffffff',
              'line-width': 7
            }
          })

          mapInstance.current.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#e43c81',
              'line-width': 5
            }
          })

          // Add start marker (green circle)
          const startMarkerElement = document.createElement('div')
          startMarkerElement.style.cssText = `
            background: #22c55e;
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 10;
          `
          new window.mapboxgl.Marker(startMarkerElement)
            .setLngLat(coordinates[0])
            .addTo(mapInstance.current)

          // Add finish marker (checkered flag pattern)
          const finishMarkerElement = document.createElement('div')
          finishMarkerElement.style.cssText = `
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            position: relative;
            z-index: 10;
          `

          const flagPattern = document.createElement('div')
          flagPattern.style.cssText = `
            width: 100%;
            height: 100%;
            background-image:
              linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%);
            background-size: 6px 6px;
            background-position: 0 0, 0 3px, 3px -3px, -3px 0px;
            background-color: white;
          `
          finishMarkerElement.appendChild(flagPattern)

          new window.mapboxgl.Marker(finishMarkerElement)
            .setLngLat(coordinates[coordinates.length - 1])
            .addTo(mapInstance.current)

          // Fit bounds to route
          const bounds = coordinates.reduce((bounds: any, coord: any) => {
            return bounds.extend(coord as [number, number])
          }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

          mapInstance.current.fitBounds(bounds, { padding: 80 })
        } catch (err) {
          console.error('Failed to load route:', err)
        }
      })
    }

    initMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
      }
    }
  }, [marathon, type])

  // Icon mapping for Material Symbols (same as MarathonShowcase)
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
      case 'Finishers (2024)': return 'groups'
      case 'Finishers (2025)': return 'groups'
      default: return 'info'
    }
  }

  return (
    <div
      className="instagram-post relative bg-white"
      style={{
        width: '1080px',
        height: '1350px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header: Logo, Title, Date */}
      <div
        className="header flex items-center justify-between px-12 py-8 bg-neutral-50 border-b-2 border-neutral-200"
        style={{ height: '140px' }}
      >
        {/* Left: Marathon Logo + Name/Location */}
        <div className="flex items-center gap-6">
          <div className="bg-white rounded-lg p-2 border border-neutral-300 flex items-center justify-center" style={{ width: '90px', height: '90px' }}>
            <img
              src={marathon.logo}
              alt={`${marathon.name} Marathon`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-neutral-900" style={{ fontSize: '38px', lineHeight: '1.1' }}>
              {marathon.name} Marathon
            </h1>
            <p className="text-neutral-600" style={{ fontSize: '24px', lineHeight: '1.2', marginTop: '4px' }}>
              {marathon.location}
            </p>
          </div>
        </div>

        {/* Right: Date */}
        <div className="bg-white rounded-lg border border-neutral-300" style={{ width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="text-neutral-600 font-semibold uppercase tracking-wide" style={{ fontSize: '16px', lineHeight: '1', marginBottom: '2px' }}>
            {marathon.date.month}
          </div>
          <div className="text-neutral-900 font-bold" style={{ fontSize: '40px', lineHeight: '0.9', marginTop: '2px' }}>
            {marathon.date.day}
          </div>
        </div>
      </div>

      {/* Content: Map or Stats */}
      {type === 'map' ? (
        <div
          ref={mapContainer}
          className="map-container flex-1 bg-neutral-100"
          style={{ height: '1070px' }}
        />
      ) : (
        <div className="stats-container flex-1 px-10 py-10 bg-white" style={{ height: '1070px' }}>
          <div className="grid grid-cols-2 gap-6 h-full">
            {marathon.stats.map((stat, index) => {
              const value = stat.static ||
                (stat.metric && stat.imperial ? stat.metric :
                stat.metric || stat.imperial || '')

              const isWorldAthleticsLabel = stat.title === 'World Athletics Label'

              return (
                <div
                  key={index}
                  className="bg-neutral-50 rounded-xl border-2 border-neutral-200 flex items-center justify-between p-6"
                >
                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="text-neutral-600 font-semibold mb-2" style={{ fontSize: '18px' }}>
                      {stat.title}
                    </div>
                    <div className="text-neutral-900 font-bold" style={{ fontSize: '32px', lineHeight: '1.1' }}>
                      {value}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 ml-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isWorldAthleticsLabel ? (
                      <div style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/images/platinum_label.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <div
                        className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full border-2 border-neutral-300 shadow-lg"
                        style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined text-neutral-700" style={{ fontSize: '36px', lineHeight: '36px', width: '36px', height: '36px', display: 'block' }}>
                          {getIconName(stat.title)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer: Distanz Running Logo */}
      <div
        className="footer bg-neutral-900 flex items-center justify-center"
        style={{ height: '140px' }}
      >
        <img
          src="/images/logo_white.svg"
          alt="Distanz Running"
          className="object-contain"
          style={{ height: '60px' }}
        />
      </div>
    </div>
  )
}

declare global {
  interface Window {
    mapboxgl: any
  }
}
