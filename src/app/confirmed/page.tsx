// app/confirmed/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DarkModeProvider } from '@/components/DarkModeProvider'
import SocialLinks from '@/components/SocialLinks'

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
          
          {/* Main Heading - Inter font for consistency */}
          {already ? (
            <h1 className="text-3xl md:text-4xl font-semibold text-textDefault transition-colors duration-300 mb-4">
              Already Confirmed!
            </h1>
          ) : (
            <h1 className="text-3xl md:text-4xl font-semibold text-textDefault transition-colors duration-300 mb-4">
              You're All Set!
            </h1>
          )}
          
          {/* Description */}
          <div className="text-sm md:text-base text-textSubtle mb-6 transition-colors duration-300 leading-relaxed">
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

      {/* Social links and footer */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <SocialLinks />
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