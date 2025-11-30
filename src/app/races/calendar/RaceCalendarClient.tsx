'use client'

import { useState, useMemo, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MoveUpRight, MoveDownRight, Thermometer, Clock, Banknote, Users, Medal, Star, Info, Maximize2 } from 'lucide-react'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'
import { AnimatePresence, motion } from 'framer-motion'
import type { RaceGuide } from '../page'

const NAVBAR_HEIGHT = 48
const FOOTER_HEIGHT = 37
const WINDOW_TOP_MARGIN = 24
const WINDOW_BOTTOM_MARGIN = 24

const getEffectiveMargins = (viewportHeight: number) => {
  const spaceWithMargins =
    viewportHeight - NAVBAR_HEIGHT - FOOTER_HEIGHT - WINDOW_TOP_MARGIN - WINDOW_BOTTOM_MARGIN
  if (spaceWithMargins > 0) {
    return {
      topMargin: WINDOW_TOP_MARGIN,
      bottomMargin: WINDOW_BOTTOM_MARGIN,
    }
  }
  return { topMargin: 0, bottomMargin: 0 }
}

const clampHeightToViewport = (desiredHeight: number, viewportHeight: number) => {
  const { topMargin, bottomMargin } = getEffectiveMargins(viewportHeight)
  const maxHeight = Math.max(
    0,
    viewportHeight - NAVBAR_HEIGHT - FOOTER_HEIGHT - topMargin - bottomMargin
  )
  return Math.min(desiredHeight, maxHeight || desiredHeight)
}

const clampYToViewport = (desiredY: number, height: number, viewportHeight: number) => {
  const { topMargin, bottomMargin } = getEffectiveMargins(viewportHeight)
  const minY = NAVBAR_HEIGHT + topMargin
  const maxY = viewportHeight - FOOTER_HEIGHT - bottomMargin - height
  if (maxY < minY) return minY
  return Math.min(Math.max(desiredY, minY), maxY)
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  slug: string
  city?: string
  country?: string
  raceCategoryName?: string
}

interface RaceWindow {
  id: string
  race: RaceGuide
  isMinimized: boolean
  isFullscreen: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  isSnapped?: 'left' | 'right' | null
  previousState?: {
    position: { x: number; y: number }
    size: { width: number; height: number }
  }
}

