'use client'

import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    const slug = info.event.extendedProps.slug
    if (slug) {
      router.push(`/races/${slug}`)
    }
  }

  // Custom event content
  const renderEventContent = (eventInfo: any) => {
    const eventDate = new Date(eventInfo.event.start)
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

        {/* Custom Toolbar */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
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

        {/* Calendar */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm calendar-wrapper">
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
            height={900}
            eventClassNames="cursor-pointer"
          />
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
        }

        .dark .calendar-wrapper .fc-col-header-cell {
          color: rgb(245, 245, 245);
          border-bottom-color: rgb(38, 38, 38);
        }

        /* Day cells */
        .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(229, 229, 229);
          background-color: transparent;
        }

        .dark .calendar-wrapper .fc-daygrid-day {
          border-color: rgb(38, 38, 38);
          background-color: transparent;
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
    </div>
  )
}
