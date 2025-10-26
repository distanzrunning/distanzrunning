'use client'

import { useEffect, createContext, useContext, Suspense } from 'react'
import { Mixpanel } from 'mixpanel-browser'
import { initMixpanel, getMixpanel, trackPageView } from '@/lib/mixpanel'
import { usePathname, useSearchParams } from 'next/navigation'

interface MixpanelContextType {
  mixpanel: Mixpanel | null
}

const MixpanelContext = createContext<MixpanelContextType>({
  mixpanel: null,
})

export const useMixpanel = () => useContext(MixpanelContext)

function MixpanelTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname, searchParams])

  return null
}

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  // Initialize Mixpanel on mount
  useEffect(() => {
    initMixpanel()
  }, [])

  const mixpanel = getMixpanel()

  return (
    <MixpanelContext.Provider value={{ mixpanel }}>
      <Suspense fallback={null}>
        <MixpanelTracking />
      </Suspense>
      {children}
    </MixpanelContext.Provider>
  )
}
