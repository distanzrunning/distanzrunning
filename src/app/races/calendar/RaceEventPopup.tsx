'use client'

import { ExternalLink, MapPin, Calendar, DollarSign, Star, TrendingUp } from 'lucide-react'
import { Window } from '@progress/kendo-react-dialogs'
import type { RaceGuide } from '../page'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface RaceEventPopupProps {
  race: RaceGuide | null
  onClose: () => void
}

export function RaceEventPopup({ race, onClose }: RaceEventPopupProps) {
  if (!race) return null

  const eventDate = race.eventDate ? new Date(race.eventDate) : null
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date TBA'

  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  const isWorldMajor = race.tags?.includes('Abbott World Marathon Major')

  // Determine World Athletics Label
  let labelColor = null
  let labelText = null
  if (race.tags?.includes('World Athletics Platinum Label')) {
    labelColor = 'rgba(204, 204, 204, 0.5)'
    labelText = 'Platinum Label'
  } else if (race.tags?.includes('World Athletics Gold Label')) {
    labelColor = 'rgba(255, 217, 0, 0.4)'
    labelText = 'Gold Label'
  } else if (race.tags?.includes('World Athletics Elite Label')) {
    labelColor = 'rgba(158, 140, 196, 0.4)'
    labelText = 'Elite Label'
  } else if (race.tags?.includes('World Athletics Label')) {
    labelColor = 'rgba(166, 251, 101, 0.4)'
    labelText = 'Label'
  }

  const imageUrl = race.mainImage ? urlFor(race.mainImage)?.width(600).height(400).url() : null

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* KendoReact Window */}
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
        {/* Content */}
        <div className="overflow-y-auto h-full p-6">
          {/* Hero Image */}
          {imageUrl && (
            <div className="relative w-full max-w-[600px] mx-auto h-48 mb-6 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={imageUrl}
                alt={race.title}
                fill
                className="object-cover"
                sizes="600px"
              />
            </div>
          )}

          {/* Content Area */}
          <div className="max-w-[600px] mx-auto">
            {/* Title and Badges */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-headline">
                  {race.title}
                </h2>
                {isWorldMajor && (
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {isWorldMajor && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                    Abbott World Marathon Major
                  </span>
                )}
                {labelText && (
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-neutral-900 dark:text-white"
                    style={{ backgroundColor: labelColor || 'transparent' }}
                  >
                    {labelText}
                  </span>
                )}
                {race.raceCategoryName && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    {race.raceCategoryName}
                  </span>
                )}
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="space-y-3 mb-6">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formattedDate}
                  </div>
                  {formattedTime && (
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formattedTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {(race.city || race.country) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {[race.city, race.stateRegion, race.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              )}

              {/* Distance */}
              {race.distance && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {race.distance}
                  </div>
                </div>
              )}

              {/* Price */}
              {race.price && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {race.currency || '$'}{race.price}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info - Course Records */}
            {(race.mensCourseRecord || race.womensCourseRecord) && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Course Records
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {race.mensCourseRecord && (
                    <div className="text-sm">
                      <div className="text-neutral-600 dark:text-neutral-400 mb-1">Men's</div>
                      <div className="font-mono font-medium text-neutral-900 dark:text-white">
                        {race.mensCourseRecord}
                      </div>
                      {race.mensCourseRecordAthlete && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {race.mensCourseRecordAthlete}
                          {race.mensCourseRecordCountry && ` (${race.mensCourseRecordCountry})`}
                        </div>
                      )}
                    </div>
                  )}
                  {race.womensCourseRecord && (
                    <div className="text-sm">
                      <div className="text-neutral-600 dark:text-neutral-400 mb-1">Women's</div>
                      <div className="font-mono font-medium text-neutral-900 dark:text-white">
                        {race.womensCourseRecord}
                      </div>
                      {race.womensCourseRecordAthlete && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {race.womensCourseRecordAthlete}
                          {race.womensCourseRecordCountry && ` (${race.womensCourseRecordCountry})`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

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
                <ExternalLink className="h-4 w-4" />
              </a>
              {race.officialWebsite && (
                <a
                  href={race.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Official Site
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Window>
    </>
  )
}
