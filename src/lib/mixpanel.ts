import mixpanel, { Mixpanel } from 'mixpanel-browser'

let mixpanelInstance: Mixpanel | null = null

export const initMixpanel = (): Mixpanel | null => {
  if (typeof window === 'undefined') {
    return null
  }

  if (mixpanelInstance) {
    return mixpanelInstance
  }

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!token) {
    console.warn('Mixpanel token not found')
    return null
  }

  mixpanel.init(token, {
    debug: isDevelopment,
    track_pageview: true,
    persistence: 'localStorage',
    ignore_dnt: true,
  })

  mixpanelInstance = mixpanel

  if (isDevelopment) {
    console.log('Mixpanel initialized')
  }

  return mixpanelInstance
}

export const getMixpanel = (): Mixpanel | null => {
  if (typeof window === 'undefined') {
    return null
  }

  if (!mixpanelInstance) {
    return initMixpanel()
  }

  return mixpanelInstance
}

// Event tracking helper
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const mp = getMixpanel()
  if (mp) {
    mp.track(eventName, properties)
  }
}

// Page view tracking helper
export const trackPageView = (pageName?: string) => {
  const mp = getMixpanel()
  if (mp) {
    mp.track('Page View', {
      page: pageName || window.location.pathname,
      url: window.location.href,
      referrer: document.referrer,
    })
  }
}

// Identify user
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  const mp = getMixpanel()
  if (mp) {
    mp.identify(userId)
    if (traits) {
      mp.people.set(traits)
    }
  }
}

// Reset user (on logout)
export const resetUser = () => {
  const mp = getMixpanel()
  if (mp) {
    mp.reset()
  }
}
