'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from './page'

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

export function RaceGuidesClient({ races }: { races: RaceGuide[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [dateFilterMode, setDateFilterMode] = useState<'dates' | 'months'>('dates')
  const dateFilterRef = useRef<HTMLDivElement>(null)

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
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((race) => {
        const raceDate = new Date(race.eventDate)
        if (dateRange.start && dateRange.end) {
          return raceDate >= dateRange.start && raceDate <= dateRange.end
        } else if (dateRange.start) {
          return raceDate >= dateRange.start
        } else if (dateRange.end) {
          return raceDate <= dateRange.end
        }
        return true
      })
    }

    return filtered
  }, [races, searchQuery, dateRange])

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
              <button
                onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Dates
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Date Dropdown */}
              <AnimatePresence>
                {isDateFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-neutral-900 rounded-lg shadow-xl border border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Toggle between Dates and Months */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="inline-flex bg-neutral-800 rounded-lg p-1">
                        <button
                          onClick={() => setDateFilterMode('dates')}
                          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                            dateFilterMode === 'dates'
                              ? 'bg-white text-neutral-900'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Dates
                        </button>
                        <button
                          onClick={() => setDateFilterMode('months')}
                          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                            dateFilterMode === 'months'
                              ? 'bg-white text-neutral-900'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Months
                        </button>
                      </div>
                    </div>

                    {dateFilterMode === 'dates' ? (
                      <>
                        {/* Calendar Header Controls */}
                        <div className="flex items-center justify-between mb-4 px-2">
                      <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              <h3 className="text-white font-semibold text-base">
                                {format(month, 'MMMM yyyy')}
                              </h3>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                <div key={day} className="text-center text-neutral-500 text-xs font-medium py-1">
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
                                  (dateRange.start && isSameDay(dayStart, dateRange.start)) ||
                                  (dateRange.end && isSameDay(dayStart, dateRange.end))
                                const isInRange =
                                  dateRange.start && dateRange.end &&
                                  isWithinInterval(dayStart, { start: dateRange.start, end: dateRange.end })

                                return (
                                  <button
                                    key={day.toString()}
                                    onClick={() => {
                                      if (!dateRange.start || (dateRange.start && dateRange.end)) {
                                        setDateRange({ start: dayStart, end: null })
                                      } else {
                                        if (dayStart < dateRange.start) {
                                          setDateRange({ start: dayStart, end: dateRange.start })
                                        } else {
                                          setDateRange({ ...dateRange, end: dayStart })
                                        }
                                      }
                                    }}
                                    className={`
                                      h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                                      ${isSelected ? 'bg-white text-neutral-900' : ''}
                                      ${isInRange && !isSelected ? 'bg-neutral-700 text-white' : ''}
                                      ${!isSelected && !isInRange ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : ''}
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
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="text-white font-semibold text-lg">{currentYear}</h3>
                          <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              dateRange.start &&
                              dateRange.start.getMonth() === index &&
                              dateRange.start.getFullYear() === currentYear

                            return (
                              <button
                                key={monthName}
                                onClick={() => {
                                  const startOfMonthDate = new Date(currentYear, index, 1)
                                  const endOfMonthDate = new Date(currentYear, index + 1, 0, 23, 59, 59)
                                  setDateRange({ start: startOfMonthDate, end: endOfMonthDate })
                                }}
                                className={`
                                  py-3 px-4 rounded-lg text-sm font-medium transition-colors
                                  ${isSelected ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}
                                `}
                              >
                                {monthName}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          setDateRange({ start: null, end: null })
                        }}
                        className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setIsDateFilterOpen(false)}
                        className="px-6 py-2 bg-white text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
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
