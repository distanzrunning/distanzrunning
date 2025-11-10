// src/components/NewsletterSignup.tsx
'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

export default function NewsletterSignup() {
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

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
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
    <section className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white mb-3 leading-tight">
              Sign up to <span className="font-playfair italic text-electric-pink">The Cooldown</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
              A curated selection of the latest running stories, gear reviews, and race profiles every other week direct in your inbox.
            </p>
          </div>

          {isSubmitted ? (
            <div className="w-full md:w-auto flex items-center gap-3 px-5 py-3 bg-volt-green/10 dark:bg-volt-green/20 border border-volt-green/30 dark:border-volt-green/40 rounded-lg">
              <svg className="w-5 h-5 text-volt-green dark:text-volt-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-neutral-900 dark:text-white font-medium">
                Check your email to confirm!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col gap-3 md:min-w-[400px]">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 sm:min-w-[240px] px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg text-base placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-electric-pink focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  data-attr="newsletter-footer-submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 leading-tight">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}