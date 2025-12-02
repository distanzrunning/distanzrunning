'use client'

import { format } from 'date-fns'
import { Window } from '@progress/kendo-react-dialogs'
import type { RaceGuide } from '../page'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'

interface RaceEventPopupProps {
  race: RaceGuide | null
  onClose: () => void
}

// Helper function to format location from city, state/region, and country
function formatLocation(city?: string, stateRegion?: string, country?: string): string {
  const parts = [city, stateRegion, country].filter(Boolean)
  return parts.join(', ')
}

export function RaceEventPopup({ race, onClose }: RaceEventPopupProps) {
  if (!race) return null

  const imageUrl = race.mainImage ? urlFor(race.mainImage)?.width(800).height(520).url() : null

  return (
    <Window
      title={race.title}
      onClose={onClose}
      initialHeight={600}
      initialWidth={672}
      initialTop={window.innerHeight / 2 - 300}
      initialLeft={window.innerWidth / 2 - 336}
      minWidth={400}
      minHeight={300}
      stage="DEFAULT"
      draggable={true}
      resizable={true}
      modal={false}
    >
      {/* Content - Styled like race guide cards */}
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col">
          {/* Image Container */}
          <div className="relative w-full">
            {/* Image Wrapper */}
            <div className="relative overflow-hidden rounded-t-lg">
              <div style={{ paddingBottom: '65%' }} className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={race.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}

                {/* Frosted Glass Overlay - Always visible in popup (no hover) */}
                <div className="absolute inset-0 backdrop-blur-md opacity-100 flex items-center justify-center">
                  <div className="flex flex-row gap-6 px-6 flex-wrap justify-center">
                    {/* Surface Pill */}
                    {race.surface && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                            Surface
                          </p>
                        </div>
                        <p className="font-body text-base font-bold text-white">
                          {race.surface}
                        </p>
                        <p className="font-body text-xs font-normal text-white">
                          {race.surfaceBreakdown || 'N/A'}
                        </p>
                      </div>
                    )}

                    {/* Price Pill */}
                    {race.price !== undefined && race.price !== null && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                            Price
                          </p>
                        </div>
                        <p className="font-body text-base font-bold text-white">
                          {formatPrice(convertCurrencySync(race.price, race.currency || 'USD', 'USD'), 'USD')}
                        </p>
                        <p className="font-body text-xs font-normal text-white">
                          Variable
                        </p>
                      </div>
                    )}

                    {/* Elevation Pill */}
                    {race.elevationGain !== undefined && race.elevationGain !== null && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                            Elevation
                          </p>
                        </div>
                        <p className="font-body text-base font-bold text-white">
                          {race.profile ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1) : 'N/A'}
                        </p>
                        <p className="font-body text-xs font-normal text-white">
                          {Math.round(race.elevationGain * 3.28084).toLocaleString()}ft
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-b-lg px-5 py-5">
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

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={`/races/${race.slug.current}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-electric-pink hover:bg-electric-pink/90 text-white rounded-lg font-medium text-sm transition-colors"
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
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
