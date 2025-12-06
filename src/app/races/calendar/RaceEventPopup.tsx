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
      <div className="overflow-y-auto h-full flex justify-center race-popup-scroll p-4">
        <div className="w-full max-w-[600px] flex flex-col gap-4">
          {/* Image Card */}
          <div className="relative w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div style={{ paddingBottom: '60%' }} className="relative">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={race.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}
            </div>
            {/* Distance/Category Badge */}
            {race.raceCategoryName && (
              <div className="absolute top-3 right-3">
                <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full shadow-sm">
                  <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                    {race.raceCategoryName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title and Date Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-body text-xl font-semibold leading-tight text-neutral-900 dark:text-white mb-1">
                  {race.title}
                </h3>
                {(race.city || race.stateRegion || race.country) && (
                  <p className="font-body text-sm text-neutral-600 dark:text-neutral-400">
                    {formatLocation(race.city, race.stateRegion, race.country)}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-16 h-16">
                <p
                  className="font-body text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400"
                  suppressHydrationWarning
                >
                  {format(new Date(race.eventDate), 'MMM')}
                </p>
                <p
                  className="font-body text-2xl font-bold leading-tight text-neutral-900 dark:text-white"
                  suppressHydrationWarning
                >
                  {format(new Date(race.eventDate), 'dd')}
                </p>
              </div>
            </div>
          </div>

          {/* Race Details Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-5">
            <h4 className="font-body text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">Race Details</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Surface</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.surface || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Entry Price</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.price !== undefined && race.price !== null
                      ? formatPrice(convertCurrencySync(race.price, race.currency || 'USD', 'USD'), 'USD')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Finishers</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.finishers ? race.finishers.toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Elev. Gain</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.elevationGain !== undefined && race.elevationGain !== null
                      ? `${Math.round(race.elevationGain * 3.28084).toLocaleString()}ft`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Elev. Loss</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.elevationLoss !== undefined && race.elevationLoss !== null
                      ? `${Math.round(race.elevationLoss * 3.28084).toLocaleString()}ft`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Profile</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.profile ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Avg. Temp</p>
                  <p className="font-body text-sm font-medium text-neutral-900 dark:text-white">
                    {race.averageTemperature !== undefined && race.averageTemperature !== null
                      ? `${Math.round(race.averageTemperature * 9/5 + 32)}°F`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Men's CR</p>
                  <p className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
                    {race.mensCourseRecord || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-1">Women's CR</p>
                  <p className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
                    {race.womensCourseRecord || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <a
              href={`/races/${race.slug.current}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium text-sm transition-all hover:opacity-90 shadow-sm"
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
                className="inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium text-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm"
              >
                Official Site
              </a>
            )}
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
