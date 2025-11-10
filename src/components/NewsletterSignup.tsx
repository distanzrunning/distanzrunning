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
    <section className="border-t border-gray-200 dark:border-neutral-700 bg-transparent py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-8 md:mb-0 max-w-md">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Go the <span className="text-electric-pink italic">Distanz</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base mt-1">
              Get a curated selection of the latest running news, gear reviews, and race profiles every week.
            </p>
          </div>

          {isSubmitted ? (
            <div className="w-full md:w-auto flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-800 dark:text-green-300 font-medium">
                Check your email to confirm!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-electric-pink dark:focus:ring-electric-pink bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  data-attr="newsletter-footer-submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
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