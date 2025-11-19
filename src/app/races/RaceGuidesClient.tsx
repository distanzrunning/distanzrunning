'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from './page'
import Slider from '@mui/material/Slider'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

// Create MUI theme for the slider
const sliderTheme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#171717', // neutral-900 for primary color
          height: 24,
          padding: '13px 0',
          boxSizing: 'border-box',
        },
        track: {
          height: 24,
          borderRadius: 12,
          backgroundColor: '#c0c0c0', // grey - track
          border: 'none',
        },
        rail: {
          height: 24,
          borderRadius: 12,
          backgroundColor: '#e5e5e5', // neutral-200 - light grey rail
          opacity: 1,
          left: '12px',
          right: '12px',
          width: 'calc(100% - 24px)',
        },
        thumb: {
          height: 24,
          width: 24,
          backgroundColor: '#ededed',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.Mui-active': {
            boxShadow: 'none',
          },
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
})

export function RaceGuidesClient({ races }: { races: RaceGuide[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  // Applied filter (what's actually filtering the races)
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  // Temporary selection in dropdown (before Apply is clicked)
  const [tempDateRange, setTempDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [dateFilterMode, setDateFilterMode] = useState<'dates' | 'months'>('dates')
  const dateFilterRef = useRef<HTMLDivElement>(null)

  // Distance filter states
  const [isDistanceFilterOpen, setIsDistanceFilterOpen] = useState(false)
  const [distanceFilterMode, setDistanceFilterMode] = useState<'distance' | 'custom'>('distance')
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('mi')
  const [appliedDistanceFilter, setAppliedDistanceFilter] = useState<string | null>(null) // e.g., 'marathon', 'ultra', or 'custom'
  const [tempDistanceFilter, setTempDistanceFilter] = useState<string | null>(null)
  // For custom range (in km)
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 })
  const [tempCustomRange, setTempCustomRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 })
  const distanceFilterRef = useRef<HTMLDivElement>(null)

  // Close date filter on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setIsDateFilterOpen(false)
      }
    }
    if (isDateFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDateFilterOpen])

  // Initialize temp date range when opening dropdown
  useEffect(() => {
    if (isDateFilterOpen) {
      setTempDateRange(appliedDateRange)
    }
  }, [isDateFilterOpen, appliedDateRange])

  // Close distance filter on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (distanceFilterRef.current && !distanceFilterRef.current.contains(event.target as Node)) {
        setIsDistanceFilterOpen(false)
      }
    }
    if (isDistanceFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDistanceFilterOpen])

  // Initialize temp distance filter when opening dropdown
  useEffect(() => {
    if (isDistanceFilterOpen) {
      setTempDistanceFilter(appliedDistanceFilter)
      setTempCustomRange(appliedCustomRange)
    }
  }, [isDistanceFilterOpen, appliedDistanceFilter, appliedCustomRange])

  // Helper: Convert km to miles
  const kmToMiles = (km: number) => km * 0.621371

  // Helper: Convert miles to km
  const milesToKm = (miles: number) => miles / 0.621371

  // Helper: Get distance category from km
  const getDistanceCategory = (distanceKm: number): string | null => {
    if (distanceKm >= 42.195 && distanceKm < 50) return 'marathon' // Standard marathon
    if (distanceKm >= 50) return 'ultra' // Ultra (50km+)
    if (distanceKm >= 21.0 && distanceKm < 21.2) return 'half-marathon' // Half marathon
    if (distanceKm >= 16.0 && distanceKm < 16.2) return '10-miles' // 10 miles
    if (distanceKm >= 10.0 && distanceKm < 10.1) return '10k' // 10k
    if (distanceKm >= 5.0 && distanceKm < 5.1) return '5k' // 5k
    return null
  }

  // Distance categories with km values
  const distanceCategories = [
    { id: '5k', label: '5k', km: 5 },
    { id: '10k', label: '10k', km: 10 },
    { id: 'half-marathon', label: 'Half Marathon', km: 21.0975 },
    { id: 'marathon', label: 'Marathon', km: 42.195 },
  ]

  // All categories for filtering (includes 10 Miles and Ultra)
  const allDistanceCategories = [
    { id: '5k', label: '5k', km: 5 },
    { id: '10k', label: '10k', km: 10 },
    { id: '10-miles', label: '10 Miles', km: 16.09344 },
    { id: 'half-marathon', label: 'Half Marathon', km: 21.0975 },
    { id: 'marathon', label: 'Marathon', km: 42.195 },
    { id: 'ultra', label: 'Ultra', km: 50 }, // 50km+ for ultras
  ]

  // Format date filter display text
  const getDateFilterText = () => {
    if (!appliedDateRange.start && !appliedDateRange.end) {
      return 'Dates'
    }

    const start = appliedDateRange.start
    const end = appliedDateRange.end

    // Check if it's a whole month selection
    if (start && end) {
      const isWholeMonth =
        start.getDate() === 1 &&
        end.getMonth() === start.getMonth() &&
        end.getFullYear() === start.getFullYear() &&
        end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()

      if (isWholeMonth) {
        return format(start, 'MMMM yyyy')
      }

      // Date range
      return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`
    }

    return 'Dates'
  }

  // Format distance filter display text
  const getDistanceFilterText = () => {
    if (!appliedDistanceFilter) {
      return 'Distance'
    }

    if (appliedDistanceFilter === 'custom') {
      const unit = distanceUnit
      const min = unit === 'km' ? appliedCustomRange.min : kmToMiles(appliedCustomRange.min)
      const max = unit === 'km' ? appliedCustomRange.max : kmToMiles(appliedCustomRange.max)
      return `${Math.round(min)}-${Math.round(max)}${unit}`
    }

    const category = allDistanceCategories.find(c => c.id === appliedDistanceFilter)
    return category?.label || 'Distance'
  }

  // Filter races based on search query and date range
  const filteredRaces = useMemo(() => {
    let filtered = races

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((race) => {
        const title = race.title?.toLowerCase() || ''
        const city = race.city?.toLowerCase() || ''
        const stateRegion = race.stateRegion?.toLowerCase() || ''
        const country = race.country?.toLowerCase() || ''
        const category = race.raceCategoryName?.toLowerCase() || ''

        return (
          title.includes(query) ||
          city.includes(query) ||
          stateRegion.includes(query) ||
          country.includes(query) ||
          category.includes(query)
        )
      })
    }

    // Apply date range filter
    if (appliedDateRange.start || appliedDateRange.end) {
      filtered = filtered.filter((race) => {
        const raceDate = new Date(race.eventDate)
        if (appliedDateRange.start && appliedDateRange.end) {
          return raceDate >= appliedDateRange.start && raceDate <= appliedDateRange.end
        } else if (appliedDateRange.start) {
          return raceDate >= appliedDateRange.start
        } else if (appliedDateRange.end) {
          return raceDate <= appliedDateRange.end
        }
        return true
      })
    }

    // Apply distance filter
    if (appliedDistanceFilter) {
      filtered = filtered.filter((race) => {
        if (!race.distance) return false

        if (appliedDistanceFilter === 'custom') {
          // Custom range filter
          return race.distance >= appliedCustomRange.min && race.distance <= appliedCustomRange.max
        } else {
          // Category filter
          const category = getDistanceCategory(race.distance)
          return category === appliedDistanceFilter
        }
      })
    }

    return filtered
  }, [races, searchQuery, appliedDateRange, appliedDistanceFilter, appliedCustomRange])

  return (
    <div className="py-12 bg-white dark:bg-[#0c0c0d] min-h-screen transition-colors duration-300">
      <div className="w-[96%] sm:w-[90%] max-w-[2000px] mx-auto px-2 sm:px-3">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 text-neutral-900 dark:text-white">
            Race Guides
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mb-6">
            Find your next race. Explore thousands of the world&apos;s greatest races with detailed
            race guides, course analysis, insider tips and recommendations
          </p>

          {/* Search and Filters Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="relative h-[44px] flex-shrink-0">
              <AnimatePresence mode="wait" initial={false}>
                {!isSearchExpanded ? (
                  <motion.button
                    key="search-button"
                    initial={{ opacity: 0, width: 44 }}
                    animate={{ opacity: 1, width: 44 }}
                    exit={{ opacity: 0, width: 44 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    onClick={() => setIsSearchExpanded(true)}
                    className="flex items-center justify-center h-[44px] p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                    aria-label="Expand search"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-input"
                    initial={{ opacity: 0, width: 44 }}
                    animate={{ opacity: 1, width: 400 }}
                    exit={{ opacity: 0, width: 44 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        if (!searchQuery) setIsSearchExpanded(false)
                      }}
                      autoFocus
                      className="w-full h-[44px] pl-10 pr-10 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent transition-colors"
                    />
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setIsSearchExpanded(false)
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      aria-label="Clear search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Date Filter */}
            <div className="relative" ref={dateFilterRef}>
              {appliedDateRange.start || appliedDateRange.end ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    {getDateFilterText()}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedDateRange({ start: null, end: null })
                      setTempDateRange({ start: null, end: null })
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear date filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Dates
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Date Dropdown */}
              <AnimatePresence>
                {isDateFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Action Buttons and Toggle */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempDateRange({ start: null, end: null })
                        }}
                        className="p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Toggle between Dates and Months - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1">
                        <button
                          onClick={() => setDateFilterMode('dates')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            dateFilterMode === 'dates'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Dates
                        </button>
                        <button
                          onClick={() => setDateFilterMode('months')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            dateFilterMode === 'months'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Months
                        </button>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedDateRange(tempDateRange)
                          setIsDateFilterOpen(false)
                        }}
                        className="p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
                        aria-label="Apply filter"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>

                    {dateFilterMode === 'dates' ? (
                      <>
                        {/* Calendar Header Controls */}
                        <div className="flex items-center justify-between mb-4 px-2">
                      <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Two Month Calendar Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {[currentMonth, addMonths(currentMonth, 1)].map((month, monthIndex) => {
                        const monthStart = startOfMonth(month)
                        const monthEnd = endOfMonth(month)
                        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

                        return (
                          <div key={monthIndex}>
                            {/* Month Name */}
                            <div className="text-center mb-4">
                              <h3 className="text-neutral-900 dark:text-white font-semibold text-lg">
                                {format(month, 'MMMM yyyy')}
                              </h3>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                <div key={day} className="text-center text-neutral-500 dark:text-neutral-500 text-sm font-medium py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1">
                              {/* Add empty cells for days before month starts */}
                              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}

                              {daysInMonth.map((day) => {
                                const dayStart = startOfDay(day)
                                const isSelected =
                                  (tempDateRange.start && isSameDay(dayStart, tempDateRange.start)) ||
                                  (tempDateRange.end && isSameDay(dayStart, tempDateRange.end))
                                const isInRange =
                                  tempDateRange.start && tempDateRange.end &&
                                  isWithinInterval(dayStart, { start: tempDateRange.start, end: tempDateRange.end })

                                return (
                                  <button
                                    key={day.toString()}
                                    onClick={() => {
                                      if (!tempDateRange.start || (tempDateRange.start && tempDateRange.end)) {
                                        setTempDateRange({ start: dayStart, end: null })
                                      } else {
                                        if (dayStart < tempDateRange.start) {
                                          setTempDateRange({ start: dayStart, end: tempDateRange.start })
                                        } else {
                                          setTempDateRange({ ...tempDateRange, end: dayStart })
                                        }
                                      }
                                    }}
                                    className={`
                                      h-10 flex items-center justify-center rounded-lg text-base font-medium transition-colors
                                      ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : ''}
                                      ${isInRange && !isSelected ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white' : ''}
                                      ${!isSelected && !isInRange ? 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white' : ''}
                                    `}
                                  >
                                    {format(day, 'd')}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                      </>
                    ) : (
                      <>
                        {/* Months View */}
                        <div className="flex items-center justify-between mb-6 px-2">
                          <button
                            onClick={() => setCurrentYear(currentYear - 1)}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="text-neutral-900 dark:text-white font-semibold text-xl">{currentYear}</h3>
                          <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Month Buttons Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          {[
                            'January', 'February', 'March', 'April',
                            'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'
                          ].map((monthName, index) => {
                            const isSelected =
                              tempDateRange.start &&
                              tempDateRange.start.getMonth() === index &&
                              tempDateRange.start.getFullYear() === currentYear

                            return (
                              <button
                                key={monthName}
                                onClick={() => {
                                  const startOfMonthDate = new Date(currentYear, index, 1)
                                  const endOfMonthDate = new Date(currentYear, index + 1, 0, 23, 59, 59)
                                  setTempDateRange({ start: startOfMonthDate, end: endOfMonthDate })
                                }}
                                className={`
                                  py-3 px-4 rounded-lg text-base font-medium transition-colors
                                  ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                              >
                                {monthName}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Distance Filter */}
            <div className="relative" ref={distanceFilterRef}>
              {appliedDistanceFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsDistanceFilterOpen(!isDistanceFilterOpen)}
                    className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    {getDistanceFilterText()}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedDistanceFilter(null)
                      setTempDistanceFilter(null)
                      setAppliedCustomRange({ min: 0, max: 100 })
                      setTempCustomRange({ min: 0, max: 100 })
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear distance filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsDistanceFilterOpen(!isDistanceFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Distance
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Distance Dropdown */}
              <AnimatePresence>
                {isDistanceFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Action Buttons and Toggle */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempDistanceFilter(null)
                          setTempCustomRange({ min: 0, max: 100 })
                        }}
                        className="p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Toggle between Distance and Custom - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button
                          onClick={() => setDistanceFilterMode('distance')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            distanceFilterMode === 'distance'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Distance
                        </button>
                        <button
                          onClick={() => setDistanceFilterMode('custom')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            distanceFilterMode === 'custom'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedDistanceFilter(tempDistanceFilter)
                          setAppliedCustomRange(tempCustomRange)
                          setIsDistanceFilterOpen(false)
                        }}
                        className="p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
                        aria-label="Apply filter"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>

                    {distanceFilterMode === 'distance' ? (
                      <>
                        {/* Predefined Distance Categories */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {allDistanceCategories.map((category) => {
                            const isSelected = tempDistanceFilter === category.id

                            return (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setTempDistanceFilter(category.id)
                                }}
                                className={`
                                  py-3 px-4 rounded-lg text-base font-medium transition-colors
                                  ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                              >
                                {category.label}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Custom Range Slider */}
                        <div className="mb-6">
                          {/* Min/Max Input Fields */}
                          <div className="flex items-center gap-3 mb-8">
                            <div className="flex-1 relative">
                              <input
                                type="number"
                                value={distanceUnit === 'km' ? Math.round(tempCustomRange.min) : Math.round(kmToMiles(tempCustomRange.min))}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                  // Allow swapping: if new min > max, swap them
                                  setTempCustomRange(prev => {
                                    if (kmValue > prev.max) {
                                      return { min: prev.max, max: kmValue }
                                    }
                                    return { ...prev, min: kmValue }
                                  })
                                  setTempDistanceFilter('custom')
                                }}
                                className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-base font-medium outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                                placeholder="0"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 text-base font-medium pointer-events-none">
                                {distanceUnit}
                              </span>
                            </div>
                            <div className="flex-1 relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 text-base font-medium pointer-events-none">
                                &gt;
                              </span>
                              <input
                                type="number"
                                value={distanceUnit === 'km' ? Math.round(tempCustomRange.max) : Math.round(kmToMiles(tempCustomRange.max))}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                  // Allow swapping: if new max < min, swap them
                                  setTempCustomRange(prev => {
                                    if (kmValue < prev.min) {
                                      return { min: kmValue, max: prev.min }
                                    }
                                    return { ...prev, max: kmValue }
                                  })
                                  setTempDistanceFilter('custom')
                                }}
                                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-base font-medium outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                                placeholder={distanceUnit === 'km' ? '100' : '62'}
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 text-base font-medium pointer-events-none">
                                {distanceUnit}
                              </span>
                            </div>
                          </div>

                          {/* Slider Container with proper padding */}
                          <div className="px-6 mb-6">
                            {/* Distance markers above slider */}
                            <div className="relative mb-2 h-12">
                              {distanceCategories.map((category) => {
                                const maxValue = distanceUnit === 'km' ? 100 : kmToMiles(100)
                                const categoryValue = distanceUnit === 'km' ? category.km : kmToMiles(category.km)
                                const position = (categoryValue / maxValue) * 100

                                return (
                                  <div
                                    key={category.id}
                                    className="absolute flex flex-col items-center gap-1"
                                    style={{
                                      left: `${position}%`,
                                      transform: 'translateX(-50%)',
                                      top: 0
                                    }}
                                  >
                                    {/* SVG circle marker */}
                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500 dark:text-neutral-400">
                                      <path d="M22.5579 42.278C23.0333 42.3149 23.5145 42.3333 24 42.3333V44C23.4714 44 22.9476 43.9784 22.4294 43.9382L22.5579 42.278ZM25.5511 43.6875L25.569 43.9382C25.0513 43.9783 24.5281 44 24 44V42.3333C24.4855 42.3333 24.9667 42.3149 25.4421 42.278L25.5511 43.6875ZM16.9834 40.9434C17.8619 41.3076 18.775 41.6052 19.7161 41.8304L19.3288 43.445C18.3012 43.199 17.3045 42.876 16.3454 42.4782L16.9834 40.9434ZM31.0166 40.9434L31.653 42.4782C30.6938 42.8759 29.6973 43.1991 28.6696 43.445L28.2839 41.8304C29.225 41.6052 30.1381 41.3076 31.0166 40.9434ZM12.0941 37.9421C12.8227 38.5649 13.6012 39.131 14.4215 39.6348L13.5492 41.0524C12.6542 40.5027 11.8079 39.8828 11.0133 39.2034L12.0941 37.9421ZM36.985 39.2034C36.1904 39.8828 35.3443 40.5028 34.4492 41.0524L33.5784 39.6348C34.3988 39.131 35.1773 38.5649 35.9059 37.9421L36.985 39.2034ZM8.36523 33.5784C8.86897 34.3988 9.43509 35.1773 10.0579 35.9059L8.79492 36.985C8.1157 36.1904 7.49553 35.3442 6.94596 34.4492L8.36523 33.5784ZM41.0524 34.4492C40.5028 35.3443 39.8828 36.1904 39.2034 36.985L37.9421 35.9059C38.5649 35.1773 39.131 34.3988 39.6348 33.5784L41.0524 34.4492ZM6.1696 28.2839C6.39482 29.225 6.69238 30.1381 7.05664 31.0166L6.28516 31.3356L6.28678 31.3372L5.52018 31.653C5.12253 30.6939 4.79923 29.6972 4.55339 28.6696L6.1696 28.2839ZM43.445 28.6696C43.1991 29.6973 42.8759 30.6938 42.4782 31.653L41.7132 31.3372L40.9434 31.0166C41.3076 30.1381 41.6052 29.225 41.8304 28.2839L43.445 28.6696ZM4 24C4 23.4714 4.01996 22.9476 4.06022 22.4294L5.72201 22.5579C5.68507 23.0333 5.66667 23.5145 5.66667 24C5.66667 24.4855 5.68507 24.9667 5.72201 25.4421L4.06022 25.569C4.02005 25.0513 4 24.528 4 24ZM44 24C44 24.5281 43.9783 25.0513 43.9382 25.569L42.278 25.4421C42.3149 24.9667 42.3333 24.4855 42.3333 24C42.3333 23.5145 42.3149 23.0333 42.278 22.5579L43.9382 22.4294C43.9784 22.9476 44 23.4714 44 24ZM6.28678 16.6628L7.05664 16.9834C6.69238 17.8619 6.39482 18.775 6.1696 19.7161L4.55339 19.3288C4.79931 18.3012 5.12247 17.3045 5.52018 16.3454L6.28678 16.6628ZM42.4782 16.3454C42.876 17.3045 43.199 18.3012 43.445 19.3288L41.8304 19.7161C41.6052 18.775 41.3076 17.8619 40.9434 16.9834L41.7132 16.6628L42.4782 16.3454ZM10.0579 12.0941C9.43508 12.8227 8.86897 13.6012 8.36523 14.4215L7.65397 13.9837L6.94596 13.5492C7.49556 12.6542 8.11568 11.8079 8.79492 11.0133L10.0579 12.0941ZM39.2034 11.0133C39.8828 11.8079 40.5027 12.6542 41.0524 13.5492L40.346 13.9854L40.3444 13.9837L39.6348 14.4215C39.131 13.6012 38.5649 12.8227 37.9421 12.0941L39.2034 11.0133ZM14.4215 8.36523C13.6012 8.86897 12.8227 9.43509 12.0941 10.0579L11.0133 8.79492C11.8079 8.11568 12.6542 7.49556 13.5492 6.94596L14.4215 8.36523ZM34.4492 6.94596C35.3442 7.49553 36.1904 8.1157 36.985 8.79492L35.9059 10.0579C35.1773 9.43508 34.3988 8.86897 33.5784 8.36523L34.4492 6.94596ZM19.7161 6.1696C18.775 6.39482 17.8619 6.69238 16.9834 7.05664L16.6628 6.28516L16.3454 5.52018C17.3045 5.12247 18.3012 4.79931 19.3288 4.55339L19.7161 6.1696ZM28.6696 4.55339C29.6972 4.79923 30.6939 5.12253 31.653 5.52018L31.3372 6.28678L31.3356 6.28516L31.0166 7.05664C30.1381 6.69238 29.225 6.39482 28.2839 6.1696L28.6696 4.55339ZM24 4C24.528 4 25.0513 4.02005 25.569 4.06022L25.4421 5.72201C24.9667 5.68507 24.4855 5.66667 24 5.66667C23.5145 5.66667 23.0333 5.68507 22.5579 5.72201L22.4294 4.06022C22.9476 4.01996 23.4714 4 24 4Z" fill="currentColor"/>
                                    </svg>
                                    <p className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap leading-tight">
                                      {category.label}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>

                            <ThemeProvider theme={sliderTheme}>
                              <Slider
                                value={[
                                  distanceUnit === 'km' ? tempCustomRange.min : kmToMiles(tempCustomRange.min),
                                  distanceUnit === 'km' ? tempCustomRange.max : kmToMiles(tempCustomRange.max)
                                ]}
                                onChange={(_, newValue) => {
                                  let [min, max] = newValue as number[]

                                  // Snap to nearby markers
                                  const snapThreshold = distanceUnit === 'km' ? 3 : 2

                                  // Check min value for snapping
                                  for (const category of distanceCategories) {
                                    const markerValue = distanceUnit === 'km' ? category.km : kmToMiles(category.km)
                                    if (Math.abs(min - markerValue) < snapThreshold) {
                                      min = markerValue
                                      break
                                    }
                                  }

                                  // Check max value for snapping
                                  for (const category of distanceCategories) {
                                    const markerValue = distanceUnit === 'km' ? category.km : kmToMiles(category.km)
                                    if (Math.abs(max - markerValue) < snapThreshold) {
                                      max = markerValue
                                      break
                                    }
                                  }

                                  const minKm = distanceUnit === 'km' ? min : milesToKm(min)
                                  const maxKm = distanceUnit === 'km' ? max : milesToKm(max)
                                  setTempCustomRange({ min: minKm, max: maxKm })
                                  setTempDistanceFilter('custom')
                                }}
                                min={0}
                                max={distanceUnit === 'km' ? 100 : Math.round(kmToMiles(100))}
                                step={0.1}
                                valueLabelDisplay="off"
                                disableSwap={false}
                              />
                            </ThemeProvider>
                          </div>

                          {/* Unit Toggle Below Slider */}
                          <div className="flex items-center justify-center gap-2 mt-6 relative z-50">
                            <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1">
                              <button
                                onClick={() => setDistanceUnit('km')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                  distanceUnit === 'km'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                km
                              </button>
                              <button
                                onClick={() => setDistanceUnit('mi')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                  distanceUnit === 'mi'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                mi
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Race Cards Grid */}
        {filteredRaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              No races found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-electric-pink text-white rounded-lg hover:bg-electric-pink/90 transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRaces.map((race) => (
              <Link
                key={race._id}
                href={`/races/${race.slug.current}`}
                className="group transition-opacity duration-200 hover:opacity-80"
              >
                <div className="flex flex-col">
                  {/* Image Container */}
                  <div className="relative w-full">
                    {/* Image Wrapper */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div style={{ paddingBottom: '65%' }} className="relative">
                        {race.mainImage && (
                          <img
                            src={urlFor(race.mainImage).width(800).height(520).url()}
                            alt={race.title}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                        )}
                      </div>
                    </div>

                    {/* Distance/Category Pill - Top Right */}
                    {race.raceCategoryName && (
                      <div className="absolute top-3 right-3 z-[2]">
                        <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                          <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                            {race.raceCategoryName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-b-lg px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      {/* Title and Location */}
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="font-body text-xl font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                          {race.title}
                        </h3>
                        {(race.city || race.stateRegion || race.country) && (
                          <p className="font-body text-sm font-normal text-neutral-600 dark:text-neutral-400">
                            {formatLocation(race.city, race.stateRegion, race.country)}
                          </p>
                        )}
                      </div>

                      {/* Date Container - Right Side (Rounded) */}
                      <div className="flex flex-col items-center justify-center gap-0 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16 h-16">
                        <p
                          className="font-body text-xs font-medium uppercase text-neutral-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          {format(new Date(race.eventDate), 'MMM')}
                        </p>
                        <p
                          className="font-body text-2xl font-semibold leading-tight text-neutral-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          {format(new Date(race.eventDate), 'dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
