// src/components/LayoutContent.tsx
'use client'

import { usePathname } from 'next/navigation'
import NavbarAltWrapper from '@/components/NavbarAltWrapper'
import Footer from '@/components/Footer'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true'

  // Hide navbar and footer on login page
  const isLoginPage = pathname === '/login'

  if (isPreviewMode || isLoginPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <NavbarAltWrapper />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
