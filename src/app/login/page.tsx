// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkModeProvider } from '@/components/DarkModeProvider'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin'
      })

      const data = await response.json()

      if (data.success) {
        // Add a small delay to ensure cookie is set before redirect
        setTimeout(() => {
          window.location.href = '/'
        }, 250) // 250ms delay
      } else {
        setError('Incorrect password')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300 flex items-center justify-center p-4">
        {/* Logo and container wrapper */}
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/images/Distanz_Logo_1600_600_Black.svg"
              alt="Distanz Running Logo"
              className="block dark:hidden"
              style={{ height: '60px', width: 'auto' }}
            />
            <img
              src="/images/logo_white.svg"
              alt="Distanz Running Logo"
              className="hidden dark:block"
              style={{ height: '60px', width: 'auto' }}
            />
          </div>
          
          {/* Login container */}
          <div className="bg-neutralBgSubtle rounded-xl p-8 shadow-sm transition-colors duration-300">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-xl font-semibold text-textDefault leading-tight">
                  Staging Access
                </h2>
                <p className="text-sm text-textSubtle mt-2 leading-tight">
                  Enter the password to access the staging site
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-base font-normal text-textDefault">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-neutral-800 border border-borderNeutral rounded-lg text-textDefault placeholder:text-textSubtle focus:outline-none focus:ring-2 focus:ring-borderNeutral focus:border-borderNeutralHover hover:border-borderNeutralHover transition-colors duration-300"
                    placeholder="Enter staging password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isLoading ? 'Authenticating...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DarkModeProvider>
  )
}