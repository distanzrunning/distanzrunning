'use client'

import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'

export default function MixpanelAnalytics() {
  useEffect(() => {
    // Only initialize Mixpanel in production environment
    const isProduction = process.env.NODE_ENV === 'production'
    const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (isProduction && mixpanelToken) {
      // Initialize Mixpanel
      mixpanel.init(mixpanelToken, {
        debug: false,
        track_pageview: true,
        persistence: 'localStorage',
      })

      // Track initial page view
      mixpanel.track('Page View', {
        page: window.location.pathname,
        referrer: document.referrer,
      })

      console.log('Mixpanel initialized')
    }
  }, [])

  return null
}
