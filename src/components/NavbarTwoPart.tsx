// src/components/NavbarTwoPart.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ArrowLeft,
  Footprints,
  Watch,
  Zap,
  UtensilsCrossed,
  Menu,
  X,
  FileText,
  Database,
  Flag,
  Calendar,
  MountainSnow
} from 'lucide-react'

type NavbarProps = {
  featuredGear: {
    title: string
    slug: { current: string }
    mainImage: any
    featuredImage?: any
    excerpt?: string
  } | null,
  featuredRace: {
    title: string
    slug: { current: string }
    mainImage: any
    eventDate?: string
    location?: string
  } | null
}

export default function NavbarTwoPart({ featuredGear, featuredRace }: NavbarProps) {
  const [isPastThreshold, setIsPastThreshold] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'gear' | 'races' | null>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
  const scrollThreshold = 80

  const handleOpenDropdown = (dropdown: 'gear' | 'races') => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setOpenDropdown(dropdown)
  }

  const handleStartClose = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
    setCloseTimeout(timeout)
  }

  const handleCancelClose = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > scrollThreshold)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (closeTimeout) clearTimeout(closeTimeout)
    }
  }, [closeTimeout, scrollThreshold])

  return (
    <>
      {/* Desktop Navigation - Two Part Structure (Art Newspaper Style) */}

      {/* Part 1: Main Header (Relative - Scrolls Away Naturally) */}
      <header className="relative w-full z-40 hidden md:block pt-4 pb-6">
        <div className="flex justify-center px-6 lg:px-8">
          <div className="w-full max-w-7xl flex justify-between items-center">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.svg"
                alt="Distanz Running Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Right: Newsletter Button */}
            <Link
              href="/newsletter"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-pink-600 rounded-md transition-colors duration-200"
            >
              Newsletter
            </Link>
          </div>
        </div>

        {/* Navigation links below logo/button */}
        <div className="flex justify-center px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-6" onMouseLeave={handleStartClose}>
            <Link
              href="/articles/category/road"
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
              style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
            >
              Road
            </Link>
            <Link
              href="/articles/category/track"
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
              style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
            >
              Track
            </Link>
            <Link
              href="/articles/category/trail"
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
              style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
            >
              Trail
            </Link>

            {/* Gear Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleOpenDropdown('gear')}
              onMouseLeave={handleCancelClose}
            >
              <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                Gear
                <div className="ml-1 w-4 h-4 relative">
                  <div className={`absolute inset-0 transition-transform duration-200 ${openDropdown === 'gear' ? 'rotate-0' : ''}`}>
                    <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${openDropdown === 'gear' ? 'scale-0' : 'scale-100'}`}></div>
                  </div>
                </div>
              </button>
            </div>

            {/* Races Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleOpenDropdown('races')}
              onMouseLeave={handleCancelClose}
            >
              <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                Races
                <div className="ml-1 w-4 h-4 relative">
                  <div className={`absolute inset-0 transition-transform duration-200 ${openDropdown === 'races' ? 'rotate-0' : ''}`}>
                    <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${openDropdown === 'races' ? 'scale-0' : 'scale-100'}`}></div>
                  </div>
                </div>
              </button>
            </div>

            <Link
              href="/about"
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
              style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Part 2: Sticky Compact Nav (Hidden Initially, Appears on Scroll) */}
      <nav className={`sticky top-0 w-full z-50 hidden md:block -mt-20 transition-all duration-300 ${
        isPastThreshold
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white/90 backdrop-blur-[15px] border-b border-gray-200">
          <div className="flex justify-center px-6 lg:px-8">
            <div className="w-full max-w-7xl flex items-center gap-6 py-3" onMouseLeave={handleStartClose}>
              {/* Logo (compact) */}
              <Link href="/" className="flex items-center">
                <img
                  src="/images/logo.svg"
                  alt="Distanz Running Logo"
                  className="h-8 w-auto"
                />
              </Link>

              {/* Navigation links */}
              <div className="flex items-center gap-6 flex-1">
                <Link
                  href="/articles/category/road"
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
                  style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                >
                  Road
                </Link>
                <Link
                  href="/articles/category/track"
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
                  style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                >
                  Track
                </Link>
                <Link
                  href="/articles/category/trail"
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
                  style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                >
                  Trail
                </Link>

                {/* Gear Dropdown Trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenDropdown('gear')}
                  onMouseLeave={handleCancelClose}
                >
                  <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                    Gear
                    <div className="ml-1 w-4 h-4 relative">
                      <div className={`absolute inset-0 transition-transform duration-200 ${openDropdown === 'gear' ? 'rotate-0' : ''}`}>
                        <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${openDropdown === 'gear' ? 'scale-0' : 'scale-100'}`}></div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Races Dropdown Trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenDropdown('races')}
                  onMouseLeave={handleCancelClose}
                >
                  <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                    Races
                    <div className="ml-1 w-4 h-4 relative">
                      <div className={`absolute inset-0 transition-transform duration-200 ${openDropdown === 'races' ? 'rotate-0' : ''}`}>
                        <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${openDropdown === 'races' ? 'scale-0' : 'scale-100'}`}></div>
                      </div>
                    </div>
                  </button>
                </div>

                <Link
                  href="/about"
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
                  style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                >
                  About
                </Link>
              </div>

              {/* Newsletter button */}
              <Link
                href="/newsletter"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-pink-600 rounded-md transition-colors duration-200 whitespace-nowrap"
              >
                Newsletter
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Shared Dropdown Menus (work for both header states) */}
      <div
        className="fixed left-1/2 transform -translate-x-1/2 z-40"
        style={{ top: isPastThreshold ? '60px' : '140px', perspective: '2000px', transition: 'top 0.3s ease' }}
        onMouseEnter={handleCancelClose}
        onMouseLeave={handleStartClose}
      >
        {/* Gear Dropdown */}
        {openDropdown === 'gear' && featuredGear && (
          <div className="w-screen max-w-screen-lg" style={{ pointerEvents: 'auto' }}>
            <div className="bg-white/90 backdrop-blur-[4px] border border-gray-300 rounded-xl overflow-hidden">
              <div className="flex">
                <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                  <div className="mb-6">
                    <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Gear</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Running Shoes</h3>
                    {/* Gear categories - simplified for now */}
                    <Link href="/gear/category/race-day-shoes" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Race Day Shoes</p>
                          <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Carbon plate shoes for PRs</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                  <div className="mb-6">
                    <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Featured Article</span>
                  </div>
                  <Link href={`/gear/${featuredGear.slug.current}`} className="group block h-full">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4">
                      <img
                        src={urlFor(featuredGear.featuredImage || featuredGear.mainImage).width(400).height(500).fit('crop').url()}
                        alt={featuredGear.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation - Simplified for now */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.svg"
              alt="Distanz Running Logo"
              className="h-8"
            />
          </Link>

          <Link
            href="/newsletter"
            className="px-3 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </>
  )
}
