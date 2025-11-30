'use client'

import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DayCellContentArg } from '@fullcalendar/core'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { format } from 'date-fns'
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
  const [showLegend, setShowLegend] = useState(false)

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

  // Handle event click - navigate to race guide page
  const handleEventClick = (info: EventClickArg) => {
    const event = events.find(e => e.id === info.event.id)
    if (event) {
      router.push(`/races/${event.slug}`)
    }
  }

  // Custom event rendering
  const renderEventContent = (eventInfo: any) => {
    const event = events.find(e => e.id === eventInfo.event.id)
    if (!event) return null

    const categoryColor = getCategoryColor(event.raceCategoryName)

    return (
      <div
        className="px-1.5 py-0.5 rounded text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          backgroundColor: categoryColor,
          color: '#fff',
        }}
        title={`${event.title}${event.city ? ` - ${event.city}` : ''}`}
      >
        {event.title}
      </div>
    )
  }

  // Custom day cell rendering - add date number
  const dayCellContent = (arg: DayCellContentArg) => {
    return (
      <div className="text-right p-1">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {format(arg.date, 'd')}
        </span>
      </div>
    )
  }

  // Add event data attributes for styling
  const handleEventDidMount = (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event?.raceCategoryName) {
      info.el.setAttribute('data-category', event.raceCategoryName.toLowerCase())
    }
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

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Month/Year Display */}
            <div className="flex items-center gap-4">
              <h1 className="font-headline text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h1>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
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

        {/* Legend Info Icon */}
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
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLegend(false)}
              />
              <div className="absolute bottom-16 right-0 z-50 w-80 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl p-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Legend</h3>
                <div className="space-y-2">
                  <LegendItem color="#e43c81" label="Marathon" />
                  <LegendItem color="#7C3AED" label="Half Marathon" />
                  <LegendItem color="#00D464" label="10K" />
                  <LegendItem color="#FF5722" label="5K" />
                  <LegendItem color="#8B4513" label="Trail" />
                  <LegendItem color="#DC2626" label="Track & Field" />
                  <LegendItem color="#6B7280" label="Other" />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                  Click any race to view details
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component for legend items
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
    </div>
  )
}

// Get category color
function getCategoryColor(category?: string): string {
  if (!category) return '#6B7280' // gray for uncategorized

  const categoryLower = category.toLowerCase()

  if (categoryLower.includes('marathon') && !categoryLower.includes('half')) {
    return '#e43c81' // Electric Pink
  }
  if (categoryLower.includes('half')) {
    return '#7C3AED' // Pace Purple
  }
  if (categoryLower.includes('10k')) {
    return '#00D464' // Volt Green
  }
  if (categoryLower.includes('5k')) {
    return '#FF5722' // Signal Orange
  }
  if (categoryLower.includes('trail')) {
    return '#8B4513' // Trail Brown
  }
  if (categoryLower.includes('track')) {
    return '#DC2626' // Track Red
  }

  return '#6B7280' // Default gray
}
