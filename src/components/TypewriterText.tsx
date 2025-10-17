'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Move phrases outside component to prevent recreation on every render
const PHRASES = [
  "Running News",
  "Gear Reviews",
  "Interactive Race Guides"
] as const

export function TypewriterText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = PHRASES[currentIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000)

      return () => clearTimeout(pauseTimer)
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((currentIndex + 1) % PHRASES.length)
        }
      } else {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        } else {
          setIsPaused(true)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, isPaused, currentIndex])

  return (
    <div className="inline-block relative max-w-full overflow-visible align-bottom">
      {/* Invisible placeholder to fix width */}
      <span
        className="invisible inline-block font-playfair text-xl md:text-2xl font-bold whitespace-nowrap align-bottom"
        aria-hidden="true"
      >
        Interactive Race Guides
      </span>

      {/* Animated text and cursor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end">
          <span className="font-playfair text-xl md:text-2xl font-bold text-black dark:text-white whitespace-nowrap align-bottom transition-colors duration-300">
            {currentText}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
            }}
            className="text-pink-500 dark:text-pink-400 font-playfair text-xl md:text-2xl font-bold align-bottom transition-colors duration-300"
          >
            |
          </motion.span>
        </div>
      </div>
    </div>
  )
}