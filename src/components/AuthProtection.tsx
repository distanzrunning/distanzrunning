// src/components/AuthProtection.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthProtectionProps {
  children: React.ReactNode
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only check authentication on staging domain
    const hostname = window.location.hostname
    
    if (hostname !== 'distanzrunning.vercel.app') {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    // Check for auth cookie
    const checkAuth = () => {
      const cookies = document.cookie
      const hasAuthCookie = cookies.includes('staging-auth=authenticated')
      
      if (!hasAuthCookie) {
        router.push('/login')
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0c0d]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}