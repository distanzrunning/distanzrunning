'use client'

import React, { useEffect, useRef } from 'react'
import { MarathonData } from '@/constants/marathonData'

interface InstagramPostProps {
  marathon: MarathonData
  type: 'map' | 'stats'
  onMapReady?: () => void
}

export const InstagramPost: React.FC<InstagramPostProps> = ({ marathon, type, onMapReady }) => {
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

      // Initialize map with preserveDrawingBuffer for canvas capture
      mapInstance.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: marathon.center,
        zoom: 12,
        attributionControl: false,
        interactive: false, // Make it static for Instagram
        preserveDrawingBuffer: true // CRITICAL FIX: Enable canvas capture
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
          new window.mapboxgl.Marker({
            element: startMarkerElement,
            anchor: 'center' // Ensures proper positioning
          })
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

          new window.mapboxgl.Marker({
            element: finishMarkerElement,
            anchor: 'center' // Ensures proper positioning
          })
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

      // Add map ready callback - fires when map is fully loaded and idle
      mapInstance.current.once('idle', () => {
        // Give extra time for rendering
        setTimeout(() => {
          if (onMapReady) {
            onMapReady()
          }
        }, 500)
      })
    }

    initMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
      }
    }
  }, [marathon, type, onMapReady])

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
      style={{
        width: '1080px',
        height: '1350px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header: Logo, Title, Date */}
      <div
        style={{
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 48px',
          backgroundColor: '#fafafa',
          borderBottom: '2px solid #e5e5e5'
        }}
      >
        {/* Left: Marathon Logo + Name/Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '8px',
            border: '1px solid #d4d4d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={marathon.logo}
              alt={`${marathon.name} Marathon`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <h1 style={{
              fontSize: '38px',
              lineHeight: '1.1',
              fontWeight: 'bold',
              color: '#171717',
              margin: 0
            }}>
              {marathon.name} Marathon
            </h1>
            <p style={{
              fontSize: '24px',
              lineHeight: '1.2',
              color: '#525252',
              marginTop: '4px',
              margin: 0
            }}>
              {marathon.location}
            </p>
          </div>
        </div>

        {/* Right: Date */}
        <div style={{
          width: '90px',
          height: '90px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d4d4d4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '16px',
            lineHeight: '1',
            marginBottom: '2px',
            color: '#525252',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {marathon.date.month}
          </div>
          <div style={{
            fontSize: '40px',
            lineHeight: '0.9',
            marginTop: '2px',
            color: '#171717',
            fontWeight: 'bold'
          }}>
            {marathon.date.day}
          </div>
        </div>
      </div>

      {/* Content: Map or Stats */}
      {type === 'map' ? (
        <div
          ref={mapContainer}
          style={{
            height: '1070px',
            flex: 1,
            backgroundColor: '#f5f5f5'
          }}
        />
      ) : (
        <div style={{
          height: '1070px',
          flex: 1,
          padding: '40px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            height: '100%'
          }}>
            {marathon.stats.map((stat, index) => {
              const value = stat.static ||
                (stat.metric && stat.imperial ? stat.metric :
                stat.metric || stat.imperial || '')

              const isWorldAthleticsLabel = stat.title === 'World Athletics Label'

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                    border: '2px solid #e5e5e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px'
                  }}
                >
                  {/* Text Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '18px',
                      color: '#525252',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      {stat.title}
                    </div>
                    <div style={{
                      fontSize: '32px',
                      lineHeight: '1.1',
                      color: '#171717',
                      fontWeight: 'bold'
                    }}>
                      {value}
                    </div>
                  </div>

                  {/* Icon */}
                  <div style={{
                    flexShrink: 0,
                    marginLeft: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isWorldAthleticsLabel ? (
                      <div style={{
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src="/images/platinum_label.svg" alt="" style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(to bottom right, #f5f5f5, #e5e5e5)',
                          borderRadius: '50%',
                          border: '2px solid #d4d4d4',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{
                          fontSize: '36px',
                          lineHeight: '36px',
                          width: '36px',
                          height: '36px',
                          display: 'block',
                          color: '#404040',
                          fontFamily: 'Material Symbols Outlined'
                        }}>
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
        style={{
          height: '140px',
          backgroundColor: '#171717',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src="/images/logo_white.svg"
          alt="Distanz Running"
          style={{
            height: '60px',
            objectFit: 'contain'
          }}
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
