'use client'

import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'
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
interface RaceEvent extends Event {
  id: string
  slug: string
  city?: string
  country?: string
  raceCategoryName?: string
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
            style={{ height: 700 }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
            views={['month', 'agenda']}
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

        /* Today highlighting */
        .calendar-wrapper .rbc-today {
          background-color: rgb(250, 250, 250);
        }

        .dark .calendar-wrapper .rbc-today {
          background-color: rgb(23, 23, 23);
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

        /* Toolbar styling */
        .calendar-wrapper .rbc-toolbar {
          padding: 16px 0;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .calendar-wrapper .rbc-toolbar button {
          padding: 8px 16px;
          border: 1px solid rgb(212, 212, 212);
          background: white;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          color: rgb(23, 23, 23);
          cursor: pointer;
          transition: all 0.2s;
        }

        .dark .calendar-wrapper .rbc-toolbar button {
          background: rgb(38, 38, 38);
          border-color: rgb(64, 64, 64);
          color: rgb(245, 245, 245);
        }

        .calendar-wrapper .rbc-toolbar button:hover {
          background: rgb(245, 245, 245);
          border-color: rgb(163, 163, 163);
        }

        .dark .calendar-wrapper .rbc-toolbar button:hover {
          background: rgb(64, 64, 64);
          border-color: rgb(115, 115, 115);
        }

        .calendar-wrapper .rbc-toolbar button.rbc-active {
          background: rgb(23, 23, 23);
          color: white;
          border-color: rgb(23, 23, 23);
        }

        .dark .calendar-wrapper .rbc-toolbar button.rbc-active {
          background: white;
          color: rgb(23, 23, 23);
          border-color: white;
        }

        .calendar-wrapper .rbc-toolbar-label {
          font-weight: 600;
          font-size: 18px;
          color: rgb(23, 23, 23);
        }

        .dark .calendar-wrapper .rbc-toolbar-label {
          color: rgb(245, 245, 245);
        }

        /* Event styling */
        .calendar-wrapper .rbc-event {
          padding: 2px 4px;
          margin: 1px;
        }

        .calendar-wrapper .rbc-event:focus {
          outline: 2px solid rgb(228, 60, 129);
        }

        /* Agenda view */
        .calendar-wrapper .rbc-agenda-view {
          border: 1px solid rgb(229, 229, 229);
          border-radius: 8px;
          overflow: hidden;
        }

        .dark .calendar-wrapper .rbc-agenda-view {
          border-color: rgb(38, 38, 38);
        }

        .calendar-wrapper .rbc-agenda-table {
          border: none;
        }

        .calendar-wrapper .rbc-agenda-date-cell,
        .calendar-wrapper .rbc-agenda-time-cell {
          padding: 12px;
          color: rgb(23, 23, 23);
        }

        .dark .calendar-wrapper .rbc-agenda-date-cell,
        .dark .calendar-wrapper .rbc-agenda-time-cell {
          color: rgb(245, 245, 245);
        }

        .calendar-wrapper .rbc-agenda-event-cell {
          padding: 12px;
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
