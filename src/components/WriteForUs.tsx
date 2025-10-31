// src/components/WriteForUs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function WriteForUs() {
  return (
    <section className="w-full overflow-x-clip px-6">
      <div className="pt-0 pb-24 max-w-[calc(1024px+2rem)] mx-auto flex w-full flex-col px-4">
        <div className="flex min-h-56 w-full items-center gap-6 overflow-hidden rounded-2xl bg-gray-900 dark:bg-white p-10">
          <div className="flex grow flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-6">
              {/* Heading */}
              <div className="flex flex-col gap-3">
                <h4 className="font-playfair text-[1.75rem] md:text-[2.25rem] leading-tight font-semibold text-center text-white dark:text-gray-900">
                  Want to create running content?
                </h4>
                <p className="text-base md:text-lg text-center text-gray-300 dark:text-gray-600">
                  We want to hear from you.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-3 flex-col sm:flex-row">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-2 px-5 h-12 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-sm"
              >
                <span>Get in touch</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
