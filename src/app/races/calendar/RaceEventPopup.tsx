'use client'

import { format } from 'date-fns'
import type { RaceGuide } from '../page'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'
import { DraggableWindow } from '@/components/DraggableWindow'

interface RaceEventPopupProps {
  race: RaceGuide | null
  onClose: () => void
  onMinimize?: () => void
}

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

export function RaceEventPopup({ race, onClose, onMinimize }: RaceEventPopupProps) {
  if (!race) return null

  const imageUrl = race.mainImage ? urlFor(race.mainImage)?.width(800).height(520).url() : null

  return (
    <DraggableWindow
      title={race.title}
      onClose={onClose}
      onMinimize={onMinimize}
      initialWidth={672}
      initialHeight={700}
      minWidth={400}
      minHeight={300}
    >
      {/* Content - Fixed width, scrollable */}
      <div className="overflow-y-auto h-full flex justify-center race-popup-scroll">
        <div className="w-full max-w-[600px] flex flex-col pt-4">
          {/* Image Container */}
          <div className="relative w-full">
            {/* Image Wrapper */}
            <div className="relative overflow-hidden rounded-lg">
              <div style={{ paddingBottom: '65%' }} className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
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
          <div className="rounded-b-lg px-5 py-5">
            <div className="flex items-center justify-between gap-3 mb-4">
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

            {/* Stats Grid - 3 rows of 3 cards */}
            <div className="space-y-2 mb-4">
              {/* Row 1: Surface, Entry Price, Finishers */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Surface</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.surface || 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Entry Price</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.price !== undefined && race.price !== null
                      ? formatPrice(convertCurrencySync(race.price, race.currency || 'USD', 'USD'), 'USD')
                      : 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Finishers</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.finishers ? race.finishers.toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Row 2: Elevation Gain, Elevation Loss, Profile */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Elev. Gain</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.elevationGain !== undefined && race.elevationGain !== null
                      ? `${Math.round(race.elevationGain * 3.28084).toLocaleString()}ft`
                      : 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Elev. Loss</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.elevationLoss !== undefined && race.elevationLoss !== null
                      ? `${Math.round(race.elevationLoss * 3.28084).toLocaleString()}ft`
                      : 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Profile</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.profile ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Row 3: Average Temperature, Men's Course Record, Women's Course Record */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Avg. Temp</p>
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.averageTemperature !== undefined && race.averageTemperature !== null
                      ? `${Math.round(race.averageTemperature * 9/5 + 32)}°F`
                      : 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Men's CR</p>
                  <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.mensCourseRecord || 'N/A'}
                  </p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">Women's CR</p>
                  <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                    {race.womensCourseRecord || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Match stats card widths */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`/races/${race.slug.current}`}
                className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium text-sm transition-opacity hover:opacity-80"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `/races/${race.slug.current}`
                }}
              >
                View Full Guide
              </a>
              {race.officialWebsite && (
                <a
                  href={race.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-lg font-medium text-sm transition-opacity hover:opacity-80"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .race-popup-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .race-popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .race-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .race-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Dark mode scrollbar */
        :global(.dark) .race-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .race-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Firefox scrollbar */
        .race-popup-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        :global(.dark) .race-popup-scroll {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </DraggableWindow>
  )
}
