'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from './page'
import Slider from '@mui/material/Slider'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

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
          color: '#111214',
          height: 12,
          padding: '22px 0 10px',
        },
        track: {
          height: 12,
          borderRadius: 999,
          backgroundColor: '#1e1f24',
          border: '1px solid #111214',
        },
        rail: {
          height: 12,
          borderRadius: 999,
          backgroundColor: '#d6d7de',
          opacity: 1,
        },
        thumb: {
          height: 28,
          width: 28,
          backgroundColor: '#ffffff',
          border: '4px solid #111214',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
          '&:hover, &.Mui-focusVisible, &.Mui-active': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
          },
          '&:before': { display: 'none' },
        },
        mark: {
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '2px solid #a5a6ac',
          backgroundColor: '#fff',
          transform: 'translate(-50%, -50%)',
          '&.MuiSlider-markActive': {
            borderColor: '#71727a',
          },
        },
        markLabel: {
          color: '#1f2024',
          fontSize: '0.75rem',
          fontWeight: 500,
          marginTop: 6,
        },
      },
    },
  },
})

const DistanceAnchorIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M22.5579 42.278C23.0333 42.3149 23.5145 42.3333 24 42.3333V44C23.4714 44 22.9476 43.9784 22.4294 43.9382L22.5579 42.278ZM25.5511 43.6875L25.569 43.9382C25.0513 43.9783 24.5281 44 24 44V42.3333C24.4855 42.3333 24.9667 42.3149 25.4421 42.278L25.5511 43.6875ZM16.9834 40.9434C17.8619 41.3076 18.775 41.6052 19.7161 41.8304L19.3288 43.445C18.3012 43.199 17.3045 42.876 16.3454 42.4782L16.9834 40.9434ZM31.0166 40.9434L31.653 42.4782C30.6938 42.8759 29.6973 43.1991 28.6696 43.445L28.2839 41.8304C29.225 41.6052 30.1381 41.3076 31.0166 40.9434ZM12.0941 37.9421C12.8227 38.5649 13.6012 39.131 14.4215 39.6348L13.5492 41.0524C12.6542 40.5027 11.8079 39.8828 11.0133 39.2034L12.0941 37.9421ZM36.985 39.2034C36.1904 39.8828 35.3443 40.5028 34.4492 41.0524L33.5784 39.6348C34.3988 39.131 35.1773 38.5649 35.9059 37.9421L36.985 39.2034ZM8.36523 33.5784C8.86897 34.3988 9.43509 35.1773 10.0579 35.9059L8.79492 36.985C8.1157 36.1904 7.49553 35.3442 6.94596 34.4492L8.36523 33.5784ZM41.0524 34.4492C40.5028 35.3443 39.8828 36.1904 39.2034 36.985L37.9421 35.9059C38.5649 35.1773 39.131 34.3988 39.6348 33.5784L41.0524 34.4492ZM6.1696 28.2839C6.39482 29.225 6.69238 30.1381 7.05664 31.0166L6.28516 31.3356L6.28678 31.3372L5.52018 31.653C5.12253 30.6939 4.79923 29.6972 4.55339 28.6696L6.1696 28.2839ZM43.445 28.6696C43.1991 29.6973 42.8759 30.6938 42.4782 31.653L41.7132 31.3372L40.9434 31.0166C41.3076 30.1381 41.6052 29.225 41.8304 28.2839L43.445 28.6696ZM4 24C4 23.4714 4.01996 22.9476 4.06022 22.4294L5.72201 22.5579C5.68507 23.0333 5.66667 23.5145 5.66667 24C5.66667 24.4855 5.68507 24.9667 5.72201 25.4421L4.06022 25.569C4.02005 25.0513 4 24.528 4 24ZM44 24C44 24.5281 43.9783 25.0513 43.9382 25.569L42.278 25.4421C42.3149 24.9667 42.3333 24.4855 42.3333 24C42.3333 23.5145 42.3149 23.0333 42.278 22.5579L43.9382 22.4294C43.9784 22.9476 44 23.4714 44 24ZM6.28678 16.6628L7.05664 16.9834C6.69238 17.8619 6.39482 18.775 6.1696 19.7161L4.55339 19.3288C4.79931 18.3012 5.12247 17.3045 5.52018 16.3454L6.28678 16.6628ZM42.4782 16.3454C42.876 17.3045 43.199 18.3012 43.445 19.3288L41.8304 19.7161C41.6052 18.775 41.3076 17.8619 40.9434 16.9834L41.7132 16.6628L42.4782 16.3454ZM10.0579 12.0941C9.43508 12.8227 8.86897 13.6012 8.36523 14.4215L7.65397 13.9837L6.94596 13.5492C7.49556 12.6542 8.11568 11.8079 8.79492 11.0133L10.0579 12.0941ZM39.2034 11.0133C39.8828 11.8079 40.5027 12.6542 41.0524 13.5492L40.346 13.9854L40.3444 13.9837L39.6348 14.4215C39.131 13.6012 38.5649 12.8227 37.9421 12.0941L39.2034 11.0133ZM14.4215 8.36523C13.6012 8.86897 12.8227 9.43509 12.0941 10.0579L11.0133 8.79492C11.8079 8.11568 12.6542 7.49556 13.5492 6.94596L14.4215 8.36523ZM34.4492 6.94596C35.3442 7.49553 36.1904 8.1157 36.985 8.79492L35.9059 10.0579C35.1773 9.43508 34.3988 8.86897 33.5784 8.36523L34.4492 6.94596ZM19.7161 6.1696C18.775 6.39482 17.8619 6.69238 16.9834 7.05664L16.6628 6.28516L16.3454 5.52018C17.3045 5.12247 18.3012 4.79931 19.3288 4.55339L19.7161 6.1696ZM28.6696 4.55339C29.6972 4.79923 30.6939 5.12253 31.653 5.52018L31.3372 6.28678L31.3356 6.28516L31.0166 7.05664C30.1381 6.69238 29.225 6.39482 28.2839 6.1696L28.6696 4.55339ZM24 4C24.528 4 25.0513 4.02005 25.569 4.06022L25.4421 5.72201C24.9667 5.68507 24.4855 5.66667 24 5.66667C23.5145 5.66667 23.0333 5.68507 22.5579 5.72201L22.4294 4.06022C22.9476 4.01996 23.4714 4 24 4Z" />
  </svg>
)

