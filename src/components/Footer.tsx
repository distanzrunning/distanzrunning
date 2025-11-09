// src/components/Footer.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { DarkModeContext } from './DarkModeProvider'
import { ChevronRight } from 'lucide-react'

export default function Footer() {
  const { isDark } = useContext(DarkModeContext)

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 pt-16 md:pt-20">
        <div className="flex flex-col md:flex-row md:justify-between gap-16 md:gap-24">
          {/* Left: Logo, About, Social Icons */}
          <div className="flex-shrink-0 max-w-sm">
            <Link href="/" className="inline-block mb-6">
              <Image
                src={isDark ? "/images/logo_white.svg" : "/images/logo.svg"}
                alt="Distanz Running"
                width={210}
                height={56}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <p className="text-footer-link text-neutral-600 dark:text-neutral-400 mb-10">
              Distanz Running delivers in-depth gear reviews, race guides, and expert insights for runners of all levels. From carbon-plated shoes to marathon majors, we help you go the distance.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/distanzrunning/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="https://x.com/distanzrunning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110"
                aria-label="X / Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.strava.com/clubs/distanzrunning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110"
                aria-label="Strava"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/distanz-running/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Category and Company Columns */}
          <div className="flex flex-row gap-8 md:gap-12">
            {/* Category Column */}
            <div className="w-[160px]">
              <h3 className="text-footer-heading text-neutral-900 dark:text-neutral-900 mb-4">
                Category
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/articles/category/road"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Road
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles/category/track"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Track
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles/category/trail"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Trail
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gear"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Gear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/races"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Races
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="w-[160px]">
              <h3 className="text-footer-heading text-neutral-900 dark:text-neutral-900 mb-4">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partner"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Partner with us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/write"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Write for us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-footer-link text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Section - Separate Container */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-footer-link text-neutral-900 dark:text-neutral-900">
            <div className="flex flex-wrap items-center gap-x-2">
              <Link
                href="/terms"
                className="inline-flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-600 hover:underline transition-colors"
              >
                Terms of Service
                <ChevronRight className="w-3 h-3" />
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-600 hover:underline transition-colors"
              >
                Privacy Policy
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-500">© {new Date().getFullYear()} Distanz Running Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
