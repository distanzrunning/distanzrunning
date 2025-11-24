'use client'

import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { RaceGuide } from '../page'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer for react-big-calendar
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Extend Event type to include race details
interface RaceEvent {
  id: string
  title: string
  start: Date
  end: Date
  slug: string
  city?: string
  country?: string
  raceCategoryName?: string
}

// Custom Toolbar Component
const CustomToolbar = ({ label, onNavigate, date }: ToolbarProps<RaceEvent>) => {
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Generate year options (current year +/- 5 years)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value)
    const newDate = new Date(date)
    newDate.setMonth(newMonth)
    onNavigate('DATE', newDate)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value)
    const newDate = new Date(date)
    newDate.setFullYear(newYear)
    onNavigate('DATE', newDate)
  }

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
      {/* Left: Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white min-w-[180px] text-center">
          {label}
        </h2>

        <button
          onClick={() => onNavigate('NEXT')}
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
          onChange={handleMonthChange}
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
          onChange={handleYearChange}
          className="pl-3 pr-10 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(64%2C64%2C64)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(212%2C212%2C212)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() => onNavigate('TODAY')}
          className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  )
}

export function RaceCalendarClient({ races }: { races: RaceGuide[] }) {
  // Convert races to calendar events
  const events = useMemo<RaceEvent[]>(() => {
    return races.map((race) => ({
      id: race._id,
      title: race.title,
      start: new Date(race.eventDate),
      end: new Date(race.eventDate),
      slug: race.slug.current,
      city: race.city,
      country: race.country,
      raceCategoryName: race.raceCategoryName,
    }))
  }, [races])

  // Custom event style
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#e43c81', // Electric Pink
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
      },
    }
  }

  // Custom event component
  const EventComponent = ({ event }: { event: RaceEvent }) => {
    return (
      <Link
        href={`/races/${event.slug}`}
        className="block hover:opacity-80 transition-opacity"
      >
        <div className="truncate">
          <div className="font-medium">{event.title}</div>
          {event.raceCategoryName && (
            <div className="text-xs opacity-90">{event.raceCategoryName}</div>
          )}
        </div>
      </Link>
    )
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
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm calendar-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 900 }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            views={['month']}
            defaultView="month"
          />
        </div>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        /* Calendar container styling */
        .calendar-wrapper .rbc-calendar {
          font-family: var(--font-body), sans-serif;
        }

        /* Header styling */
        .calendar-wrapper .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          font-size: 14px;
          color: rgb(23, 23, 23);
          border-bottom: 1px solid rgb(229, 229, 229);
        }

        .dark .calendar-wrapper .rbc-header {
          color: rgb(245, 245, 245);
          border-bottom-color: rgb(38, 38, 38);
        }

        /* Month view cells */
        .calendar-wrapper .rbc-month-view {
          border: 1px solid rgb(229, 229, 229);
          border-radius: 8px;
          overflow: hidden;
        }

        .dark .calendar-wrapper .rbc-month-view {
          border-color: rgb(38, 38, 38);
        }

        .calendar-wrapper .rbc-day-bg {
          border-left: 1px solid rgb(229, 229, 229);
        }

        .dark .calendar-wrapper .rbc-day-bg {
          border-left-color: rgb(38, 38, 38);
        }

        .calendar-wrapper .rbc-month-row {
          border-top: 1px solid rgb(229, 229, 229);
        }

        .dark .calendar-wrapper .rbc-month-row {
          border-top-color: rgb(38, 38, 38);
        }

        /* Today highlighting - remove background */
        .calendar-wrapper .rbc-today {
          background-color: transparent;
        }

        .dark .calendar-wrapper .rbc-today {
          background-color: transparent;
        }

        /* Off-range days */
        .calendar-wrapper .rbc-off-range-bg {
          background-color: rgb(250, 250, 250);
        }

        .dark .calendar-wrapper .rbc-off-range-bg {
          background-color: rgb(12, 12, 13);
        }

        .calendar-wrapper .rbc-off-range {
          color: rgb(163, 163, 163);
        }

        .dark .calendar-wrapper .rbc-off-range {
          color: rgb(115, 115, 115);
        }

        /* Date cell numbers */
        .calendar-wrapper .rbc-date-cell {
          padding: 8px;
          text-align: right;
        }

        .calendar-wrapper .rbc-date-cell > a {
          font-weight: 500;
          color: rgb(23, 23, 23);
        }

        .dark .calendar-wrapper .rbc-date-cell > a {
          color: rgb(245, 245, 245);
        }

        /* Today's date with circle */
        .calendar-wrapper .rbc-now .rbc-date-cell > a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgb(23, 23, 23);
          color: rgb(255, 255, 255) !important;
        }

        .dark .calendar-wrapper .rbc-now .rbc-date-cell > a {
          background-color: rgb(255, 255, 255);
          color: rgb(23, 23, 23) !important;
        }

        /* Event styling */
        .calendar-wrapper .rbc-event {
          padding: 2px 4px;
          margin: 1px;
        }

        .calendar-wrapper .rbc-event:focus {
          outline: 2px solid rgb(228, 60, 129);
        }

        /* Show more link */
        .calendar-wrapper .rbc-show-more {
          color: rgb(228, 60, 129);
          font-weight: 500;
          cursor: pointer;
          padding: 4px;
        }

        .calendar-wrapper .rbc-show-more:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
