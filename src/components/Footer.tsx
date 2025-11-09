// src/components/Footer.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'

export default function Footer() {
  const { isDark } = useContext(DarkModeContext)

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16">
          {/* Left: Logo & About */}
          <div className="max-w-md">
            <Link href="/" className="inline-block mb-6">
              <Image
                src={isDark ? "/images/logo_white.svg" : "/images/logo.svg"}
                alt="Distanz Running"
                width={210}
                height={56}
                className="h-12 md:h-14 w-auto"
                priority
              />
            </Link>
            <p className="text-body-distanz text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Distanz Running delivers in-depth gear reviews, race guides, and expert insights for runners of all levels. From carbon-plated shoes to marathon majors, we help you go the distance.
            </p>
          </div>

          {/* Right: Two Columns */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {/* Connect Column */}
            <div>
              <h3 className="font-playfair text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://www.instagram.com/distanzrunning/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://x.com/distanzrunning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    X / Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.strava.com/clubs/distanzrunning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Strava
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.youtube.com/@distanzrunning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-playfair text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partner"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Partner with us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/write"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Write for us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Line */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center md:text-left">
            © {new Date().getFullYear()} Distanz Running. All rights reserved.{' '}
            <Link
              href="/privacy"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link
              href="/terms"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