const DistanceTrashIcon = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path d="M24 4C20.4917 4 17.5704 6.62143 17.0801 10H10.2383C10.1531 9.98543 10.0669 9.97824 9.98047 9.97852C9.90582 9.98013 9.83139 9.98731 9.75781 10H6.5C6.30123 9.99719 6.10389 10.0339 5.91944 10.108C5.73498 10.1822 5.5671 10.2922 5.42555 10.4318C5.28399 10.5713 5.17159 10.7376 5.09487 10.921C5.01815 11.1044 4.97864 11.3012 4.97864 11.5C4.97864 11.6988 5.01815 11.8956 5.09487 12.079C5.17159 12.2624 5.28399 12.4287 5.42555 12.5682C5.5671 12.7078 5.73498 12.8178 5.91944 12.892C6.10389 12.9661 6.30123 13.0028 6.5 13H8.63867L11.1563 39.0293C11.4273 41.8359 13.8118 44 16.6309 44H31.3672C34.1864 44 36.5708 41.8362 36.8418 39.0293L39.3613 13H41.5C41.6988 13.0028 41.8961 12.9661 42.0806 12.892C42.265 12.8178 42.4329 12.7078 42.5745 12.5682C42.716 12.4287 42.8284 12.2624 42.9051 12.079C42.9819 11.8956 43.0214 11.6988 43.0214 11.5C43.0214 11.3012 42.9819 11.1044 42.9051 10.921C42.8284 10.7376 42.716 10.5713 42.5745 10.4318C42.4329 10.2922 42.265 10.1822 42.0806 10.108C41.8961 10.0339 41.6988 9.99719 41.5 10H38.2441C38.085 9.97419 37.9228 9.97419 37.7637 10H30.9199C30.4296 6.62143 27.5083 4 24 4ZM24 7C25.8792 7 27.4208 8.26816 27.8613 10H20.1387C20.5792 8.26816 22.1208 7 24 7ZM11.6504 13H36.3477L33.8555 38.7402C33.7304 40.0354 32.668 41 31.3672 41H16.6309C15.3319 41 14.2675 40.0336 14.1426 38.7402L11.6504 13ZM20.4766 17.9785C20.0791 17.9847 19.7003 18.1485 19.4235 18.4337C19.1466 18.719 18.9943 19.1025 19 19.5V34.5C18.9972 34.6988 19.0339 34.8961 19.108 35.0806C19.1822 35.265 19.2922 35.4329 19.4318 35.5745C19.5713 35.716 19.7376 35.8284 19.921 35.9051C20.1044 35.9819 20.3012 36.0214 20.5 36.0214C20.6988 36.0214 20.8956 35.9819 21.079 35.9051C21.2624 35.8284 21.4287 35.716 21.5682 35.5745C21.7078 35.4329 21.8178 35.265 21.892 35.0806C21.9661 34.8961 22.0028 34.6988 22 34.5V19.5C22.0029 19.2992 21.9654 19.0999 21.8899 18.9139C21.8143 18.7279 21.7022 18.5589 21.5601 18.417C21.418 18.2752 21.2489 18.1632 21.0628 18.0879C20.8767 18.0126 20.6773 17.9754 20.4766 17.9785ZM27.4766 17.9785C27.0791 17.9847 26.7003 18.1485 26.4235 18.4337C26.1466 18.719 25.9943 19.1025 26 19.5V34.5C25.9972 34.6988 26.0339 34.8961 26.108 35.0806C26.1822 35.265 26.2922 35.4329 26.4318 35.5745C26.5713 35.716 26.7376 35.8284 26.921 35.9051C27.1044 35.9819 27.3012 36.0214 27.5 36.0214C27.6988 36.0214 27.8956 35.9819 28.079 35.9051C28.2624 35.8284 28.4287 35.716 28.5682 35.5745C28.7078 35.4329 28.8178 35.265 28.892 35.0806C28.9661 34.8961 29.0028 34.6988 29 34.5V19.5C29.0029 19.2992 28.9654 19.0999 28.8899 18.9139C28.8143 18.7279 28.7022 18.5589 28.5601 18.417C28.418 18.2752 28.2489 18.1632 28.0628 18.0879C27.8767 18.0126 27.6773 17.9754 27.4766 17.9785Z" />
  </svg>
)

