// src/components/AuthProtection.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from "framer-motion"

interface AuthProtectionProps {
  children: React.ReactNode
}

function LoadingSpinner() {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-pink-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ willChange: 'transform' }}
    />
  )
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're on staging domain
        const hostname = window.location.hostname
        console.log('🔍 AuthProtection: Checking auth for hostname:', hostname)
        
        if (hostname !== 'distanzrunning.vercel.app') {
          // Not staging domain, allow access
          console.log('✅ AuthProtection: Not staging domain, allowing access')
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Skip auth check for login page
        if (pathname === '/login') {
          console.log('✅ AuthProtection: On login page, allowing access')
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        console.log('🔍 AuthProtection: Checking authentication status via API')

        // Check authentication status via API
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'same-origin'
        })

        if (response.ok) {
          const data = await response.json()
          console.log('🔍 AuthProtection: API response:', data)
          setIsAuthenticated(data.authenticated)
          
          if (!data.authenticated) {
            // Not authenticated, redirect to login
            console.log('🔒 AuthProtection: Not authenticated, redirecting to login')
            router.replace('/login')
            return
          } else {
            console.log('✅ AuthProtection: Authenticated, allowing access')
          }
        } else {
          // API error, assume not authenticated
          console.log('❌ AuthProtection: API error, redirecting to login')
          setIsAuthenticated(false)
          router.replace('/login')
          return
        }
      } catch (error) {
        console.error('❌ AuthProtection: Auth check failed:', error)
        setIsAuthenticated(false)
        router.replace('/login')
        return
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Show nothing while redirecting (this should be brief)
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Redirecting to login...
        </p>
      </div>
    </div>
  )
}