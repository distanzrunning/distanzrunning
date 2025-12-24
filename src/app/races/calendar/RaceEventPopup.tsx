'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import type { RaceGuide } from '../page'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'
import { DraggableWindow } from '@/components/DraggableWindow'
import { RaceRouteMapWithElevation } from '@/components/RaceRouteMapWithElevation'
import { fetchGPXElevationData, type ElevationPoint } from '@/lib/gpxUtils'
import { Route, Wallet, Users, ArrowUpRight, ArrowDownRight, Mountain, ThermometerSun, Medal, Settings2, Settings } from 'lucide-react'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import { DarkModeContext } from '@/components/DarkModeProvider'
import { useContext } from 'react'

interface RaceEventPopupProps {
  race: RaceGuide | null
  onClose: () => void
  onMinimize?: () => void
  showMapMarkers: boolean
  mapUseMetric: boolean
  onMapMarkersChange: (show: boolean) => void
  onMapUseMetricChange: (metric: boolean) => void
}

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

export function RaceEventPopup({
  race,
  onClose,
  onMinimize,
  showMapMarkers,
  mapUseMetric,
  onMapMarkersChange,
  onMapUseMetricChange
}: RaceEventPopupProps) {
  const [showMensTooltip, setShowMensTooltip] = useState(false)
  const [showWomensTooltip, setShowWomensTooltip] = useState(false)

  // Elevation data state
  const [elevationData, setElevationData] = useState<ElevationPoint[]>([])
  const { isDark } = useContext(DarkModeContext)

  // Settings dropdown state
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [widthMode, setWidthMode] = useState<'fixed' | 'full'>('fixed')
  const [customWidth, setCustomWidth] = useState(600)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const settingsDropdownRef = useRef<HTMLDivElement>(null)
  const [contentKey, setContentKey] = useState(0) // Force map remount on width change
  const contentContainerRef = useRef<HTMLDivElement>(null) // Track content container for resize observer

  const DEFAULT_WIDTH = 600
  const MIN_WIDTH = 400
  const MAX_WIDTH = 850
  const FULL_WIDTH_MAX = 850 // Maximum width for full width mode

  // Track if map is resizing to show loading screen
  const [isMapResizing, setIsMapResizing] = useState(false)

  // Trigger map resize when width changes (debounced to avoid excessive remounts)
  useEffect(() => {
    // Show loading screen immediately
    setIsMapResizing(true)

    const timeoutId = setTimeout(() => {
      setContentKey(prev => prev + 1)
      // Hide loading screen after map remounts
      setTimeout(() => setIsMapResizing(false), 100)
    }, 350) // Wait for transition to complete (300ms + 50ms buffer)

    return () => clearTimeout(timeoutId)
  }, [customWidth, widthMode])

  // Detect container resize from window maximize/minimize and trigger map remount
  useEffect(() => {
    const container = contentContainerRef.current
    if (!container) return

    let resizeTimeout: NodeJS.Timeout
    const resizeObserver = new ResizeObserver(() => {
      // Debounce to avoid excessive remounts during transition
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setContentKey(prev => prev + 1)
      }, 350)
    })

    resizeObserver.observe(container)

    return () => {
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showSettingsDropdown &&
        settingsDropdownRef.current &&
        settingsButtonRef.current &&
        !settingsDropdownRef.current.contains(e.target as Node) &&
        !settingsButtonRef.current.contains(e.target as Node)
      ) {
        setShowSettingsDropdown(false)
      }
    }

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSettingsDropdown])

  // Fetch elevation data when race GPX URL changes
  useEffect(() => {
    if (race?.gpxFile?.asset?.url) {
      fetchGPXElevationData(race.gpxFile.asset.url).then(setElevationData)
    }
  }, [race?.gpxFile?.asset?.url])

  if (!race) return null

  const imageUrl = race.mainImage ? urlFor(race.mainImage)?.width(800).height(520).url() : null

  // Determine if we should show local currency
  const showLocalCurrency = mapUseMetric && race.currency && race.currency !== 'USD'

  // Determine World Athletics Label image
  const getWorldAthleticsLabel = () => {
    if (!race.tags) return null

    if (race.tags.includes('World Athletics Platinum Label')) {
      return '/images/platinum.png'
    } else if (race.tags.includes('World Athletics Elite Label')) {
      return '/images/elite.png'
    } else if (race.tags.includes('World Athletics Gold Label')) {
      return '/images/gold.png'
    } else if (race.tags.includes('World Athletics Label')) {
      return '/images/label.png'
    }
    return null
  }

  const labelImage = getWorldAthleticsLabel()

  // Calculate effective max-width based on mode
  const effectiveMaxWidth = widthMode === 'full' ? `${FULL_WIDTH_MAX}px` : `${customWidth}px`

  // Calculate map height based on content width (scale from 320px at 400px width to 480px at 850px)
  const currentWidth = widthMode === 'full' ? FULL_WIDTH_MAX : customWidth
  const minMapHeight = 320
  const maxMapHeight = 480
  const mapHeight = Math.round(minMapHeight + ((currentWidth - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH)) * (maxMapHeight - minMapHeight))

  // Settings button and dropdown
  const settingsControl = (
    <div className="relative">
      <button
        ref={settingsButtonRef}
        onClick={(e) => {
          e.stopPropagation()
          setShowSettingsDropdown(!showSettingsDropdown)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-8 w-8 rounded-md flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Settings Dropdown */}
      {showSettingsDropdown && settingsButtonRef.current && (
        <div
          ref={settingsDropdownRef}
          className="absolute left-0 top-10 w-80 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-[0_10px_38px_-10px_rgba(0,0,0,0.35),0_10px_20px_-15px_rgba(0,0,0,0.2)] p-2 z-[9999]"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2.5">
            <label className="pt-1.5 text-[15px] block mb-1 text-neutral-900 dark:text-white">
              Content width
            </label>

            {/* Tab buttons for Fixed/Full */}
            <div
              role="group"
              className="flex space-x-px rounded p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
            >
              <button
                type="button"
                onClick={() => setWidthMode('fixed')}
                className={`flex-1 flex border p-1 items-center justify-center leading-4 text-sm font-medium rounded transition-colors ${
                  widthMode === 'fixed'
                    ? 'bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
                    : 'bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                } text-neutral-900 dark:text-white`}
                aria-label="Fixed"
              >
                <svg className="size-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M10.64 11.4V4.62H8.168V3h6.828v1.62h-2.46v6.78H10.64Z"></path>
                  <path fillRule="evenodd" d="M16.125 12.375c.483 0 .875.392.875.875v6.5a.875.875 0 0 1-1.75 0v-6.5c0-.483.392-.875.875-.875ZM7 12.375c.483 0 .875.392.875.875v6.5a.875.875 0 0 1-1.75 0v-6.5c0-.483.392-.875.875-.875Z" clipRule="evenodd"></path>
                  <path d="M7.5 15.5h8v1.75h-8z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setWidthMode('full')}
                className={`flex-1 flex border p-1 items-center justify-center leading-4 text-sm font-medium rounded transition-colors ${
                  widthMode === 'full'
                    ? 'bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
                    : 'bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                } text-neutral-900 dark:text-white`}
                aria-label="Full"
              >
                <svg className="size-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M10.64 11.4V4.62H8.168V3h6.828v1.62h-2.46v6.78H10.64Zm9.252 4.394-3.143-3.143a.857.857 0 1 0-1.212 1.212l1.68 1.68h-5.36a.857.857 0 0 0 0 1.714h5.36l-1.68 1.68a.857.857 0 1 0 1.212 1.212l3.143-3.143a.857.857 0 0 0 0-1.212Z"></path>
                  <path d="m3.25 15.794 3.144-3.143a.857.857 0 1 1 1.212 1.212l-1.68 1.68h5.36a.857.857 0 0 1 0 1.714h-5.36l1.68 1.68a.857.857 0 1 1-1.212 1.212l-3.143-3.143a.857.857 0 0 1 0-1.212Z"></path>
                </svg>
              </button>
            </div>

            {/* Slider and reset button (only shown when Fixed is selected) */}
            {widthMode === 'fixed' && (
              <div className="flex items-center space-x-1">
                <div className="flex-grow">
                  <Box sx={{ width: '100%', px: 1 }}>
                    <Slider
                      value={customWidth}
                      onChange={(_, newValue) => setCustomWidth(newValue as number)}
                      min={MIN_WIDTH}
                      max={MAX_WIDTH}
                      step={1}
                      valueLabelDisplay="off"
                      sx={{
                        color: '#1A1A1A',
                        height: 8,
                        padding: 0,
                        '& .MuiSlider-rail': {
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#d4d4d8',
                          opacity: 1,
                        },
                        '& .MuiSlider-track': {
                          height: 8,
                          borderRadius: '4px 0 0 4px',
                          backgroundColor: '#171717',
                          border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                          height: 16,
                          width: 16,
                          backgroundColor: '#171717',
                          border: 'none',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                          '&:hover, &.Mui-active': {
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                          },
                        },
                        '.dark &': {
                          '& .MuiSlider-rail': {
                            backgroundColor: '#404040',
                          },
                          '& .MuiSlider-track': {
                            backgroundColor: '#E6E6E6',
                          },
                          '& .MuiSlider-thumb': {
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                            '&:hover, &.Mui-active': {
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </div>
                <button
                  onClick={() => setCustomWidth(DEFAULT_WIDTH)}
                  className="inline-flex items-center justify-center px-2 py-1.5 text-[15px] rounded-md border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors bg-transparent active:bg-neutral-100 dark:active:bg-neutral-700 text-neutral-900 dark:text-white"
                  aria-label="Reset width"
                >
                  <svg className="size-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.75 3C5.16421 3 5.5 3.33579 5.5 3.75V5.71122C7.1554 4.03743 9.4791 3 12 3C16.9706 3 21 7.02944 21 12C21 12.3803 20.9764 12.7555 20.9304 13.1241C20.8792 13.5351 20.5044 13.8267 20.0934 13.7755C19.6823 13.7242 19.3907 13.3495 19.4419 12.9384C19.4802 12.6313 19.5 12.3181 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C9.77612 4.5 7.73561 5.46681 6.3448 7H8.75C9.16421 7 9.5 7.33579 9.5 7.75C9.5 8.16421 9.16421 8.5 8.75 8.5H5.25C4.55964 8.5 4 7.94036 4 7.25V3.75C4 3.33579 4.33579 3 4.75 3ZM3.90663 10.2245C4.31766 10.2758 4.60932 10.6505 4.55806 11.0616C4.51977 11.3687 4.5 11.6819 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C14.2239 19.5 16.2644 18.5332 17.6552 17H15.2618C14.8476 17 14.5118 16.6642 14.5118 16.25C14.5118 15.8358 14.8476 15.5 15.2618 15.5H18.7618C19.4522 15.5 20.0118 16.0596 20.0118 16.75V20.25C20.0118 20.6642 19.6761 21 19.2618 21C18.8476 21 18.5118 20.6642 18.5118 20.25V18.2768C16.8557 19.9576 14.5269 21 12 21C7.02944 21 3 16.9706 3 12C3 11.6197 3.02364 11.2445 3.06959 10.8759C3.12085 10.4649 3.4956 10.1733 3.90663 10.2245Z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <DraggableWindow
      title={race.title}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={672}
      initialHeight={700}
      minWidth={400}
      minHeight={300}
      leftControls={settingsControl}
    >
      {/* Main container with flex column */}
      <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 flex justify-center race-popup-scroll p-4 pb-0">
          <div
            ref={contentContainerRef}
            className="w-full flex flex-col gap-4 transition-all duration-300"
            style={{ maxWidth: effectiveMaxWidth }}
          >
            {/* Image Card */}
            <div className="relative w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 flex-shrink-0">
              <div className="relative flex-shrink-0" style={{ aspectRatio: '8 / 5' }}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={race.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}
            </div>
            {/* Distance/Category Badge */}
            {race.raceCategoryName && (
              <div className="absolute top-3 right-3">
                <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full shadow-sm">
                  <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                    {race.raceCategoryName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title and Date Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-5 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Date - Left Side */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-16 h-16">
                <p
                  className="font-body text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400"
                  suppressHydrationWarning
                >
                  {format(new Date(race.eventDate), 'MMM')}
                </p>
                <p
                  className="font-body text-2xl font-bold leading-tight text-neutral-900 dark:text-white"
                  suppressHydrationWarning
                >
                  {format(new Date(race.eventDate), 'dd')}
                </p>
              </div>

              {/* Title and Location - Center */}
              <div className="flex-1">
                <h3 className="font-body text-xl font-semibold leading-tight text-neutral-900 dark:text-white mb-1">
                  {race.title}
                </h3>
                {(race.city || race.stateRegion || race.country) && (
                  <p className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                    {formatLocation(race.city, race.stateRegion, race.country)}
                  </p>
                )}
              </div>

              {/* World Athletics Label - Right Side */}
              {labelImage && (
                <div className="flex-shrink-0 relative h-14 w-14">
                  <Image
                    src={labelImage}
                    alt="World Athletics Label"
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          {/* Key Details Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-5 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-body text-sm font-medium text-neutral-600 dark:text-neutral-400">Key Details</h4>

              {/* Unit Toggle */}
              <div className="relative group">
                <button
                  onClick={() => onMapUseMetricChange(!mapUseMetric)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  aria-label="Toggle units"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {mapUseMetric ? 'Change to Imperial (mi/ft)' : 'Change to Metric (km/m)'}
                  <div className="absolute bottom-full right-4 w-2 h-2 bg-neutral-900 dark:bg-neutral-100 transform rotate-45 translate-y-1"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Route className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Surface</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.surface || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Wallet className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Entry Price</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.price !== undefined && race.price !== null
                        ? showLocalCurrency
                          ? formatPrice(race.price, race.currency!)
                          : formatPrice(convertCurrencySync(race.price, race.currency || 'USD', 'USD'), 'USD')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Finishers</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.finishers ? race.finishers.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Elev. Gain</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.elevationGain !== undefined && race.elevationGain !== null
                        ? mapUseMetric
                          ? `${Math.round(race.elevationGain).toLocaleString()}m`
                          : `${Math.round(race.elevationGain * 3.28084).toLocaleString()}ft`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ArrowDownRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Elev. Loss</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.elevationLoss !== undefined && race.elevationLoss !== null
                        ? mapUseMetric
                          ? `${Math.round(race.elevationLoss).toLocaleString()}m`
                          : `${Math.round(race.elevationLoss * 3.28084).toLocaleString()}ft`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Mountain className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Profile</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.profile ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ThermometerSun className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Avg. Temp</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.averageTemperature !== undefined && race.averageTemperature !== null
                        ? mapUseMetric
                          ? `${Math.round(race.averageTemperature)}°C`
                          : `${Math.round(race.averageTemperature * 9/5 + 32)}°F`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div
                    className="flex items-center gap-3 cursor-help flex-1"
                    onMouseEnter={() => setShowMensTooltip(true)}
                    onMouseLeave={() => setShowMensTooltip(false)}
                  >
                    <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                      <Medal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Men's CR</p>
                      <p className="font-mono text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {race.mensCourseRecord || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {/* Tooltip */}
                  {showMensTooltip && race.mensCourseRecordAthlete && race.mensCourseRecordCountry && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
                      <div className="text-center">
                        <div className="font-medium">{race.mensCourseRecordAthlete}</div>
                        <div className="text-neutral-300 dark:text-neutral-400">{race.mensCourseRecordCountry}</div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative flex items-center gap-3">
                  <div
                    className="flex items-center gap-3 cursor-help flex-1"
                    onMouseEnter={() => setShowWomensTooltip(true)}
                    onMouseLeave={() => setShowWomensTooltip(false)}
                  >
                    <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                      <Medal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Women's CR</p>
                      <p className="font-mono text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {race.womensCourseRecord || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {/* Tooltip */}
                  {showWomensTooltip && race.womensCourseRecordAthlete && race.womensCourseRecordCountry && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
                      <div className="text-center">
                        <div className="font-medium">{race.womensCourseRecordAthlete}</div>
                        <div className="text-neutral-300 dark:text-neutral-400">{race.womensCourseRecordCountry}</div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Race Route Map with Elevation Chart */}
          {race.gpxFile?.asset?.url && (
            <RaceRouteMapWithElevation
              key={contentKey}
              gpxUrl={race.gpxFile.asset.url}
              title={race.title}
              height={mapHeight}
              initialShowMarkers={showMapMarkers}
              initialUseMetric={mapUseMetric}
              onShowMarkersChange={onMapMarkersChange}
              onUseMetricChange={onMapUseMetricChange}
              elevationData={elevationData}
              forceLoading={isMapResizing}
            />
          )}

          {/* Spacer to ensure content can scroll */}
          <div className="h-4"></div>
          </div>
        </div>

        {/* Fixed Action Buttons at Bottom - No Border */}
        <div className="flex-shrink-0 bg-neutral-50 dark:bg-neutral-950 p-4 pt-3">
          <div
            className="w-full mx-auto transition-all duration-300"
            style={{ maxWidth: effectiveMaxWidth }}
          >
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`/races/${race.slug.current}`}
                className="col-span-2 inline-flex items-center justify-center px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium text-sm transition-all hover:opacity-90 shadow-sm"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `/races/${race.slug.current}`
                }}
              >
                Race Guide
              </a>
              {race.officialWebsite && (
                <a
                  href={race.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-1 inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium text-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .race-popup-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .race-popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .race-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .race-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Dark mode scrollbar */
        :global(.dark) .race-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .race-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Firefox scrollbar */
        .race-popup-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        :global(.dark) .race-popup-scroll {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        /* Custom slider styling for black/white theme - NUCLEAR APPROACH */
        input[type="range"][data-slider="black"] {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          outline: none !important;
        }

        /* WebKit (Chrome, Safari, Edge) - ALL states */
        input[type="range"][data-slider="black"]::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          background: #171717 !important;
          background-color: #171717 !important;
          background-image: none !important;
          cursor: pointer !important;
          border: 0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
          margin-top: -4px !important;
        }

        input[type="range"][data-slider="black"]:focus::-webkit-slider-thumb {
          background: #171717 !important;
          background-color: #171717 !important;
          background-image: none !important;
          outline: none !important;
        }

        input[type="range"][data-slider="black"]:active::-webkit-slider-thumb {
          background: #171717 !important;
          background-color: #171717 !important;
          background-image: none !important;
        }

        /* Firefox */
        input[type="range"][data-slider="black"]::-moz-range-thumb {
          -moz-appearance: none !important;
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          background: #171717 !important;
          background-color: #171717 !important;
          background-image: none !important;
          cursor: pointer !important;
          border: 0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
        }

        input[type="range"][data-slider="black"]:focus::-moz-range-thumb {
          background: #171717 !important;
          background-color: #171717 !important;
          background-image: none !important;
          outline: none !important;
        }

        /* Remove default track styling */
        input[type="range"][data-slider="black"]::-webkit-slider-runnable-track {
          height: 8px !important;
          border-radius: 4px !important;
          background: transparent !important;
          border: none !important;
        }

        input[type="range"][data-slider="black"]::-moz-range-track {
          height: 8px !important;
          border-radius: 4px !important;
          background: transparent !important;
          border: none !important;
        }

        /* Dark mode overrides - using colors from RaceGuidesClient distance filter */
        :global(.dark) input[type="range"][data-slider="black"]::-webkit-slider-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
        }

        :global(.dark) input[type="range"][data-slider="black"]:focus::-webkit-slider-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
        }

        :global(.dark) input[type="range"][data-slider="black"]:active::-webkit-slider-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
        }

        :global(.dark) input[type="range"][data-slider="black"]::-moz-range-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
        }

        :global(.dark) input[type="range"][data-slider="black"]:focus::-moz-range-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
        }

        :global(.dark) input[type="range"][data-slider="black"]:active::-moz-range-thumb {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
        }

        /* Update slider track background for dark mode - filled light gray (#E6E6E6), unfilled dark gray (#404040) */
        :global(.dark) input[type="range"][data-slider="black"] {
          background: linear-gradient(to right, #E6E6E6 0%, #E6E6E6 var(--slider-progress, 50%), #404040 var(--slider-progress, 50%), #404040 100%) !important;
        }
      `}</style>
    </DraggableWindow>
  )
}
