'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { RaceGuide } from '../page'
import { urlFor } from '@/sanity/lib/image'
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'
import { DraggableWindow } from '@/components/DraggableWindow'
import { Route, Wallet, Users, ArrowUpRight, ArrowDownRight, Mountain, ThermometerSun, Medal, Settings2 } from 'lucide-react'

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
  const [useMetric, setUseMetric] = useState(false)

  if (!race) return null

  const imageUrl = race.mainImage ? urlFor(race.mainImage)?.width(800).height(520).url() : null

  // Determine if we should show local currency
  const showLocalCurrency = useMetric && race.currency && race.currency !== 'USD'

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
            <div className="flex items-center gap-4">
              {/* Date - Left Side */}
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

              {/* Title and Location - Right Side */}
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
            </div>
          </div>

          {/* Key Details Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-body text-sm font-medium text-neutral-600 dark:text-neutral-400">Key Details</h4>

              {/* Unit Toggle */}
              <button
                onClick={() => setUseMetric(!useMetric)}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                title={useMetric ? 'Switch to Imperial' : 'Switch to Metric'}
                aria-label="Toggle units"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Route className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Surface</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.surface || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Wallet className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Entry Price</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.price !== undefined && race.price !== null
                        ? showLocalCurrency
                          ? formatPrice(race.price, race.currency!)
                          : formatPrice(convertCurrencySync(race.price, race.currency || 'USD', 'USD'), 'USD')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Finishers</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.finishers ? race.finishers.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Elev. Gain</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.elevationGain !== undefined && race.elevationGain !== null
                        ? useMetric
                          ? `${Math.round(race.elevationGain).toLocaleString()}m`
                          : `${Math.round(race.elevationGain * 3.28084).toLocaleString()}ft`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ArrowDownRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Elev. Loss</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.elevationLoss !== undefined && race.elevationLoss !== null
                        ? useMetric
                          ? `${Math.round(race.elevationLoss).toLocaleString()}m`
                          : `${Math.round(race.elevationLoss * 3.28084).toLocaleString()}ft`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Mountain className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Profile</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.profile ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <ThermometerSun className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Avg. Temp</p>
                    <p className="font-body text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {race.averageTemperature !== undefined && race.averageTemperature !== null
                        ? useMetric
                          ? `${Math.round(race.averageTemperature)}°C`
                          : `${Math.round(race.averageTemperature * 9/5 + 32)}°F`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Medal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Men's CR</p>
                    <p
                      className="font-mono text-sm font-medium text-neutral-900 dark:text-white truncate"
                      title={race.mensCourseRecordAthlete && race.mensCourseRecordCountry
                        ? `${race.mensCourseRecordAthlete}\n${race.mensCourseRecordCountry}`
                        : ''}
                      style={{ cursor: race.mensCourseRecordAthlete ? 'help' : 'default' }}
                    >
                      {race.mensCourseRecord || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-10 h-10">
                    <Medal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-neutral-500 dark:text-neutral-500 mb-0.5">Women's CR</p>
                    <p
                      className="font-mono text-sm font-medium text-neutral-900 dark:text-white truncate"
                      title={race.womensCourseRecordAthlete && race.womensCourseRecordCountry
                        ? `${race.womensCourseRecordAthlete}\n${race.womensCourseRecordCountry}`
                        : ''}
                      style={{ cursor: race.womensCourseRecordAthlete ? 'help' : 'default' }}
                    >
                      {race.womensCourseRecord || 'N/A'}
                    </p>
                  </div>
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