export function RaceCalendarClient({ races }: { races: RaceGuide[] }) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<RaceWindow[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | null>(null)
  const [showLegend, setShowLegend] = useState(false)
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  // Convert races to FullCalendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return races
      .map((race) => ({
        id: race._id,
        title: race.title,
        start: race.eventDate, // Keep full ISO timestamp for sorting
        slug: race.slug.current,
        city: race.city,
        country: race.country,
        raceCategoryName: race.raceCategoryName,
      }))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // Sort by date/time
  }, [races])

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-resize windows to fit content on initial render
  useEffect(() => {
    if (isMobile || typeof window === 'undefined') return

    const timers: NodeJS.Timeout[] = []

    openWindows.forEach(windowInstance => {
      if (!windowInstance.isFullscreen && !windowInstance.isSnapped) {
        // Wait for DOM to settle and images to load
        const timer = setTimeout(() => {
          const windowEl = document.querySelector(`[data-window-id="${windowInstance.id}"]`)
          if (windowEl) {
            const viewportHeight = globalThis.window.innerHeight
            const { topMargin, bottomMargin } = getEffectiveMargins(viewportHeight)

            // Get the actual rendered height of the entire window
            const windowHeight = windowEl.scrollHeight
            const windowTop = Math.max(windowInstance.position.y, NAVBAR_HEIGHT + topMargin)
            const maxHeight = Math.max(
              0,
              viewportHeight - FOOTER_HEIGHT - bottomMargin - windowTop
            )
            if (maxHeight <= 0) return

            const optimalHeight = Math.min(windowHeight, maxHeight)

            // Only update if significantly different (avoid infinite loops)
            if (Math.abs(windowInstance.size.height - optimalHeight) > 10) {
              setOpenWindows(prev =>
                prev.map(w =>
                  w.id === windowInstance.id && !w.isFullscreen && !w.isSnapped
                    ? { ...w, size: { ...w.size, height: optimalHeight } }
                    : w
                )
              )
            }
          }
        }, 200) // Increased timeout to let images load

        timers.push(timer)
      }
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [openWindows.map(w => `${w.id}-${w.size.height}-${w.position.y}`).join('|'), isMobile])

  const handleEventClick = (info: EventClickArg) => {
    const race = races.find(r => r._id === info.event.id)
    if (!race) return

    // On mobile, only allow one fullscreen window
    if (isMobile) {
      const newWindow = {
        id: race._id,
        race,
        isMinimized: false,
        isFullscreen: true,
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight - 48 - 37 },
        isSnapped: null
      }
      setOpenWindows([newWindow])
      setActiveWindowId(newWindow.id)
      return
    }

    // On desktop, check if window already exists
    const existingWindow = openWindows.find(w => w.id === race._id)
    if (existingWindow) {
      // Bring to front by moving to end of array
      setOpenWindows(prev => [...prev.filter(w => w.id !== race._id), existingWindow])
      setActiveWindowId(existingWindow.id)
      return
    }

    // Create new window with content-fit size
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const { topMargin, bottomMargin } = getEffectiveMargins(viewportHeight)
    const heightBudget =
      viewportHeight - NAVBAR_HEIGHT - FOOTER_HEIGHT - topMargin - bottomMargin

    // Fixed width, height will be calculated from content
    const windowWidth = 850

    // Estimate content height (this will be refined after render)
    // Image: 425px (50% of 850px width), Stats: ~450px, Padding: ~50px
    const estimatedContentHeight = 925
    const provisionalHeight = Math.min(estimatedContentHeight, Math.max(0, heightBudget))
    const windowHeight = clampHeightToViewport(provisionalHeight || estimatedContentHeight, viewportHeight)

    // Center the window with slight offset for multiple windows
    const offset = openWindows.length * 40
    const centerX = Math.max(40, Math.min((viewportWidth - windowWidth) / 2 + offset, viewportWidth - windowWidth - 40))
    const desiredY = NAVBAR_HEIGHT + topMargin + offset
    const centerY = clampYToViewport(desiredY, windowHeight, viewportHeight)

    const newWindow = {
      id: race._id,
      race,
      isMinimized: false,
      isFullscreen: false,
      position: { x: centerX, y: centerY },
      size: { width: windowWidth, height: windowHeight },
      isSnapped: null
    }

    setOpenWindows(prev => [...prev, newWindow])
    setActiveWindowId(newWindow.id)
  }

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ))
  }

  const restoreWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id === id) {
        // If window was snapped, reset to a safe floating position
        if (w.isSnapped) {
          const restoredSize = w.previousState?.size || { width: 850, height: 700 }
          const safeY = typeof window !== 'undefined'
            ? clampYToViewport(100, restoredSize.height, window.innerHeight)
            : 100
          return {
            ...w,
            isMinimized: false,
            isSnapped: null,
            position: { x: 100, y: safeY },
            size: restoredSize
          }
        }
        // If position is at 0,0 (under navbar), move to safe position
        if (w.position.x === 0 && w.position.y === 0) {
          const safeHeight = w.size.height
          const safeY = typeof window !== 'undefined'
            ? clampYToViewport(100, safeHeight, window.innerHeight)
            : 100
          return {
            ...w,
            isMinimized: false,
            position: { x: 100, y: safeY },
            size: w.size || { width: 850, height: 700 }
          }
        }
        if (typeof window !== 'undefined') {
          const adjustedY = clampYToViewport(w.position.y, w.size.height, window.innerHeight)
          if (adjustedY !== w.position.y) {
            return { ...w, isMinimized: false, position: { ...w.position, y: adjustedY } }
          }
        }
        return { ...w, isMinimized: false }
      }
      return w
    }).sort((a) => a.id === id ? 1 : -1)) // Bring to front
  }

  const toggleFullscreen = (id: string, isOptionClick: boolean = false) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id !== id) return w

      // Option + Click: Zoom to optimal size
      if (isOptionClick) {
        if (w.isFullscreen) {
          // Exit fullscreen and zoom to optimal size
          return {
            ...w,
            isFullscreen: false,
            position: w.previousState?.position || { x: 100, y: 100 },
            size: { width: 850, height: 700 } // Optimal size
          }
        } else {
          // Zoom to optimal size
          return {
            ...w,
            previousState: { position: w.position, size: w.size },
            size: { width: 850, height: 700 }
          }
        }
      }

      // Regular click: Toggle fullscreen
      if (w.isFullscreen) {
        // Exit fullscreen, restore previous state
        return {
          ...w,
          isFullscreen: false,
          position: w.previousState?.position || { x: 100, y: 100 },
          size: w.previousState?.size || { width: 850, height: 700 },
          isSnapped: null
        }
      } else {
        // Enter fullscreen, save current state
        return {
          ...w,
          isFullscreen: true,
          previousState: { position: w.position, size: w.size },
          isSnapped: null
        }
      }
    }))
  }

  const bringToFront = (id: string) => {
    setOpenWindows(prev => {
      const window = prev.find(w => w.id === id)
      if (!window) return prev
      return [...prev.filter(w => w.id !== id), window]
    })
    setActiveWindowId(id)
  }

  // Window resize handler - Direct DOM manipulation for performance
  const handleResizeStart = (id: string, direction: string, e: React.MouseEvent) => {
    if (isMobile) return
    e.stopPropagation()

    const raceWindow = openWindows.find(w => w.id === id)
    if (!raceWindow || raceWindow.isFullscreen || raceWindow.isSnapped) return

    // Bring window to front when starting resize
    setActiveWindowId(id)

    const windowEl = document.querySelector(`[data-window-id="${id}"]`) as HTMLElement
    if (!windowEl) return

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = raceWindow.size.width
    const startHeight = raceWindow.size.height
    const startPosX = raceWindow.position.x
    const startPosY = raceWindow.position.y

    const MIN_WIDTH = 600
    const MIN_HEIGHT = 500

    // Disable transitions during resize for instant feedback
    windowEl.style.transition = 'none'

    const handleResize = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      // Handle different resize directions
      if (direction.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX)
      }
      if (direction.includes('w')) {
        const potentialWidth = startWidth - deltaX
        if (potentialWidth >= MIN_WIDTH) {
          newWidth = potentialWidth
          newX = startPosX + deltaX
        }
      }
      if (direction.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY)
      }
      if (direction.includes('n')) {
        const potentialHeight = startHeight - deltaY
        if (potentialHeight >= 0) {
          newHeight = potentialHeight
          newY = startPosY + deltaY
        }
      }

      const viewportHeight = window.innerHeight
      const { topMargin, bottomMargin } = getEffectiveMargins(viewportHeight)
      const minTop = NAVBAR_HEIGHT + topMargin
      newY = Math.max(newY, minTop)
      const maxHeightAtPosition = Math.max(
        0,
        viewportHeight - FOOTER_HEIGHT - bottomMargin - newY
      )
      const minHeightAtPosition = Math.min(MIN_HEIGHT, maxHeightAtPosition || MIN_HEIGHT)
      newHeight = Math.max(
        minHeightAtPosition,
        Math.min(newHeight, maxHeightAtPosition || newHeight)
      )
      newY = clampYToViewport(newY, newHeight, viewportHeight)

      // Direct DOM manipulation for instant feedback
      windowEl.style.width = `${newWidth}px`
      windowEl.style.height = `${newHeight}px`
      windowEl.style.left = `${newX}px`
      windowEl.style.top = `${newY}px`
    }

    const handleResizeEnd = () => {
      // Re-enable transitions
      windowEl.style.transition = ''

      // Get final dimensions from DOM
      const finalWidth = parseInt(windowEl.style.width)
      const finalHeight = parseInt(windowEl.style.height)
      const finalX = parseInt(windowEl.style.left)
      const finalY = parseInt(windowEl.style.top)

      // Update React state to match DOM
      setOpenWindows(prev =>
        prev.map(w =>
          w.id === id
            ? {
                ...w,
                size: { width: finalWidth, height: finalHeight },
                position: { x: finalX, y: finalY }
              }
            : w
        )
      )

      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', handleResizeEnd)
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  // Double-click title bar to zoom
  const handleTitleBarDoubleClick = (id: string) => {
    if (isMobile) return
    toggleFullscreen(id, true) // Use zoom behavior (Option+click)
  }

  // Custom drag handling with snap zones and magnetism
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    if (isMobile) return

    const raceWindow = openWindows.find(w => w.id === id)
    if (!raceWindow) return

    // Bring to front when starting drag
    setActiveWindowId(id)

    // If window is snapped, unsnap it and position under cursor
    const wasSnapped = raceWindow.isSnapped
    if (wasSnapped) {
      const restoredSize = raceWindow.previousState?.size || { width: 850, height: 700 }
      // Position window so title bar is under mouse cursor
      const newX = e.clientX - restoredSize.width / 2
      const newY = e.clientY - 20 // 20px from top of title bar
      const clampedY = typeof window !== 'undefined'
        ? clampYToViewport(newY, restoredSize.height, window.innerHeight)
        : newY

      setOpenWindows(prev =>
        prev.map(w => w.id === id ? {
          ...w,
          isSnapped: null,
          size: restoredSize,
          position: { x: Math.max(0, newX), y: clampedY }
        } : w)
      )
      return // Let the user start dragging from current mouse position next time
    }

    const startX = e.clientX - raceWindow.position.x
    const startY = e.clientY - raceWindow.position.y

    const SNAP_THRESHOLD = 50 // pixels from edge to trigger snap
    const MAGNETIC_THRESHOLD = 8 // pixels for edge magnetism

    // Store current snap zone in a ref to access in handleDragEnd
    let currentSnapZone: 'left' | 'right' | null = null

    const handleDrag = (moveEvent: MouseEvent) => {
      let x = moveEvent.clientX - startX
      let y = moveEvent.clientY - startY

      // Get actual window dimensions
      const currentWindow = raceWindow
      const windowWidth = currentWindow.size.width
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const { topMargin } = getEffectiveMargins(viewportHeight)

      // Constrain to area between navbar and footer
      const EDGE_BUFFER = 20 // pixels allowed beyond left/right edges
      const minX = -EDGE_BUFFER
      const minY = NAVBAR_HEIGHT + topMargin // Never go under navbar
      const maxX = viewportWidth - windowWidth + EDGE_BUFFER

      // Constrain with buffer
      x = Math.max(minX, Math.min(x, maxX))
      // For Y: keep title bar visible (above navbar), no max constraint to allow tall windows
      y = Math.max(minY, y)

      // Apply edge magnetism (but not in snap zones)
      if (moveEvent.clientX >= SNAP_THRESHOLD && moveEvent.clientX <= viewportWidth - SNAP_THRESHOLD) {
        if (Math.abs(x) < MAGNETIC_THRESHOLD) x = 0
        if (Math.abs(x - (viewportWidth - windowWidth)) < MAGNETIC_THRESHOLD) {
          x = viewportWidth - windowWidth
        }
        if (Math.abs(y - (NAVBAR_HEIGHT + topMargin)) < MAGNETIC_THRESHOLD) y = NAVBAR_HEIGHT + topMargin
      }

      // Detect snap zones (only left and right) - only show preview while dragging near edges
      if (moveEvent.clientX < SNAP_THRESHOLD) {
        currentSnapZone = 'left'
      } else if (moveEvent.clientX > viewportWidth - SNAP_THRESHOLD) {
        currentSnapZone = 'right'
      } else {
        currentSnapZone = null
      }

      setSnapPreview(currentSnapZone)

      // Update position during drag (keeping existing snap state)
      setOpenWindows(prev =>
        prev.map(w =>
          w.id === id
            ? { ...w, position: { x, y } }
            : w
        )
      )
    }

    const handleDragEnd = () => {
      // Use the captured snap zone value
      if (currentSnapZone) {
        setOpenWindows(prev =>
          prev.map(w => {
            if (w.id === id) {
              // Save current state before snapping
              return {
                ...w,
                isSnapped: currentSnapZone,
                position: { x: 0, y: 0 },
                previousState: {
                  position: w.position,
                  size: w.size
                }
              }
            }
            return w
          })
        )
      } else {
        // Not in snap zone, ensure window is unsnapped
        setOpenWindows(prev =>
          prev.map(w =>
            w.id === id && w.isSnapped
              ? { ...w, isSnapped: null }
              : w
          )
        )
      }

      setSnapPreview(null)
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
  }

  // Apply background color to event element based on World Athletics Label
  const handleEventDidMount = (info: any) => {
    const race = races.find(r => r._id === info.event.id)
    if (!race) return

    // Determine World Athletics Label background color (slightly muted versions)
    let backgroundColor = ''
    if (race.tags?.includes('World Athletics Platinum Label')) {
      backgroundColor = 'rgba(204, 204, 204, 0.3)' // Muted platinum
    } else if (race.tags?.includes('World Athletics Gold Label')) {
      backgroundColor = 'rgba(255, 217, 0, 0.25)' // Muted gold
    } else if (race.tags?.includes('World Athletics Elite Label')) {
      backgroundColor = 'rgba(158, 140, 196, 0.25)' // Muted purple
    } else if (race.tags?.includes('World Athletics Label')) {
      backgroundColor = 'rgba(166, 251, 101, 0.25)' // Muted green
    }

    if (backgroundColor) {
      info.el.style.backgroundColor = backgroundColor
    }
  }

  // Custom event content
  const renderEventContent = (eventInfo: any) => {
    // Get the race from extendedProps to access the full eventDate
    const race = races.find(r => r._id === eventInfo.event.id)

    if (!race) {
      return <div className="px-1 py-0.5 font-medium text-xs">{eventInfo.event.title}</div>
    }

    const eventDate = new Date(race.eventDate)
    const timeStr = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    // Check if this is an Abbott World Marathon Major
    const isWorldMajor = race.tags?.includes('Abbott World Marathon Major')

    return (
      <div className="px-1 py-0.5 flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-neutral-900 dark:text-white text-xs truncate">
            {eventInfo.event.title}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {timeStr}
          </div>
        </div>
        {isWorldMajor && (
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
        )}
      </div>
    )
  }

  // Custom day cell content to add today indicator
  const dayCellContent = (arg: DayCellContentArg) => {
    const today = new Date()
    const isToday = arg.date.toDateString() === today.toDateString()

    if (isToday) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium">
          {arg.dayNumberText}
        </span>
      )
    }

    return <span className="font-medium">{arg.dayNumberText}</span>
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(parseInt(e.target.value))
    setCurrentDate(newDate)
  }

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(parseInt(e.target.value))
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-white dark:bg-[#0c0c0d] transition-colors duration-300 pt-12 pb-8">
      {/* Content fills viewport below navbar (48px) and above footer (32px) */}
      <div className="h-full flex flex-col">
        {/* Calendar - Takes full remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white dark:bg-neutral-900 flex-1 flex flex-col calendar-wrapper">
          {/* Custom Toolbar - Compact */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white font-playfair">
                Race Calendar
              </h1>

              {/* Center: Month Navigation */}
              <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white min-w-[180px] text-center">
                  {months[currentMonth]} {currentYear}
                </h2>

                <button
                  onClick={() => handleMonthChange('next')}
                  className="p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Right: Dropdowns */}
              <div className="flex items-center gap-3">
                <select
                  value={currentMonth}
                  onChange={handleMonthSelect}
                  className="pl-3 pr-10 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(64%2C64%2C64)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(212%2C212%2C212)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  onChange={handleYearSelect}
                  className="pl-3 pr-10 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(64%2C64%2C64)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(212%2C212%2C212)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleToday}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid - Fills remaining space */}
          <div className="flex-1 overflow-hidden relative">
            <FullCalendar
              key={currentDate.toISOString()}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate={currentDate}
              events={events}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              eventDidMount={handleEventDidMount}
              dayCellContent={dayCellContent}
              headerToolbar={false}
              height="100%"
              dayMaxEvents={false}
              eventClassNames="cursor-pointer"
            />

            {/* Legend Info Icon - Overlays bottom right of calendar */}
            <div className="absolute bottom-4 right-4 z-50">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="p-3 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-lg text-neutral-700 dark:text-neutral-300"
                aria-label="Show legend"
              >
                <Info className="h-5 w-5" />
              </button>

              {/* Legend Popover */}
              {showLegend && (
                <>
                  {/* Backdrop to close on click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLegend(false)}
                  />

                  {/* Legend Content */}
                  <div className="absolute bottom-16 right-0 z-50 w-80 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl p-4">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Legend</h3>

                    {/* Star Icon Explanation */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        <span className="text-xs text-neutral-700 dark:text-neutral-300">Abbott World Marathon Major</span>
                      </div>
                    </div>

                    {/* Color Legend */}
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">World Athletics Labels</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded flex-shrink-0 border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: 'rgba(204, 204, 204, 0.3)' }}></div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">Platinum Label</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded flex-shrink-0 border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: 'rgba(255, 217, 0, 0.4)' }}></div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">Gold Label</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded flex-shrink-0 border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: 'rgba(158, 140, 196, 0.4)' }}></div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">Elite Label</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded flex-shrink-0 border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: 'rgba(166, 251, 101, 0.4)' }}></div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">Label</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        /* Calendar container styling */
        .calendar-wrapper .fc {
          font-family: var(--font-body), sans-serif;
        }

        /* Hide default header */
        .calendar-wrapper .fc-header-toolbar {
          display: none;
        }

        /* Header styling */
        .calendar-wrapper .fc-col-header-cell {
          padding: 12px 8px;
          font-weight: 600;
          font-size: 14px;
          color: rgb(23, 23, 23);
          border-bottom: 1px solid rgb(229, 229, 229);
          border-right: 1px solid rgb(229, 229, 229);
          background-color: white;
        }

        .dark .calendar-wrapper .fc-col-header-cell {
          color: rgb(245, 245, 245);
          border-bottom-color: rgb(38, 38, 38);
          border-right-color: rgb(38, 38, 38);
          background-color: rgb(23, 23, 23);
        }

        /* Month view - remove outer border */
        .calendar-wrapper .fc-scrollgrid {
          border: none !important;
        }

        .calendar-wrapper .fc-scrollgrid-section > * {
          border: none !important;
        }

        /* Force equal row heights - table-based layout */
        .calendar-wrapper .fc-scrollgrid-sync-table {
          height: 100% !important;
          table-layout: fixed !important;
        }

        .calendar-wrapper .fc-daygrid-body {
          height: 100% !important;
          display: table !important;
          width: 100% !important;
        }

        .calendar-wrapper .fc-daygrid-body tr {
          display: table-row !important;
          height: 1px !important; /* Forces equal distribution */
        }

        /* Day cells - equal height, constrained */
        .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(229, 229, 229);
          background-color: white;
          display: table-cell !important;
          vertical-align: top !important;
          position: relative !important;
          height: 0 !important; /* Let table layout distribute height */
        }

        .dark .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(38, 38, 38);
          background-color: rgb(23, 23, 23);
        }

        /* Flexible row heights - constrain content */
        .calendar-wrapper .fc-daygrid-day-frame {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .calendar-wrapper .fc-daygrid-day-events {
          flex: 1 !important;
          overflow-y: auto !important;
          min-height: 0 !important;
          padding: 0 8px 8px 8px !important;
        }

        /* Remove today's cell background */
        .calendar-wrapper .fc-day-today {
          background-color: transparent !important;
        }

        .dark .calendar-wrapper .fc-day-today {
          background-color: transparent !important;
        }

        /* Date numbers - align top-left */
        .calendar-wrapper .fc-daygrid-day-top {
          padding: 8px;
          display: flex !important;
          flex-direction: row !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
        }

        .calendar-wrapper .fc-daygrid-day-number {
          color: rgb(23, 23, 23);
          font-weight: 500;
          padding: 0;
        }

        .dark .calendar-wrapper .fc-daygrid-day-number {
          color: rgb(245, 245, 245);
        }

        /* Ensure date numbers have correct text color */
        .calendar-wrapper .fc-daygrid-day-top > span {
          color: rgb(23, 23, 23);
        }

        .dark .calendar-wrapper .fc-daygrid-day-top > span {
          color: rgb(245, 245, 245);
        }

        /* Off-range days */
        .calendar-wrapper .fc-day-other {
          background-color: rgb(250, 250, 250);
        }

        .dark .calendar-wrapper .fc-day-other {
          background-color: rgb(12, 12, 13);
        }

        .calendar-wrapper .fc-day-other .fc-daygrid-day-number {
          color: rgb(163, 163, 163);
        }

        .dark .calendar-wrapper .fc-day-other .fc-daygrid-day-number {
          color: rgb(115, 115, 115);
        }

        /* Event styling - no background */
        .calendar-wrapper .fc-event {
          background-color: transparent;
          border: none !important;
          border-radius: 4px;
          padding: 0;
          margin: 1px 0;
        }

        .calendar-wrapper .fc-event:hover {
          background-color: rgb(245, 245, 245) !important;
        }

        .dark .calendar-wrapper .fc-event:hover {
          background-color: rgb(38, 38, 38) !important;
        }

        .calendar-wrapper .fc-event-main {
          color: inherit;
        }

        /* More link */
        .calendar-wrapper .fc-more-link {
          color: #e43c81;
          font-weight: 500;
        }

        .calendar-wrapper .fc-more-link:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* Snap Preview Overlay */}
      {snapPreview && (
        <div
          className="fixed z-40 border-4 border-neutral-400 dark:border-neutral-500 pointer-events-none"
          style={
            snapPreview === 'left'
              ? { left: 0, top: '48px', width: '50%', height: 'calc(100vh - 48px)' }
              : { right: 0, top: '48px', width: '50%', height: 'calc(100vh - 48px)' }
          }
        />
      )}

      {/* Race Windows */}
      <AnimatePresence mode="popLayout">
        {openWindows.map((window, index) => {
          if (window.isMinimized) return null

          const isActive = window.id === activeWindowId
          const isSnapped = window.isSnapped !== null && window.isSnapped !== undefined

          // Calculate window dimensions and position based on snap state
          const getWindowProps = () => {
            if (window.isFullscreen || isMobile) {
              return {
                left: 0,
                top: 48,
                width: '100vw',
                height: 'calc(100vh - 48px)',
              }
            }

            if (window.isSnapped === 'left') {
              return {
                left: 0,
                top: 48,
                width: '50vw',
                height: 'calc(100vh - 48px - 37px)',
              }
            }

            if (window.isSnapped === 'right') {
              return {
                left: '50vw',
                top: 48,
                width: '50vw',
                height: 'calc(100vh - 48px - 37px)',
              }
            }

            // Default floating window - use explicit height from state
            const viewportHeight = typeof globalThis !== 'undefined' && globalThis.window
              ? globalThis.window.innerHeight
              : undefined
            const safeTop = viewportHeight
              ? clampYToViewport(window.position.y, window.size.height, viewportHeight)
              : Math.max(NAVBAR_HEIGHT, window.position.y)
            return {
              left: window.position.x,
              top: safeTop,
              width: window.size.width,
              height: window.size.height,
            }
          }

          const windowProps = getWindowProps()

          return (
            <motion.div
              key={window.id}
              data-window-id={window.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                ...windowProps,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              style={{
                position: 'fixed',
                zIndex: 50 + index,
                maxWidth: window.isFullscreen || window.isSnapped ? 'none' : 'calc(100vw - 40px)',
                maxHeight: window.isFullscreen || window.isSnapped ? 'none' : 'calc(100vh - 48px - 37px)', // Subtract navbar and footer
              }}
              className={`
                bg-white dark:bg-neutral-900
                ${isActive ? 'mac-window-shadow-active' : 'mac-window-shadow'}
                ${isSnapped || window.isFullscreen ? '' : 'rounded-xl border border-neutral-200/60 dark:border-neutral-700/60'}
                overflow-hidden flex flex-col
              `}
              onClick={() => bringToFront(window.id)}
            >
              {/* macOS-style Title Bar */}
              <div
                className={`
                  flex items-center justify-between px-4 py-3
                  border-b border-neutral-200 dark:border-neutral-700
                  select-none group/titlebar transition-colors duration-200
                  ${isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800'
                    : 'bg-neutral-200/80 dark:bg-neutral-850/80 opacity-95'
                  }
                `}
                style={{ cursor: isMobile ? 'default' : 'move' }}
                onMouseDown={(e) => !isMobile && handleDragStart(window.id, e)}
                onDoubleClick={() => handleTitleBarDoubleClick(window.id)}
              >
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeWindow(window.id)
                    }}
                    className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4136] transition-colors relative flex items-center justify-center"
                    aria-label="Close"
                  >
                    <svg className="w-2 h-2 text-[#7D0F0F] opacity-0 group-hover/titlebar:opacity-100 transition-opacity" viewBox="0 0 12 12">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {!isMobile && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          minimizeWindow(window.id)
                        }}
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFB300] transition-colors relative flex items-center justify-center"
                        aria-label="Minimize"
                      >
                        <svg className="w-2 h-2 text-[#7D5B00] opacity-0 group-hover/titlebar:opacity-100 transition-opacity" viewBox="0 0 12 12">
                          <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFullscreen(window.id, e.altKey) // Detect Option/Alt key
                        }}
                        className="w-3 h-3 rounded-full bg-[#28CA42] hover:bg-[#1DB935] transition-colors relative flex items-center justify-center"
                        aria-label="Fullscreen"
                        title={window.isFullscreen ? "Exit Full Screen" : "Enter Full Screen (Option+Click to Zoom)"}
                      >
                        <Maximize2 className="w-2 h-2 text-[#0D5520] opacity-0 group-hover/titlebar:opacity-100 transition-opacity" />
                      </button>
                    </>
                  )}
                </div>

                {/* Window Title */}
                <div className="flex-1 text-center px-4">
                  <p className="font-body text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {window.race.title}
                  </p>
                </div>

                {/* Spacer for layout balance */}
                <div className="w-[52px]" />
              </div>

              {/* Window Content - Auto-fit to content, scrollable only if needed */}
              <div
                data-window-content={window.id}
                className={`${window.isFullscreen || window.isSnapped ? 'flex-1 overflow-y-auto mac-scroll' : 'overflow-y-auto mac-scroll'}`}
              >
                <div className="max-w-[850px] mx-auto">
                {/* Race Image */}
                <div className="relative w-full p-4">
                  <div className="relative overflow-hidden rounded-lg">
                    <div style={{ paddingBottom: '50%' }} className="relative">
                      {window.race.mainImage && (
                        <img
                          src={urlFor(window.race.mainImage).width(800).height(400).url()}
                          alt={window.race.title}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      )}
                    </div>
                  </div>

                  {/* Category Badge */}
                  {window.race.raceCategoryName && (
                    <div className="absolute top-8 left-8">
                      <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                        <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                          {window.race.raceCategoryName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-4 pt-4 pb-2">
                  {/* Title, Location, Date */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Title and Location */}
                      <div className="flex-1">
                        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white mb-2">
                          {window.race.title}
                        </h2>
                        {(window.race.city || window.race.stateRegion || window.race.country) && (
                          <p className="font-body text-base text-neutral-600 dark:text-neutral-400">
                            {[window.race.city, window.race.stateRegion, window.race.country]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Date Container - Right Side (Rounded) */}
                      <div className="flex flex-col items-center justify-center gap-0 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16 h-16">
                        <p
                          className="font-body text-xs font-medium uppercase text-neutral-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          {format(new Date(window.race.eventDate), 'MMM')}
                        </p>
                        <p
                          className="font-body text-2xl font-semibold leading-tight text-neutral-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          {format(new Date(window.race.eventDate), 'dd')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid - 3 rows of 3 */}
                  <div className="space-y-4">
                    {/* Row 1: Start Time, Avg. Temp, Entry Price */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Start Time */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Start Time
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                            {format(new Date(window.race.eventDate), 'h:mm a')}
                          </p>
                          <Clock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>

                      {/* Average Temperature */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Avg. Temp
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.averageTemperature !== undefined && window.race.averageTemperature !== null
                              ? `${Math.round((window.race.averageTemperature * 9) / 5 + 32)}°F`
                              : 'N/A'}
                          </p>
                          <Thermometer className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>

                      {/* Entry Price */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Entry Price
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.price !== undefined && window.race.price !== null
                              ? formatPrice(
                                  convertCurrencySync(
                                    window.race.price,
                                    window.race.currency || 'USD',
                                    'USD'
                                  ),
                                  'USD'
                                )
                              : 'N/A'}
                          </p>
                          <Banknote className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Surface, Elevation Gain, Elevation Loss */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Surface */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Surface
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.surface || 'N/A'}
                          </p>
                          {window.race.surface && window.race.surface !== 'N/A' && (
                            <svg width="20" height="20" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                              <path
                                d="M10 55 Q 30 15 50 55 T 90 55 Q 110 15 130 55"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                className="text-neutral-400 dark:text-neutral-500"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Elevation Gain */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Elevation Gain
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.elevationGain !== undefined && window.race.elevationGain !== null
                              ? `${Math.round(window.race.elevationGain)}m`
                              : 'N/A'}
                          </p>
                          <MoveUpRight className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>

                      {/* Elevation Loss */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Elevation Loss
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.elevationLoss !== undefined && window.race.elevationLoss !== null
                              ? `${Math.round(window.race.elevationLoss)}m`
                              : 'N/A'}
                          </p>
                          <MoveDownRight className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Men's CR, Women's CR, Finishers 2025 */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Men's Course Record */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Men's CR
                        </p>
                        {window.race.mensCourseRecord ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                                {window.race.mensCourseRecord}
                              </p>
                              <Medal className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            {(window.race.mensCourseRecordAthlete || window.race.mensCourseRecordCountry) && (
                              <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {window.race.mensCourseRecordAthlete}
                                {window.race.mensCourseRecordAthlete && window.race.mensCourseRecordCountry && ' '}
                                {window.race.mensCourseRecordCountry && `(${window.race.mensCourseRecordCountry})`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">N/A</p>
                        )}
                      </div>

                      {/* Women's Course Record */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Women's CR
                        </p>
                        {window.race.womensCourseRecord ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                                {window.race.womensCourseRecord}
                              </p>
                              <Medal className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            {(window.race.womensCourseRecordAthlete || window.race.womensCourseRecordCountry) && (
                              <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {window.race.womensCourseRecordAthlete}
                                {window.race.womensCourseRecordAthlete && window.race.womensCourseRecordCountry && ' '}
                                {window.race.womensCourseRecordCountry && `(${window.race.womensCourseRecordCountry})`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">N/A</p>
                        )}
                      </div>

                      {/* Number of Finishers */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Finishers 2025
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                            {window.race.finishers !== undefined && window.race.finishers !== null
                              ? window.race.finishers.toLocaleString()
                              : 'N/A'}
                          </p>
                          <Users className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push(`/races/${window.race.slug.current}`)}
                      className="w-full py-3 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                    >
                      Full Race Guide
                    </button>
                    {window.race.officialWebsite && (
                      <a
                        href={window.race.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-6 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center"
                      >
                        Official Website
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </div>

              {/* Resize Handles - Only show on floating windows */}
              {!window.isFullscreen && !window.isSnapped && !isMobile && (
                <>
                  {/* Corner handles */}
                  <div
                    className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'nw', e)}
                  />
                  <div
                    className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'ne', e)}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'sw', e)}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'se', e)}
                  />

                  {/* Edge handles */}
                  <div
                    className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'n', e)}
                  />
                  <div
                    className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 's', e)}
                  />
                  <div
                    className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'w', e)}
                  />
                  <div
                    className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-10"
                    onMouseDown={(e) => handleResizeStart(window.id, 'e', e)}
                  />
                </>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Minimized Windows Dock */}
      {openWindows.some(w => w.isMinimized) && !isMobile && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-100/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700">
          {openWindows.filter(w => w.isMinimized).map(window => (
            <button
              key={window.id}
              onClick={() => restoreWindow(window.id)}
              className="group relative px-4 py-2 bg-white dark:bg-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="font-body text-xs font-medium text-neutral-900 dark:text-white truncate max-w-[120px]">
                  {window.race.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Minimal Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-2 px-4 z-[100]">
        <div className="flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-400">
          <span>© {new Date().getFullYear()} Distanz Running</span>
        </div>
      </div>

    </div>
  )
}
