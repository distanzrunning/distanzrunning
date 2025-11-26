'use client'

import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, X, MoveUpRight, MoveDownRight } from 'lucide-react'
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

export function RaceCalendarClient({ races }: { races: RaceGuide[] }) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedRace, setSelectedRace] = useState<RaceGuide | null>(null)

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

  const handleEventClick = (info: EventClickArg) => {
    const race = races.find(r => r._id === info.event.id)
    if (race) {
      setSelectedRace(race)
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
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
      <div className="w-[95%] mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-headline text-[35px] md:text-[56px] leading-[1.1] md:leading-[1.05] font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">
            Race Calendar
          </h1>
          <p className="font-body text-base md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Explore upcoming races on an interactive calendar. Click on any race to view detailed information, course analysis, and registration details.
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm calendar-wrapper">
          {/* Custom Toolbar - Inside Calendar */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
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

          {/* Calendar Grid */}
          <div>
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
              height="auto"
              dayMaxEvents={false}
              eventClassNames="cursor-pointer"
            />
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

      {/* Race Details Modal */}
      <AnimatePresence>
        {selectedRace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedRace(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRace(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-neutral-900 dark:text-white" />
              </button>

              {/* Race Image */}
              <div className="relative w-full">
                <div className="relative overflow-hidden">
                  <div style={{ paddingBottom: '50%' }} className="relative">
                    {selectedRace.mainImage && (
                      <img
                        src={urlFor(selectedRace.mainImage).width(800).height(400).url()}
                        alt={selectedRace.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                {selectedRace.raceCategoryName && (
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                      <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                        {selectedRace.raceCategoryName}
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
                        {selectedRace.title}
                      </h2>
                      {(selectedRace.city || selectedRace.stateRegion || selectedRace.country) && (
                        <p className="font-body text-base text-neutral-600 dark:text-neutral-400">
                          {[selectedRace.city, selectedRace.stateRegion, selectedRace.country]
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
                        {format(new Date(selectedRace.eventDate), 'MMM')}
                      </p>
                      <p
                        className="font-body text-2xl font-semibold leading-tight text-neutral-900 dark:text-white"
                        suppressHydrationWarning
                      >
                        {format(new Date(selectedRace.eventDate), 'dd')}
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
                      <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                        {format(new Date(selectedRace.eventDate), 'h:mm a')}
                      </p>
                    </div>

                    {/* Average Temperature */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                      <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Avg. Temp
                      </p>
                      <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                        {selectedRace.averageTemperature !== undefined && selectedRace.averageTemperature !== null
                          ? `${Math.round((selectedRace.averageTemperature * 9) / 5 + 32)}°F`
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Entry Price */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                      <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Entry Price
                      </p>
                      <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                        {selectedRace.price !== undefined && selectedRace.price !== null
                          ? formatPrice(
                              convertCurrencySync(
                                selectedRace.price,
                                selectedRace.currency || 'USD',
                                'USD'
                              ),
                              'USD'
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Surface, Elevation Gain, Elevation Loss */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Surface */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                      <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Surface
                      </p>
                      <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                        {selectedRace.surface || 'N/A'}
                      </p>
                    </div>

                    {/* Elevation Gain */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                      <p className="font-body text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Elevation Gain
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedRace.elevationGain !== undefined && selectedRace.elevationGain !== null
                            ? `${Math.round(selectedRace.elevationGain)}m`
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
                      <div className="flex items-center justify-between">
                        <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedRace.elevationLoss !== undefined && selectedRace.elevationLoss !== null
                            ? `${Math.round(selectedRace.elevationLoss)}m`
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
                      {selectedRace.mensCourseRecord ? (
                        <div>
                          <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                            {selectedRace.mensCourseRecord}
                          </p>
                          {(selectedRace.mensCourseRecordAthlete || selectedRace.mensCourseRecordCountry) && (
                            <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                              {selectedRace.mensCourseRecordAthlete}
                              {selectedRace.mensCourseRecordAthlete && selectedRace.mensCourseRecordCountry && ' '}
                              {selectedRace.mensCourseRecordCountry && `(${selectedRace.mensCourseRecordCountry})`}
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
                      {selectedRace.womensCourseRecord ? (
                        <div>
                          <p className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                            {selectedRace.womensCourseRecord}
                          </p>
                          {(selectedRace.womensCourseRecordAthlete || selectedRace.womensCourseRecordCountry) && (
                            <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                              {selectedRace.womensCourseRecordAthlete}
                              {selectedRace.womensCourseRecordAthlete && selectedRace.womensCourseRecordCountry && ' '}
                              {selectedRace.womensCourseRecordCountry && `(${selectedRace.womensCourseRecordCountry})`}
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
                      <p className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
                        {selectedRace.finishers !== undefined && selectedRace.finishers !== null
                          ? selectedRace.finishers.toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/races/${selectedRace.slug.current}`)}
                    className="w-full py-3 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                  >
                    Full Race Guide
                  </button>
                  {selectedRace.officialWebsite && (
                    <a
                      href={selectedRace.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-6 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center"
                    >
                      Official Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
