'use client'

import { useContext } from 'react'
import { Moon, Sun } from 'lucide-react'
import { DarkModeContext } from './DarkModeProvider'

export function PreviewDarkModeToggle() {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 w-12 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
      style={{ zIndex: 99999 }}
      aria-label="Toggle dark mode"
      type="button"
    >
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
    </button>
  )
}
