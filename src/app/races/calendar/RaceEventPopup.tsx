'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ExternalLink, MapPin, Calendar, DollarSign, Star, TrendingUp } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import type { RaceGuide } from '../page'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface RaceEventPopupProps {
  race: RaceGuide | null
  onClose: () => void
}

export function RaceEventPopup({ race, onClose }: RaceEventPopupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 })

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

  // Drag handlers with useCallback to prevent recreating on every render
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newX = e.clientX - dragRef.current.startX
    const newY = e.clientY - dragRef.current.startY
    setPosition({ x: newX, y: newY })
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    }
  }

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <Dialog.Root open={!!race} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop/Overlay - No blur, no animations */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />

        {/* Dialog Content - Custom Draggable */}
        <Dialog.Content
          asChild
          onPointerDownOutside={() => {
            // Close on backdrop click
            onClose()
          }}
          onEscapeKeyDown={() => {
            // Close on Escape key
            onClose()
          }}
        >
          <div
            className="fixed w-[90vw] max-w-2xl z-50"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            }}
          >
            {/* Window Container */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden flex flex-col max-h-[85vh]">
              {/* Title Bar - Draggable Handle */}
              <div
                onMouseDown={handleMouseDown}
                className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 px-4 py-3 flex items-center justify-between select-none cursor-move"
              >
              <Dialog.Title className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {race.title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                  aria-label="Close window"
                >
                  <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </button>
              </Dialog.Close>
            </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                {/* Hero Image */}
                {imageUrl && (
                  <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={imageUrl}
                      alt={race.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 672px"
                    />
                  </div>
                )}

                {/* Content Area */}
                <div className="p-6">
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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
