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
  // Check if we're on staging domain BEFORE setting initial state
  const isStagingDomain = typeof window !== 'undefined' && window.location.hostname === 'distanzrunning.vercel.app'

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(isStagingDomain ? null : true)
  const [isLoading, setIsLoading] = useState(isStagingDomain)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check if not on staging domain
    if (!isStagingDomain) {
      return
    }

    const checkAuth = async () => {
      try {
        // Skip auth check for login page
        if (pathname === '/login') {
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Check authentication status via API
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'same-origin'
        })

        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.authenticated)

          if (!data.authenticated) {
            // Not authenticated, redirect to login
            router.replace('/login')
            return
          }
        } else {
          // API error, assume not authenticated
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
  }, [pathname, router, isStagingDomain])

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