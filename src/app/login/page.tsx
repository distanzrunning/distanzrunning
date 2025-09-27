// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkModeProvider, DarkModeToggle } from '@/components/DarkModeProvider'

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
        {/* Dark Mode Toggle */}
        <DarkModeToggle />
        
        {/* Clean minimal container */}
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-lg dark:shadow-2xl transition-colors duration-300">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  Staging Access
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 transition-colors duration-300">
                  Enter the password to access the staging site
                </p>
              </div>
              
              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-300"
                    placeholder="Enter staging password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm transition-colors duration-300">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black dark:bg-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 disabled:bg-neutral-500 dark:disabled:bg-neutral-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Authenticating...' : 'Access Staging Site'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DarkModeProvider>
  )
}