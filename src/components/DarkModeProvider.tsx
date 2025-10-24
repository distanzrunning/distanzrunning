'use client'

import { useState, useEffect, createContext, useContext } from 'react'
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

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 99999,
    }}>
      <button
        onClick={toggleDarkMode}
        className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Toggle dark mode"
        type="button"
      >
        {/* Toggle Track */}
        <div className="relative w-12 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300">
          {/* Toggle Knob */}
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
              isDark ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-neutral-700" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Text Label */}
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors duration-300">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    </div>
  )
}