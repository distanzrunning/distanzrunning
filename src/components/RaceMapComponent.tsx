'use client'

import React, { useEffect, useRef, useState } from 'react'

// Declare global types for Mapbox and Chart.js
declare global {
  interface Window {
    mapboxgl: any
    Chart: any
  }
}

// Props interface for the Race Map Component
interface RaceMapComponentProps {
  token: string
  gpxUrl?: string
  center?: [number, number]
  city?: string
}

// Race Map Component that loads GPX/GeoJSON route data
export const RaceMapComponent: React.FC<RaceMapComponentProps> = ({ 
  token,
  gpxUrl = "https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/tokyo_marathon_geo.json",
  center = [139.6917, 35.6895], // Default to Tokyo
  city = "Tokyo"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const chartContainer = useRef<HTMLCanvasElement>(null)
  const mapInstance = useRef<any>(null)
  const chartInstance = useRef<any>(null)
  const verticalLinePlugin = useRef<any>(null) // Store the vertical line plugin
  const [mapLoaded, setMapLoaded] = useState(false)
  const [routeLoaded, setRouteLoaded] = useState(false)
  const [chartLoaded, setChartLoaded] = useState(false)
  const [chartJsLoaded, setChartJsLoaded] = useState(false)
  const [isMetric, setIsMetric] = useState(true)
  const [currentMapStyle, setCurrentMapStyle] = useState('streets-v11')
  const [error, setError] = useState<string | null>(null)
  const routeCoordinates = useRef<number[][]>([]) // Store coordinates for chart
  const hoverMarker = useRef<any>(null) // For interactive hover marker
  const scaleControl = useRef<any>(null) // Store scale control reference
  const navigationControl = useRef<any>(null) // Store navigation control reference
  const attributionControl = useRef<any>(null) // Store attribution control reference

  // Helper function to safely remove source and layers
  const removeExistingRouteData = () => {
    if (!mapInstance.current) return

    // Remove layers first (they depend on sources)
    const layersToRemove = ['route-line', 'route-border', 'distance-markers-icons']
    layersToRemove.forEach(layerId => {
      if (mapInstance.current.getLayer(layerId)) {
        mapInstance.current.removeLayer(layerId)
      }
    })

    // Remove sources
    const sourcesToRemove = ['route', 'distance-markers']
    sourcesToRemove.forEach(sourceId => {
      if (mapInstance.current.getSource(sourceId)) {
        mapInstance.current.removeSource(sourceId)
      }
    })

    // Remove any existing markers
    if (hoverMarker.current) {
      hoverMarker.current.remove()
      hoverMarker.current = null
    }
  }

  // Helper function to safely add map controls
  const addMapControls = () => {
    if (!mapInstance.current) return

    // Add navigation control if not already added
    if (!navigationControl.current) {
      navigationControl.current = new window.mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true
      })
      mapInstance.current.addControl(navigationControl.current, 'top-left')
    }

    // Add scale control if not already added
    if (!scaleControl.current) {
      scaleControl.current = new window.mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: isMetric ? 'metric' : 'imperial'
      })
      mapInstance.current.addControl(scaleControl.current, 'bottom-left')
    }

    // Add attribution control if not already added
    if (!attributionControl.current) {
      attributionControl.current = new window.mapboxgl.AttributionControl({
        compact: true
      })
      mapInstance.current.addControl(attributionControl.current, 'bottom-right')
    }
  }

  // Helper function to remove all controls
  const removeMapControls = () => {
    if (!mapInstance.current) return

    if (navigationControl.current) {
      mapInstance.current.removeControl(navigationControl.current)
      navigationControl.current = null
    }

    if (scaleControl.current) {
      mapInstance.current.removeControl(scaleControl.current)
      scaleControl.current = null
    }

    if (attributionControl.current) {
      mapInstance.current.removeControl(attributionControl.current)
      attributionControl.current = null
    }
  }

  // Function to calculate distance between two coordinates
  const calculateDistance = (coord1: number[], coord2: number[]) => {
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

  // Function to find closest coordinate to a given distance
  const findCoordinateAtDistance = (targetDistance: number, coordinates: number[][], useMetric: boolean) => {
    // Build cumulative distance array to match chart data exactly
    const distanceArray: number[] = []
    let cumulativeDistance = 0
    
    distanceArray.push(0) // Start at 0
    
    for (let i = 1; i < coordinates.length; i++) {
      const distance = calculateDistance(coordinates[i - 1], coordinates[i])
      cumulativeDistance += distance
      // Convert to same units as specified
      distanceArray.push(useMetric ? cumulativeDistance / 1000 : cumulativeDistance / 1609.34)
    }
    
    // Find the closest distance in our array
    let closestIndex = 0
    let minDiff = Math.abs(distanceArray[0] - targetDistance)
    
    for (let i = 1; i < distanceArray.length; i++) {
      const diff = Math.abs(distanceArray[i] - targetDistance)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }
    
    // If we have an exact match or we're at the boundaries, return the coordinate
    if (minDiff < 0.01 || closestIndex === 0 || closestIndex === coordinates.length - 1) {
      return coordinates[closestIndex]
    }
    
    // Interpolate between the closest points
    let lowerIndex = closestIndex
    let upperIndex = closestIndex
    
    if (distanceArray[closestIndex] < targetDistance && closestIndex < coordinates.length - 1) {
      upperIndex = closestIndex + 1
    } else if (distanceArray[closestIndex] > targetDistance && closestIndex > 0) {
      lowerIndex = closestIndex - 1
    }
    
    if (lowerIndex === upperIndex) {
      return coordinates[closestIndex]
    }
    
    // Linear interpolation
    const lowerDistance = distanceArray[lowerIndex]
    const upperDistance = distanceArray[upperIndex]
    const ratio = (targetDistance - lowerDistance) / (upperDistance - lowerDistance)
    
    const lowerCoord = coordinates[lowerIndex]
    const upperCoord = coordinates[upperIndex]
    
    return [
      lowerCoord[0] + (upperCoord[0] - lowerCoord[0]) * ratio,
      lowerCoord[1] + (upperCoord[1] - lowerCoord[1]) * ratio,
      lowerCoord[2] ? lowerCoord[2] + (upperCoord[2] - lowerCoord[2]) * ratio : 0
    ]
  }

  // Function to add/update hover marker on map
  const updateHoverMarker = (coordinate: number[]) => {
    if (!mapInstance.current) return

    // Remove existing hover marker
    if (hoverMarker.current) {
      hoverMarker.current.remove()
    }

    // Create new hover marker
    const markerElement = document.createElement('div')
    markerElement.style.cssText = `
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    `

    hoverMarker.current = new window.mapboxgl.Marker(markerElement)
      .setLngLat(coordinate)
      .addTo(mapInstance.current)
  }

  // Function to remove hover marker
  const removeHoverMarker = () => {
    if (hoverMarker.current) {
      hoverMarker.current.remove()
      hoverMarker.current = null
    }
  }

  // Simplified function to add distance markers using Mapbox layers
  const addDistanceMarkers = (coordinates: number[][]) => {
    addDistanceMarkersWithUnits(coordinates, isMetric)
  }

  const addDistanceMarkersWithUnits = (coordinates: number[][], useMetric: boolean) => {
    // Remove existing marker layers first
    if (mapInstance.current.getLayer('distance-markers-icons')) {
      mapInstance.current.removeLayer('distance-markers-icons')
    }
    if (mapInstance.current.getSource('distance-markers')) {
      mapInstance.current.removeSource('distance-markers')
    }

    const targetIntervalMeters = useMetric ? 1000 : 1609.34 // 1km or 1mi in meters
    const unit = useMetric ? 'km' : 'mi'
    
    // Create SVG icon data URL for the authentic distance marker (full circle + flag)
    const distanceMarkerSvg = `<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M16 8A8 8 0 100 8a8 8 0 0016 0z" fill="#e43c81" stroke="#ffffff" stroke-width="1"></path><path d="M3 3.5a.5.5 0 011 0V5h8V3.5a.5.5 0 011 0V13h-1V9H4v4H3V5.667v-.019z" fill="#fff"></path></svg>`
    const distanceMarkerIconUrl = `data:image/svg+xml;base64,${btoa(distanceMarkerSvg)}`
    
    // Calculate cumulative distances and find marker points
    const markerFeatures = []
    let cumulativeDistance = 0
    let nextMarkerDistance = targetIntervalMeters
    let markerCount = 1

    for (let i = 1; i < coordinates.length; i++) {
      const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i])
      cumulativeDistance += segmentDistance

      // Check if we've passed a marker point
      if (cumulativeDistance >= nextMarkerDistance) {
        // Use the current coordinate (closest to the marker distance)
        markerFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coordinates[i][0], coordinates[i][1]]
          },
          properties: {
            label: `${markerCount} ${unit}`,
            markerNumber: markerCount
          }
        })
        
        markerCount++
        nextMarkerDistance = markerCount * targetIntervalMeters
      }
    }

    console.log(`✅ Created ${markerFeatures.length} distance markers`)

    // Add the distance marker icon to the map
    if (!mapInstance.current.hasImage('distance-marker-icon')) {
      const img = new Image(16, 16)
      img.onload = () => {
        if (mapInstance.current && !mapInstance.current.hasImage('distance-marker-icon')) {
          mapInstance.current.addImage('distance-marker-icon', img)
        }
      }
      img.src = distanceMarkerIconUrl
    }

    // Add markers as a GeoJSON source
    mapInstance.current.addSource('distance-markers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: markerFeatures
      }
    })

    // Add distance marker icons
    mapInstance.current.addLayer({
      id: 'distance-markers-icons',
      type: 'symbol',
      source: 'distance-markers',
      layout: {
        'icon-image': 'distance-marker-icon',
        'icon-size': 1,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    })

    // Create a popup for hover tooltips
    const popup = new window.mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15
    })

    // Add hover events for tooltips
    const addHoverEvents = (layerId: string) => {
      mapInstance.current.on('mouseenter', layerId, (e: any) => {
        mapInstance.current.getCanvas().style.cursor = 'pointer'
        
        const coordinates = e.features[0].geometry.coordinates.slice()
        const label = e.features[0].properties.label

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        popup.setLngLat(coordinates)
          .setHTML(`<div style="font-family: Inter, sans-serif; font-weight: 600; color: #1f2937; font-size: 12px;">${label}</div>`)
          .addTo(mapInstance.current)
      })

      mapInstance.current.on('mouseleave', layerId, () => {
        mapInstance.current.getCanvas().style.cursor = ''
        popup.remove()
      })
    }

    // Add hover events to the distance marker icons
    addHoverEvents('distance-markers-icons')
  }

  // Function to add route to map
  const addRouteToMap = (coordinates: number[][]) => {
    if (!mapInstance.current) return

    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }]
    }
    
    // Add the route source (now safe since we removed existing ones)
    mapInstance.current.addSource('route', {
      type: 'geojson',
      data: geojson
    })

    // Add the route layers
    mapInstance.current.addLayer({
      id: 'route-border',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#ffffff',
        'line-width': 6
      }
    })

    mapInstance.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#e43c81',
        'line-width': 4
      }
    })

    // Add start marker
    const startMarkerElement = document.createElement('div')
    startMarkerElement.style.cssText = `
      background: #22c55e;
      border: 3px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
    `
    new window.mapboxgl.Marker(startMarkerElement)
      .setLngLat(coordinates[0])
      .addTo(mapInstance.current)

    // Add finish marker
    const finishMarkerElement = document.createElement('div')
    finishMarkerElement.style.cssText = `
      border: 3px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      background: 
        linear-gradient(45deg, 
          #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
        linear-gradient(45deg, 
          #000 25%, transparent 25%, transparent 75%, #000 75%, #000);
      background-size: 4px 4px;
      background-position: 0 0, 2px 2px;
      background-color: #fff;
    `
    new window.mapboxgl.Marker(finishMarkerElement)
      .setLngLat(coordinates[coordinates.length - 1])
      .addTo(mapInstance.current)

    // Add distance markers
    addDistanceMarkersWithUnits(coordinates, isMetric)
  }

  // Function to change map style
  const changeMapStyle = (styleId: string) => {
    if (mapInstance.current && styleId !== currentMapStyle) {
      setCurrentMapStyle(styleId)
      mapInstance.current.setStyle(`mapbox://styles/mapbox/${styleId}`)
      
      // Re-add route and markers after style change
      mapInstance.current.once('styledata', () => {
        // Re-add the route if it was loaded
        if (routeLoaded && routeCoordinates.current.length > 0) {
          addRouteToMap(routeCoordinates.current)
        }
      })
    }
  }

  // Function to toggle between metric and imperial
  const toggleUnits = () => {
    const newIsMetric = !isMetric
    setIsMetric(newIsMetric)
    
    // Update scale control units
    if (scaleControl.current && mapInstance.current) {
      mapInstance.current.removeControl(scaleControl.current)
      scaleControl.current = new window.mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: newIsMetric ? 'metric' : 'imperial'
      })
      mapInstance.current.addControl(scaleControl.current, 'bottom-left')
    }
    
    // Re-add markers with new units if route is loaded
    if (routeLoaded && mapInstance.current && mapInstance.current.getSource('route')) {
      const routeData = mapInstance.current.getSource('route')._data
      const coordinates = routeData.features[0].geometry.coordinates
      addDistanceMarkersWithUnits(coordinates, newIsMetric)
    }

    // Update chart with new units
    if (chartLoaded && routeCoordinates.current.length > 0) {
      updateChartWithUnits(routeCoordinates.current, newIsMetric)
    }
  }

  // Function to calculate grade between two points
  const calculateGrade = (coordinates: number[][], index: number) => {
    if (index === 0 || index >= coordinates.length - 1) return 0

    const prevCoord = coordinates[index - 1]
    const currentCoord = coordinates[index]
    const nextCoord = coordinates[index + 1]

    // Calculate distances and elevation changes
    const distance1 = calculateDistance(prevCoord, currentCoord)
    const distance2 = calculateDistance(currentCoord, nextCoord)
    const totalDistance = distance1 + distance2

    if (totalDistance === 0) return 0

    const elevationChange = (nextCoord[2] || 0) - (prevCoord[2] || 0)
    const grade = (elevationChange / totalDistance) * 100

    return grade
  }

  // Function to calculate chart data
  const calculateChartData = (coordinates: number[][], useMetric: boolean) => {
    const distanceData: number[] = []
    const elevationData: number[] = []
    const gradeData: number[] = []
    let cumulativeDistance = 0

    for (let i = 0; i < coordinates.length; i++) {
      const [lng, lat, ele] = coordinates[i]
      const elevation = ele || 0

      if (i > 0) {
        const distance = calculateDistance(coordinates[i - 1], coordinates[i])
        cumulativeDistance += distance
      }

      // Calculate grade
      const grade = calculateGrade(coordinates, i)

      // Convert distance and elevation based on unit system
      distanceData.push(useMetric ? cumulativeDistance / 1000 : cumulativeDistance / 1609.34)
      elevationData.push(useMetric ? elevation : elevation * 3.28084)
      gradeData.push(grade)
    }

    return { distanceData, elevationData, gradeData }
  }

  // Function to load Chart.js
  const loadChartJS = async () => {
    if (window.Chart) {
      // Create vertical line plugin if it doesn't exist
      if (!verticalLinePlugin.current) {
        createVerticalLinePlugin()
      }
      setChartJsLoaded(true)
      return
    }

    try {
      console.log('📊 Loading Chart.js...')
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
        script.onload = () => {
          console.log('✅ Chart.js loaded successfully')
          // Create vertical line plugin after Chart.js loads
          createVerticalLinePlugin()
          setChartJsLoaded(true)
          resolve(true)
        }
        script.onerror = (e) => {
          console.error('❌ Failed to load Chart.js:', e)
          reject(e)
        }
        document.head.appendChild(script)
      })
    } catch (err) {
      console.error('❌ Chart.js loading error:', err)
      setError('Failed to load Chart.js library')
      throw err
    }
  }

  // Function to create vertical line plugin
  const createVerticalLinePlugin = () => {
    verticalLinePlugin.current = {
      id: 'verticalLine',
      afterDatasetsDraw: (chart: any) => {
        if (chart.active && chart.active.length > 0) {
          const ctx = chart.ctx
          const activePoint = chart.active[0]
          const x = activePoint.element.x
          const topY = chart.scales.y.top
          const bottomY = chart.scales.y.bottom

          ctx.save()
          ctx.strokeStyle = '#e43c81'
          ctx.lineWidth = 1.5
          ctx.setLineDash([4, 4])
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.moveTo(x, topY)
          ctx.lineTo(x, bottomY)
          ctx.stroke()
          ctx.restore()
        }
      }
    }
    
    // Register the plugin
    if (window.Chart) {
      window.Chart.register(verticalLinePlugin.current)
    }
  }

  // Function to initialize elevation chart
  const initializeChart = async (coordinates: number[][]) => {
    if (!chartContainer.current) {
      console.warn('⚠️ Chart container not available')
      return
    }

    if (!chartJsLoaded) {
      console.warn('⚠️ Chart.js not loaded yet')
      return
    }

    try {
      console.log('📊 Initializing elevation chart...')

      const { distanceData, elevationData, gradeData } = calculateChartData(coordinates, isMetric)
      const unitDistance = isMetric ? 'km' : 'mi'
      const unitElevation = isMetric ? 'm' : 'ft'

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new window.Chart(chartContainer.current, {
        type: 'line',
        data: {
          labels: distanceData.map(d => d.toFixed(1)),
          datasets: [{
            label: `Elevation (${unitElevation})`,
            data: elevationData,
            borderColor: '#e43c81',
            backgroundColor: 'rgba(228, 60, 129, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#e43c81',
          }]
        },
        plugins: [verticalLinePlugin.current],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 12,
              right: 12,
              bottom: 8,
              left: 8
            }
          },
          onHover: (event: any, activeElements: any[]) => {
            if (activeElements.length > 0 && routeCoordinates.current.length > 0) {
              const index = activeElements[0].index
              const distance = parseFloat(chartInstance.current.data.labels[index])
              
              // Store active element for vertical line plugin
              chartInstance.current.active = activeElements
              
              // Find coordinate at this distance and show hover marker
              const coordinate = findCoordinateAtDistance(distance, routeCoordinates.current, isMetric)
              updateHoverMarker(coordinate)
              
              // Trigger redraw for vertical line
              chartInstance.current.draw()
            } else {
              chartInstance.current.active = []
              removeHoverMarker()
              chartInstance.current.draw()
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: 'rgb(249, 250, 250)',
              bodyColor: 'rgb(249, 250, 250)',
              borderColor: 'rgba(231, 231, 231, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              titleFont: {
                family: 'InterVariable, Inter, sans-serif',
                size: 13,
                weight: '500'
              },
              bodyFont: {
                family: 'InterVariable, Inter, sans-serif',
                size: 12,
                weight: '400'
              },
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (tooltipItems: any[]) => {
                  return `${tooltipItems[0].label} ${unitDistance}`
                },
                label: (context: any) => {
                  const index = context.dataIndex
                  const elevation = Math.round(context.parsed.y)
                  const grade = gradeData[index]?.toFixed(1) || '0.0'
                  
                  return [
                    `Elevation: ${elevation} ${unitElevation}`,
                    `Grade: ${grade}%`
                  ]
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              border: {
                display: false
              },
              title: {
                display: true,
                text: `Distance (${unitDistance})`,
                color: 'rgb(107, 114, 128)',
                font: {
                  family: 'InterVariable, Inter, sans-serif',
                  size: 12,
                  weight: '400'
                },
                padding: {
                  top: 8
                }
              },
              grid: {
                color: 'rgba(231, 231, 231, 0.6)',
                drawBorder: false,
                lineWidth: 0.5
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                font: {
                  family: 'InterVariable, Inter, sans-serif',
                  size: 11,
                  weight: '400'
                },
                maxTicksLimit: 8,
                padding: 6
              }
            },
            y: {
              display: true,
              border: {
                display: false
              },
              title: {
                display: true,
                text: `Elevation (${unitElevation})`,
                color: 'rgb(107, 114, 128)',
                font: {
                  family: 'InterVariable, Inter, sans-serif',
                  size: 12,
                  weight: '400'
                },
                padding: {
                  bottom: 8
                }
              },
              grid: {
                color: 'rgba(231, 231, 231, 0.6)',
                drawBorder: false,
                lineWidth: 0.5
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                font: {
                  family: 'InterVariable, Inter, sans-serif',
                  size: 11,
                  weight: '400'
                },
                padding: 6
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              hoverRadius: 5
            }
          }
        }
      })

      // Add mouseleave event listener to the chart canvas to clear hover state
      chartContainer.current.addEventListener('mouseleave', () => {
        if (chartInstance.current) {
          chartInstance.current.active = []
          removeHoverMarker()
          chartInstance.current.draw()
        }
      })

      console.log('✅ Elevation chart initialized successfully')
      setChartLoaded(true)
    } catch (err) {
      console.error('❌ Chart initialization error:', err)
      setError(`Chart initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Function to update chart when toggling units
  const updateChart = (coordinates: number[][]) => {
    updateChartWithUnits(coordinates, isMetric)
  }

  const updateChartWithUnits = (coordinates: number[][], useMetric: boolean) => {
    if (!chartInstance.current) return

    const { distanceData, elevationData, gradeData } = calculateChartData(coordinates, useMetric)
    const unitDistance = useMetric ? 'km' : 'mi'
    const unitElevation = useMetric ? 'm' : 'ft'

    // Update chart data
    chartInstance.current.data.labels = distanceData.map(d => d.toFixed(1))
    chartInstance.current.data.datasets[0].data = elevationData
    chartInstance.current.data.datasets[0].label = `Elevation (${unitElevation})`

    // Update axis labels
    chartInstance.current.options.scales.x.title.text = `Distance (${unitDistance})`
    chartInstance.current.options.scales.y.title.text = `Elevation (${unitElevation})`

    // Update tooltip callbacks
    chartInstance.current.options.plugins.tooltip.callbacks.title = (tooltipItems: any[]) => {
      return `${tooltipItems[0].label} ${unitDistance}`
    }
    chartInstance.current.options.plugins.tooltip.callbacks.label = (context: any) => {
      const index = context.dataIndex
      const elevation = Math.round(context.parsed.y)
      const grade = coordinates ? calculateGrade(coordinates, index).toFixed(1) : '0.0'
      
      return [
        `Elevation: ${elevation} ${unitElevation}`,
        `Grade: ${grade}%`
      ]
    }

    // Update the onHover callback to use the current unit state
    chartInstance.current.options.onHover = (event: any, activeElements: any[]) => {
      if (activeElements.length > 0 && routeCoordinates.current.length > 0) {
        const index = activeElements[0].index
        const distance = parseFloat(chartInstance.current.data.labels[index])
        
        // Store active element for vertical line plugin
        chartInstance.current.active = activeElements
        
        // Find coordinate at this distance and show hover marker
        const coordinate = findCoordinateAtDistance(distance, routeCoordinates.current, useMetric)
        updateHoverMarker(coordinate)
        
        // Trigger redraw for vertical line
        chartInstance.current.draw()
      } else {
        chartInstance.current.active = []
        removeHoverMarker()
        chartInstance.current.draw()
      }
    }

    chartInstance.current.update('none')
    console.log('✅ Chart updated for', useMetric ? 'metric' : 'imperial', 'units')
  }

  useEffect(() => {
    const initMap = async () => {
      try {
        // Load Chart.js first
        await loadChartJS()

        // Load Mapbox if not already loaded
        if (!window.mapboxgl) {
          console.log('🗺️ Loading Mapbox...')
          // Load Mapbox CSS
          const link = document.createElement('link')
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
          link.rel = 'stylesheet'
          document.head.appendChild(link)

          // Load Mapbox JS
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
            script.onload = () => {
              console.log('✅ Mapbox loaded successfully')
              resolve(true)
            }
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        // Set token
        window.mapboxgl.accessToken = token
        console.log('✅ Mapbox token set')

        // Create map with dynamic center
        mapInstance.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: center, // Use the prop
          zoom: 10,
          attributionControl: false // Disable default attribution
        })

        mapInstance.current.on('load', async () => {
          console.log(`✅ ${city} map loaded successfully!`)
          setMapLoaded(true)
          
          // Add controls safely
          addMapControls()
          
          // Now load the route
          await loadRoute()
        })

        mapInstance.current.on('error', (e: any) => {
          console.error('❌ Map error:', e.error)
          setError(`Map error: ${e.error?.message || 'Unknown error'}`)
        })

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('❌ Setup error:', err)
        setError(`Setup error: ${errorMsg}`)
      }
    }

    const loadRoute = async () => {
      try {
        console.log(`📍 Loading ${city} route data...`)
        
        // Fetch the GPX/GeoJSON data using the prop
        const response = await fetch(gpxUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch route data: ${response.status}`)
        }
        
        const geojson = await response.json()
        console.log(`📍 ${city} route data loaded:`, geojson)

        // Validate the data structure
        if (!geojson.features || !geojson.features[0] || !geojson.features[0].geometry) {
          throw new Error('Invalid GeoJSON structure')
        }

        const coordinates = geojson.features[0].geometry.coordinates
        console.log(`📍 ${city} route coordinates count:`, coordinates.length)

        // Remove any existing route data before adding new
        removeExistingRouteData()

        // Add route to map
        addRouteToMap(coordinates)

        // Fit the map to show the entire route
        const bounds = coordinates.reduce(
          (bounds: any, coord: number[]) => bounds.extend(coord),
          new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        )
        
        mapInstance.current.fitBounds(bounds, { 
          padding: 50,
          duration: 2000 // Smooth transition
        })

        // Store coordinates for chart
        routeCoordinates.current = coordinates

        console.log(`✅ ${city} route loaded successfully!`)
        setRouteLoaded(true)

        // Initialize elevation chart after route is loaded
        if (chartJsLoaded) {
          await initializeChart(coordinates)
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('❌ Route loading error:', err)
        setError(`Route error: ${errorMsg}`)
      }
    }

    if (mapContainer.current) {
      initMap()
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        // Clean up hover marker
        if (hoverMarker.current) {
          hoverMarker.current.remove()
        }
        // Remove all controls before removing map
        removeMapControls()
        mapInstance.current.remove()
      }
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [token, gpxUrl, center, city]) // Add dependencies

  // Effect to initialize chart when Chart.js loads and route is ready
  useEffect(() => {
    if (chartJsLoaded && routeLoaded && routeCoordinates.current.length > 0 && !chartLoaded) {
      initializeChart(routeCoordinates.current)
    }
  }, [chartJsLoaded, routeLoaded, chartLoaded])

  return (
    <div className="my-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Map Controls */}
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        {/* Top Right Controls */}
        {routeLoaded && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {/* Map Style Selector */}
            <select
              value={currentMapStyle}
              onChange={(e) => changeMapStyle(e.target.value)}
              className="mapboxgl-ctrl mapboxgl-ctrl-group bg-white text-gray-800 border-0 rounded shadow-sm text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                fontFamily: 'inherit',
                fontSize: '12px',
                padding: '6px 8px',
                minWidth: '120px'
              }}
            >
              <option value="streets-v11">Standard Map</option>
              <option value="satellite-v9">Satellite Map</option>
              <option value="satellite-streets-v11">Hybrid Map</option>
            </select>
            
            {/* Metric/Imperial Toggle */}
            <button
              onClick={toggleUnits}
              className="mapboxgl-ctrl mapboxgl-ctrl-group bg-white text-gray-800 border-0 rounded shadow-sm text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                fontFamily: 'inherit',
                fontSize: '12px',
                padding: '6px 8px',
                minWidth: '80px'
              }}
            >
              {isMetric ? 'Metric' : 'Imperial'}
            </button>
          </div>
        )}
        
        {/* Map */}
        <div 
          ref={mapContainer}
          className="w-full h-96 bg-gray-200"
        />

        {/* Elevation Chart */}
        <div className="h-48 bg-white border-t border-gray-200">
          <canvas ref={chartContainer} className="w-full h-full" />
          {!chartLoaded && chartJsLoaded && routeLoaded && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-sm font-medium">Loading elevation chart...</div>
            </div>
          )}
          {!chartJsLoaded && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-sm font-medium">Loading Chart.js library...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tokyo Marathon Race Map (existing)
export const TokyoMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/tokyo_marathon_geo.json"
    center={[139.6917, 35.6895]}
    city="Tokyo"
  />
}

// Berlin Marathon Race Map (new)
export const BerlinMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/berlin_marathon.json"
    center={[13.4050, 52.5200]}
    city="Berlin"
  />
}

// Boston Marathon Race Map (new)
export const BostonMarathonRaceMap: React.FC = () => {
  return <RaceMapComponent 
    token="pk.eyJ1IjoiZGlzdGFuenJ1bm5pbmciLCJhIjoiY21ia2Y4YjB0MDVyczJqcGduaXoxeW12dSJ9.tCFipup9j7bs_60hpBLqsg" 
    gpxUrl="https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/boston_marathon.json"
    center={[-71.0589, 42.3601]}
    city="Boston"
  />
}