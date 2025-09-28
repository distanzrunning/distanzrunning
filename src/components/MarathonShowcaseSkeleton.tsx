// src/components/MarathonShowcaseSkeleton.tsx
'use client'

import React from 'react'

export function MarathonShowcaseSkeleton() {
  return (
    <div className="my-8 relative">
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden transition-colors duration-300">
        
        {/* Skeleton Tabs */}
        <nav className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-2 transition-colors duration-300">
          <div className="hidden lg:flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 px-4 py-2 rounded transition-all duration-300 ${
                  i === 0 
                    ? 'bg-neutral-200 dark:bg-neutral-600' 
                    : 'bg-transparent'
                }`}
              >
                <div className="h-4 bg-neutral-300 dark:bg-neutral-500 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Mobile tabs */}
          <div className="flex lg:hidden gap-1 overflow-x-auto scrollbar-hide">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-3 py-2 rounded transition-all duration-300 ${
                  i === 0 
                    ? 'bg-neutral-200 dark:bg-neutral-600' 
                    : 'bg-transparent'
                }`}
              >
                <div className="h-3 w-16 bg-neutral-300 dark:bg-neutral-500 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </nav>

        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:block h-[760px] relative">
          <div className="grid h-full" style={{ gridTemplateColumns: '3fr 2fr', gridTemplateRows: '495px 265px' }}>
            
            {/* Map Area */}
            <div className="border-r border-b border-neutral-200 dark:border-neutral-700 p-4">
              <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            
            {/* Stats Area */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex flex-col transition-colors duration-300">
              
              {/* Header with logo and title */}
              <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors duration-300">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Logo skeleton */}
                    <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-16 h-16 animate-pulse"></div>
                    
                    {/* Name and location skeleton */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-5 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Date skeleton */}
                  <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-16 h-16 flex flex-col items-center justify-center">
                    <div className="h-2 w-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-6 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Stats grid */}
              <div className="flex-1 flex items-center p-3 min-h-0">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="bg-white dark:bg-neutral-700 p-3 rounded border dark:border-neutral-600">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                        </div>
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="col-span-2 flex flex-col">
              <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 px-4 py-2 flex items-center justify-between">
                <div className="h-4 w-32 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
              </div>
              <div className="bg-white dark:bg-neutral-900 flex-1 p-4">
                <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout Skeleton */}
        <div className="lg:hidden">
          
          {/* Mobile header */}
          <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-14 h-14 animate-pulse"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
              </div>
              <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-14 h-14 flex flex-col items-center justify-center">
                <div className="h-2 w-6 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Mobile map */}
          <div className="h-64 border-b border-neutral-200 dark:border-neutral-700 p-4">
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          
          {/* Mobile chart */}
          <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 flex items-center justify-between">
              <div className="h-3 w-24 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
              <div className="h-5 w-12 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-neutral-900 h-48 p-3">
              <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Mobile stats */}
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-700 p-3 rounded border dark:border-neutral-600">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse"></div>
                    </div>
                    <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}