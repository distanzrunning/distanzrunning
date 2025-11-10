// src/components/NewsletterSignup.tsx
'use client'

import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import posthog from 'posthog-js'

export default function NewsletterSignup() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!executeRecaptcha) {
      setError('reCAPTCHA not loaded. Please try again.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('newsletter_signup')

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Track newsletter signup in PostHog
        posthog.capture('newsletter_signup', {
          location: 'footer',
          email_domain: email.split('@')[1], // Track domain without PII
          source: 'newsletter_footer'
        })

        setIsSubmitted(true)
        setEmail('')
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        // Handle complex error objects from API
        let errorMessage = 'Something went wrong. Please try again.'

        if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
        } else if (data.detail) {
          errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
        } else if (data.message) {
          errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
        }

        setError(errorMessage)
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-y border-neutral-200 dark:border-neutral-800 bg-gradient-to-t from-neutral-50 dark:from-neutral-800/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex w-full flex-col justify-center gap-7 sm:flex-row sm:items-start sm:justify-between">

        {/* Left: Heading and description */}
        <div className="flex flex-col gap-2">
          <span className="text-xl md:text-2xl font-headline font-bold text-neutral-900 dark:text-white">
            Subscribe to the <i className="italic text-neutral-900 dark:text-white">Shakeout</i>
          </span>
          <span className="text-base text-neutral-600 dark:text-neutral-400 max-w-[400px]">
            Curated set of running stories, gear reviews, and race profiles every other week.
          </span>
        </div>

        {/* Right: Form */}
        <div className="flex w-full sm:max-w-md min-h-[160px] items-start">
          {isSubmitted ? (
            <div className="w-full flex items-center gap-3 px-5 py-3 bg-volt-green/10 dark:bg-volt-green/20 border border-volt-green/30 dark:border-volt-green/40 rounded-lg">
              <svg className="w-5 h-5 text-volt-green dark:text-volt-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-neutral-900 dark:text-white font-medium">
                Check your email to confirm!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-start">
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
                <div className="flex w-full flex-col gap-2">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-12 rounded-lg pl-3 pr-3 text-base placeholder:font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 disabled:opacity-40 transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  data-attr="newsletter-footer-submit"
                  disabled={isSubmitting}
                  className="group whitespace-nowrap font-medium text-lg relative m-0 flex cursor-pointer select-none items-center rounded-lg border-none p-0 no-underline outline-none transition ease-out focus-visible:outline-none active:scale-[0.98] active:duration-100 h-12 gap-2 px-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="flex min-w-0 transition-opacity opacity-100">
                    <div className="font-sans font-medium text-lg leading-snug">
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </div>
                  </div>
                </button>
              </div>
              <div className="w-full min-h-[20px]">
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400 w-full">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex w-full flex-col items-center sm:items-start">
                <div className="max-w-sm text-center sm:text-start">
                  <div className="text-balance text-neutral-500 dark:text-neutral-400 text-xs">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="https://policies.google.com/privacy" className="underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="https://policies.google.com/terms" className="underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{' '}
                    apply.
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}