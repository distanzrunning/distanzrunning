"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { Moon, Sun } from "lucide-react";

export const DarkModeContext = createContext<{
  isDark: boolean;
  toggleDarkMode: () => void;
  isInitialized: boolean;
}>({
  isDark: false,
  toggleDarkMode: () => {},
  isInitialized: false,
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    // Only enable dark mode if explicitly saved as 'dark'
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      // Default to light mode
      document.documentElement.classList.remove("dark");
    }

    setIsInitialized(true);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;

    // Disable all CSS transitions during the theme switch to prevent
    // color fade artifacts and flashing
    const style = document.createElement("style");
    style.setAttribute("data-theme-transition", "");
    style.textContent = `*, *::before, *::after { transition: none !important; }`;
    document.head.appendChild(style);

    // Force a reflow so the transition-disable rule takes effect before
    // the class change
    window.getComputedStyle(document.documentElement).getPropertyValue("color");

    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Re-enable transitions on the next frame after the browser has
    // painted with the new theme colors
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove();
      });
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode, isInitialized }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggle = (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 w-12 h-6 rounded-full bg-surfaceWarm transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
      style={{
        zIndex: 99999,
      }}
      aria-label="Toggle dark mode"
      type="button"
    >
      {/* Toggle Knob */}
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface shadow-md transition-all duration-300 flex items-center justify-center ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-textSubtle" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );

  return typeof window !== "undefined"
    ? createPortal(toggle, document.body)
    : null;
}