const DistanceDoneIcon = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path d="M41.5809 9.001C40.9705 9.01885 40.3912 9.26923 39.9656 9.69908L15.7818 33.4338L8.0448 25.8405C7.8283 25.6192 7.56898 25.4425 7.28203 25.3208C6.99509 25.1991 6.68628 25.1348 6.37369 25.1317C6.06111 25.1285 5.75103 25.1867 5.46162 25.3026C5.1722 25.4186 4.90928 25.59 4.68824 25.807C4.46719 26.0239 4.29248 26.282 4.17432 26.566C4.05616 26.85 3.99694 27.1544 4.00012 27.4611C4.0033 27.7679 4.06882 28.071 4.19284 28.3526C4.31686 28.6342 4.49689 28.8887 4.72239 29.1012L14.1206 38.3249C14.5612 38.7572 15.1588 39 15.7818 39C16.4048 39 17.0024 38.7572 17.443 38.3249L43.288 12.9598C43.6276 12.6359 43.8595 12.2189 43.9533 11.7634C44.0472 11.308 43.9987 10.8353 43.8142 10.4073C43.6297 9.9794 43.3177 9.61615 42.9192 9.3652C42.5207 9.11425 42.0542 8.9873 41.5809 9.001Z" />
  </svg>
)

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

  const sliderMarks = useMemo(
    () =>
      distanceCategories.map((category) => ({
        value: distanceUnit === 'km' ? category.km : Number(kmToMiles(category.km).toFixed(1)),
        label: category.label,
      })),
    [distanceUnit],
  )

  const sliderMaxValue = distanceUnit === 'km' ? 100 : Number(kmToMiles(100).toFixed(1))

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
                    <div className="flex items-center justify-between gap-4 mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempDistanceFilter(null)
                          setTempCustomRange({ min: 0, max: 100 })
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
                        aria-label="Clear distance selection"
                      >
                        <DistanceTrashIcon className="h-7 w-7" />
                      </button>

                      {/* Toggle between Distance and Custom - Center */}
                      <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                        <button
                          onClick={() => setDistanceFilterMode('distance')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            distanceFilterMode === 'distance'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                          }`}
                        >
                          Distance
                        </button>
                        <button
                          onClick={() => setDistanceFilterMode('custom')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            distanceFilterMode === 'custom'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
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
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
                        aria-label="Apply distance filter"
                      >
                        <DistanceDoneIcon className="h-7 w-7" />
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
                        <div className="mb-6 space-y-6">
                          {/* Min/Max Input Fields */}
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                              <div className="flex items-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm ring-1 ring-transparent transition focus-within:ring-neutral-900/20 dark:border-neutral-700 dark:bg-neutral-800">
                                <input
                                  type="number"
                                  value={distanceUnit === 'km' ? Math.round(tempCustomRange.min) : Math.round(kmToMiles(tempCustomRange.min))}
                                  onChange={(e) => {
                                    const value = Number(e.target.value)
                                    const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                    setTempCustomRange(prev => {
                                      if (kmValue > prev.max) {
                                        return { min: prev.max, max: kmValue }
                                      }
                                      return { ...prev, min: kmValue }
                                    })
                                    setTempDistanceFilter('custom')
                                  }}
                                  className="w-full bg-transparent text-lg font-semibold text-neutral-900 outline-none [appearance:textfield] focus:ring-0 dark:text-white [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <span className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                                  {distanceUnit}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm ring-1 ring-transparent transition focus-within:ring-neutral-900/20 dark:border-neutral-700 dark:bg-neutral-800">
                                <span className="mr-3 text-lg font-semibold leading-none text-neutral-400 dark:text-neutral-500">
                                  &gt;
                                </span>
                                <input
                                  type="number"
                                  value={distanceUnit === 'km' ? Math.round(tempCustomRange.max) : Math.round(kmToMiles(tempCustomRange.max))}
                                  onChange={(e) => {
                                    const value = Number(e.target.value)
                                    const kmValue = distanceUnit === 'km' ? value : milesToKm(value)
                                    setTempCustomRange(prev => {
                                      if (kmValue < prev.min) {
                                        return { min: kmValue, max: prev.min }
                                      }
                                      return { ...prev, max: kmValue }
                                    })
                                    setTempDistanceFilter('custom')
                                  }}
                                  className="w-full bg-transparent text-lg font-semibold text-neutral-900 outline-none [appearance:textfield] focus:ring-0 dark:text-white [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder={distanceUnit === 'km' ? '100' : '62'}
                                />
                                <span className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                                  {distanceUnit}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Slider + Anchors */}
                          <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="px-1">
                              <ThemeProvider theme={sliderTheme}>
                                <Box sx={{ px: 1, position: 'relative' }}>
                                  <Slider
                                    value={[
                                      distanceUnit === 'km' ? tempCustomRange.min : kmToMiles(tempCustomRange.min),
                                      distanceUnit === 'km' ? tempCustomRange.max : kmToMiles(tempCustomRange.max),
                                    ]}
                                    onChange={(_, newValue) => {
                                      const [min, max] = newValue as number[]
                                      const minKm = distanceUnit === 'km' ? min : milesToKm(min)
                                      const maxKm = distanceUnit === 'km' ? max : milesToKm(max)
                                      setTempCustomRange({ min: minKm, max: maxKm })
                                      setTempDistanceFilter('custom')
                                    }}
                                    onChangeCommitted={(_, newValue) => {
                                      let [min, max] = newValue as number[]
                                      const snapThreshold = distanceUnit === 'km' ? 3 : 2

                                      for (const category of distanceCategories) {
                                        const markerValue = distanceUnit === 'km' ? category.km : kmToMiles(category.km)
                                        if (Math.abs(min - markerValue) < snapThreshold) {
                                          min = markerValue
                                          break
                                        }
                                      }

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
                                    max={sliderMaxValue}
                                    step={distanceUnit === 'km' ? 1 : 0.1}
                                    valueLabelDisplay="off"
                                    disableSwap={false}
                                    marks={sliderMarks}
                                    sx={{
                                      '& .MuiSlider-markLabel': {
                                        top: 40,
                                      },
                                    }}
                                  />
                                </Box>
                              </ThemeProvider>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-3 px-2">
                              {distanceCategories.map((category) => {
                                const isActive =
                                  tempCustomRange.min <= category.km && tempCustomRange.max >= category.km

                                return (
                                  <button
                                    key={category.id}
                                    onClick={() => {
                                      const kmValue = category.km
                                      setTempCustomRange({ min: kmValue - 1, max: kmValue + 1 })
                                      setTempDistanceFilter('custom')
                                    }}
                                    className="flex flex-col items-center gap-2 text-center transition-colors"
                                    aria-label={`Set slider to ${category.label}`}
                                  >
                                    <DistanceAnchorIcon
                                      className={`h-9 w-9 ${
                                        isActive
                                          ? 'text-neutral-900 dark:text-white'
                                          : 'text-neutral-400 dark:text-neutral-500'
                                      }`}
                                    />
                                    <p
                                      className={`text-xs font-semibold uppercase tracking-wide ${
                                        isActive
                                          ? 'text-neutral-900 dark:text-white'
                                          : 'text-neutral-500 dark:text-neutral-400'
                                      }`}
                                    >
                                      {category.label}
                                    </p>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Unit Toggle Below Distance Anchors */}
                          <div className="flex items-center justify-center">
                            <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
                              <button
                                onClick={() => setDistanceUnit('km')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                                  distanceUnit === 'km'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                              >
                                km
                              </button>
                              <button
                                onClick={() => setDistanceUnit('mi')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                                  distanceUnit === 'mi'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
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
