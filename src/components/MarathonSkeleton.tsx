import React from 'react'
import { motion } from 'framer-motion'

interface MarathonSkeletonProps {
  isVisible: boolean
  marathonName?: string
  marathonLogo?: string
  isDarkMode?: boolean
}

export function MarathonSkeleton({ isVisible, marathonName, marathonLogo, isDarkMode }: MarathonSkeletonProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-white dark:bg-neutral-900 z-40 transition-colors duration-300"
    >
      {/* Desktop Layout Skeleton */}
      <div className="hidden lg:grid h-full" style={{ gridTemplateColumns: '3fr 2fr', gridTemplateRows: '495px 265px' }}>
        {/* Map Skeleton */}
        <div className="border-r border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 transition-colors duration-300">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              {/* Marathon Logo */}
              {marathonLogo ? (
                <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center shadow-sm">
                  <img
                    src={isDarkMode ? marathonLogo.replace('.svg', '_white.svg') : marathonLogo}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              )}
              {/* Loading text */}
              {marathonName ? (
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Loading {marathonName}...
                </p>
              ) : (
                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              )}
              {/* Loading Progress Bar */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1.5 shadow-sm transition-colors duration-300">
                <div className="w-48 bg-neutral-200 dark:bg-neutral-700 rounded-xl h-1.5 overflow-hidden transition-colors duration-300">
                  <motion.div
                    className="bg-gradient-to-r from-pink-500 to-pink-600 h-1.5 rounded-xl"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden transition-colors duration-300">
          {/* Header Skeleton - matches exact layout with logo, name/location, and date box */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors duration-300">
            <div className="flex items-center justify-between w-full">
              {/* Left side: Logo + Name/Location */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Logo Box */}
                <div className="flex-shrink-0 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1 border dark:border-neutral-600 w-16 h-16 flex items-center justify-center transition-colors duration-300">
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>

                {/* Name and Location */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>

              {/* Right side: Date Box */}
              <div className="flex-shrink-0 text-center bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600 w-16 h-16 flex flex-col items-center justify-center transition-colors duration-300">
                <div className="h-3 w-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-1 animate-pulse" />
                <div className="h-5 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton - 2 column grid with icons on right */}
          <div className="flex-1 flex items-center p-3 min-h-0">
            <div className="grid grid-cols-2 gap-3 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white dark:bg-neutral-700 p-3 rounded border dark:border-neutral-600 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-2/3 mb-1 animate-pulse" />
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4 animate-pulse" />
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-600 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="col-span-2 flex flex-col">
          {/* Chart Header with title and button */}
          <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 px-4 py-2 flex items-center justify-between flex-shrink-0 transition-colors duration-300">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse" />
            <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
          {/* Chart Content */}
          <div className="bg-white dark:bg-neutral-900 flex-1 p-4 min-h-0 transition-colors duration-300">
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden flex flex-col">
        {/* Title Section - matches mobile header with logo, name/location, and date */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 border dark:border-neutral-600 w-14 h-14 flex items-center justify-center transition-colors duration-300">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>

            {/* Name and Location */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
            </div>

            {/* Date Box */}
            <div className="flex-shrink-0 text-center bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600 w-14 h-14 flex flex-col items-center justify-center transition-colors duration-300">
              <div className="h-3 w-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-1 animate-pulse" />
              <div className="h-4 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-64 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-colors duration-300">
          <div className="flex flex-col items-center gap-3">
            {/* Marathon Logo */}
            {marathonLogo ? (
              <div className="w-16 h-16 bg-white dark:bg-neutral-700 rounded-lg p-2 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center shadow-sm">
                <img
                  src={isDarkMode ? marathonLogo.replace('.svg', '_white.svg') : marathonLogo}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            )}
            {/* Loading text */}
            {marathonName ? (
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Loading {marathonName}...
              </p>
            ) : (
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            )}
            {/* Loading Progress Bar */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1.5 shadow-sm transition-colors duration-300">
              <div className="w-40 bg-neutral-200 dark:bg-neutral-700 rounded-xl h-1.5 overflow-hidden transition-colors duration-300">
                <motion.div
                  className="bg-gradient-to-r from-pink-500 to-pink-600 h-1.5 rounded-xl"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
          {/* Chart Header */}
          <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse" />
            <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
          {/* Chart Content */}
          <div className="bg-white dark:bg-neutral-900 h-48 p-3 transition-colors duration-300">
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Section - 2 column grid */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 transition-colors duration-300">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-neutral-700 p-3 rounded border dark:border-neutral-600 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-2/3 mb-1 animate-pulse" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4 animate-pulse" />
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-600 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  )
}
