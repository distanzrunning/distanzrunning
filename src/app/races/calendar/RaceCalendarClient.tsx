'use client'

import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { ChevronLeft, ChevronRight, Star, Info } from 'lucide-react'
import type { RaceGuide } from '../page'
import { RaceEventPopup } from './RaceEventPopup'

interface CalendarEvent {
  id: string
  title: string
  start: string
  slug: string
  city?: string
  country?: string
  raceCategoryName?: string
}

export function RaceCalendarClient({ races }: { races: RaceGuide[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showLegend, setShowLegend] = useState(false)
  const [selectedRace, setSelectedRace] = useState<RaceGuide | null>(null)

  // Convert races to FullCalendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return races
      .map((race) => ({
        id: race._id,
        title: race.title,
        start: race.eventDate,
        slug: race.slug.current,
        city: race.city,
        country: race.country,
        raceCategoryName: race.raceCategoryName,
      }))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }, [races])

  // Handle event click - show popup window
  const handleEventClick = (info: EventClickArg) => {
    const race = races.find(r => r._id === info.event.id)
    if (race) {
      setSelectedRace(race)
    }
  }

  // Add World Athletics Label background colors
  const handleEventDidMount = (info: any) => {
    const race = races.find(r => r._id === info.event.id)
    if (!race) return

    // Determine World Athletics Label background color
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

  // Custom event rendering with time and star for World Marathon Majors
  const renderEventContent = (eventInfo: any) => {
    const race = races.find(r => r._id === eventInfo.event.id)
    if (!race) return null

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

  // Custom day cell rendering - add today indicator
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

  // Navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
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

  return (
    <>
      {/* Race Event Popup */}
      <RaceEventPopup race={selectedRace} onClose={() => setSelectedRace(null)} />

      <div className="fixed inset-0 overflow-hidden bg-white dark:bg-[#0c0c0d] transition-colors duration-300 pt-12 pb-8">
        {/* Content fills viewport below navbar (48px) and above footer (32px) */}
        <div className="h-full flex flex-col">
        {/* Calendar - Takes full remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="bg-white dark:bg-neutral-900 flex-1 flex flex-col calendar-wrapper">
            {/* Custom Toolbar */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
              <div className="flex items-center justify-between">
                {/* Left: Title */}
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white font-playfair">
                  Race Calendar
                </h1>

                {/* Center: Month Navigation with chevrons */}
                <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="text-lg font-semibold text-neutral-900 dark:text-white min-w-[140px] text-center">
                    {months[currentMonth]}
                  </span>

                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Right: Month/Year/Today controls */}
                <div className="flex items-center gap-2">
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

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
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
            </div>
          </div>

          {/* Legend Button - Bottom right corner */}
          <div className="absolute bottom-4 right-4 z-50 group">
            <button
              onClick={() => setShowLegend(!showLegend)}
              onMouseEnter={() => setShowLegend(true)}
              onMouseLeave={() => setShowLegend(false)}
              className="p-2 rounded-lg bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all text-neutral-700 dark:text-neutral-300"
              aria-label="Show legend"
            >
              <Info className="h-5 w-5" />
            </button>

            {/* Legend Popover */}
            {showLegend && (
              <div
                className="absolute bottom-full right-0 mb-2 w-64 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl p-4"
                onMouseEnter={() => setShowLegend(true)}
                onMouseLeave={() => setShowLegend(false)}
              >
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Legend</h3>

                {/* Star Icon Explanation */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    <span className="text-xs text-neutral-900 dark:text-white">Abbott World Marathon Major</span>
                  </div>
                </div>

                {/* Color Legend */}
                <div>
                  <h4 className="text-xs font-medium text-neutral-900 dark:text-white mb-2">World Athletics Labels</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(204, 204, 204, 0.3)' }}></div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">Platinum Label</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(255, 217, 0, 0.25)' }}></div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">Gold Label</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(158, 140, 196, 0.25)' }}></div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">Elite Label</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(166, 251, 101, 0.25)' }}></div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">Label</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-2 px-4 z-30">
        <div className="flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-400">
          <span>© {new Date().getFullYear()} Distanz Running</span>
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
          table-layout: fixed !important;
        }

        .calendar-wrapper .fc-daygrid-body {
          height: 100% !important;
          display: table !important;
          width: 100% !important;
        }

        .calendar-wrapper .fc-daygrid-body tr {
          display: table-row !important;
          height: 1px !important;
        }

        /* Day cells */
        .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(229, 229, 229);
          background-color: white;
          display: table-cell !important;
          vertical-align: top !important;
          position: relative !important;
          height: 0 !important;
        }

        .dark .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(38, 38, 38);
          background-color: rgb(23, 23, 23);
        }

        /* Other month dates - darker background */
        .calendar-wrapper .fc-day-other {
          background-color: rgb(250, 250, 250) !important;
        }

        .dark .calendar-wrapper .fc-day-other {
          background-color: rgb(15, 15, 15) !important;
        }

        /* Remove yellow highlight from today */
        .calendar-wrapper .fc-day-today {
          background-color: white !important;
        }

        .dark .calendar-wrapper .fc-day-today {
          background-color: rgb(23, 23, 23) !important;
        }

        /* Day cell content */
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
          flex: 1 1 auto !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          margin-top: 4px !important;
        }

        /* Event styling */
        .calendar-wrapper .fc-event {
          margin-bottom: 2px !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 2px 4px !important;
        }

        .calendar-wrapper .fc-event:hover {
          opacity: 0.8 !important;
        }

        /* Day number */
        .calendar-wrapper .fc-daygrid-day-top {
          padding: 4px 8px !important;
          display: flex !important;
          justify-content: flex-end !important;
        }

        .calendar-wrapper .fc-daygrid-day-number {
          padding: 2px !important;
        }
      `}</style>
      </div>
    </>
  )
}
