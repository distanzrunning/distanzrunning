'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Moon, Sun } from 'lucide-react'

const DarkModeContext = createContext<{
  isDark: boolean
  toggleDarkMode: () => void
}>({
  isDark: false,
  toggleDarkMode: () => {}
})

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const button = (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999
      }}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-600" />
      )}
    </button>
  )

  return createPortal(button, document.body)
}