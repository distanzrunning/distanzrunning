// src/components/NavbarAlt.tsx
'use client'

import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import {
  Menu,
  X,
  ChevronDown,
  Flag,
  Calendar,
  Footprints,
  Zap,
  MountainSnow,
  Watch,
  UtensilsCrossed,
  FileText,
  Database,
  ArrowLeft,
  Moon,
  Sun,
  Search as SearchIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DarkModeContext } from './DarkModeProvider'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Search from './Search'

type SanitySlug = {
  current: string
}

type FeaturedGear = {
  title: string
  slug: SanitySlug
  mainImage?: SanityImageSource | null
  excerpt?: string
}

type FeaturedRace = {
  title: string
  slug: SanitySlug
  mainImage?: SanityImageSource | null
  eventDate?: string
  location?: string
}

type NavbarAltProps = {
  featuredGear: FeaturedGear | null
  featuredRace: FeaturedRace | null
}

export default function NavbarAlt({ featuredGear, featuredRace }: NavbarAltProps) {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubMenu, setMobileSubMenu] = useState<'main' | 'gear' | 'races'>('main')
  const [mounted, setMounted] = useState(false)
  const [navValue, setNavValue] = useState('')
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll to shrink navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcut (Cmd/Ctrl + K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchDialogOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Desktop & Mobile Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 transition-all duration-300" role="banner">

        {/* Skip Links for Accessibility */}
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md shadow-lg z-[100]">
          Skip to Content
        </a>

        {/* Top Section: Logo, Search Icon, Newsletter, Dark Mode */}
        <motion.div
          className="border-b border-neutral-200 dark:border-neutral-700 overflow-hidden relative z-50"
          initial={false}
          animate={{
            height: isScrolled ? 0 : 'auto',
            opacity: isScrolled ? 0 : 1
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">

            {/* Mobile Menu Button - Left (Mobile Only) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              title="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Centered Logo - Larger when unscrolled */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center flex-shrink-0" title="Home">
              <Image
                src="/images/logo.svg"
                alt="Distanz Running Logo"
                className="h-14 w-auto dark:hidden"
                width={210}
                height={56}
                priority
              />
              <Image
                src="/images/logo_white.svg"
                alt="Distanz Running Logo"
                className="hidden h-14 w-auto dark:block"
                width={210}
                height={56}
                priority
              />
            </Link>

            {/* Right: Search Icon + Newsletter + Dark Mode */}
            <div className="ml-auto flex items-center gap-3">
              {/* Search Icon Button */}
              <button
                onClick={() => setSearchDialogOpen(true)}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                aria-label="Open search"
                title="Search (⌘K / Ctrl+K)"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Newsletter Button - Desktop */}
              <Link
                href="/newsletter"
                className="hidden md:inline-flex items-center px-4 h-9 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md transition-all duration-200 ease-out active:scale-[0.98] whitespace-nowrap"
              >
                Newsletter
              </Link>

              {/* Dark Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                  aria-label="Toggle dark mode"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Section: Centered Navigation Links */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 relative z-50">
          <div className="hidden lg:flex items-center justify-between px-4 md:px-6 lg:px-8 h-12">

            {/* Small Logo - Shows when scrolled */}
            <motion.div
              initial={false}
              animate={{
                opacity: isScrolled ? 1 : 0,
                pointerEvents: isScrolled ? 'auto' : 'none'
              }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Link href="/" className="flex items-center" title="Home">
                <Image
                  src="/images/logo.svg"
                  alt="Distanz Running Logo"
                  className="h-8 w-auto dark:hidden"
                  width={120}
                  height={32}
                  priority
                />
                <Image
                  src="/images/logo_white.svg"
                  alt="Distanz Running Logo"
                  className="hidden h-8 w-auto dark:block"
                  width={120}
                  height={32}
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation - Radix UI */}
            <NavigationMenu.Root className="relative z-10" value={navValue} onValueChange={setNavValue}>
              <NavigationMenu.List className="flex items-center gap-1">
                {/* Road Link */}
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/articles/category/road"
                      className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Road
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>

                {/* Track Link */}
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/articles/category/track"
                      className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Track
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>

                {/* Trail Link */}
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/articles/category/trail"
                      className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Trail
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>

                {/* Gear Dropdown */}
                <NavigationMenu.Item value="gear">
                  <NavigationMenu.Trigger className="group relative flex items-center gap-1 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800 data-[state=open]:text-neutral-900 dark:data-[state=open]:text-white">
                    Gear
                    <motion.div
                      animate={{ rotate: navValue === 'gear' ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </motion.div>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="mega-menu-content absolute left-0 top-0 w-full">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8 lg:py-10">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_0.75fr_1fr] md:gap-4">
                          {/* Column 1: Description */}
                          <div className="md:border-r md:border-neutral-200/70 md:pr-5 dark:md:border-neutral-800/70">
                            <h3 className="font-playfair text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                              Gear
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              From carbon-plated race shoes to GPS watches and nutrition, we review the latest running gear to help you find the perfect equipment for your training and racing goals.
                            </p>
                          </div>

                          {/* Column 2: Category Links */}
                          <div className="flex flex-col gap-0.5 md:px-2">
                            <Link
                              href="/gear/category/race-day-shoes"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Flag className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Race Day Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Carbon plate shoes for PRs</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/daily-trainers"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Daily Trainers</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Everyday runners</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/max-cushion-shoes"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Footprints className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Max Cushion</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Recovery and long runs</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/tempo-shoes"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Zap className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Tempo Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Speed work essentials</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/trail-shoes"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <MountainSnow className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Trail Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Off-road adventures</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/gps-watches"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Watch className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">GPS Watches</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Track every mile</div>
                              </div>
                            </Link>
                            <Link
                              href="/gear/category/nutrition"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <UtensilsCrossed className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Nutrition</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Fuel for distance</div>
                              </div>
                            </Link>
                          </div>

                          {/* Column 3: Featured Article */}
                          <div className="md:pl-3">
                            {featuredGear ? (
                              <Link
                                href={`/gear/${featuredGear.slug.current}`}
                                className="group block rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
                              >
                                <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                  <div className="relative aspect-[16/9]">
                                    {featuredGear.mainImage ? (
                                      <Image
                                        src={urlFor(featuredGear.mainImage).width(640).height(480).fit('crop').url()}
                                        alt={featuredGear.title}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
                                        Image coming soon
                                      </div>
                                    )}
                                    {/* Text overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 from-10% via-black/50 via-30% to-transparent to-50% flex flex-col justify-end p-4">
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                                        Featured article
                                      </div>
                                      <h4 className="text-base font-semibold text-white line-clamp-2">
                                        {featuredGear.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600">
                                No featured article
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                {/* Races Dropdown */}
                <NavigationMenu.Item value="races">
                  <NavigationMenu.Trigger className="group relative flex items-center gap-1 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800 data-[state=open]:text-neutral-900 dark:data-[state=open]:text-white">
                    Races
                    <motion.div
                      animate={{ rotate: navValue === 'races' ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </motion.div>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="mega-menu-content absolute left-0 top-0 w-full">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8 lg:py-10">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_0.75fr_1fr] md:gap-4">
                          {/* Column 1: Description */}
                          <div className="md:border-r md:border-neutral-200/70 md:pr-5 dark:md:border-neutral-800/70">
                            <h3 className="font-playfair text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                              Races
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              Explore the world&apos;s greatest marathons with detailed race guides, course analysis, and insider tips to help you prepare for your next race.
                            </p>
                          </div>

                          {/* Column 2: Race Links */}
                          <div className="flex flex-col gap-0.5 md:px-2">
                            <Link
                              href="/races"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Race Profiles</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Marathon guides & analysis</div>
                              </div>
                            </Link>
                            <Link
                              href="/races/database"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                              <Database className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Race Database</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Search races worldwide</div>
                              </div>
                            </Link>
                          </div>

                          {/* Column 3: Featured Race */}
                          <div className="md:pl-3">
                            {featuredRace ? (
                              <Link
                                href={`/races/${featuredRace.slug.current}`}
                                className="group block rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
                              >
                                <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                  <div className="relative aspect-[16/9]">
                                    {featuredRace.mainImage ? (
                                      <Image
                                        src={urlFor(featuredRace.mainImage).width(640).height(480).fit('crop').url()}
                                        alt={featuredRace.title}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
                                        Image coming soon
                                      </div>
                                    )}
                                    {/* Text overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 from-10% via-black/50 via-30% to-transparent to-50% flex flex-col justify-end p-4">
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                                        Featured race
                                      </div>
                                      <h4 className="text-base font-semibold text-white line-clamp-2">
                                        {featuredRace.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600">
                                No featured race
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

              </NavigationMenu.List>

              <NavigationMenu.Indicator className="pointer-events-none absolute top-full hidden h-2 translate-y-[6px] items-center justify-center overflow-hidden rounded-full data-[state=hidden]:animate-nav-indicator-out data-[state=visible]:animate-nav-indicator-in lg:flex">
                <span className="h-[2px] w-full rounded-full bg-neutral-900/80 dark:bg-white/80" />
              </NavigationMenu.Indicator>

              <div className="perspective-[2000px] absolute left-1/2 -translate-x-1/2 top-full w-screen pointer-events-none z-[-1]">
                <NavigationMenu.Viewport className="pointer-events-auto relative w-full h-[var(--radix-navigation-menu-viewport-height)] origin-top bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)] overflow-hidden transition-[height,transform,opacity] duration-300 ease-out data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp" />
              </div>
            </NavigationMenu.Root>

            {/* Utility Buttons - Shows when scrolled */}
            <motion.div
              className="flex items-center gap-3"
              initial={false}
              animate={{
                opacity: isScrolled ? 1 : 0,
                pointerEvents: isScrolled ? 'auto' : 'none'
              }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* Search Icon Button */}
              <button
                onClick={() => setSearchDialogOpen(true)}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                aria-label="Open search"
                title="Search (⌘K / Ctrl+K)"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                  aria-label="Toggle dark mode"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Dialog */}
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-white dark:bg-neutral-900 p-6 overflow-y-auto transition-colors duration-300">
            <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
            <Dialog.Description className="sr-only">
              Main navigation menu for Distanz Running
            </Dialog.Description>

            {/* Main Menu */}
            {mobileSubMenu === 'main' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src="/images/logo.svg"
                      alt="Distanz Running Logo"
                      className="h-8 w-auto dark:hidden"
                      width={120}
                      height={32}
                      priority
                    />
                    <Image
                      src="/images/logo_white.svg"
                      alt="Distanz Running Logo"
                      className="hidden h-8 w-auto dark:block"
                      width={120}
                      height={32}
                      priority
                    />
                  </Link>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/articles/category/road"
                    className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Road
                  </Link>
                  <Link
                    href="/articles/category/track"
                    className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track
                  </Link>
                  <Link
                    href="/articles/category/trail"
                    className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Trail
                  </Link>
                  <button
                    onClick={() => setMobileSubMenu('gear')}
                    className="flex items-center justify-between w-full text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                  >
                    Gear
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setMobileSubMenu('races')}
                    className="flex items-center justify-between w-full text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                  >
                    Races
                    <ChevronDown className="h-5 w-5" />
                  </button>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <Link
                      href="/newsletter"
                      className="block w-full text-center px-6 py-3 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md transition-all duration-200 ease-out active:scale-[0.98]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Subscribe to Newsletter
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Gear Submenu */}
            {mobileSubMenu === 'gear' && (
              <>
                <div className="flex justify-start mb-8">
                  <button
                    onClick={() => setMobileSubMenu('main')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Gear</h2>

                <div className="space-y-3">
                  <Link
                    href="/gear/category/race-day-shoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Flag className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Race Day Shoes</div>
                      <div className="text-sm text-neutral-500">Carbon plate shoes</div>
                    </div>
                  </Link>
                  <Link
                    href="/gear/category/daily-trainers"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Daily Trainers</div>
                      <div className="text-sm text-neutral-500">Everyday runners</div>
                    </div>
                  </Link>
                  <Link
                    href="/gear/category/max-cushion-shoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Footprints className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Max Cushion</div>
                      <div className="text-sm text-neutral-500">Recovery shoes</div>
                    </div>
                  </Link>
                  <Link
                    href="/gear/category/tempo-shoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Zap className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Tempo Shoes</div>
                      <div className="text-sm text-neutral-500">Speed work</div>
                    </div>
                  </Link>
                  <Link
                    href="/gear/category/trail-shoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MountainSnow className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Trail Shoes</div>
                      <div className="text-sm text-neutral-500">Off-road</div>
                    </div>
                  </Link>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-3" />
                  <Link
                    href="/gear/category/gps-watches"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Watch className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">GPS Watches</div>
                      <div className="text-sm text-neutral-500">Track every mile</div>
                    </div>
                  </Link>
                  <Link
                    href="/gear/category/nutrition"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UtensilsCrossed className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Nutrition</div>
                      <div className="text-sm text-neutral-500">Fuel for distance</div>
                    </div>
                  </Link>
                </div>
              </>
            )}

            {/* Races Submenu */}
            {mobileSubMenu === 'races' && (
              <>
                <div className="flex justify-start mb-8">
                  <button
                    onClick={() => setMobileSubMenu('main')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Races</h2>

                <div className="space-y-3">
                  <Link
                    href="/races"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Race Profiles</div>
                      <div className="text-sm text-neutral-500">Marathon guides and course analysis</div>
                    </div>
                  </Link>
                  <Link
                    href="/races/database"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Database className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Race Database</div>
                      <div className="text-sm text-neutral-500">Search and compare races worldwide</div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
      </header>

      {/* Search Dialog Modal */}
      <Dialog.Root open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl focus:outline-none overflow-hidden">
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search Distanz Running content
            </Dialog.Description>

            <div className="p-6">
              <Search
                isExpanded={searchDialogOpen}
                onExpandChange={setSearchDialogOpen}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Spacer to prevent content from hiding under fixed header - Updated height */}
      <div className="h-[8rem]" />
    </>
  )
}
