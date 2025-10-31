'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

// Move phrases outside component to prevent recreation on every render
const PHRASES = [
  "Running News",
  "Gear Reviews",
  "Interactive Race Guides"
] as const

// Timing constants
const TYPING_SPEED = 100
const DELETING_SPEED = 50
const PAUSE_DURATION = 2000

export function TypewriterText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Memoize current phrase to avoid recalculation
  const currentPhrase = useMemo(() => PHRASES[currentIndex], [currentIndex])

  // Memoize timeout delay
  const timeoutDelay = useMemo(() => {
    if (isPaused) return PAUSE_DURATION
    return isDeleting ? DELETING_SPEED : TYPING_SPEED
  }, [isPaused, isDeleting])

  // Stable callback for animation logic
  const updateText = useCallback(() => {
    if (isPaused) {
      setIsPaused(false)
      setIsDeleting(true)
      return
    }

    if (isDeleting) {
      if (currentText.length > 0) {
        setCurrentText(prev => prev.slice(0, -1))
      } else {
        setIsDeleting(false)
        setCurrentIndex(prev => (prev + 1) % PHRASES.length)
      }
    } else {
      if (currentText.length < currentPhrase.length) {
        setCurrentText(currentPhrase.slice(0, currentText.length + 1))
      } else {
        setIsPaused(true)
      }
    }
  }, [currentText, currentPhrase, isDeleting, isPaused])

  useEffect(() => {
    const timer = setTimeout(updateText, timeoutDelay)
    return () => clearTimeout(timer)
  }, [updateText, timeoutDelay])

  return (
    <div className="inline-block relative max-w-full overflow-visible align-bottom">
      {/* Invisible placeholder to fix width */}
      <span
        className="invisible inline-block font-playfair text-[26px] sm:text-2xl md:text-3xl font-semibold whitespace-nowrap align-bottom"
        aria-hidden="true"
      >
        Interactive Race Guides
      </span>

      {/* Animated text and cursor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end">
          <span
            className="font-playfair text-[26px] sm:text-2xl md:text-3xl font-semibold text-black dark:text-white whitespace-nowrap align-bottom transition-colors duration-300"
            style={{ willChange: 'contents' }}
          >
            {currentText}
          </span>
          <span
            className="text-electric-pink dark:text-electric-pink font-playfair text-[26px] sm:text-2xl md:text-3xl font-semibold align-bottom transition-colors duration-300 animate-blink"
            style={{ willChange: 'opacity' }}
          >
            |
          </span>
        </div>
      </div>
    </div>
  )
}