// src/components/NavbarAlt.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, Search } from 'lucide-react'

export default function NavbarAlt() {
  return (
    <>
      {/* Desktop & Mobile Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300" role="banner">

        {/* Skip Links for Accessibility */}
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md shadow-lg">
          Skip to Content
        </a>

        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">

          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center" title="Home">
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
            <nav className="hidden md:flex items-center gap-1" role="navigation">
              <Link
                href="/articles"
                className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Articles
              </Link>
              <Link
                href="/gear"
                className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Gear
              </Link>
              <Link
                href="/races"
                className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Races
              </Link>
              <Link
                href="/races/database"
                className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Race Database
              </Link>
            </nav>
          </div>

          {/* Right: Newsletter CTA + Menu */}
          <div className="flex items-center gap-3">
            {/* Newsletter Button - Desktop */}
            <Link
              href="/newsletter"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-electric-pink dark:hover:bg-electric-pink dark:hover:text-white rounded-md transition-colors duration-200"
            >
              Newsletter
            </Link>

            {/* Search Button */}
            <button
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Button */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
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

                  {/* Mobile Menu Header */}
                  <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="flex items-center">
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

                  {/* Mobile Menu Links */}
                  <div className="space-y-4">
                    <Dialog.Close asChild>
                      <Link
                        href="/articles"
                        className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                      >
                        Articles
                      </Link>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Link
                        href="/gear"
                        className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                      >
                        Gear
                      </Link>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Link
                        href="/races"
                        className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                      >
                        Races
                      </Link>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Link
                        href="/races/database"
                        className="block text-xl font-semibold text-neutral-900 dark:text-white hover:text-electric-pink dark:hover:text-electric-pink transition-colors py-2"
                      >
                        Race Database
                      </Link>
                    </Dialog.Close>

                    {/* Newsletter CTA - Mobile */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                      <Dialog.Close asChild>
                        <Link
                          href="/newsletter"
                          className="block w-full text-center px-6 py-3 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-electric-pink dark:hover:bg-electric-pink dark:hover:text-white rounded-md transition-colors duration-200"
                        >
                          Subscribe to Newsletter
                        </Link>
                      </Dialog.Close>
                    </div>
                  </div>
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
