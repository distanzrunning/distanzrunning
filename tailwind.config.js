/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════════════════════════
        // GEIST-STYLE COLOR SYSTEM - 100-1000 Scales
        // Inspired by Vercel's Geist Design System
        // Scale Semantics:
        // 100-300: Component backgrounds (subtle fills, hover states)
        // 400-600: Borders (subtle to prominent)
        // 700-800: High contrast backgrounds (solid fills)
        // 900-1000: Text and icons
        // ═══════════════════════════════════════════════════════════════════

        // Brand Core
        black: "#000000",
        white: "#FFFFFF",

        // ─────────────────────────────────────────────────────────────────
        // GRAY SCALE - Geist pure neutral (100-1000)
        // ─────────────────────────────────────────────────────────────────
        gray: {
          100: "#F2F2F2",
          200: "#EBEBEB",
          300: "#E6E6E6",
          400: "#EBEBEB",
          500: "#C9C9C9",
          600: "#A8A8A8",
          700: "#8F8F8F",
          800: "#7D7D7D",
          900: "#666666",
          1000: "#171717",
        },

        // ─────────────────────────────────────────────────────────────────
        // BLUE SCALE - Geist Blue (Primary accent)
        // ─────────────────────────────────────────────────────────────────
        blue: {
          100: "#EFF7FF",
          200: "#E8F4FF",
          300: "#DBEEFF",
          400: "#C6E4FF",
          500: "#99CCFF",
          600: "#52A9FF",
          700: "#0070F3", // Geist primary blue
          800: "#0062D4",
          900: "#006ADC",
          1000: "#00244D",
        },

        // ─────────────────────────────────────────────────────────────────
        // RED SCALE - Geist Red (Error)
        // ─────────────────────────────────────────────────────────────────
        red: {
          100: "#FFF0F0",
          200: "#FFE8E8",
          300: "#FFE0E0",
          400: "#FFD2D2",
          500: "#FFAFAF",
          600: "#FF6C6C",
          700: "#EE0000", // Geist error red
          800: "#D50000",
          900: "#C50000",
          1000: "#3C1414",
        },

        // ─────────────────────────────────────────────────────────────────
        // AMBER SCALE - Geist Amber (Warning)
        // ─────────────────────────────────────────────────────────────────
        amber: {
          100: "#FFF8E6",
          200: "#FFF4D6",
          300: "#FFEFC7",
          400: "#FFDC8C",
          500: "#FFC850",
          600: "#FFA800", // Geist warning amber
          700: "#F5A400",
          800: "#E68C00",
          900: "#995200",
          1000: "#472912",
        },

        // ─────────────────────────────────────────────────────────────────
        // GREEN SCALE - Geist Green (Success)
        // ─────────────────────────────────────────────────────────────────
        green: {
          100: "#ECFDF0",
          200: "#E4FBEB",
          300: "#D4F7DC",
          400: "#BFF1CA",
          500: "#99E6AA",
          600: "#66D982", // Geist success green
          700: "#2FA34C",
          800: "#248B3D",
          900: "#1A7832",
          1000: "#0F371B",
        },

        // ─────────────────────────────────────────────────────────────────
        // TEAL SCALE - Geist Teal
        // ─────────────────────────────────────────────────────────────────
        teal: {
          100: "#EBFEFD",
          200: "#E6FDFA",
          300: "#D6F9F4",
          400: "#C3F4EC",
          500: "#99E8DA",
          600: "#66D9C3",
          700: "#1AA390",
          800: "#118B7A",
          900: "#0C786A",
          1000: "#123D35",
        },

        // ─────────────────────────────────────────────────────────────────
        // PURPLE SCALE - Geist Purple
        // ─────────────────────────────────────────────────────────────────
        purple: {
          100: "#FAF0FF",
          200: "#FAF0FF",
          300: "#F2E6FD",
          400: "#E6D7FA",
          500: "#C8AAF5",
          600: "#A573EB",
          700: "#7928CA", // Geist purple
          800: "#641EAA",
          900: "#5D1EA8",
          1000: "#280F48",
        },

        // ─────────────────────────────────────────────────────────────────
        // PINK SCALE - Geist Pink
        // ─────────────────────────────────────────────────────────────────
        pink: {
          100: "#FFEDF5",
          200: "#FFEDF3",
          300: "#FDE1EC",
          400: "#FAD7E6",
          500: "#F2B9D2",
          600: "#EB82AF",
          700: "#EB377D", // Geist pink
          800: "#DA2D73",
          900: "#B92D64",
          1000: "#3C1426",
        },

        // ═══════════════════════════════════════════════════════════════════
        // LEGACY ALIASES - Backward compatibility
        // These map old color names to new 100-1000 scale
        // ═══════════════════════════════════════════════════════════════════

        // Electric Pink aliases
        "electric-pink": "#D11B5C",
        "electric-pink-20": "#450820", // → pink-1000
        "electric-pink-30": "#6A0D30", // → pink-900
        "electric-pink-45": "#B8164F", // → pink-700
        "electric-pink-55": "#D11B5C", // → pink-600
        "electric-pink-90": "#F5D2E1", // → pink-300
        "electric-pink-95": "#FAE9F0", // → pink-200

        // Pace Purple aliases
        "pace-purple": "#5E3FD1",
        "pace-purple-45": "#452BB8", // → purple-700
        "pace-purple-55": "#5E3FD1", // → purple-600
        "pace-purple-90": "#DBD6F5", // → purple-300
        "pace-purple-95": "#EDEBFA", // → purple-200

        // Volt Green aliases
        "volt-green": "#008C47",
        "volt-green-45": "#00733A", // → green-700
        "volt-green-55": "#008C47", // → green-600
        "volt-green-90": "#CCF5E0", // → green-300
        "volt-green-95": "#E6FAEF", // → green-200

        // Tech Cyan aliases
        "tech-cyan": "#008CB8",
        "tech-cyan-45": "#007399", // → blue-700
        "tech-cyan-55": "#008CB8", // → blue-600
        "tech-cyan-90": "#CCF0F5", // → blue-300
        "tech-cyan-95": "#E6F7FA", // → blue-200

        // Track Red aliases
        "track-red": "#D11B1B",
        "track-red-45": "#B81616", // → red-700
        "track-red-55": "#D11B1B", // → red-600
        "track-red-90": "#F5D2D2", // → red-300
        "track-red-95": "#FAE9E9", // → red-200

        // Trail Brown (kept as-is, not part of new system)
        "trail-brown": "#8C4623",
        "trail-brown-45": "#73391D",
        "trail-brown-55": "#8C4623",
        "trail-brown-90": "#F5E6D9",
        "trail-brown-95": "#FAF2EC",

        // Signal Orange aliases → Amber
        "signal-orange-45": "#B38208", // → amber-700
        "signal-orange-55": "#D69E0A", // → amber-600
        "signal-orange-90": "#FBEBC4", // → amber-300
        "signal-orange-95": "#FDF5E0", // → amber-200

        // Asphalt aliases → Gray (backward compatibility)
        "asphalt-5": "#141413", // Darker than gray-1000
        "asphalt-10": "#1F1E1C", // → gray-1000
        "asphalt-15": "#2A2926", // Between gray-900 and gray-1000
        "asphalt-20": "#363530", // → gray-900
        "asphalt-25": "#42403A", // Between gray-800 and gray-900
        "asphalt-30": "#4E4C45", // Between gray-800 and gray-900
        "asphalt-35": "#5A574F", // → gray-800
        "asphalt-40": "#666359", // Between gray-700 and gray-800
        "asphalt-45": "#726F64", // Between gray-700 and gray-800
        "asphalt-50": "#7E7B6F", // → gray-700
        "asphalt-55": "#8B887C", // Between gray-600 and gray-700
        "asphalt-60": "#989588", // Between gray-600 and gray-700
        "asphalt-65": "#A5A295", // → gray-600
        "asphalt-70": "#B3B0A3", // Between gray-500 and gray-600
        "asphalt-75": "#C1BEAF", // → gray-500
        "asphalt-80": "#CFCCBE", // Between gray-400 and gray-500
        "asphalt-85": "#DDDACB", // → gray-400
        "asphalt-90": "#EBE9DC", // → gray-300
        "asphalt-95": "#F5F4ED", // → gray-200
        "asphalt-98": "#FAF9F5", // → gray-100

        // ═══════════════════════════════════════════════════════════════════
        // SEMANTIC TOKENS (Dynamic - swap between light/dark mode via CSS vars)
        // ═══════════════════════════════════════════════════════════════════

        // Text colors
        textDefault: "rgb(var(--color-textDefault))",
        textSubtle: "rgb(var(--color-textSubtle))",
        textSubtler: "rgb(var(--color-textSubtler))",
        textInverted: "rgb(var(--color-textInverted))",
        textDisabled: "rgb(var(--color-textDisabled))",

        // Border colors
        borderDefault: "rgb(var(--color-borderDefault))",
        borderDefaultHover: "rgb(var(--color-borderDefaultHover))",
        borderSubtle: "rgb(var(--color-borderSubtle))",
        borderSubtleHover: "rgb(var(--color-borderSubtleHover))",
        borderExtraSubtle: "rgb(var(--color-borderExtraSubtle))",
        borderNeutral: "rgb(var(--color-borderNeutral))",
        borderNeutralHover: "rgb(var(--color-borderNeutralHover))",
        borderNeutralSubtle: "rgb(var(--color-borderNeutralSubtle))",

        // Surface colors
        surface: "rgb(var(--color-surface))",
        surfaceSubtle: "rgb(var(--color-surfaceSubtle))",
        surfaceWarm: "rgb(var(--color-surfaceWarm))",
        canvas: "rgb(var(--color-canvas))",
        neutralBgSubtle: "rgb(var(--color-neutralBgSubtle))",

        // Elevated surfaces - layered depth hierarchy
        "surface-elevated-1": "rgb(var(--color-surfaceElevated1))",
        "surface-elevated-2": "rgb(var(--color-surfaceElevated2))",
        "surface-elevated-3": "rgb(var(--color-surfaceElevated3))",

        // Status colors - Success
        "success-text": "rgb(var(--color-success-text))",
        "success-text-subtle": "rgb(var(--color-success-text-subtle))",
        "success-bg": "rgb(var(--color-success-bg))",
        "success-bg-subtle": "rgb(var(--color-success-bg-subtle))",
        "success-border": "rgb(var(--color-success-border))",

        // Status colors - Warning
        "warning-text": "rgb(var(--color-warning-text))",
        "warning-text-subtle": "rgb(var(--color-warning-text-subtle))",
        "warning-bg": "rgb(var(--color-warning-bg))",
        "warning-bg-subtle": "rgb(var(--color-warning-bg-subtle))",
        "warning-border": "rgb(var(--color-warning-border))",

        // Status colors - Error
        "error-text": "rgb(var(--color-error-text))",
        "error-text-subtle": "rgb(var(--color-error-text-subtle))",
        "error-bg": "rgb(var(--color-error-bg))",
        "error-bg-subtle": "rgb(var(--color-error-bg-subtle))",
        "error-border": "rgb(var(--color-error-border))",

        // Status colors - Info
        "info-text": "rgb(var(--color-info-text))",
        "info-text-subtle": "rgb(var(--color-info-text-subtle))",
        "info-bg": "rgb(var(--color-info-bg))",
        "info-bg-subtle": "rgb(var(--color-info-bg-subtle))",
        "info-border": "rgb(var(--color-info-border))",
      },
      backgroundColor: {
        // Surface tokens (semantic)
        surface: "rgb(var(--color-surface))",
        surfaceSubtle: "rgb(var(--color-surfaceSubtle))",
        surfaceWarm: "rgb(var(--color-surfaceWarm))",
        canvas: "rgb(var(--color-canvas))",
        neutralBgSubtle: "rgb(var(--color-neutralBgSubtle))",
        // Elevated surfaces
        "surface-elevated-1": "rgb(var(--color-surfaceElevated1))",
        "surface-elevated-2": "rgb(var(--color-surfaceElevated2))",
        "surface-elevated-3": "rgb(var(--color-surfaceElevated3))",
      },
      keyframes: {
        navContentIn: {
          "0%": { opacity: "0", transform: "translateY(-12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        navContentOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-10px) scale(0.98)" },
        },
        navViewportIn: {
          "0%": { opacity: "0", transform: "translateY(-10px) scaleY(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scaleY(1)" },
        },
        navViewportOut: {
          "0%": { opacity: "1", transform: "translateY(0) scaleY(1)" },
          "100%": { opacity: "0", transform: "translateY(-8px) scaleY(0.95)" },
        },
        navIndicatorIn: {
          "0%": { opacity: "0", transform: "translateY(6px) scaleX(0.8)" },
          "100%": { opacity: "1", transform: "translateY(0) scaleX(1)" },
        },
        navIndicatorOut: {
          "0%": { opacity: "1", transform: "translateY(0) scaleX(1)" },
          "100%": { opacity: "0", transform: "translateY(4px) scaleX(0.75)" },
        },
        navEnterFromLeft: {
          "0%": { opacity: "0", transform: "translateX(-180px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        navEnterFromRight: {
          "0%": { opacity: "0", transform: "translateX(180px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        navExitToLeft: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-180px)" },
        },
        navExitToRight: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(180px)" },
        },
        megaMenuIn: {
          "0%": { opacity: "0", transform: "scaleY(0.95) translateY(-20px)" },
          "100%": { opacity: "1", transform: "scaleY(1) translateY(0)" },
        },
        megaMenuOut: {
          "0%": { opacity: "1", transform: "scaleY(1) translateY(0)" },
          "100%": { opacity: "0", transform: "scaleY(0.95) translateY(-20px)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px) scaleY(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scaleY(1)" },
        },
        slideUp: {
          "0%": { opacity: "1", transform: "translateY(0) scaleY(1)" },
          "100%": { opacity: "0", transform: "translateY(-20px) scaleY(0.95)" },
        },
        megaMenuOpen: {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "100%": { opacity: "1", transform: "scaleY(1)" },
        },
        megaMenuClose: {
          "0%": { opacity: "1", transform: "scaleY(1)" },
          "100%": { opacity: "0", transform: "scaleY(0)" },
        },
      },
      animation: {
        "nav-content-in":
          "navContentIn 200ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-content-out":
          "navContentOut 160ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-viewport-in":
          "navViewportIn 220ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-viewport-out":
          "navViewportOut 180ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-indicator-in":
          "navIndicatorIn 160ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-indicator-out":
          "navIndicatorOut 140ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-enter-from-left":
          "navEnterFromLeft 180ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-enter-from-right":
          "navEnterFromRight 180ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-exit-to-left":
          "navExitToLeft 160ms cubic-bezier(.16,1,.3,1) forwards",
        "nav-exit-to-right":
          "navExitToRight 160ms cubic-bezier(.16,1,.3,1) forwards",
        "mega-menu-in": "megaMenuIn 250ms cubic-bezier(.16,1,.3,1) forwards",
        "mega-menu-out": "megaMenuOut 200ms cubic-bezier(.16,1,.3,1) forwards",
        slideDown: "slideDown 250ms cubic-bezier(.16,1,.3,1) forwards",
        slideUp: "slideUp 200ms cubic-bezier(.16,1,.3,1) forwards",
        "mega-menu-open":
          "megaMenuOpen 300ms cubic-bezier(.16,1,.3,1) forwards",
        "mega-menu-close":
          "megaMenuClose 300ms cubic-bezier(.16,1,.3,1) forwards",
      },
      textColor: {
        // Semantic text colors (dynamic via CSS vars)
        textDefault: "rgb(var(--color-textDefault))",
        textSubtle: "rgb(var(--color-textSubtle))",
        textSubtler: "rgb(var(--color-textSubtler))",
        textInverted: "rgb(var(--color-textInverted))",
        textDisabled: "rgb(var(--color-textDisabled))",
      },
      borderColor: {
        // Semantic border colors (dynamic via CSS vars)
        borderDefault: "rgb(var(--color-borderDefault))",
        borderNeutral: "rgb(var(--color-borderNeutral))",
        borderNeutralHover: "rgb(var(--color-borderNeutralHover))",
        borderNeutralSubtle: "rgb(var(--color-borderNeutralSubtle))",
      },
      fontFamily: {
        // Distanz Typography System
        // Body/UI: Geist Sans (via `geist/font/sans`, self-hosted, variable)
        // Mono/data: Geist Mono (via `geist/font/mono`, self-hosted, variable)
        // Editorial headings: EB Garamond (Adobe Fonts: "eb-garamond")

        // Sans-serif (Geist) - Body, UI, navigation
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        geist: ["var(--font-geist-sans)", "sans-serif"],

        // Serif (EB Garamond) - Headings, display
        serif: ["eb-garamond", "Georgia", "serif"],
        garamond: ["eb-garamond", "Georgia", "serif"],

        // Legacy aliases for backwards compatibility
        display: ["eb-garamond", "serif"],
        headline: ["eb-garamond", "serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        ui: ["var(--font-geist-sans)", "sans-serif"],
        // Old font aliases (kept so existing class names don't break)
        inter: ["var(--font-geist-sans)", "sans-serif"],
        eczar: ["eb-garamond", "Georgia", "serif"],
        franklin: ["var(--font-geist-sans)", "sans-serif"],
        playfair: ["eb-garamond", "serif"],
        manrope: ["var(--font-geist-sans)", "sans-serif"],
        archivo: ["var(--font-geist-sans)", "sans-serif"],
        bricolage: ["var(--font-geist-sans)", "sans-serif"],
        garvis: ["var(--font-geist-sans)", "sans-serif"],
        quasimoda: ["var(--font-geist-sans)", "sans-serif"],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        // Distanz Typography System - Inter + EB Garamond

        // Small Text & Metadata (Inter)
        xs: [
          "11px",
          {
            lineHeight: "1.3",
            letterSpacing: "0.02em",
            "--font-size-px": "11",
          },
        ],
        sm: [
          "12px",
          {
            lineHeight: "1.4",
            letterSpacing: "0",
            "--font-size-px": "12",
          },
        ],

        // UI & Forms (Inter)
        base: [
          "14px",
          {
            lineHeight: "1.5",
            letterSpacing: "0",
            "--font-size-px": "14",
          },
        ],
        nav: [
          "14px",
          {
            lineHeight: "1",
            letterSpacing: "0",
            "--font-size-px": "14",
          },
        ],
        button: [
          "14px",
          {
            lineHeight: "1",
            letterSpacing: "0.01em",
            "--font-size-px": "14",
          },
        ],

        // Body Text (Inter) - Fixed sizes from design-tokens.ts
        body: [
          "16px",
          {
            lineHeight: "1.5",
            letterSpacing: "0",
            "--font-size-px": "16",
          },
        ],
        "body-lg": [
          "18px",
          {
            lineHeight: "1.6",
            letterSpacing: "0",
            "--font-size-px": "18",
          },
        ],
        "body-sm": [
          "14px",
          {
            lineHeight: "1.5",
            letterSpacing: "0",
            "--font-size-px": "14",
          },
        ],
        // Feature body (EB Garamond for long-form articles)
        "body-feature": [
          "20px",
          {
            lineHeight: "1.6",
            letterSpacing: "0",
            "--font-size-px": "20",
          },
        ],

        // Overline / Tags (Inter)
        overline: [
          "12px",
          {
            lineHeight: "1.3",
            letterSpacing: "0.08em",
            "--font-size-px": "12",
          },
        ],

        // Pull Quotes (EB Garamond)
        quote: [
          "26px",
          {
            lineHeight: "1.4",
            letterSpacing: "0",
            "--font-size-px": "26",
          },
        ],

        // Headings - Body (Inter Bold/SemiBold)
        "h3-news": [
          "22px",
          {
            lineHeight: "1.3",
            letterSpacing: "0",
            "--font-size-px": "22",
          },
        ],
        "h2-news": [
          "28px",
          {
            lineHeight: "1.25",
            letterSpacing: "-0.01em",
            "--font-size-px": "28",
          },
        ],
        "h1-news": [
          "36px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.015em",
            "--font-size-px": "36",
          },
        ],
        "display-news": [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            "--font-size-px": "48",
          },
        ],

        // Headings - Features (EB Garamond)
        "h3-feature": [
          "24px",
          {
            lineHeight: "1.3",
            letterSpacing: "0",
            "--font-size-px": "24",
          },
        ],
        "h2-feature": [
          "30px",
          {
            lineHeight: "1.25",
            letterSpacing: "0",
            "--font-size-px": "30",
          },
        ],
        "h1-feature": [
          "40px",
          {
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
            "--font-size-px": "40",
          },
        ],
        "display-feature": [
          "52px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.01em",
            "--font-size-px": "52",
          },
        ],

        // Headings (EB Garamond) - Fluid typography from design-tokens.ts
        // Format: clamp(min, preferred, max) where max = design token value
        h6: [
          "clamp(18px, 2vw, 24px)",
          {
            lineHeight: "1.2",
            letterSpacing: "0",
            "--font-size-px": "24",
          },
        ],
        h5: [
          "clamp(20px, 2.5vw, 28px)",
          {
            lineHeight: "1.2",
            letterSpacing: "0",
            "--font-size-px": "28",
          },
        ],
        h4: [
          "clamp(24px, 3vw, 38px)",
          {
            lineHeight: "1.2",
            letterSpacing: "0",
            "--font-size-px": "38",
          },
        ],
        h3: [
          "clamp(28px, 3.5vw, 44px)",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.005em",
            "--font-size-px": "44",
          },
        ],
        h2: [
          "clamp(32px, 4.5vw, 58px)",
          {
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
            "--font-size-px": "58",
          },
        ],
        h1: [
          "clamp(36px, 5vw, 68px)",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.015em",
            "--font-size-px": "68",
          },
        ],
        display: [
          "clamp(40px, 6vw, 72px)",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            "--font-size-px": "72",
          },
        ],
        "display-large": [
          "clamp(48px, 7vw, 84px)",
          {
            lineHeight: "1.05",
            letterSpacing: "-0.02em",
            "--font-size-px": "84",
          },
        ],

        // Legacy Tailwind sizes for compatibility
        xl: [
          "20px",
          {
            lineHeight: "1.5",
            letterSpacing: "0",
            "--font-size-px": "20",
          },
        ],
        "2xl": [
          "24px",
          {
            lineHeight: "1.4",
            letterSpacing: "0",
            "--font-size-px": "24",
          },
        ],
        "3xl": [
          "30px",
          {
            lineHeight: "1.3",
            letterSpacing: "-0.01em",
            "--font-size-px": "30",
          },
        ],
        "4xl": [
          "36px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
            "--font-size-px": "36",
          },
        ],
        "5xl": [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            "--font-size-px": "48",
          },
        ],
        "6xl": [
          "60px",
          {
            lineHeight: "1.0",
            letterSpacing: "-0.02em",
            "--font-size-px": "60",
          },
        ],
        "7xl": [
          "72px",
          {
            lineHeight: "0.95",
            letterSpacing: "-0.03em",
            "--font-size-px": "72",
          },
        ],
      },
      lineHeight: {
        // Tighter line heights for more squared typography
        snug: "1.25", // Reduced from 1.375
        tight: "1.15", // Reduced from 1.25
        normal: "1.35", // Reduced from 1.5
        relaxed: "1.5", // Reduced from 1.625

        // Exact pixel line heights from Distanz
        "[23px]": "23px",
        "[24px]": "24px",
        "[25px]": "25px",
        "[28px]": "28px",
        "[40px]": "40px",
        "[56px]": "56px",
      },
      fontWeight: {
        light: "300", // Rarely used, large display text only
        regular: "400", // Body text, paragraphs
        medium: "500", // Headings, emphasis
        semibold: "600", // Buttons, strong emphasis
        bold: "700", // Maximum emphasis, rarely used
      },
      letterSpacing: {
        tight: "-0.025em",
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
        18: "repeat(18, minmax(0, 1fr))",
      },
      maxWidth: {
        distanz: "95%", // Wide container width for consistent layouts
        distanz: "95%", // Legacy - updated to match new width
        text: "720px", // Optimal reading width for articles (unchanged)
        content: "95%", // Standard content width
        wide: "95%", // Wide layouts
      },
      // ═══════════════════════════════════════════════════════════════════
      // BORDER RADIUS SYSTEM - Named semantic tokens
      // Generous, premium radii inspired by modern design systems
      // ═══════════════════════════════════════════════════════════════════
      borderRadius: {
        none: "0",
        xs: "4px", // Subtle rounding for small elements (tags, badges)
        sm: "6px", // Default for inputs, small buttons
        DEFAULT: "8px", // Standard rounding for cards, buttons
        md: "10px", // Medium elements
        lg: "12px", // Larger cards, modals
        xl: "16px", // Feature cards, prominent containers
        "2xl": "20px", // Large panels, hero sections
        "3xl": "24px", // Extra large containers
        "4xl": "32px", // Maximum rounding for special elements
        full: "9999px", // Pill shapes, circular elements
        // Fluid responsive radii - scale with viewport
        "fluid-sm": "clamp(4px, 0.5vw, 8px)",
        "fluid-md": "clamp(8px, 1vw, 16px)",
        "fluid-lg": "clamp(12px, 1.5vw, 24px)",
        "fluid-xl": "clamp(16px, 2vw, 32px)",
      },
      spacing: {
        18: "4.5rem",
        21: "5.25rem",
        23: "5.75rem",
      },
      boxShadow: {
        "elevation-flyout":
          "0 4px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
        // Elevated surface shadows - use CSS variables for light/dark mode
        "elevated-1": "var(--shadow-elevated1)",
        "elevated-2": "var(--shadow-elevated2)",
        "elevated-3": "var(--shadow-elevated3)",
      },
      animation: {
        rotate: "rotate 3s linear infinite both",
        flip: "flip 6s steps(2) infinite",
      },
      keyframes: {
        rotate: {
          to: {
            transform: "rotate(90deg)",
            content: "var(--tw-content)",
          },
        },
        flip: {
          to: { transform: "rotate(1turn)" },
        },
      },
    },
  },
  typography: (theme) => ({
    DEFAULT: {
      css: {
        lineHeight: "1.3",
        p: {
          marginTop: "0",
          marginBottom: "1rem",
        },
        h2: {
          marginTop: "1.25rem",
          marginBottom: "1rem",
        },
        h3: {
          marginTop: "1.25rem",
          marginBottom: "0.75rem",
        },
      },
    },
  }),

  plugins: [
    require("@tailwindcss/typography"),
    // TODO: Install @tailwindcss/container-queries package
    // require('@tailwindcss/container-queries'),

    // ═══════════════════════════════════════════════════════════════════
    // GEIST TYPOGRAPHY UTILITIES
    // Pre-set combinations of font-size, line-height, letter-spacing, and font-weight
    // Based on Vercel's Geist Design System
    // ═══════════════════════════════════════════════════════════════════
    function ({ addUtilities }) {
      const geistTypography = {
        // ─────────────────────────────────────────────────────────────────
        // HEADINGS - Used to introduce pages or sections
        // ─────────────────────────────────────────────────────────────────
        ".text-heading-72": {
          fontSize: "72px",
          lineHeight: "80px",
          letterSpacing: "-0.04em",
          fontWeight: "700",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-64": {
          fontSize: "64px",
          lineHeight: "72px",
          letterSpacing: "-0.04em",
          fontWeight: "700",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-56": {
          fontSize: "56px",
          lineHeight: "64px",
          letterSpacing: "-0.04em",
          fontWeight: "700",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-48": {
          fontSize: "48px",
          lineHeight: "56px",
          letterSpacing: "-0.03em",
          fontWeight: "700",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-40": {
          fontSize: "40px",
          lineHeight: "48px",
          letterSpacing: "-0.02em",
          fontWeight: "600",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-32": {
          fontSize: "32px",
          lineHeight: "40px",
          letterSpacing: "-0.02em",
          fontWeight: "600",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-24": {
          fontSize: "24px",
          lineHeight: "32px",
          letterSpacing: "-0.015em",
          fontWeight: "600",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-20": {
          fontSize: "20px",
          lineHeight: "28px",
          letterSpacing: "-0.01em",
          fontWeight: "600",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-16": {
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "-0.01em",
          fontWeight: "600",
          "& strong": { fontWeight: "400" },
        },
        ".text-heading-14": {
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "-0.006em",
          fontWeight: "600",
        },

        // ─────────────────────────────────────────────────────────────────
        // BUTTONS - Only for button components
        // ─────────────────────────────────────────────────────────────────
        ".text-button-16": {
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0",
          fontWeight: "500",
        },
        ".text-button-14": {
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "500",
        },
        ".text-button-12": {
          fontSize: "12px",
          lineHeight: "16px",
          letterSpacing: "0",
          fontWeight: "500",
        },

        // ─────────────────────────────────────────────────────────────────
        // LABELS - Single-line text with ample line-height for icons
        // ─────────────────────────────────────────────────────────────────
        ".text-label-20": {
          fontSize: "20px",
          lineHeight: "32px",
          letterSpacing: "-0.01em",
          fontWeight: "500",
        },
        ".text-label-18": {
          fontSize: "18px",
          lineHeight: "28px",
          letterSpacing: "-0.01em",
          fontWeight: "500",
        },
        ".text-label-16": {
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "500" },
        },
        ".text-label-14": {
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "500" },
        },
        ".text-label-14-mono": {
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        },
        ".text-label-13": {
          fontSize: "13px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
          fontVariantNumeric: "tabular-nums",
          "& strong": { fontWeight: "500" },
        },
        ".text-label-13-mono": {
          fontSize: "13px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        },
        ".text-label-12": {
          fontSize: "12px",
          lineHeight: "16px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "500" },
        },
        ".text-label-12-mono": {
          fontSize: "12px",
          lineHeight: "16px",
          letterSpacing: "0",
          fontWeight: "400",
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        },

        // ─────────────────────────────────────────────────────────────────
        // COPY - Multi-line text with higher line height than Label
        // ─────────────────────────────────────────────────────────────────
        ".text-copy-24": {
          fontSize: "24px",
          lineHeight: "36px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "600" },
        },
        ".text-copy-20": {
          fontSize: "20px",
          lineHeight: "32px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "600" },
        },
        ".text-copy-18": {
          fontSize: "18px",
          lineHeight: "28px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "600" },
        },
        ".text-copy-16": {
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "600" },
        },
        ".text-copy-14": {
          fontSize: "14px",
          lineHeight: "22px",
          letterSpacing: "0",
          fontWeight: "400",
          "& strong": { fontWeight: "600" },
        },
        ".text-copy-13": {
          fontSize: "13px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
        },
        ".text-copy-13-mono": {
          fontSize: "13px",
          lineHeight: "20px",
          letterSpacing: "0",
          fontWeight: "400",
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        },

        // ─────────────────────────────────────────────────────────────────
        // FOOTER-SPECIFIC TEXT STYLES (keeping legacy)
        // ─────────────────────────────────────────────────────────────────
        ".text-footer-heading": {
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: "500",
          letterSpacing: "0",
        },
        ".text-footer-link": {
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: "400",
          letterSpacing: "0",
        },
      };
      addUtilities(geistTypography);
    },
    function ({ addComponents, theme }) {
      addComponents({
        // Distanz container system (Economist-inspired grid)
        // 4 columns (< 600px) → 6 columns (≥ 600px) → 12 columns (≥ 960px)
        // Gap: 12px (small/medium), 16px (large), Max-width: 1585px
        ".distanz-container": {
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1585px",
          width: "100%",
          columnGap: "0.75rem", // 12px
          paddingLeft: "1.5rem", // 24px
          paddingRight: "1.5rem",
        },
        "@media (min-width: 600px)": {
          ".distanz-container": {
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          },
        },
        "@media (min-width: 960px)": {
          ".distanz-container": {
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            columnGap: "1rem", // 16px
            paddingLeft: "2rem", // 32px
            paddingRight: "2rem",
          },
        },

        // Article container with top padding
        ".distanz-article-container": {
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1585px",
          width: "100%",
          columnGap: "0.75rem", // 12px
          paddingLeft: "1.5rem", // 24px
          paddingRight: "1.5rem",
          paddingTop: "80px",
        },
        "@media (min-width: 600px)": {
          ".distanz-article-container": {
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          },
        },
        "@media (min-width: 960px)": {
          ".distanz-article-container": {
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            columnGap: "1rem", // 16px
            paddingLeft: "2rem", // 32px
            paddingRight: "2rem",
          },
        },

        ".distanz-full-col": {
          gridColumn: "1 / -1",
        },

        // Centered content column (cols 3-10 of 12)
        ".distanz-article-col": {
          gridColumn: "1 / -1",
        },
        "@media (min-width: 768px)": {
          ".distanz-article-col": {
            gridColumnStart: "3",
            gridColumnEnd: "11",
          },
        },

        // Distanz font features - enable OpenType features for better readability
        ".distanz-font-features": {
          fontFeatureSettings: "normal",
          fontVariantLigatures: "common-ligatures",
          fontVariantNumeric: "oldstyle-nums proportional-nums",
        },

        // IEEE-inspired bordered layout system
        // Outer wrapper with responsive width and margins
        ".main-wrapper": {
          position: "relative",
          width: "100%",
          margin: "0 auto",
          minHeight: "100vh",
          overflow: "visible",
        },
        "@media (min-width: 768px)": {
          ".main-wrapper": {
            width: "100%",
            maxWidth: "1585px",
          },
        },

        // Inner bordered container - full width with side borders
        ".main-bordered": {
          position: "relative",
          width: "100%",
          overflow: "visible",
        },
        "@media (min-width: 768px)": {
          ".main-bordered": {
            borderLeft: "1px solid rgb(var(--color-borderNeutral))",
            borderRight: "1px solid rgb(var(--color-borderNeutral))",
          },
        },

        // Vertical separator utility (borders only)
        ".v-sep": {
          borderLeft: "1px solid rgb(var(--color-borderNeutral))",
          borderRight: "1px solid rgb(var(--color-borderNeutral))",
        },
        "@media (max-width: 767px)": {
          ".v-sep": {
            borderLeft: "none",
            borderRight: "none",
          },
        },
      });
    },
    require("tailwindcss-animate"),

    // ═══════════════════════════════════════════════════════════════════
    // MATERIAL UTILITIES
    // Presets combining background, border, border-radius, and box-shadow
    // Based on Vercel's Geist Design System materials
    // ═══════════════════════════════════════════════════════════════════
    function ({ addUtilities }) {
      const materialUtilities = {
        // Surface materials - on the page
        ".material-base": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "6px",
        },
        ".material-small": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "6px",
          boxShadow: "var(--ds-shadow-small)",
        },
        ".material-medium": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "12px",
          boxShadow: "var(--ds-shadow-medium)",
        },
        ".material-large": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "12px",
          boxShadow: "var(--ds-shadow-large)",
        },
        // Floating materials - above the page
        ".material-tooltip": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "6px",
          boxShadow: "var(--ds-shadow-tooltip)",
        },
        ".material-menu": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "12px",
          boxShadow: "var(--ds-shadow-menu)",
        },
        ".material-modal": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "12px",
          boxShadow: "var(--ds-shadow-modal)",
        },
        ".material-fullscreen": {
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: "16px",
          boxShadow: "var(--ds-shadow-fullscreen)",
        },
      };
      addUtilities(materialUtilities);
    },
  ],
};
