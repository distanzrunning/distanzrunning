"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { Moon, Sun } from "lucide-react";

export type ThemePreference = "system" | "light" | "dark";

export const DarkModeContext = createContext<{
  isDark: boolean;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleDarkMode: () => void;
  isInitialized: boolean;
}>({
  isDark: false,
  theme: "system",
  setTheme: () => {},
  toggleDarkMode: () => {},
  isInitialized: false,
});

function applyTheme(isDark: boolean) {
  const style = document.createElement("style");
  style.setAttribute("data-theme-transition", "");
  style.textContent = `*, *::before, *::after { transition: none !important; }`;
  document.head.appendChild(style);

  window.getComputedStyle(document.documentElement).getPropertyValue("color");

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      style.remove();
    });
  });
}

function getSystemPrefersDark() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Suppress transitions during initial mount the same way
    // applyTheme does during a user-initiated theme switch.
    // Without this, any element carrying a `transition-colors`
    // class (SiteHeader, filter chips, etc.) animates its bg
    // through the brief sequence of CSS-variable resolution
    // states the browser walks during stylesheet load — visible
    // as a white-to-dark flash on heavy pages.
    const noTransition = document.createElement("style");
    noTransition.setAttribute("data-theme-transition", "");
    noTransition.textContent =
      `*, *::before, *::after { transition: none !important; }`;
    document.head.appendChild(noTransition);

    const savedTheme = localStorage.getItem("theme") as ThemePreference | null;
    const preference = savedTheme || "system";
    setThemeState(preference);

    let dark = false;
    if (preference === "dark") {
      dark = true;
    } else if (preference === "system") {
      dark = getSystemPrefersDark();
    }

    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setIsInitialized(true);

    // Re-enable transitions after two animation frames so the
    // first paint settles fully without animating.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        noTransition.remove();
      });
    });
  }, []);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyTheme(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    let dark = false;
    if (newTheme === "dark") {
      dark = true;
    } else if (newTheme === "system") {
      dark = getSystemPrefersDark();
    }

    setIsDark(dark);
    applyTheme(dark);
  };

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <DarkModeContext.Provider value={{ isDark, theme, setTheme, toggleDarkMode, isInitialized }}>
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
