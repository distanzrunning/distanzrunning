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

    // Enhanced cookie checking with multiple retries and longer delays
    const checkAuth = (attempt = 1, maxAttempts = 5) => {
      const cookies = document.cookie
      console.log(`Auth check attempt ${attempt}:`, cookies)
      const hasAuthCookie = cookies.includes('staging-auth=authenticated')
      
      if (hasAuthCookie) {
        console.log('Auth cookie found on attempt', attempt)
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      if (attempt < maxAttempts) {
        // Exponential backoff: 200ms, 400ms, 800ms, 1600ms
        const delay = 200 * Math.pow(2, attempt - 1)
        console.log(`No auth cookie found, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`)
        
        setTimeout(() => {
          checkAuth(attempt + 1, maxAttempts)
        }, delay)
      } else {
        console.log('No auth cookie found after all attempts, redirecting to login')
        router.push('/login')
      }
    }

    // Start checking immediately
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