'use client'

import { useEffect, createContext, useContext } from 'react'
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

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize Mixpanel on mount
  useEffect(() => {
    initMixpanel()
  }, [])

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname, searchParams])

  const mixpanel = getMixpanel()

  return (
    <MixpanelContext.Provider value={{ mixpanel }}>
      {children}
    </MixpanelContext.Provider>
  )
}
