// src/components/WriteForUs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function WriteForUs() {
  return (
    <section className="w-full overflow-x-clip px-4 py-8 md:py-12">
      {/* Ad Container - Standard Display Ad Placement */}
      <div className="w-[95%] mx-auto flex flex-col items-center">
        {/* Display Ad Label */}
        <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-2">
          Advertisement
        </div>

        {/* Ad Slot - Responsive Container */}
        {/* Desktop: 970x250 (Billboard) or 728x90 (Leaderboard) */}
        {/* Mobile: 320x100 (Mobile Banner) or 300x250 (Medium Rectangle) */}
        <div className="w-full max-w-[970px] mx-auto">
          {/* Placeholder: "Write for Us" message */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            {/* Mobile: 320x100 or 300x250 */}
            <div className="block md:hidden w-full">
              <div className="flex min-h-[100px] sm:min-h-[250px] items-center justify-center p-6">
                <div className="flex flex-col gap-3 items-center text-center">
                  <h4 className="font-body text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
                    Want to create running content?
                  </h4>
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-200 font-semibold text-sm"
                  >
                    <span>Write for us</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop: 970x250 (Billboard) or 728x90 (Leaderboard) */}
            <div className="hidden md:block w-full">
              <div className="flex min-h-[90px] lg:min-h-[250px] items-center justify-center p-8">
                <div className="flex flex-col gap-4 items-center text-center">
                  <h4 className="font-body text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-white">
                    Want to create running content?
                  </h4>
                  <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
                    We want to hear from you.
                  </p>
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-200 font-semibold text-sm"
                  >
                    <span>Get in touch</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
