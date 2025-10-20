import React from 'react'
import { motion } from 'framer-motion'

interface MarathonSkeletonProps {
  isVisible: boolean
}

export function MarathonSkeleton({ isVisible }: MarathonSkeletonProps) {
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
            <div className="flex flex-col items-center gap-3">
              {/* Map icon skeleton */}
              <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
          {/* Header Skeleton */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="p-3 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(495px - 5rem)' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 rounded-lg p-3 transition-colors duration-300">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="col-span-2 bg-white dark:bg-neutral-900 p-4 transition-colors duration-300">
          <div className="h-full flex flex-col">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-4 animate-pulse" />
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Mobile Map Skeleton */}
        <div className="h-[400px] bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-colors duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Mobile Content Skeleton */}
        <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-800 transition-colors duration-300">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 rounded-lg p-3 transition-colors duration-300">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2 animate-pulse" />
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 transition-colors duration-300">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-40 mb-3 animate-pulse" />
              <div className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center z-50">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1.5 shadow-lg transition-colors duration-300">
          <div className="w-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl h-1.5 overflow-hidden transition-colors duration-300">
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
    </motion.div>
  )
}
