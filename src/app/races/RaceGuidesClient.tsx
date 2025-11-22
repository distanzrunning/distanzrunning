'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from './page'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
// @ts-ignore - country-flag-icons doesn't have perfect TypeScript types
import * as flags from 'country-flag-icons/react/3x2'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'

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

  // Country filter states
  const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false)
  const [appliedCountryFilter, setAppliedCountryFilter] = useState<string | null>(null)
  const [tempCountryFilter, setTempCountryFilter] = useState<string | null>(null)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const countryFilterRef = useRef<HTMLDivElement>(null)

  // City filter states
  const [isCityFilterOpen, setIsCityFilterOpen] = useState(false)
  const [appliedCityFilter, setAppliedCityFilter] = useState<string | null>(null)
  const [tempCityFilter, setTempCityFilter] = useState<string | null>(null)
  const [citySearchQuery, setCitySearchQuery] = useState('')
  const cityFilterRef = useRef<HTMLDivElement>(null)

  // State filter states
  const [isStateFilterOpen, setIsStateFilterOpen] = useState(false)
  const [appliedStateFilter, setAppliedStateFilter] = useState<string | null>(null)
  const [tempStateFilter, setTempStateFilter] = useState<string | null>(null)
  const [stateSearchQuery, setStateSearchQuery] = useState('')
  const stateFilterRef = useRef<HTMLDivElement>(null)

  // Surface filter states
  const [isSurfaceFilterOpen, setIsSurfaceFilterOpen] = useState(false)
  const [appliedSurfaceFilter, setAppliedSurfaceFilter] = useState<string | null>(null)
  const [tempSurfaceFilter, setTempSurfaceFilter] = useState<string | null>(null)
  const surfaceFilterRef = useRef<HTMLDivElement>(null)

  // Elevation filter states
  const [isElevationFilterOpen, setIsElevationFilterOpen] = useState(false)
  const [elevationFilterMode, setElevationFilterMode] = useState<'elevation' | 'custom'>('elevation')
  const [elevationUnit, setElevationUnit] = useState<'m' | 'ft'>('m')
  const [appliedElevationFilter, setAppliedElevationFilter] = useState<string | null>(null) // e.g., 'flat', 'rolling', or 'custom'
  const [tempElevationFilter, setTempElevationFilter] = useState<string | null>(null)
  // For custom elevation range (in meters)
  const [appliedCustomElevationRange, setAppliedCustomElevationRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const [tempCustomElevationRange, setTempCustomElevationRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const elevationFilterRef = useRef<HTMLDivElement>(null)
  // Track which elevation input is focused
  const [isMinElevationInputFocused, setIsMinElevationInputFocused] = useState(false)
  const [isMaxElevationInputFocused, setIsMaxElevationInputFocused] = useState(false)
  // Track elevation input values while typing
  const [minElevationInputValue, setMinElevationInputValue] = useState('')
  const [maxElevationInputValue, setMaxElevationInputValue] = useState('')

  // Temperature filter states
  const [isTemperatureFilterOpen, setIsTemperatureFilterOpen] = useState(false)
  const [temperatureFilterMode, setTemperatureFilterMode] = useState<'temperature' | 'custom'>('temperature')
  const [temperatureUnit, setTemperatureUnit] = useState<'c' | 'f'>('c')
  const [appliedTemperatureFilter, setAppliedTemperatureFilter] = useState<string | null>(null) // e.g., 'very-cold', 'cold', or 'custom'
  const [tempTemperatureFilter, setTempTemperatureFilter] = useState<string | null>(null)
  // For custom temperature range (in Celsius)
  const [appliedCustomTemperatureRange, setAppliedCustomTemperatureRange] = useState<{ min: number; max: number }>({ min: 0, max: 35 })
  const [tempCustomTemperatureRange, setTempCustomTemperatureRange] = useState<{ min: number; max: number }>({ min: 0, max: 35 })
  const temperatureFilterRef = useRef<HTMLDivElement>(null)
  // Track which temperature input is focused
  const [isMinTemperatureInputFocused, setIsMinTemperatureInputFocused] = useState(false)
  const [isMaxTemperatureInputFocused, setIsMaxTemperatureInputFocused] = useState(false)
  // Track temperature input values while typing
  const [minTemperatureInputValue, setMinTemperatureInputValue] = useState('')
  const [maxTemperatureInputValue, setMaxTemperatureInputValue] = useState('')

  // Price filter states
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')
  const [tempSelectedCurrency, setTempSelectedCurrency] = useState<string>('USD')
  const [appliedPriceRange, setAppliedPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 })
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 })
  const priceFilterRef = useRef<HTMLDivElement>(null)
  const [isMinPriceInputFocused, setIsMinPriceInputFocused] = useState(false)
  const [isMaxPriceInputFocused, setIsMaxPriceInputFocused] = useState(false)
  const [minPriceInputValue, setMinPriceInputValue] = useState('')
  const [maxPriceInputValue, setMaxPriceInputValue] = useState('')

  // Tags filter states
  const [isTagsFilterOpen, setIsTagsFilterOpen] = useState(false)
  const [appliedTagsFilter, setAppliedTagsFilter] = useState<string>('')
  const [tempTagsFilter, setTempTagsFilter] = useState<string>('')
  const tagsFilterRef = useRef<HTMLDivElement>(null)

  // Loading state for filtering
  const [isFiltering, setIsFiltering] = useState(false)

  // Get unique tags from all races
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>()
    races.forEach(race => {
      if (race.tags && race.tags.length > 0) {
        race.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    // Convert to array and sort alphabetically
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b))
  }, [races])

  // Get unique cities from races with their country
  const availableCities = useMemo(() => {
    const cityCountryMap = new Map<string, string>()
    races.forEach(race => {
      if (race.city && race.country) {
        cityCountryMap.set(race.city, race.country)
      }
    })
    // Convert to array and sort alphabetically by city name
    return Array.from(cityCountryMap.entries())
      .map(([city, country]) => ({ city, country }))
      .sort((a, b) => a.city.localeCompare(b.city))
  }, [races])

  // All US states list (52 total: 50 states + DC + Puerto Rico) - sorted alphabetically
  const allStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  // Surface options
  const surfaceOptions = [
    'Road',
    'Trail',
    'Track',
    'Mixed'
  ]

  // Elevation categories
  const elevationCategories = [
    { id: 'flat', label: 'Flat', minM: 0, maxM: 100 },
    { id: 'rolling', label: 'Rolling', minM: 100, maxM: 300 },
    { id: 'hilly', label: 'Hilly', minM: 300, maxM: 600 },
    { id: 'mountainous', label: 'Mountainous', minM: 600, maxM: 1000 }
  ]

  // Temperature categories (in Celsius)
  const temperatureCategories = [
    { id: 'very-cold', label: 'Very Cold', minC: -10, maxC: 0, fillPercent: 15, color: '#3B82F6' },
    { id: 'cold', label: 'Cold', minC: 0, maxC: 10, fillPercent: 35, color: '#60A5FA' },
    { id: 'mild', label: 'Mild', minC: 10, maxC: 18, fillPercent: 50, color: '#FEF3C7' },
    { id: 'warm', label: 'Warm', minC: 18, maxC: 25, fillPercent: 65, color: '#FCD34D' },
    { id: 'hot', label: 'Hot', minC: 25, maxC: 32, fillPercent: 85, color: '#FB923C' },
    { id: 'very-hot', label: 'Very Hot', minC: 32, maxC: 45, fillPercent: 100, color: '#EF4444' }
  ]

  // Currency options (matching Sanity schema)
  const currencyOptions = [
    { code: 'USD', label: 'USD - US Dollar' },
    { code: 'EUR', label: 'EUR - Euro' },
    { code: 'GBP', label: 'GBP - British Pound' },
    { code: 'JPY', label: 'JPY - Japanese Yen' },
    { code: 'AUD', label: 'AUD - Australian Dollar' },
    { code: 'CAD', label: 'CAD - Canadian Dollar' },
    { code: 'CHF', label: 'CHF - Swiss Franc' },
    { code: 'CNY', label: 'CNY - Chinese Yuan' },
    { code: 'SEK', label: 'SEK - Swedish Krona' },
    { code: 'NZD', label: 'NZD - New Zealand Dollar' },
    { code: 'MXN', label: 'MXN - Mexican Peso' },
    { code: 'SGD', label: 'SGD - Singapore Dollar' },
    { code: 'HKD', label: 'HKD - Hong Kong Dollar' },
    { code: 'NOK', label: 'NOK - Norwegian Krone' },
    { code: 'KRW', label: 'KRW - South Korean Won' },
    { code: 'TRY', label: 'TRY - Turkish Lira' },
    { code: 'INR', label: 'INR - Indian Rupee' },
    { code: 'BRL', label: 'BRL - Brazilian Real' },
    { code: 'ZAR', label: 'ZAR - South African Rand' }
  ]


  // All countries list (sorted alphabetically)
  const allCountries = [
    'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
    'China', 'Colombia', 'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia',
    'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya',
    'Luxembourg', 'Malaysia', 'Mexico', 'Monaco', 'Morocco', 'Netherlands',
    'New Zealand', 'Norway', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
    'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand',
    'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Vietnam'
  ]

  // Country code mapping for flags (ISO 3166-1 alpha-2)
  const countryToCode: Record<string, string> = {
    'United States': 'US',
    'USA': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Japan': 'JP',
    'China': 'CN',
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Canada': 'CA',
    'Mexico': 'MX',
    'Brazil': 'BR',
    'Argentina': 'AR',
    'South Africa': 'ZA',
    'Kenya': 'KE',
    'Ethiopia': 'ET',
    'Morocco': 'MA',
    'Ireland': 'IE',
    'Scotland': 'GB-SCT',
    'Wales': 'GB-WLS',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Turkey': 'TR',
    'India': 'IN',
    'Singapore': 'SG',
    'Hong Kong': 'HK',
    'South Korea': 'KR',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Taiwan': 'TW',
    'Russia': 'RU',
    'Ukraine': 'UA',
    'Israel': 'IL',
    'United Arab Emirates': 'AE',
    'UAE': 'AE',
    'Qatar': 'QA',
    'Saudi Arabia': 'SA',
    'Egypt': 'EG',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Iceland': 'IS',
    'Luxembourg': 'LU',
    'Monaco': 'MC',
  }

  const getCountryFlag = (country: string) => {
    const code = countryToCode[country]
    if (!code) return null

    // Handle sub-national flags (use parent country flag)
    const flagCode = code.includes('-') ? code.split('-')[0] : code

    // Get the flag component from the flags object
    const FlagComponent = (flags as any)[flagCode]

    if (FlagComponent) {
      return <FlagComponent className="w-6 h-4 rounded-sm" />
    }

    return null
  }

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

  // Close country filter on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryFilterRef.current && !countryFilterRef.current.contains(event.target as Node)) {
        setIsCountryFilterOpen(false)
      }
    }
    if (isCountryFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryFilterOpen])

  // Initialize temp country filter when opening dropdown
  useEffect(() => {
    if (isCountryFilterOpen) {
      setTempCountryFilter(appliedCountryFilter)
      setCountrySearchQuery('')
    }
  }, [isCountryFilterOpen, appliedCountryFilter])

  // Click outside to close city filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityFilterRef.current && !cityFilterRef.current.contains(event.target as Node)) {
        setIsCityFilterOpen(false)
      }
    }

    if (isCityFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCityFilterOpen])

  // Initialize city filter temp state when dropdown opens
  useEffect(() => {
    if (isCityFilterOpen) {
      setTempCityFilter(appliedCityFilter)
      setCitySearchQuery('')
    }
  }, [isCityFilterOpen, appliedCityFilter])

  // Click outside to close state filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateFilterRef.current && !stateFilterRef.current.contains(event.target as Node)) {
        setIsStateFilterOpen(false)
      }
    }

    if (isStateFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isStateFilterOpen])

  // Initialize state filter temp state when dropdown opens
  useEffect(() => {
    if (isStateFilterOpen) {
      setTempStateFilter(appliedStateFilter)
      setStateSearchQuery('')
    }
  }, [isStateFilterOpen, appliedStateFilter])

  // Click outside to close surface filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (surfaceFilterRef.current && !surfaceFilterRef.current.contains(event.target as Node)) {
        setIsSurfaceFilterOpen(false)
      }
    }

    if (isSurfaceFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSurfaceFilterOpen])

  // Initialize surface filter temp state when dropdown opens
  useEffect(() => {
    if (isSurfaceFilterOpen) {
      setTempSurfaceFilter(appliedSurfaceFilter)
    }
  }, [isSurfaceFilterOpen, appliedSurfaceFilter])

  // Click outside to close elevation filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elevationFilterRef.current && !elevationFilterRef.current.contains(event.target as Node)) {
        setIsElevationFilterOpen(false)
      }
    }

    if (isElevationFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isElevationFilterOpen])

  // Initialize elevation filter temp state when dropdown opens
  useEffect(() => {
    if (isElevationFilterOpen) {
      setTempElevationFilter(appliedElevationFilter)
      setTempCustomElevationRange(appliedCustomElevationRange)
      setMinElevationInputValue('')
      setMaxElevationInputValue('')
    }
  }, [isElevationFilterOpen, appliedElevationFilter, appliedCustomElevationRange])

  // Click outside to close temperature filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (temperatureFilterRef.current && !temperatureFilterRef.current.contains(event.target as Node)) {
        setIsTemperatureFilterOpen(false)
      }
    }

    if (isTemperatureFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTemperatureFilterOpen])

  // Initialize temperature filter temp state when dropdown opens
  useEffect(() => {
    if (isTemperatureFilterOpen) {
      setTempTemperatureFilter(appliedTemperatureFilter)
      setTempCustomTemperatureRange(appliedCustomTemperatureRange)
      setMinTemperatureInputValue('')
      setMaxTemperatureInputValue('')
    }
  }, [isTemperatureFilterOpen, appliedTemperatureFilter, appliedCustomTemperatureRange])

  // Click outside to close tags filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsFilterRef.current && !tagsFilterRef.current.contains(event.target as Node)) {
        setIsTagsFilterOpen(false)
      }
    }

    if (isTagsFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTagsFilterOpen])

  // Click outside to close price filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priceFilterRef.current && !priceFilterRef.current.contains(event.target as Node)) {
        setIsPriceFilterOpen(false)
      }
    }

    if (isPriceFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPriceFilterOpen])

  // Initialize price filter temp state when dropdown opens
  useEffect(() => {
    if (isPriceFilterOpen) {
      setTempPriceRange(appliedPriceRange)
      setTempSelectedCurrency(selectedCurrency)
      setMinPriceInputValue('')
      setMaxPriceInputValue('')
    }
  }, [isPriceFilterOpen, appliedPriceRange, selectedCurrency])

  // Initialize tags filter temp state when dropdown opens
  useEffect(() => {
    if (isTagsFilterOpen) {
      setTempTagsFilter(appliedTagsFilter)
    }
  }, [isTagsFilterOpen, appliedTagsFilter])

  // Helper: Convert km to miles
  const kmToMiles = (km: number) => km * 0.621371

  // Helper: Convert miles to km
  const milesToKm = (miles: number) => miles / 0.621371

  // Helper: Convert meters to feet
  const metersToFeet = (m: number) => m * 3.28084

  // Helper: Convert feet to meters
  const feetToMeters = (ft: number) => ft / 3.28084

  // Helper: Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (c: number) => (c * 9/5) + 32

  // Helper: Convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (f: number) => (f - 32) * 5/9

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

  const getElevationFilterText = () => {
    if (!appliedElevationFilter) {
      return 'Elevation'
    }

    if (appliedElevationFilter === 'custom') {
      const unit = elevationUnit
      const min = unit === 'm' ? appliedCustomElevationRange.min : metersToFeet(appliedCustomElevationRange.min)
      const max = unit === 'm' ? appliedCustomElevationRange.max : metersToFeet(appliedCustomElevationRange.max)
      const maxValue = unit === 'm' ? 1000 : 3280

      if (max >= maxValue) {
        return `${Math.round(min)}->${Math.round(max >= maxValue ? maxValue : max)}${unit}`
      }
      return `${Math.round(min)}-${Math.round(max)}${unit}`
    }

    const category = elevationCategories.find(c => c.id === appliedElevationFilter)
    return category?.label || 'Elevation'
  }

  const getTemperatureFilterText = () => {
    if (!appliedTemperatureFilter) {
      return 'Temperature'
    }

    if (appliedTemperatureFilter === 'custom') {
      const unit = temperatureUnit
      const min = unit === 'c' ? appliedCustomTemperatureRange.min : celsiusToFahrenheit(appliedCustomTemperatureRange.min)
      const max = unit === 'c' ? appliedCustomTemperatureRange.max : celsiusToFahrenheit(appliedCustomTemperatureRange.max)
      const minValue = unit === 'c' ? 0 : 32
      const maxValue = unit === 'c' ? 35 : 95

      if (min <= minValue && max >= maxValue) {
        return `<${minValue}->${maxValue}°${unit.toUpperCase()}`
      }
      if (min <= minValue) {
        return `<${minValue}-${Math.round(max)}°${unit.toUpperCase()}`
      }
      if (max >= maxValue) {
        return `${Math.round(min)}->${maxValue}°${unit.toUpperCase()}`
      }
      return `${Math.round(min)}-${Math.round(max)}°${unit.toUpperCase()}`
    }

    const category = temperatureCategories.find(c => c.id === appliedTemperatureFilter)
    return category?.label || 'Temperature'
  }

  // Trigger loading state when filters change
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, appliedDateRange, appliedDistanceFilter, appliedCustomRange, appliedCountryFilter, appliedCityFilter, appliedStateFilter, appliedSurfaceFilter, appliedElevationFilter, appliedCustomElevationRange, appliedTemperatureFilter, appliedCustomTemperatureRange, appliedPriceRange, selectedCurrency, appliedTagsFilter])

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

    // Apply country filter
    if (appliedCountryFilter) {
      filtered = filtered.filter((race) => race.country === appliedCountryFilter)
    }

    // Apply city filter
    if (appliedCityFilter) {
      filtered = filtered.filter((race) => race.city === appliedCityFilter)
    }

    // Apply state filter
    if (appliedStateFilter) {
      filtered = filtered.filter((race) => race.stateRegion === appliedStateFilter)
    }

    // Apply surface filter
    if (appliedSurfaceFilter) {
      filtered = filtered.filter((race) => race.surface === appliedSurfaceFilter)
    }

    // Apply elevation filter
    if (appliedElevationFilter) {
      if (appliedElevationFilter === 'custom') {
        filtered = filtered.filter((race) => {
          if (!race.elevationGain) return false
          return race.elevationGain >= appliedCustomElevationRange.min && race.elevationGain <= appliedCustomElevationRange.max
        })
      } else {
        const category = elevationCategories.find(c => c.id === appliedElevationFilter)
        if (category) {
          filtered = filtered.filter((race) => {
            if (!race.elevationGain) return false
            return race.elevationGain >= category.minM && race.elevationGain < category.maxM
          })
        }
      }
    }

    // Apply temperature filter
    if (appliedTemperatureFilter) {
      if (appliedTemperatureFilter === 'custom') {
        filtered = filtered.filter((race) => {
          if (race.averageTemperature === undefined) return false
          return race.averageTemperature >= appliedCustomTemperatureRange.min && race.averageTemperature <= appliedCustomTemperatureRange.max
        })
      } else {
        const category = temperatureCategories.find(c => c.id === appliedTemperatureFilter)
        if (category) {
          filtered = filtered.filter((race) => {
            if (race.averageTemperature === undefined) return false
            return race.averageTemperature >= category.minC && race.averageTemperature <= category.maxC
          })
        }
      }
    }

    // Apply Price filter
    if (appliedPriceRange.min > 0 || appliedPriceRange.max < 500) {
      filtered = filtered.filter((race) => {
        if (!race.price || !race.currency) return false
        // Convert race price to selected currency
        const convertedPrice = convertCurrencySync(race.price, race.currency, selectedCurrency)
        return convertedPrice >= appliedPriceRange.min && convertedPrice <= appliedPriceRange.max
      })
    }

    // Apply Tags filter
    if (appliedTagsFilter) {
      filtered = filtered.filter((race) => {
        if (!race.tags || race.tags.length === 0) return false
        // Check if the race has the selected tag
        return race.tags.includes(appliedTagsFilter)
      })
    }

    return filtered
  }, [races, searchQuery, appliedDateRange, appliedDistanceFilter, appliedCustomRange, appliedCountryFilter, appliedCityFilter, appliedStateFilter, appliedSurfaceFilter, appliedElevationFilter, appliedCustomElevationRange, appliedTemperatureFilter, appliedCustomTemperatureRange, appliedPriceRange, selectedCurrency, appliedTagsFilter])

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
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
            {/* Search Bar */}
            <div className="relative flex-shrink-0">
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
                                        // If clicking the same date that's already selected as start (and no end), deselect it
                                        if (tempDateRange.start && !tempDateRange.end && isSameDay(dayStart, tempDateRange.start)) {
                                          setTempDateRange({ start: null, end: null })
                                        } else {
                                          setTempDateRange({ start: dayStart, end: null })
                                        }
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
                                  // Toggle: if already selected, deselect it
                                  if (isSelected) {
                                    setTempDateRange({ start: null, end: null })
                                  } else {
                                    setTempDateRange({ start: startOfMonthDate, end: endOfMonthDate })
                                  }
                                }}
                                className={`
                                  py-4 px-4 rounded-lg text-base font-medium transition-colors
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
                                  // Toggle: if already selected, deselect it
                                  setTempDistanceFilter(isSelected ? null : category.id)
                                }}
                                className={`
                                  py-4 px-4 rounded-lg text-base font-medium transition-colors
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
                                  // Only set to 'custom' if not at default min/max
                                  if (minKm === 0 && maxKm === 100) {
                                    setTempDistanceFilter(null)
                                  } else {
                                    setTempDistanceFilter('custom')
                                  }
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
                                  // Only set to 'custom' if not at default min/max
                                  if (minKm === 0 && maxKm === 100) {
                                    setTempDistanceFilter(null)
                                  } else {
                                    setTempDistanceFilter('custom')
                                  }
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

            {/* Country Filter */}
            <div className="relative" ref={countryFilterRef}>
              {appliedCountryFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsCountryFilterOpen(!isCountryFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    {getCountryFlag(appliedCountryFilter)}
                    <span>{appliedCountryFilter}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedCountryFilter(null)
                      setTempCountryFilter(null)
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear country filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsCountryFilterOpen(!isCountryFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Country
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Country Dropdown */}
              <AnimatePresence>
                {isCountryFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Clear, Search, Apply */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempCountryFilter(null)
                        }}
                        disabled={!tempCountryFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempCountryFilter
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Search Input - Center */}
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={countrySearchQuery}
                          onChange={(e) => setCountrySearchQuery(e.target.value)}
                          placeholder="Search"
                          className="w-full px-3 py-2 pl-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedCountryFilter(tempCountryFilter)
                          setIsCountryFilterOpen(false)
                        }}
                        disabled={!tempCountryFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempCountryFilter
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

                    {/* Country List - Scrollable */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      {allCountries
                        .filter((country: string) =>
                          country.toLowerCase().includes(countrySearchQuery.toLowerCase())
                        )
                        .map((country: string) => {
                          const isSelected = tempCountryFilter === country
                          return (
                            <button
                              key={country}
                              onClick={() => {
                                // Toggle: if already selected, deselect
                                setTempCountryFilter(isSelected ? null : country)
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-1 ${
                                isSelected
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                              }`}
                            >
                              <div className="flex-shrink-0">{getCountryFlag(country)}</div>
                              <span className="text-base font-medium">{country}</span>
                            </button>
                          )
                        })}
                      {allCountries.filter((country: string) =>
                        country.toLowerCase().includes(countrySearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-center py-4 text-neutral-500 dark:text-neutral-400 text-base">
                          No countries found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Filter */}
            <div className="relative" ref={cityFilterRef}>
              {appliedCityFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsCityFilterOpen(!isCityFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    <span>{appliedCityFilter}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedCityFilter(null)
                      setTempCityFilter(null)
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear city filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsCityFilterOpen(!isCityFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  City
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* City Dropdown */}
              <AnimatePresence>
                {isCityFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Clear, Search, Apply */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempCityFilter(null)
                        }}
                        disabled={!tempCityFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempCityFilter
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Search Input - Center */}
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          placeholder="Search"
                          className="w-full px-3 py-2 pl-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedCityFilter(tempCityFilter)
                          setIsCityFilterOpen(false)
                        }}
                        disabled={!tempCityFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempCityFilter
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

                    {/* City List - Scrollable */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      {availableCities
                        .filter(({ city }) =>
                          city.toLowerCase().includes(citySearchQuery.toLowerCase())
                        )
                        .map(({ city, country }) => {
                          const isSelected = tempCityFilter === city
                          return (
                            <button
                              key={city}
                              onClick={() => {
                                // Toggle: if already selected, deselect
                                setTempCityFilter(isSelected ? null : city)
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-1 ${
                                isSelected
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                              }`}
                            >
                              <span className="text-base font-medium">
                                {city} <span className="text-neutral-500 dark:text-neutral-400">• {country}</span>
                              </span>
                            </button>
                          )
                        })}
                      {availableCities.filter(({ city }) =>
                        city.toLowerCase().includes(citySearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-center py-4 text-neutral-500 dark:text-neutral-400 text-base">
                          No cities found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* State Filter */}
            <div className="relative" ref={stateFilterRef}>
              {appliedStateFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsStateFilterOpen(!isStateFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    <span>{appliedStateFilter}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedStateFilter(null)
                      setTempStateFilter(null)
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear state filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsStateFilterOpen(!isStateFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  State
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* State Dropdown */}
              <AnimatePresence>
                {isStateFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Clear, Search, Apply */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempStateFilter(null)
                        }}
                        disabled={!tempStateFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempStateFilter
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Search Input - Center */}
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={stateSearchQuery}
                          onChange={(e) => setStateSearchQuery(e.target.value)}
                          placeholder="Search"
                          className="w-full px-3 py-2 pl-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedStateFilter(tempStateFilter)
                          setIsStateFilterOpen(false)
                        }}
                        disabled={!tempStateFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempStateFilter
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

                    {/* State List - Scrollable */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      {allStates
                        .filter((state: string) =>
                          state.toLowerCase().includes(stateSearchQuery.toLowerCase())
                        )
                        .map((state: string) => {
                          const isSelected = tempStateFilter === state
                          return (
                            <button
                              key={state}
                              onClick={() => {
                                // Toggle: if already selected, deselect
                                setTempStateFilter(isSelected ? null : state)
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-1 ${
                                isSelected
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                              }`}
                            >
                              <span className="text-base font-medium">
                                {state} <span className="text-neutral-500 dark:text-neutral-400">• United States</span>
                              </span>
                            </button>
                          )
                        })}
                      {allStates.filter((state: string) =>
                        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-center py-4 text-neutral-500 dark:text-neutral-400 text-base">
                          No states found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Surface Filter */}
            <div className="relative" ref={surfaceFilterRef}>
              {appliedSurfaceFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsSurfaceFilterOpen(!isSurfaceFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    <span>{appliedSurfaceFilter}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedSurfaceFilter(null)
                      setTempSurfaceFilter(null)
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear surface filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsSurfaceFilterOpen(!isSurfaceFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Surface
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Surface Dropdown */}
              <AnimatePresence>
                {isSurfaceFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Action Buttons and Tab */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempSurfaceFilter(null)
                        }}
                        disabled={!tempSurfaceFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempSurfaceFilter
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Tab - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button className="px-6 py-2.5 rounded-md text-base font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-default">
                          Surface
                        </button>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedSurfaceFilter(tempSurfaceFilter)
                          setIsSurfaceFilterOpen(false)
                        }}
                        disabled={!tempSurfaceFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempSurfaceFilter
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

                    {/* Surface List */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {surfaceOptions.map((surface) => {
                        const isSelected = tempSurfaceFilter === surface

                        // Get SVG icon for each surface
                        const getSurfaceSvgIcon = () => {
                          const strokeColor = isSelected ? 'currentColor' : '#777'

                          switch (surface) {
                            case 'Road':
                              return (
                                <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                  {/* road edges */}
                                  <path d="M25 14 H95"
                                        stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                                  <path d="M25 26 H95"
                                        stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                                  {/* dashed center line */}
                                  <path d="M28 20 H92"
                                        stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none"
                                        strokeDasharray="6 6" />
                                </svg>
                              )
                            case 'Trail':
                              return (
                                <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                  {/* upper edge */}
                                  <path d="M15 18 C 30 6, 50 6, 65 18 S 100 30, 105 22"
                                        stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                                  {/* lower edge (upper edge + 8px vertical offset) */}
                                  <path d="M15 26 C 30 14, 50 14, 65 26 S 100 38, 105 30"
                                        stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                                </svg>
                              )
                            case 'Track':
                              return (
                                <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="12" y="8" width="96" height="24" rx="12" ry="12"
                                        stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
                                </svg>
                              )
                            case 'Mixed':
                              return (
                                <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                  {/* left side: road */}
                                  <path d="M15 14 H50"
                                        stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
                                  <path d="M15 26 H50"
                                        stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
                                  {/* right side: trail */}
                                  <path d="M65 18 C 75 12, 85 12, 95 18"
                                        stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
                                  <path d="M65 26 C 75 20, 85 20, 95 26"
                                        stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
                                </svg>
                              )
                            default:
                              return null
                          }
                        }

                        return (
                          <button
                            key={surface}
                            onClick={() => {
                              // Toggle: if already selected, deselect
                              setTempSurfaceFilter(isSelected ? null : surface)
                            }}
                            className={`
                              py-4 px-4 rounded-lg text-base font-medium transition-colors flex flex-col items-center gap-1
                              ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                            `}
                          >
                            <span>{surface}</span>
                            {getSurfaceSvgIcon()}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Elevation Filter */}
            <div className="relative" ref={elevationFilterRef}>
              {appliedElevationFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsElevationFilterOpen(!isElevationFilterOpen)}
                    className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    {getElevationFilterText()}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedElevationFilter(null)
                      setTempElevationFilter(null)
                      setAppliedCustomElevationRange({ min: 0, max: 1000 })
                      setTempCustomElevationRange({ min: 0, max: 1000 })
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear elevation filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsElevationFilterOpen(!isElevationFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Elevation
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Elevation Dropdown */}
              <AnimatePresence>
                {isElevationFilterOpen && (
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
                          setTempElevationFilter(null)
                          setTempCustomElevationRange({ min: 0, max: 1000 })
                        }}
                        disabled={!tempElevationFilter && tempCustomElevationRange.min === 0 && tempCustomElevationRange.max === 1000}
                        className={`p-2 rounded-lg transition-colors ${
                          tempElevationFilter || tempCustomElevationRange.min !== 0 || tempCustomElevationRange.max !== 1000
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Tab Toggle - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button
                          onClick={() => setElevationFilterMode('elevation')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            elevationFilterMode === 'elevation'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Elevation
                        </button>
                        <button
                          onClick={() => setElevationFilterMode('custom')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            elevationFilterMode === 'custom'
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
                          setAppliedElevationFilter(tempElevationFilter)
                          setAppliedCustomElevationRange(tempCustomElevationRange)
                          setIsElevationFilterOpen(false)
                        }}
                        disabled={!tempElevationFilter && (tempCustomElevationRange.min === 0 && tempCustomElevationRange.max === 1000)}
                        className={`p-2 rounded-lg transition-colors ${
                          tempElevationFilter || tempCustomElevationRange.min !== 0 || tempCustomElevationRange.max !== 1000
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

                    {/* Tab Content */}
                    {elevationFilterMode === 'elevation' ? (
                      <>
                        {/* Elevation Categories Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {elevationCategories.map((category) => {
                            const isSelected = tempElevationFilter === category.id

                            // Get SVG icon for each category
                            const getSvgIcon = () => {
                              // When selected: white in light mode (dark bg), dark in dark mode (white bg)
                              // When not selected: gray in both modes
                              const strokeColor = isSelected ? 'currentColor' : '#777'

                              switch (category.id) {
                                case 'flat':
                                  return (
                                    <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10 20 Q 40 22 70 20 T 110 20"
                                            stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
                                    </svg>
                                  )
                                case 'rolling':
                                  return (
                                    <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10 22 Q 30 15 50 22 T 90 22 T 110 22"
                                            stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
                                    </svg>
                                  )
                                case 'hilly':
                                  return (
                                    <svg width="60" height="20" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10 25 Q 30 10 50 25 T 90 25 T 110 25"
                                            stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
                                    </svg>
                                  )
                                case 'mountainous':
                                  return (
                                    <svg width="60" height="25" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                                      <path d="M10 55 Q 30 15 50 55 T 90 55 Q 110 15 130 55"
                                            stroke={strokeColor} strokeWidth="12" fill="none" strokeLinecap="round"/>
                                    </svg>
                                  )
                                default:
                                  return null
                              }
                            }

                            return (
                              <button
                                key={category.id}
                                onClick={() => {
                                  // Toggle: if already selected, deselect
                                  setTempElevationFilter(isSelected ? null : category.id)
                                }}
                                className={`
                                  py-4 px-4 rounded-lg text-base font-medium transition-colors flex flex-col items-center gap-1
                                  ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                              >
                                <span>{category.label}</span>
                                {getSvgIcon()}
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
                                {isMinElevationInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    <input
                                      type="number"
                                      value={minElevationInputValue}
                                      onChange={(e) => {
                                        setMinElevationInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const mValue = elevationUnit === 'm' ? value : feetToMeters(value)
                                          // Allow swapping: if new min > max, swap them
                                          setTempCustomElevationRange(prev => {
                                            if (mValue > prev.max) {
                                              return { min: prev.max, max: mValue }
                                            }
                                            return { ...prev, min: mValue }
                                          })
                                          setTempElevationFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMinElevationInputFocused(false)
                                        setMinElevationInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, minElevationInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {minElevationInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        {elevationUnit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMinElevationInputFocused(true)}>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {elevationUnit === 'm' ? Math.round(tempCustomElevationRange.min) : Math.round(metersToFeet(tempCustomElevationRange.min))}
                                    </span>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {elevationUnit}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Max Value Box with ">" prefix (only shown at max 1000m/3280ft) */}
                              <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                                {isMaxElevationInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    {(() => {
                                      const maxValue = elevationUnit === 'm' ? 1000 : 3280
                                      const currentValue = maxElevationInputValue ? Number(maxElevationInputValue) : (elevationUnit === 'm' ? tempCustomElevationRange.max : Math.round(metersToFeet(tempCustomElevationRange.max)))
                                      return currentValue >= maxValue && maxElevationInputValue && (
                                        <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                          &gt;
                                        </span>
                                      )
                                    })()}
                                    <input
                                      type="number"
                                      value={maxElevationInputValue}
                                      onChange={(e) => {
                                        setMaxElevationInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const mValue = elevationUnit === 'm' ? value : feetToMeters(value)
                                          // Allow swapping: if new max < min, swap them
                                          setTempCustomElevationRange(prev => {
                                            if (mValue < prev.min) {
                                              return { min: mValue, max: prev.min }
                                            }
                                            return { ...prev, max: mValue }
                                          })
                                          setTempElevationFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMaxElevationInputFocused(false)
                                        setMaxElevationInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, maxElevationInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {maxElevationInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        {elevationUnit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMaxElevationInputFocused(true)}>
                                    {(() => {
                                      const maxValue = elevationUnit === 'm' ? 1000 : 3280
                                      const currentValue = elevationUnit === 'm' ? tempCustomElevationRange.max : Math.round(metersToFeet(tempCustomElevationRange.max))
                                      return currentValue >= maxValue && (
                                        <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                          &gt;
                                        </span>
                                      )
                                    })()}
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {elevationUnit === 'm' ? Math.round(tempCustomElevationRange.max) : Math.min(3280, Math.round(metersToFeet(tempCustomElevationRange.max)))}
                                    </span>
                                    <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                      {elevationUnit}
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
                                  elevationUnit === 'm' ? tempCustomElevationRange.min : metersToFeet(tempCustomElevationRange.min),
                                  elevationUnit === 'm' ? tempCustomElevationRange.max : metersToFeet(tempCustomElevationRange.max)
                                ]}
                                onChange={(_, newValue) => {
                                  const [min, max] = newValue as number[]
                                  const minM = elevationUnit === 'm' ? min : feetToMeters(min)
                                  const maxM = elevationUnit === 'm' ? max : feetToMeters(max)
                                  setTempCustomElevationRange({ min: minM, max: maxM })
                                  // Only set to 'custom' if not at default min/max
                                  if (minM === 0 && maxM === 1000) {
                                    setTempElevationFilter(null)
                                  } else {
                                    setTempElevationFilter('custom')
                                  }
                                }}
                                min={0}
                                max={elevationUnit === 'm' ? 1000 : 3280}
                                step={elevationUnit === 'm' ? 10 : 50}
                                valueLabelDisplay="off"
                                disableSwap={false}
                                marks={[
                                  { value: elevationUnit === 'm' ? 250 : 820, label: '' },
                                  { value: elevationUnit === 'm' ? 500 : 1640, label: '' },
                                  { value: elevationUnit === 'm' ? 750 : 2460, label: '' }
                                ]}
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
                                    zIndex: 2,
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

                            {/* Elevation Labels Below Slider */}
                            <div className="relative mt-1" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                              {[
                                { valueM: 250, valueFt: 820, label: elevationUnit === 'm' ? '250m' : '820ft' },
                                { valueM: 500, valueFt: 1640, label: elevationUnit === 'm' ? '500m' : '1640ft' },
                                { valueM: 750, valueFt: 2460, label: elevationUnit === 'm' ? '750m' : '2460ft' }
                              ].map((marker, index) => {
                                const maxValue = elevationUnit === 'm' ? 1000 : 3280
                                const markerValue = elevationUnit === 'm' ? marker.valueM : marker.valueFt
                                const position = (markerValue / maxValue) * 100

                                return (
                                  <div
                                    key={index}
                                    className="absolute flex flex-col items-center"
                                    style={{
                                      left: `${position}%`,
                                      transform: 'translateX(-50%)',
                                      top: 0
                                    }}
                                  >
                                    <p className="text-sm font-medium text-center leading-tight text-neutral-400 dark:text-neutral-500">
                                      {marker.label}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Unit Toggle Below Elevation Anchors */}
                          <div className="flex items-center justify-center gap-2 mt-12 relative z-50">
                            <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-0.5">
                              <button
                                onClick={() => setElevationUnit('m')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                  elevationUnit === 'm'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                m
                              </button>
                              <button
                                onClick={() => setElevationUnit('ft')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                  elevationUnit === 'ft'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                ft
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

            {/* Temperature Filter */}
            <div className="relative" ref={temperatureFilterRef}>
              {appliedTemperatureFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsTemperatureFilterOpen(!isTemperatureFilterOpen)}
                    className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    {getTemperatureFilterText()}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedTemperatureFilter(null)
                      setTempTemperatureFilter(null)
                      setAppliedCustomTemperatureRange({ min: 0, max: 35 })
                      setTempCustomTemperatureRange({ min: 0, max: 35 })
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear temperature filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsTemperatureFilterOpen(!isTemperatureFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Temperature
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Temperature Dropdown */}
              <AnimatePresence>
                {isTemperatureFilterOpen && (
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
                          setTempTemperatureFilter(null)
                          setTempCustomTemperatureRange({ min: 0, max: 35 })
                        }}
                        disabled={!tempTemperatureFilter && tempCustomTemperatureRange.min === 0 && tempCustomTemperatureRange.max === 35}
                        className={`p-2 rounded-lg transition-colors ${
                          tempTemperatureFilter || tempCustomTemperatureRange.min !== 0 || tempCustomTemperatureRange.max !== 35
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Tab Toggle - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button
                          onClick={() => setTemperatureFilterMode('temperature')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            temperatureFilterMode === 'temperature'
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          Temperature
                        </button>
                        <button
                          onClick={() => setTemperatureFilterMode('custom')}
                          className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                            temperatureFilterMode === 'custom'
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
                          setAppliedTemperatureFilter(tempTemperatureFilter)
                          setAppliedCustomTemperatureRange(tempCustomTemperatureRange)
                          setIsTemperatureFilterOpen(false)
                        }}
                        disabled={!tempTemperatureFilter && (tempCustomTemperatureRange.min === 0 && tempCustomTemperatureRange.max === 35)}
                        className={`p-2 rounded-lg transition-colors ${
                          tempTemperatureFilter || tempCustomTemperatureRange.min !== 0 || tempCustomTemperatureRange.max !== 35
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

                    {/* Tab Content */}
                    {temperatureFilterMode === 'temperature' ? (
                      <>
                        {/* Temperature Categories Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {temperatureCategories.map((category) => {
                            const isSelected = tempTemperatureFilter === category.id

                            return (
                              <button
                                key={category.id}
                                onClick={() => {
                                  // Toggle: if already selected, deselect
                                  setTempTemperatureFilter(isSelected ? null : category.id)
                                }}
                                className={`
                                  py-4 px-4 rounded-lg text-base font-medium transition-colors flex flex-col items-center gap-2
                                  ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                              >
                                <span>{category.label}</span>
                                {/* Temperature Gauge */}
                                <div className="w-32 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${category.fillPercent}%`,
                                      backgroundColor: category.color
                                    }}
                                  />
                                </div>
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
                                {isMinTemperatureInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    <input
                                      type="number"
                                      value={minTemperatureInputValue}
                                      onChange={(e) => {
                                        setMinTemperatureInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const cValue = temperatureUnit === 'c' ? value : fahrenheitToCelsius(value)
                                          // Allow swapping: if new min > max, swap them
                                          setTempCustomTemperatureRange(prev => {
                                            if (cValue > prev.max) {
                                              return { min: prev.max, max: cValue }
                                            }
                                            return { ...prev, min: cValue }
                                          })
                                          setTempTemperatureFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMinTemperatureInputFocused(false)
                                        setMinTemperatureInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, minTemperatureInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {minTemperatureInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        °{temperatureUnit.toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsMinTemperatureInputFocused(true)}
                                    className="flex items-center justify-center gap-0 w-full text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                  >
                                    {(() => {
                                      const minValue = temperatureUnit === 'c' ? 0 : 32
                                      const displayMin = temperatureUnit === 'c'
                                        ? tempCustomTemperatureRange.min
                                        : celsiusToFahrenheit(tempCustomTemperatureRange.min)

                                      if (displayMin <= minValue) {
                                        return `<${Math.round(minValue)}°${temperatureUnit.toUpperCase()}`
                                      }
                                      return `${Math.round(displayMin)}°${temperatureUnit.toUpperCase()}`
                                    })()}
                                  </button>
                                )}
                              </div>

                              {/* Max Value Box */}
                              <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                                {isMaxTemperatureInputFocused ? (
                                  <div className="flex items-center justify-center gap-0 w-full">
                                    <input
                                      type="number"
                                      value={maxTemperatureInputValue}
                                      onChange={(e) => {
                                        setMaxTemperatureInputValue(e.target.value)
                                        const value = Number(e.target.value)
                                        if (!isNaN(value) && e.target.value !== '') {
                                          const cValue = temperatureUnit === 'c' ? value : fahrenheitToCelsius(value)
                                          // Allow swapping: if new max < min, swap them
                                          setTempCustomTemperatureRange(prev => {
                                            if (cValue < prev.min) {
                                              return { min: cValue, max: prev.min }
                                            }
                                            return { ...prev, max: cValue }
                                          })
                                          setTempTemperatureFilter('custom')
                                        }
                                      }}
                                      onBlur={() => {
                                        setIsMaxTemperatureInputFocused(false)
                                        setMaxTemperatureInputValue('')
                                      }}
                                      autoFocus
                                      className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                      style={{ width: `${Math.max(1, maxTemperatureInputValue.length)}ch` }}
                                      placeholder=""
                                    />
                                    {maxTemperatureInputValue && (
                                      <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                        °{temperatureUnit.toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsMaxTemperatureInputFocused(true)}
                                    className="flex items-center justify-center gap-0 w-full text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                  >
                                    {(() => {
                                      const maxValue = temperatureUnit === 'c' ? 35 : 95
                                      const displayMax = temperatureUnit === 'c'
                                        ? tempCustomTemperatureRange.max
                                        : celsiusToFahrenheit(tempCustomTemperatureRange.max)

                                      if (displayMax >= maxValue) {
                                        return `>${Math.round(maxValue)}°${temperatureUnit.toUpperCase()}`
                                      }
                                      return `${Math.round(displayMax)}°${temperatureUnit.toUpperCase()}`
                                    })()}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Slider */}
                          <Box sx={{ width: '100%', px: 1.5 }}>
                            <Slider
                              value={[
                                temperatureUnit === 'c' ? tempCustomTemperatureRange.min : celsiusToFahrenheit(tempCustomTemperatureRange.min),
                                temperatureUnit === 'c' ? tempCustomTemperatureRange.max : celsiusToFahrenheit(tempCustomTemperatureRange.max)
                              ]}
                              onChange={(_, newValue) => {
                                const [min, max] = newValue as number[]
                                const minC = temperatureUnit === 'c' ? min : fahrenheitToCelsius(min)
                                const maxC = temperatureUnit === 'c' ? max : fahrenheitToCelsius(max)
                                setTempCustomTemperatureRange({ min: minC, max: maxC })
                                if (minC === 0 && maxC === 35) {
                                  setTempTemperatureFilter(null)
                                } else {
                                  setTempTemperatureFilter('custom')
                                }
                              }}
                              min={temperatureUnit === 'c' ? 0 : 32}
                              max={temperatureUnit === 'c' ? 35 : 95}
                              step={temperatureUnit === 'c' ? 1 : 2}
                              valueLabelDisplay="off"
                              disableSwap={false}
                              marks={[
                                { value: temperatureUnit === 'c' ? 9 : 48, label: '' },
                                { value: temperatureUnit === 'c' ? 18 : 64, label: '' },
                                { value: temperatureUnit === 'c' ? 27 : 81, label: '' },
                              ]}
                              sx={{
                                color: '#1A1A1A',
                                height: 24,
                                padding: 0,
                                '& .MuiSlider-rail': {
                                  height: 24,
                                  borderRadius: 12,
                                  backgroundColor: '#404040',
                                  opacity: 1,
                                },
                                '& .MuiSlider-track': {
                                  height: 24,
                                  borderRadius: 0,
                                  backgroundColor: '#E6E6E6',
                                  border: 'none',
                                },
                                '& .MuiSlider-thumb': {
                                  height: 24,
                                  width: 24,
                                  backgroundColor: '#FFFFFF',
                                  border: 'none',
                                  boxShadow: 'none',
                                  zIndex: 2,
                                },
                                '& .MuiSlider-mark': {
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: 'transparent',
                                  border: '1px dashed #A3A3A3',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  opacity: 1,
                                  zIndex: 3,
                                },
                              }}
                            />
                          </Box>

                          {/* Temperature Labels Below Slider */}
                          <div className="relative mt-1" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                            {temperatureUnit === 'c' ? (
                              <>
                                {[
                                  { valueC: 9, label: '9°C' },
                                  { valueC: 18, label: '18°C' },
                                  { valueC: 27, label: '27°C' }
                                ].map((marker, index) => {
                                  const maxValue = 35
                                  const position = (marker.valueC / maxValue) * 100

                                  return (
                                    <div
                                      key={index}
                                      className="absolute text-xs text-neutral-600 dark:text-neutral-400 font-medium"
                                      style={{
                                        left: `${position}%`,
                                        transform: 'translateX(-50%)',
                                      }}
                                    >
                                      {marker.label}
                                    </div>
                                  )
                                })}
                              </>
                            ) : (
                              <>
                                {[
                                  { valueF: 48, label: '48°F' },
                                  { valueF: 64, label: '64°F' },
                                  { valueF: 81, label: '81°F' }
                                ].map((marker, index) => {
                                  const maxValue = 95
                                  const minValue = 32
                                  const position = ((marker.valueF - minValue) / (maxValue - minValue)) * 100

                                  return (
                                    <div
                                      key={index}
                                      className="absolute text-xs text-neutral-600 dark:text-neutral-400 font-medium"
                                      style={{
                                        left: `${position}%`,
                                        transform: 'translateX(-50%)',
                                      }}
                                    >
                                      {marker.label}
                                    </div>
                                  )
                                })}
                              </>
                            )}
                          </div>

                          {/* Unit Toggle Below Temperature Anchors */}
                          <div className="flex items-center justify-center gap-2 mt-12 relative z-50">
                            <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-0.5">
                              <button
                                onClick={() => setTemperatureUnit('c')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                  temperatureUnit === 'c'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                °C
                              </button>
                              <button
                                onClick={() => setTemperatureUnit('f')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                  temperatureUnit === 'f'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                °F
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

            {/* Price Filter */}
            <div className="relative" ref={priceFilterRef}>
              {(appliedPriceRange.min > 0 || appliedPriceRange.max < 500) ? (
                // Filter is active - show price range with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    <span>{formatPrice(appliedPriceRange.min, selectedCurrency)} - {formatPrice(appliedPriceRange.max, selectedCurrency)}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedPriceRange({ min: 0, max: 500 })
                      setTempPriceRange({ min: 0, max: 500 })
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear price filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Price
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Price Dropdown */}
              <AnimatePresence>
                {isPriceFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Action Buttons and Tab */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempPriceRange({ min: 0, max: 500 })
                        }}
                        disabled={tempPriceRange.min === 0 && tempPriceRange.max === 500}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempPriceRange.min !== 0 || tempPriceRange.max !== 500
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Tab - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button className="px-6 py-2.5 rounded-md text-base font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-default">
                          Price
                        </button>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedPriceRange(tempPriceRange)
                          setSelectedCurrency(tempSelectedCurrency)
                          setIsPriceFilterOpen(false)
                        }}
                        className="p-2 rounded-lg transition-colors flex-shrink-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 cursor-pointer"
                        aria-label="Apply filter"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Price Range Slider */}
                    <div className="mb-6">
                      {/* Min/Max Input Fields */}
                      <div className="px-3 mb-6">
                        <div className="flex items-center justify-between" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                          {/* Min Value Box */}
                          <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                            {isMinPriceInputFocused ? (
                              <div className="flex items-center justify-center gap-0 w-full">
                                <input
                                  type="number"
                                  value={minPriceInputValue}
                                  onChange={(e) => {
                                    setMinPriceInputValue(e.target.value)
                                    const value = Number(e.target.value)
                                    if (!isNaN(value) && e.target.value !== '') {
                                      setTempPriceRange({ ...tempPriceRange, min: Math.min(value, tempPriceRange.max) })
                                    }
                                  }}
                                  onBlur={() => {
                                    setIsMinPriceInputFocused(false)
                                    setMinPriceInputValue('')
                                  }}
                                  autoFocus
                                  className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                  style={{ width: `${Math.max(1, minPriceInputValue.length)}ch` }}
                                  placeholder=""
                                />
                                {minPriceInputValue && (
                                  <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                    {formatPrice(0, tempSelectedCurrency).replace(/[0-9]/g, '')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMinPriceInputFocused(true)}>
                                <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                  {formatPrice(tempPriceRange.min, tempSelectedCurrency)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Max Value Box */}
                          <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 w-[80px]">
                            {isMaxPriceInputFocused ? (
                              <div className="flex items-center justify-center gap-0 w-full">
                                <input
                                  type="number"
                                  value={maxPriceInputValue}
                                  onChange={(e) => {
                                    setMaxPriceInputValue(e.target.value)
                                    const value = Number(e.target.value)
                                    if (!isNaN(value) && e.target.value !== '') {
                                      setTempPriceRange({ ...tempPriceRange, max: Math.max(value, tempPriceRange.min) })
                                    }
                                  }}
                                  onBlur={() => {
                                    setIsMaxPriceInputFocused(false)
                                    setMaxPriceInputValue('')
                                  }}
                                  autoFocus
                                  className="flex-shrink-0 w-auto min-w-0 bg-transparent text-neutral-900 dark:text-white text-sm font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                  style={{ width: `${Math.max(1, maxPriceInputValue.length)}ch` }}
                                  placeholder=""
                                />
                                {maxPriceInputValue && (
                                  <span className="text-neutral-900 dark:text-white text-sm font-medium flex-shrink-0">
                                    {formatPrice(0, tempSelectedCurrency).replace(/[0-9]/g, '')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-0 cursor-pointer" onClick={() => setIsMaxPriceInputFocused(true)}>
                                <span className="text-neutral-900 dark:text-white text-sm font-medium">
                                  {tempPriceRange.max >= 500 ? `${formatPrice(500, tempSelectedCurrency)}+` : formatPrice(tempPriceRange.max, tempSelectedCurrency)}
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
                            value={[tempPriceRange.min, tempPriceRange.max]}
                            onChange={(_, newValue) => {
                              const [min, max] = newValue as number[]
                              setTempPriceRange({ min, max })
                            }}
                            onChangeCommitted={(_, newValue) => {
                              const [min, max] = newValue as number[]
                              const snapThreshold = 15
                              const marks = [0, 125, 250, 375, 500]

                              // Snap min to nearest mark if within threshold
                              let snappedMin = min
                              for (const mark of marks) {
                                if (Math.abs(min - mark) <= snapThreshold) {
                                  snappedMin = mark
                                  break
                                }
                              }

                              // Snap max to nearest mark if within threshold
                              let snappedMax = max
                              for (const mark of marks) {
                                if (Math.abs(max - mark) <= snapThreshold) {
                                  snappedMax = mark
                                  break
                                }
                              }

                              setTempPriceRange({ min: snappedMin, max: snappedMax })
                            }}
                            min={0}
                            max={500}
                            step={10}
                            valueLabelDisplay="off"
                            disableSwap={false}
                            marks={[
                              { value: 125, label: '' },
                              { value: 250, label: '' },
                              { value: 375, label: '' }
                            ]}
                            sx={{
                              color: '#1A1A1A',
                              height: 24,
                              padding: 0,
                              '& .MuiSlider-rail': {
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: '#404040',
                                opacity: 1,
                                left: 0,
                                right: 0,
                                width: '100%',
                              },
                              '& .MuiSlider-track': {
                                height: 24,
                                borderRadius: 0,
                                backgroundColor: '#E6E6E6',
                                border: 'none',
                              },
                              '& .MuiSlider-thumb': {
                                height: 24,
                                width: 24,
                                backgroundColor: '#FFFFFF',
                                border: 'none',
                                boxShadow: 'none',
                                zIndex: 2,
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
                                border: '1px dashed #A3A3A3',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                opacity: 1,
                                zIndex: 3,
                                pointerEvents: 'none',
                                '&.MuiSlider-markActive': {
                                  backgroundColor: 'transparent',
                                  border: '1px dashed #A3A3A3',
                                },
                              },
                            }}
                          />
                        </Box>

                        {/* Price Labels Below Slider */}
                        <div className="relative mt-1" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                          {[
                            { value: 125, label: formatPrice(125, tempSelectedCurrency) },
                            { value: 250, label: formatPrice(250, tempSelectedCurrency) },
                            { value: 375, label: formatPrice(375, tempSelectedCurrency) }
                          ].map((marker, index) => {
                            const totalRange = 500
                            const position = (marker.value / totalRange) * 100

                            return (
                              <div
                                key={index}
                                className="absolute text-xs text-neutral-600 dark:text-neutral-400 font-medium"
                                style={{
                                  left: `${position}%`,
                                  transform: 'translateX(-50%)',
                                }}
                              >
                                {marker.label}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Currency Toggle Below Slider */}
                      <div className="flex items-center justify-center gap-2 mt-12">
                        <select
                          value={tempSelectedCurrency}
                          onChange={(e) => setTempSelectedCurrency(e.target.value)}
                          className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tags Filter */}
            <div className="relative" ref={tagsFilterRef}>
              {appliedTagsFilter ? (
                // Filter is active - show filter value with X button
                <div className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium">
                  <button
                    onClick={() => setIsTagsFilterOpen(!isTagsFilterOpen)}
                    className="flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    <span>{appliedTagsFilter}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppliedTagsFilter('')
                      setTempTagsFilter('')
                    }}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Clear tags filter"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // No filter - show default button
                <button
                  onClick={() => setIsTagsFilterOpen(!isTagsFilterOpen)}
                  className="flex items-center gap-2 px-4 h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Tags
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Tags Dropdown */}
              <AnimatePresence>
                {isTagsFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 min-w-[600px]"
                  >
                    {/* Top Bar: Action Buttons and Tab */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Clear Button - Left */}
                      <button
                        onClick={() => {
                          setTempTagsFilter('')
                        }}
                        disabled={!tempTagsFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempTagsFilter
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer'
                            : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        }`}
                        aria-label="Clear selection"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Tab - Center */}
                      <div className="inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 relative z-10">
                        <button className="px-6 py-2.5 rounded-md text-base font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-default">
                          Tags
                        </button>
                      </div>

                      {/* Apply Button - Right */}
                      <button
                        onClick={() => {
                          setAppliedTagsFilter(tempTagsFilter)
                          setIsTagsFilterOpen(false)
                        }}
                        disabled={!tempTagsFilter}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          tempTagsFilter
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

                    {/* Tag Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {availableTags.map((tag) => {
                        const isSelected = tempTagsFilter === tag

                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              // Toggle: if already selected, deselect
                              setTempTagsFilter(isSelected ? '' : tag)
                            }}
                            className={`
                              h-[84px] px-4 rounded-lg text-base font-medium transition-colors flex flex-col items-center justify-center
                              ${isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}
                            `}
                          >
                            <span className="text-center">{tag}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Race Cards Grid */}
        {isFiltering ? (
          // Show skeleton cards while filtering
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex flex-col">
                  {/* Image Skeleton */}
                  <div className="relative w-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div style={{ paddingBottom: '65%' }} className="relative bg-neutral-200 dark:bg-neutral-800"></div>
                    </div>
                  </div>
                  {/* Content Skeleton */}
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-b-lg px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                      </div>
                      <div className="flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16 h-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRaces.length === 0 ? (
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
