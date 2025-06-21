// src/components/NavbarClient.tsx
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

type MobileMenuProps = {
  featuredGear: {
    title: string
    slug: { current: string }
    mainImage: any
    featuredImage?: any
    excerpt?: string
  } | null
  featuredRace: {
    title: string
    slug: { current: string }
    mainImage: any
    eventDate?: string
    location?: string
  } | null
}

export default function Navbar({ featuredGear, featuredRace }: NavbarProps) {
  const [isPastThreshold, setIsPastThreshold] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'gear' | 'races' | null>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
  const scrollThreshold = 60

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
    const handleScroll = () => setIsPastThreshold(window.scrollY > scrollThreshold)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (closeTimeout) clearTimeout(closeTimeout)
    }
  }, [closeTimeout])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed w-full z-50 hidden md:block">
        <div className="flex justify-center px-6 lg:px-8" style={{ paddingTop: isPastThreshold ? '1rem' : '1rem' }}>
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Floating Logo */}
            <div className={`pointer-events-auto absolute left-0 z-1 flex h-full items-center px-4 transition-all duration-500 ease-out ${
              isPastThreshold ? 'opacity-0 blur-sm -translate-x-8' : 'opacity-100 blur-0 translate-x-0'
            }`}>
              <div className="px-2">
                <Link href="/" className="flex items-center">
                  <img
                    src="/images/logo.svg"
                    alt="Distanz Running Logo"
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
            
            {/* Right Side Newsletter Button (when not scrolled) */}
            <div className={`pointer-events-auto absolute right-0 z-1 flex h-full items-center px-4 transition-all duration-500 ease-out ${
              isPastThreshold ? 'opacity-0 blur-sm translate-x-8' : 'opacity-100 blur-0 translate-x-0'
            }`}>
              <Link
                href="/newsletter"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-pink-600 rounded-md transition-colors duration-200"
              >
                Newsletter
              </Link>
            </div>
          </div>

          {/* Center Navigation Container */}
          <div className="pointer-events-auto relative flex justify-center items-center w-auto" onMouseLeave={handleStartClose}>
            <div className={`border-b border-gray-200 after:bg-gradient-to-b after:from-white/90 after:to-transparent md:border md:border-gray-300 md:px-1.5 transition-all duration-300 ease-out backdrop-blur-[15px] w-max ${
              isPastThreshold 
                ? 'bg-white/60 rounded-xl' 
                : 'bg-white/60 rounded-xl'
            }`}>
              <div className="relative">
                <div className="flex justify-center items-center">
                  
                  {/* Logo (when scrolled) - Fixed positioning */}
                  <div className={`transition-all duration-500 ease-out ${
                    isPastThreshold
                      ? 'opacity-100 blur-0 translate-x-0 w-auto mr-6 pointer-events-auto'
                      : 'opacity-0 blur-sm -translate-x-8 w-0 mr-0 pointer-events-none overflow-hidden'
                  }`}>
                    <Link href="/" className="flex items-center px-2">
                      <img
                        src="/images/logo.svg"
                        alt="Distanz Running Logo"
                        className="h-8 w-auto"
                      />
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex items-center space-x-0">
                    <Link
                      href="/articles/category/road"
                      className="px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]"
                      style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                    >
                      Road
                    </Link>
                    <Link
                      href="/articles/category/track"
                      className="px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]"
                      style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                    >
                      Track
                    </Link>
                    <Link
                      href="/articles/category/trail"
                      className="px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]"
                      style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                    >
                      Trail
                    </Link>

                    {/* Gear Dropdown */}
                    <div
                      className="relative"
                      onMouseEnter={() => handleOpenDropdown('gear')}
                      onMouseLeave={handleCancelClose}
                    >
                      <button className="flex items-center px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                        Gear
                        <div className="ml-1 w-4 h-4 relative">
                          <div className={`absolute inset-0 transition-transform duration-200 ${
                            openDropdown === 'gear' ? 'rotate-0' : ''
                          }`}>
                            <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                              openDropdown === 'gear' ? 'scale-0' : 'scale-100'
                            }`}></div>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Races Dropdown */}
                    <div
                      className="relative"
                      onMouseEnter={() => handleOpenDropdown('races')}
                      onMouseLeave={handleCancelClose}
                    >
                      <button className="flex items-center px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                        Races
                        <div className="ml-1 w-4 h-4 relative">
                          <div className={`absolute inset-0 transition-transform duration-200 ${
                            openDropdown === 'races' ? 'rotate-0' : ''
                          }`}>
                            <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            <div className={`w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                              openDropdown === 'races' ? 'scale-0' : 'scale-100'
                            }`}></div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <Link
                      href="/about"
                      className="px-3 py-4 text-gray-700 hover:text-gray-900 transition-all duration-200 md:py-[15px]"
                      style={{ fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}
                    >
                      About
                    </Link>
                  </div>

                  {/* Newsletter Button (when scrolled) - Fixed positioning */}
                  <div className={`transition-all duration-500 ease-out ${
                    isPastThreshold 
                      ? 'opacity-100 blur-0 translate-x-0 w-auto ml-6 pointer-events-auto'
                      : 'opacity-0 blur-sm translate-x-8 w-0 ml-0 pointer-events-none overflow-hidden'
                  }`}>
                    <Link
                      href="/newsletter"
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-pink-600 rounded-md transition-colors duration-200 whitespace-nowrap"
                    >
                      Newsletter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Containers */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 top-full z-50 mt-2"
          style={{ perspective: '2000px' }}
          onMouseEnter={handleCancelClose}
          onMouseLeave={handleStartClose}
        >
          {/* Gear Dropdown */}
          {openDropdown === 'gear' && (
            <div
              className="w-screen max-w-screen-lg"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="bg-white/90 backdrop-blur-[4px] border border-gray-300 rounded-xl overflow-hidden">
                <div className="flex">
                  {/* Left Column - Categories */}
                  <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                    <div className="mb-6">
                      <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Gear</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Running Shoes</h3>
                      <Link href="/gear/category/race-day-shoes" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Flag className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Race Day Shoes</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Carbon plate shoes for PRs</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gear/category/daily-trainers" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Daily Trainers</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Reliable everyday runners</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gear/category/max-cushion-shoes" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Footprints className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Max Cushion</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Recovery and long runs</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gear/category/tempo-shoes" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Tempo Shoes</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Speed work essentials</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gear/category/trail-shoes" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <MountainSnow className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Trail Shoes</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Off-road adventures</p>
                          </div>
                        </div>
                      </Link>
                      
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 pt-2">Tech & Nutrition</h3>
                      <Link href="/gear/category/gps-watches" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Watch className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>GPS Watches</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Track every mile</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gear/category/nutrition" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <UtensilsCrossed className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Nutrition</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Fuel for the distance</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Featured */}
                  <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                    <div className="mb-6">
                      <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Featured Article</span>
                    </div>
                    {featuredGear && (
                      <Link href={`/gear/${featuredGear.slug.current}`} className="group block h-full">
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4">
                          <img
                            src={urlFor(featuredGear.featuredImage || featuredGear.mainImage).width(400).height(500).fit('crop').url()}
                            alt={featuredGear.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-3 inline-block">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-black" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Read article</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                                  <path d="m9 18 6-6-6-6"></path>
                                </svg>
                              </div>
                              <p className="text-black" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '21px' }}>{featuredGear.title}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Races Dropdown */}
          {openDropdown === 'races' && (
            <div
              className="w-screen max-w-screen-lg"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="bg-white/90 backdrop-blur-[4px] border border-gray-300 rounded-xl overflow-hidden">
                <div className="flex">
                  {/* Left Column - Race Links */}
                  <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                    <div className="mb-6">
                      <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Race Resources</span>
                    </div>
                    <div className="space-y-1">
                      <Link href="/races" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Race Profiles</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>In-depth marathon guides and course analysis</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/races/database" className="group block p-3 rounded-lg hover:bg-black transition-colors">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 group-hover:text-white" style={{ fontWeight: 550, fontSize: '15px', lineHeight: '21px' }}>Race Database</p>
                            <p className="text-gray-500 mt-1 group-hover:text-gray-300" style={{ fontWeight: 400, fontSize: '13px', lineHeight: '18px' }}>Search and compare races worldwide</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Featured Race */}
                  <div className="flex-shrink-0 flex-grow p-6" style={{ flexBasis: '50%' }}>
                    <div className="mb-6">
                      <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Featured Race</span>
                    </div>
                    {featuredRace && (
                      <Link href={`/races/${featuredRace.slug.current}`} className="group block h-full">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                          <img
                            src={urlFor(featuredRace.mainImage).width(400).height(250).fit('crop').url()}
                            alt={featuredRace.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-3 inline-block">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-black" style={{ fontWeight: 600, fontSize: '15px', lineHeight: '21px' }}>Explore race</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                                  <path d="m9 18 6-6-6-6"></path>
                                </svg>
                              </div>
                              <p className="text-black" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '21px' }}>{featuredRace.title}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.svg"
              alt="Distanz Running Logo"
              className="h-8"
            />
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/newsletter"
              className="px-3 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors"
            >
              Newsletter
            </Link>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="p-2 text-gray-700 hover:text-gray-900">
                  <Menu className="h-6 w-6" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-white p-6 overflow-y-auto">
                  <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Main navigation menu for Distanz Running
                  </Dialog.Description>
                  <MobileMenu featuredGear={featuredGear} featuredRace={featuredRace} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </nav>
    </>
  )
}

export function MobileMenu({ featuredGear, featuredRace }: MobileMenuProps) {
  const [currentMenu, setCurrentMenu] = useState<'main' | 'gear' | 'races'>('main')

  const renderMainMenu = () => (
    <>
      <div className="flex justify-end mb-8">
        <Dialog.Close asChild>
          <button className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </Dialog.Close>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Dialog.Close asChild>
            <Link href="/articles/category/road" className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Road
            </Link>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Link href="/articles/category/track" className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Track
            </Link>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Link href="/articles/category/trail" className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Trail
            </Link>
          </Dialog.Close>
          <button
            onClick={() => setCurrentMenu('gear')}
            className="flex items-center justify-between w-full text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            Gear
            <div className="w-4 h-4 relative">
              <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </button>
          <button
            onClick={() => setCurrentMenu('races')}
            className="flex items-center justify-between w-full text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            Races
            <div className="w-4 h-4 relative">
              <div className="w-[9px] h-[1px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-[1px] h-[9px] bg-gray-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </button>
          <Dialog.Close asChild>
            <Link href="/about" className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors">
              About
            </Link>
          </Dialog.Close>
        </div>
      </div>
    </>
  )

  const renderGearMenu = () => (
    <>
      <div className="flex justify-start mb-8">
        <button
          onClick={() => setCurrentMenu('main')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Gear Categories</h2>
        <div className="space-y-4">
          {[
            { href: '/gear/category/race-day-shoes', icon: Flag, title: 'Race Day Shoes', desc: 'Carbon plate racing shoes' },
            { href: '/gear/category/daily-trainers', icon: Calendar, title: 'Daily Trainers', desc: 'Everyday running shoes' },
            { href: '/gear/category/max-cushion-shoes', icon: Footprints, title: 'Max Cushion', desc: 'Recovery running shoes' },
            { href: '/gear/category/tempo-shoes', icon: Zap, title: 'Tempo Shoes', desc: 'Speed work essentials' },
            { href: '/gear/category/trail-shoes', icon: MountainSnow, title: 'Trail Shoes', desc: 'Off-road running shoes' },
            { href: '/gear/category/gps-watches', icon: Watch, title: 'GPS Watches', desc: 'Running tracking devices' },
            { href: '/gear/category/nutrition', icon: UtensilsCrossed, title: 'Nutrition', desc: 'Running fuel and hydration' },
          ].map((item) => (
            <Dialog.Close key={item.href} asChild>
              <Link
                href={item.href}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-black transition-colors group"
              >
                <item.icon className="h-6 w-6 text-gray-400 group-hover:text-white" />
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 group-hover:text-gray-300">{item.desc}</p>
                </div>
              </Link>
            </Dialog.Close>
          ))}
        </div>

        {featuredGear && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Featured Article</h3>
            <Dialog.Close asChild>
              <Link href={`/gear/${featuredGear.slug.current}`} className="block">
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={urlFor(featuredGear.featuredImage || featuredGear.mainImage).width(100).height(125).fit('crop').url()}
                      alt={featuredGear.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{featuredGear.title}</p>
                    {featuredGear.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">{featuredGear.excerpt}</p>
                    )}
                  </div>
                </div>
              </Link>
            </Dialog.Close>
          </div>
        )}
      </div>
    </>
  )

  const renderRacesMenu = () => (
    <>
      <div className="flex justify-start mb-8">
        <button
          onClick={() => setCurrentMenu('main')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Race Resources</h2>
        <div className="space-y-4">
          <Dialog.Close asChild>
            <Link
              href="/races"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-black transition-colors group"
            >
              <FileText className="h-6 w-6 text-gray-400 group-hover:text-white" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-white">Race Profiles</p>
                <p className="text-sm text-gray-600 group-hover:text-gray-300">Marathon guides and course analysis</p>
              </div>
            </Link>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Link
              href="/races/database"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-black transition-colors group"
            >
              <Database className="h-6 w-6 text-gray-400 group-hover:text-white" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-white">Race Database</p>
                <p className="text-sm text-gray-600 group-hover:text-gray-300">Search races worldwide</p>
              </div>
            </Link>
          </Dialog.Close>
        </div>

        {featuredRace && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Featured Race</h3>
            <Dialog.Close asChild>
              <Link href={`/races/${featuredRace.slug.current}`} className="block">
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={urlFor(featuredRace.mainImage).width(120).height(80).fit('crop').url()}
                      alt={featuredRace.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{featuredRace.title}</p>
                    {featuredRace.location && (
                      <p className="text-sm text-gray-600">{featuredRace.location}</p>
                    )}
                  </div>
                </div>
              </Link>
            </Dialog.Close>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {currentMenu === 'main' && renderMainMenu()}
      {currentMenu === 'gear' && renderGearMenu()}
      {currentMenu === 'races' && renderRacesMenu()}
    </>
  )
}