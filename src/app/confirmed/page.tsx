// app/confirmed/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DarkModeProvider } from '@/components/DarkModeProvider'

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const already = searchParams?.get('already')

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full text-center">
          
          {/* Success Icon - smaller */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Logo - bigger and clickable */}
          <div className="flex justify-center mb-4">
            <Link href="/">
              <img
                src="/images/logo_1.svg"
                alt="Distanz Running Logo"
                className="block dark:hidden cursor-pointer"
                style={{ height: '80px', width: 'auto' }}
              />
              <img
                src="/images/logo_white.svg"
                alt="Distanz Running Logo"
                className="hidden dark:block cursor-pointer"
                style={{ height: '80px', width: 'auto' }}
              />
            </Link>
          </div>
          
          {/* Main Heading - Playfair font, consistent sizing */}
          {already ? (
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300 mb-4">
              Already Confirmed!
            </h1>
          ) : (
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300 mb-4">
              You're All Set!
            </h1>
          )}
          
          {/* Description */}
          <div className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-6 transition-colors duration-300 leading-relaxed">
            {already ? (
              <p>
                You're already subscribed to our newsletter. Keep an eye on your inbox for our latest running content, gear reviews, and interactive race guides.
              </p>
            ) : (
              <p>
                Thanks for confirming your subscription! You'll receive our newsletter with exclusive running content, gear reviews, and interactive race guides straight to your inbox.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Social links and footer - same as preview page */}
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
            Follow us for updates
          </p>
          
          <div className="flex items-center space-x-4 justify-center mb-6">
            <a 
              href="https://x.com/DistanzRunning" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="X / Twitter" 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 512 512">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/distanz-running" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn" 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/distanzrunning/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram" 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a 
              href="https://www.strava.com/clubs/distanzrunning" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Strava" 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 384 512">
                <path d="M158.4 0L7 292h89.2l62.2-116.1L220.1 292h88.5zm150.2 292l-43.9 88.2-44.6-88.2h-67.6l112.2 220 111.5-220z"/>
              </svg>
            </a>
          </div>

          {/* Copyright footer */}
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © 2025 Distanz Running. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <DarkModeProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-white dark:bg-[#0c0c0d] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      }>
        <ConfirmedContent />
      </Suspense>
    </DarkModeProvider>
  )
}