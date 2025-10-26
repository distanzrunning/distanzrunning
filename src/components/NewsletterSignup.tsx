// src/components/NewsletterSignup.tsx
'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Track newsletter signup in PostHog
    posthog.capture('newsletter_signup', {
      location: 'footer',
      email_domain: email.split('@')[1], // Track domain without PII
      source: 'newsletter_footer'
    })

    alert(`Subscribed with: ${email}`)
    setEmail('')
  }

  return (
    <section className="border-t border-gray-200 bg-transparent py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-8 md:mb-0 max-w-md">
            <h2 className="text-2xl font-bold text-dark">
              Go the <span className="text-primary italic">Distanz</span>
            </h2>
            <p className="text-muted text-sm md:text-base mt-1">
              Get a curated selection of the latest running news, gear reviews, and race profiles every week.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-dark text-white text-sm font-semibold hover:bg-primary transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}