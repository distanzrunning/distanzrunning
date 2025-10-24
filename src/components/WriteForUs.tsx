// src/components/WriteForUs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function WriteForUs() {
  return (
    <section className="w-full overflow-x-clip bg-gradient-to-b from-canvas to-neutralBgSubtle px-6">
      <div className="pt-0 pb-24 max-w-6xl mx-auto flex w-full flex-col">
        <div className="flex min-h-56 w-full items-center overflow-hidden rounded-2xl bg-gradient-to-b from-canvas to-neutralBgSubtle p-10 md:p-16">
          <div className="flex grow flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-6 max-w-2xl">
              {/* Heading and Description */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[1.75rem] md:text-[2.25rem] leading-tight font-semibold text-center text-textDefault">
                  Want to write and create running content?
                </h4>
                <p className="text-base md:text-lg text-center text-textSubtle">
                  We want to hear from you
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
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
