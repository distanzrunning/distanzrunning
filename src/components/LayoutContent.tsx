// src/components/LayoutContent.tsx
'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface LayoutContentProps {
  children: ReactNode
  navbar: ReactNode
  footer: ReactNode
}

export default function LayoutContent({ children, navbar, footer }: LayoutContentProps) {
  const pathname = usePathname()
  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true'

  // Hide navbar and footer on login page
  const isLoginPage = pathname === '/login'

  // Hide footer on calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === '/races/calendar'

  if (isPreviewMode || isLoginPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="main-wrapper">
      <div className="main-bordered min-h-screen flex flex-col">
        {navbar}
        <main className="flex-grow pt-6 bg-white dark:bg-[#0c0c0d] transition-colors duration-300">{children}</main>
        {!isCalendarPage && footer}
      </div>
    </div>
  )
}
