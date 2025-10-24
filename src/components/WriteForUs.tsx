// src/components/WriteForUs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function WriteForUs() {
  return (
    <section className="w-full overflow-x-clip bg-gradient-to-b from-canvas to-neutralBgSubtle">
      <div className="pt-0 pb-24 max-w-[calc(1024px+2rem)] mx-auto flex w-full flex-col gap-24 px-4">
        <div className="flex min-h-56 w-full items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-b from-canvas to-neutralBgSubtle p-10">
          <div className="flex grow flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar Group - Placeholder for now */}
              <div className="flex gap-3">
                <div className="flex -space-x-2">
                  {/* Placeholder avatars - you can add real images later */}
                  <div className="size-10 md:size-12 flex-shrink-0 rounded-full bg-pink-500/20 border-2 border-white flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-sm">W</span>
                  </div>
                  <div className="size-10 md:size-12 flex-shrink-0 rounded-full bg-pink-500/20 border-2 border-white flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-sm">R</span>
                  </div>
                  <div className="size-10 md:size-12 flex-shrink-0 rounded-full bg-pink-500/20 border-2 border-white flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-sm">U</span>
                  </div>
                </div>
              </div>

              {/* Heading and Description */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[2rem] md:text-[2.5rem] leading-tight font-semibold text-center text-textDefault">
                  Want to write and create running content?
                </h4>
                <p className="text-lg md:text-xl text-center text-textSubtle text-balance">
                  We want to hear from you
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-3 flex-col sm:flex-row">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-2 px-5 h-12 rounded-lg bg-gray-900 text-white hover:bg-pink-600 transition-colors duration-200 font-semibold text-sm"
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
