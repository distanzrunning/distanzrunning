'use client'

import { useState, useMemo, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MoveUpRight, MoveDownRight, Thermometer, Clock, Banknote, Users, Medal } from 'lucide-react'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'
import { motion, AnimatePresence } from 'framer-motion'
import type { RaceGuide } from '../page'

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
  isSnapped?: 'left' | 'right' | null
}

export function RaceCalendarClient({ races }: { races: RaceGuide[] }) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<RaceWindow[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | null>(null)

  // Convert races to FullCalendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return races.map((race) => {
      const eventDate = new Date(race.eventDate)
      return {
        id: race._id,
        title: race.title,
        start: eventDate.toISOString().split('T')[0],
        slug: race.slug.current,
        city: race.city,
        country: race.country,
        raceCategoryName: race.raceCategoryName,
      }
    })
  }, [races])

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEventClick = (info: EventClickArg) => {
    const race = races.find(r => r._id === info.event.id)
    if (!race) return

    // On mobile, only allow one fullscreen window
    if (isMobile) {
      setOpenWindows([{
        id: race._id,
        race,
        isMinimized: false,
        isFullscreen: true,
        position: { x: 0, y: 0 },
        isSnapped: null
      }])
      return
    }

    // On desktop, check if window already exists
    const existingWindow = openWindows.find(w => w.id === race._id)
    if (existingWindow) {
      // Bring to front by moving to end of array
      setOpenWindows(prev => [...prev.filter(w => w.id !== race._id), existingWindow])
      return
    }

    // Create new window with staggered position (accounting for navbar at 64px)
    const offset = openWindows.length * 30
    setOpenWindows(prev => [...prev, {
      id: race._id,
      race,
      isMinimized: false,
      isFullscreen: false,
      position: { x: 50 + offset, y: 84 + offset },
      isSnapped: null
    }])
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
    setOpenWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: false } : w
    ).sort((a) => a.id === id ? 1 : -1)) // Bring to front
  }

  const toggleFullscreen = (id: string) => {
    setOpenWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isFullscreen: !w.isFullscreen } : w
    ))
  }

  const bringToFront = (id: string) => {
    setOpenWindows(prev => {
      const window = prev.find(w => w.id === id)
      if (!window) return prev
      return [...prev.filter(w => w.id !== id), window]
    })
  }

  // Custom drag handling with snap zones
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    if (isMobile) return

    const raceWindow = openWindows.find(w => w.id === id)
    if (!raceWindow) return

    // If window is snapped, unsnap it when drag starts
    const wasSnapped = raceWindow.isSnapped
    if (wasSnapped) {
      setOpenWindows(prev =>
        prev.map(w => w.id === id ? { ...w, isSnapped: null } : w)
      )
    }

    const startX = e.clientX - raceWindow.position.x
    const startY = e.clientY - raceWindow.position.y

    const SNAP_THRESHOLD = 50 // pixels from edge to trigger snap

    // Store current snap zone in a ref to access in handleDragEnd
    let currentSnapZone: 'left' | 'right' | null = null

    const handleDrag = (moveEvent: MouseEvent) => {
      let x = moveEvent.clientX - startX
      let y = moveEvent.clientY - startY

      // Allow slight overflow beyond viewport boundaries
      const EDGE_BUFFER = 20 // pixels allowed beyond edges
      const windowWidth = 640
      const windowHeight = 500 // approximate height
      const minX = -EDGE_BUFFER
      const minY = -EDGE_BUFFER
      const maxX = window.innerWidth - windowWidth + EDGE_BUFFER
      const maxY = window.innerHeight - windowHeight + EDGE_BUFFER

      // Constrain with buffer
      x = Math.max(minX, Math.min(x, maxX))
      y = Math.max(minY, Math.min(y, maxY))

      // Detect snap zones (only left and right)
      if (moveEvent.clientX < SNAP_THRESHOLD) {
        currentSnapZone = 'left'
        console.log('In LEFT snap zone')
      } else if (moveEvent.clientX > window.innerWidth - SNAP_THRESHOLD) {
        currentSnapZone = 'right'
        console.log('In RIGHT snap zone')
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
      console.log('handleDragEnd called, currentSnapZone:', currentSnapZone)

      if (currentSnapZone) {
        console.log('Snapping window to:', currentSnapZone)
        setOpenWindows(prev =>
          prev.map(w =>
            w.id === id
              ? { ...w, isSnapped: currentSnapZone, position: { x: 0, y: 0 } }
              : w
          )
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

    return (
      <div className="px-1 py-0.5">
        <div className="font-medium text-neutral-900 dark:text-white text-xs truncate">
          {eventInfo.event.title}
        </div>
        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
          {timeStr}
        </div>
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
    <div className="fixed inset-0 overflow-hidden bg-white dark:bg-[#0c0c0d] transition-colors duration-300 pt-16">
      {/* Content fills viewport below navbar */}
      <div className="h-full flex flex-col">
        {/* Calendar - Takes full remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white dark:bg-neutral-900 flex-1 flex flex-col calendar-wrapper">
          {/* Custom Toolbar - Compact */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Navigation */}
              <div className="flex items-center gap-4">
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
          <div className="flex-1 overflow-hidden p-6">
            <FullCalendar
              key={currentDate.toISOString()}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate={currentDate}
              events={events}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              dayCellContent={dayCellContent}
              headerToolbar={false}
              height="100%"
              dayMaxEvents={false}
              eventClassNames="cursor-pointer"
            />
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

        /* Force equal row heights */
        .calendar-wrapper .fc-scrollgrid-sync-table {
          height: 100% !important;
        }

        .calendar-wrapper .fc-daygrid-body tr {
          height: 150px !important;
        }

        /* Day cells */
        .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(229, 229, 229);
          background-color: white;
          height: 150px !important;
        }

        .dark .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(38, 38, 38);
          background-color: rgb(23, 23, 23);
        }

        /* Fixed row heights - constrain content */
        .calendar-wrapper .fc-daygrid-day-frame {
          height: 100% !important;
          max-height: 150px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .calendar-wrapper .fc-daygrid-day-events {
          flex: 1 !important;
          overflow-y: auto !important;
          min-height: 0 !important;
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
          background-color: transparent !important;
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
              ? { left: 0, top: '64px', width: '50%', height: 'calc(100vh - 64px)' }
              : { right: 0, top: '64px', width: '50%', height: 'calc(100vh - 64px)' }
          }
        />
      )}

      {/* Race Windows */}
      <AnimatePresence>
        {openWindows.map((window, index) => {
          if (window.isMinimized) return null

          // Calculate window dimensions and position based on snap state
          const getWindowStyle = () => {
            const baseStyle = {
              position: 'fixed' as const,
              zIndex: 50 + index,
            }

            if (window.isFullscreen || isMobile) {
              return {
                ...baseStyle,
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
              }
            }

            if (window.isSnapped === 'left') {
              console.log('Rendering LEFT snapped window')
              return {
                ...baseStyle,
                left: 0,
                top: 64,
                width: '50vw',
                height: 'calc(100vh - 64px)',
              }
            }

            if (window.isSnapped === 'right') {
              console.log('Rendering RIGHT snapped window')
              return {
                ...baseStyle,
                left: '50vw',
                top: 64,
                width: '50vw',
                height: 'calc(100vh - 64px)',
              }
            }

            // Default floating window
            return {
              ...baseStyle,
              left: window.position.x,
              top: window.position.y,
              width: 640,
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 40px)',
            }
          }

          const isSnappedOrFullscreen = window.isFullscreen || isMobile || window.isSnapped

          const windowStyle = getWindowStyle()
          console.log(`Window ${window.id} style:`, windowStyle, 'isSnapped:', window.isSnapped)

          return (
            <motion.div
              key={window.id}
              initial={false}
              animate={windowStyle}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
                layout: { duration: 0.2 }
              }}
              className={`
                bg-white dark:bg-neutral-900 shadow-2xl
                ${isSnappedOrFullscreen ? '' : 'rounded-xl border border-neutral-200/60 dark:border-neutral-700/60'}
                overflow-hidden flex flex-col
              `}
              onClick={() => bringToFront(window.id)}
            >
              {/* macOS-style Title Bar */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 select-none"
                style={{ cursor: isMobile ? 'default' : 'move' }}
                onMouseDown={(e) => !isMobile && handleDragStart(window.id, e)}
              >
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeWindow(window.id)
                    }}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    aria-label="Close"
                  />
                  {!isMobile && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          minimizeWindow(window.id)
                        }}
                        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                        aria-label="Minimize"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFullscreen(window.id)
                        }}
                        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                        aria-label="Fullscreen"
                      />
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

              {/* Window Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* Race Image */}
                <div className="relative w-full">
                  <div className="relative overflow-hidden">
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
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                        <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                          {window.race.raceCategoryName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
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

    </div>
  )
}
