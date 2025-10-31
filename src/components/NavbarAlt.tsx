// src/components/NavbarAlt.tsx
'use client'

import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
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
  Sun
} from 'lucide-react'
import { DarkModeContext } from './DarkModeProvider'
import { urlFor } from '@/sanity/lib/image'

type NavbarAltProps = {
  featuredGear: {
    title: string
    slug: { current: string }
    mainImage: any
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

export default function NavbarAlt({ featuredGear, featuredRace }: NavbarAltProps) {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubMenu, setMobileSubMenu] = useState<'main' | 'gear' | 'races'>('main')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Desktop & Mobile Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300" role="banner">

        {/* Skip Links for Accessibility */}
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md shadow-lg z-[100]">
          Skip to Content
        </a>

        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">

          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0" title="Home">
              <img
                src="/images/logo.svg"
                alt="Distanz Running Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/images/logo_white.svg"
                alt="Distanz Running Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              <Link
                href="/articles/category/road"
                className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Road
              </Link>
              <Link
                href="/articles/category/track"
                className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Track
              </Link>
              <Link
                href="/articles/category/trail"
                className="px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Trail
              </Link>

              {/* Gear Dropdown - Full Width */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Gear
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="w-screen bg-white dark:bg-neutral-900 border-t border-b border-neutral-200 dark:border-neutral-700 shadow-lg z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    sideOffset={0}
                    align="start"
                    alignOffset={-9999}
                  >
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Column 1: Description */}
                        <div className="border-r border-neutral-200 dark:border-neutral-700 pr-8">
                          <h3 className="font-playfair text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                            Gear
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            From carbon-plated race shoes to GPS watches and nutrition, we review the latest running gear to help you find the perfect equipment for your training and racing goals.
                          </p>
                        </div>

                        {/* Column 2: Category Links */}
                        <div className="flex flex-col gap-1">
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/race-day-shoes"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <Flag className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Race Day Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Carbon plate shoes for PRs</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/daily-trainers"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Daily Trainers</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Everyday runners</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/max-cushion-shoes"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <Footprints className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Max Cushion</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Recovery and long runs</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/tempo-shoes"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <Zap className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Tempo Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Speed work essentials</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/trail-shoes"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <MountainSnow className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Trail Shoes</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Off-road adventures</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <div className="h-px bg-neutral-200 dark:border-neutral-700 my-2" />
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/gps-watches"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <Watch className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">GPS Watches</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Track every mile</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/gear/category/nutrition"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none transition-colors"
                            >
                              <UtensilsCrossed className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold">Nutrition</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Fuel for distance</div>
                              </div>
                            </Link>
                          </DropdownMenu.Item>
                        </div>

                        {/* Column 3: Featured Article */}
                        <div>
                          {featuredGear ? (
                            <Link
                              href={`/gear/${featuredGear.slug.current}`}
                              className="block group"
                            >
                              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
                                <img
                                  src={urlFor(featuredGear.mainImage).width(400).height(500).fit('crop').url()}
                                  alt={featuredGear.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                Featured Article
                              </div>
                              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-electric-pink dark:group-hover:text-electric-pink transition-colors">
                                {featuredGear.title}
                              </h4>
                              {featuredGear.excerpt && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                  {featuredGear.excerpt}
                                </p>
                              )}
                            </Link>
                          ) : (
                            <div className="aspect-[4/5] rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                              <p className="text-neutral-400 dark:text-neutral-600">No featured article</p>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Races Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Races
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[240px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-2 z-50"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/races"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer outline-none"
                      >
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-semibold">Race Profiles</div>
                          <div className="text-xs text-neutral-500">Marathon guides</div>
                        </div>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/races/database"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer outline-none"
                      >
                        <Database className="h-4 w-4" />
                        <div>
                          <div className="font-semibold">Race Database</div>
                          <div className="text-xs text-neutral-500">Search races</div>
                        </div>
                      </Link>
                    </DropdownMenu.Item>

                    {/* Featured Race */}
                    {featuredRace && (
                      <>
                        <DropdownMenu.Separator className="h-px bg-neutral-200 dark:bg-neutral-700 my-1" />
                        <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          Featured Race
                        </DropdownMenu.Label>
                        <DropdownMenu.Item asChild>
                          <Link
                            href={`/races/${featuredRace.slug.current}`}
                            className="flex items-start gap-3 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer outline-none"
                          >
                            <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                              <img
                                src={urlFor(featuredRace.mainImage).width(100).height(75).fit('crop').url()}
                                alt={featuredRace.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-neutral-900 dark:text-white line-clamp-2">
                                {featuredRace.title}
                              </div>
                              {featuredRace.location && (
                                <div className="text-xs text-neutral-500 mt-1">
                                  {featuredRace.location}
                                </div>
                              )}
                            </div>
                          </Link>
                        </DropdownMenu.Item>
                      </>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </nav>
          </div>

          {/* Right: Newsletter CTA + Dark Mode + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Newsletter Button - Desktop - Subtle hover like Quartr */}
            <Link
              href="/newsletter"
              className="hidden md:inline-flex items-center px-4 h-9 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md transition-all duration-200 ease-out active:scale-[0.98]"
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

            {/* Mobile Menu Button */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                  title="Menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </Dialog.Trigger>
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
                          <img
                            src="/images/logo.svg"
                            alt="Distanz Running Logo"
                            className="h-8 w-auto dark:hidden"
                          />
                          <img
                            src="/images/logo_white.svg"
                            alt="Distanz Running Logo"
                            className="h-8 w-auto hidden dark:block"
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
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  )
}
