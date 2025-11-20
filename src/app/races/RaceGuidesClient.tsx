'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from './page'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

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
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km')
  const [appliedDistanceFilter, setAppliedDistanceFilter] = useState<string | null>(null) // e.g., 'marathon', 'ultra', or 'custom'
  const [tempDistanceFilter, setTempDistanceFilter] = useState<string | null>(null)
  // For custom range (in km)
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 })
  const [tempCustomRange, setTempCustomRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 })
  const distanceFilterRef = useRef<HTMLDivElement>(null)
  // Track which input is focused
  const [isMinInputFocused, setIsMinInputFocused] = useState(false)
  const [isMaxInputFocused, setIsMaxInputFocused] = useState(false)
  // Track input values while typing
  const [minInputValue, setMinInputValue] = useState('')
  const [maxInputValue, setMaxInputValue] = useState('')

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

  // Helper: Get distance category from km (with more forgiving tolerance)
  const getDistanceCategory = (distanceKm: number): string | null => {
    if (distanceKm >= 40 && distanceKm < 50) return 'marathon' // Marathon (±2km tolerance)
    if (distanceKm >= 50) return 'ultra' // Ultra (50km+)
    if (distanceKm >= 20 && distanceKm < 23) return 'half-marathon' // Half marathon (±1km tolerance)
    if (distanceKm >= 15 && distanceKm < 17.5) return '10-miles' // 10 miles (~16km ±1km tolerance)
    if (distanceKm >= 9 && distanceKm < 11) return '10k' // 10k (±1km tolerance)
    if (distanceKm >= 4.5 && distanceKm < 5.5) return '5k' // 5k (±0.5km tolerance)
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
      // Show decimal if values are close together (< 2 units apart)
      const diff = max - min
      if (diff < 2) {
        return `${min.toFixed(1)}-${max.toFixed(1)}${unit}`
      }
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
                        disabled={!tempDateRange.start && !tempDateRange.end}
                        className={`p-2 rounded-lg transition-colors ${
                          tempDateRange.start || tempDateRange.end
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
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
                        disabled={!tempDateRange.start && !tempDateRange.end}
                        className={`p-2 rounded-lg transition-colors ${
                          tempDateRange.start || tempDateRange.end
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 cursor-pointer'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
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
                        disabled={!tempDistanceFilter && tempCustomRange.min === 0 && tempCustomRange.max === 100}
                        className={`p-2 rounded-lg transition-colors ${
                          tempDistanceFilter || tempCustomRange.min !== 0 || tempCustomRange.max !== 100
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
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
                        disabled={!tempDistanceFilter && tempCustomRange.min === 0 && tempCustomRange.max === 100}
                        className={`p-2 rounded-lg transition-colors ${
                          tempDistanceFilter || tempCustomRange.min !== 0 || tempCustomRange.max !== 100
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 cursor-pointer'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
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
                          <div className="px-3 mb-6">
                            <div className="flex items-center justify-between" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                              {/* Min Value Box */}
                              <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                                {isMinInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    <input
                                      type="number"
                                      value={minInputValue}
                                      onChange={(e) => {
                                        setMinInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                          // Allow swapping: if new min > max, swap them
                                          setTempCustomRange(prev => {
                                            if (kmValue > prev.max) {
                                              return { min: prev.max, max: kmValue }
                                            }
                                            return { ...prev, min: kmValue }
                                          })
                                          setTempDistanceFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMinInputFocused(false)
                                        setMinInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, minInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {minInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        {distanceUnit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMinInputFocused(true)}>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {distanceUnit === 'km' ? Math.round(tempCustomRange.min) : Math.round(kmToMiles(tempCustomRange.min))}
                                    </span>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {distanceUnit}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Max Value Box with ">" prefix (only shown at max 100km/62mi) */}
                              <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                                {isMaxInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    {(() => {
                                      const maxValue = distanceUnit === 'km' ? 100 : Math.round(kmToMiles(100))
                                      const currentValue = maxInputValue ? Number(maxInputValue) : (distanceUnit === 'km' ? tempCustomRange.max : Math.round(kmToMiles(tempCustomRange.max)))
                                      return currentValue >= maxValue && maxInputValue && (
                                        <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                          &gt;
                                        </span>
                                      )
                                    })()}
                                    <input
                                      type="number"
                                      value={maxInputValue}
                                      onChange={(e) => {
                                        setMaxInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                          // Allow swapping: if new max < min, swap them
                                          setTempCustomRange(prev => {
                                            if (kmValue < prev.min) {
                                              return { min: kmValue, max: prev.min }
                                            }
                                            return { ...prev, max: kmValue }
                                          })
                                          setTempDistanceFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMaxInputFocused(false)
                                        setMaxInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, maxInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {maxInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        {distanceUnit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMaxInputFocused(true)}>
                                    {(() => {
                                      const maxValue = distanceUnit === 'km' ? 100 : Math.round(kmToMiles(100))
                                      const currentValue = distanceUnit === 'km' ? tempCustomRange.max : Math.round(kmToMiles(tempCustomRange.max))
                                      return currentValue >= maxValue && (
                                        <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                          &gt;
                                        </span>
                                      )
                                    })()}
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {distanceUnit === 'km' ? Math.round(tempCustomRange.max) : Math.round(kmToMiles(tempCustomRange.max))}
                                    </span>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {distanceUnit}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Slider Container */}
                          <div className="px-3 mb-6">
                            <Box sx={{ width: '100%', px: 1 }}>
                              <Slider
                                value={[
                                  distanceUnit === 'km' ? tempCustomRange.min : kmToMiles(tempCustomRange.min),
                                  distanceUnit === 'km' ? tempCustomRange.max : kmToMiles(tempCustomRange.max)
                                ]}
                                onChange={(_, newValue) => {
                                  const [min, max] = newValue as number[]
                                  const minKm = distanceUnit === 'km' ? min : milesToKm(min)
                                  const maxKm = distanceUnit === 'km' ? max : milesToKm(max)
                                  setTempCustomRange({ min: minKm, max: maxKm })
                                  setTempDistanceFilter('custom')
                                }}
                                onChangeCommitted={(_, newValue) => {
                                  // Snap to markers when user releases slider
                                  let [min, max] = newValue as number[]
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
                                step={distanceUnit === 'km' ? 1 : 0.5}
                                valueLabelDisplay="off"
                                disableSwap={false}
                                marks={distanceCategories.map(category => ({
                                  value: distanceUnit === 'km' ? category.km : kmToMiles(category.km),
                                  label: ''
                                }))}
                                sx={{
                                  color: '#1A1A1A', // gray-900
                                  height: 24,
                                  padding: 0,
                                  '& .MuiSlider-rail': {
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: '#404040', // gray-700 - dark rail
                                    opacity: 1,
                                    left: 0,
                                    right: 0,
                                    width: '100%',
                                  },
                                  '& .MuiSlider-track': {
                                    height: 24,
                                    borderRadius: 0, // Remove rounded ends to touch thumbs
                                    backgroundColor: '#E6E6E6', // gray-200 - light track
                                    border: 'none',
                                  },
                                  '& .MuiSlider-thumb': {
                                    height: 24,
                                    width: 24,
                                    backgroundColor: '#FFFFFF', // white thumb
                                    border: 'none',
                                    boxShadow: 'none',
                                    zIndex: 2, // Thumbs below marks
                                    '&:hover, &.Mui-active': {
                                      boxShadow: 'none',
                                    },
                                    '&.Mui-focusVisible': {
                                      boxShadow: 'none',
                                    },
                                  },
                                  '& .MuiSlider-mark': {
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent',
                                    border: '1px dashed #A3A3A3', // gray-400 - more subtle
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    opacity: 1,
                                    zIndex: 3, // Marks above thumbs
                                    pointerEvents: 'none', // Don't interfere with thumb dragging
                                    '&.MuiSlider-markActive': {
                                      backgroundColor: 'transparent',
                                      border: '1px dashed #A3A3A3', // gray-400 when active
                                    },
                                  },
                                }}
                              />
                            </Box>

                            {/* Distance Labels Below Slider */}
                            <div className="relative mt-1" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                              {distanceCategories.map((category) => {
                                const maxValue = distanceUnit === 'km' ? 100 : kmToMiles(100)
                                const categoryValue = distanceUnit === 'km' ? category.km : kmToMiles(category.km)
                                const position = (categoryValue / maxValue) * 100

                                return (
                                  <div
                                    key={category.id}
                                    className="absolute flex flex-col items-center"
                                    style={{
                                      left: `${position}%`,
                                      transform: 'translateX(-50%)',
                                      top: 0
                                    }}
                                  >
                                    <p className="text-sm font-medium text-center leading-tight text-neutral-400 dark:text-neutral-500">
                                      {category.id === 'half-marathon' ? (
                                        <>
                                          Half<br />Marathon
                                        </>
                                      ) : (
                                        category.label
                                      )}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Unit Toggle Below Distance Anchors */}
                          <div className="flex items-center justify-center gap-2 mt-12 relative z-50">
                            <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-0.5">
                              <button
                                onClick={() => setDistanceUnit('km')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                  distanceUnit === 'km'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                km
                              </button>
                              <button
                                onClick={() => setDistanceUnit('mi')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
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
