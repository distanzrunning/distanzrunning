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
        // GLOBAL PALETTE TOKENS (Static - these values never change)
        // Source: src/styles/design-tokens.ts
        // ═══════════════════════════════════════════════════════════════════

        // Brand Core
        black: "#000000",
        white: "#FFFFFF",

        // Electric Pink - Primary accent (HSL: 333°, 74%)
        "electric-pink": "#D11B5C", // Default = 55 shade
        "electric-pink-20": "#520A23",
        "electric-pink-30": "#7A0F35",
        "electric-pink-45": "#B8164F",
        "electric-pink-55": "#D11B5C",
        "electric-pink-90": "#F5D2E1",
        "electric-pink-95": "#FAE9F0",

        // Pace Purple - Secondary accent, Training (HSL: 262°, 60%)
        "pace-purple": "#5E3FD1", // Default = 55 shade
        "pace-purple-45": "#452BB8",
        "pace-purple-55": "#5E3FD1",
        "pace-purple-90": "#DBD6F5",
        "pace-purple-95": "#EDEBFA",

        // Volt Green - Secondary accent, Nutrition/Wellness (HSL: 146°, 100%)
        "volt-green": "#008C47", // Default = 55 shade
        "volt-green-45": "#00733A",
        "volt-green-55": "#008C47",
        "volt-green-90": "#CCF5E0",
        "volt-green-95": "#E6FAEF",

        // Tech Cyan - Tertiary accent, Gear (HSL: 190°, 100%)
        "tech-cyan": "#008CB8", // Default = 55 shade
        "tech-cyan-45": "#007399",
        "tech-cyan-55": "#008CB8",
        "tech-cyan-90": "#CCF0F5",
        "tech-cyan-95": "#E6F7FA",

        // Track Red - Tertiary accent, Road/Races (HSL: 0°, 79%)
        "track-red": "#D11B1B", // Default = 55 shade
        "track-red-45": "#B81616",
        "track-red-55": "#D11B1B",
        "track-red-90": "#F5D2D2",
        "track-red-95": "#FAE9E9",

        // Trail Brown - Tertiary accent, Trail (HSL: 25°, 59%)
        "trail-brown": "#8C4623", // Default = 55 shade
        "trail-brown-45": "#73391D",
        "trail-brown-55": "#8C4623",
        "trail-brown-90": "#F5E6D9",
        "trail-brown-95": "#FAF2EC",

        // Signal Orange - Warning states (HSL: 20°, 100%)
        "signal-orange-45": "#732600",
        "signal-orange-55": "#8C2F00",
        "signal-orange-90": "#F5D6CC",
        "signal-orange-95": "#FAEBE6",

        // Asphalt Greyscale - 10% lightness steps
        "asphalt-5": "#0D0D0D",
        "asphalt-10": "#1A1A1A",
        "asphalt-20": "#333333",
        "asphalt-30": "#4D4D4D",
        "asphalt-40": "#666666",
        "asphalt-50": "#808080",
        "asphalt-60": "#999999",
        "asphalt-70": "#B3B3B3",
        "asphalt-80": "#CCCCCC",
        "asphalt-90": "#E5E5E5",
        "asphalt-95": "#F2F2F2",

        // ═══════════════════════════════════════════════════════════════════
        // SEMANTIC TOKENS (Dynamic - swap between light/dark mode via CSS vars)
        // ═══════════════════════════════════════════════════════════════════

        // Text colors
        textDefault: "rgb(var(--color-textDefault))",
        textSubtle: "rgb(var(--color-textSubtle))",
        textSubtler: "rgb(var(--color-textSubtler))",
        textForceTint: "rgb(var(--color-textForceTint))",
        textForceShade: "rgb(var(--color-textForceShade))",
        textInverted: "rgb(var(--color-textInverted))",
        textDisabled: "rgb(var(--color-textDisabled))",
        textAccent: "rgb(var(--color-textAccent))",
        textAccentSubtle: "rgb(var(--color-textAccentSubtle))",

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
        textForceTint: "rgb(var(--color-textForceTint))",
        textForceShade: "rgb(var(--color-textForceShade))",
        textInverted: "rgb(var(--color-textInverted))",
        textDisabled: "rgb(var(--color-textDisabled))",
        textAccent: "rgb(var(--color-textAccent))",
        textAccentSubtle: "rgb(var(--color-textAccentSubtle))",
      },
      borderColor: {
        // Semantic border colors (dynamic via CSS vars)
        borderDefault: "rgb(var(--color-borderDefault))",
        borderNeutral: "rgb(var(--color-borderNeutral))",
        borderNeutralHover: "rgb(var(--color-borderNeutralHover))",
        borderNeutralSubtle: "rgb(var(--color-borderNeutralSubtle))",
      },
      fontFamily: {
        // Distanz Typography System - Adobe Fonts
        // Body/UI: inter-variable (complete weight spectrum 100-900)
        // Headings: eb-garamond (400, 500, 600 + italic variants)
        // Adobe Fonts Project ID: bua7sld

        // Sans-serif (Inter Variable) - Body, UI, navigation
        sans: [
          "inter-variable",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        inter: ["inter-variable", "Inter", "sans-serif"],

        // Serif (EB Garamond) - Headings, display
        serif: ["eb-garamond", "EB Garamond", "Georgia", "serif"],
        garamond: ["eb-garamond", "EB Garamond", "Georgia", "serif"],

        // Legacy aliases for backwards compatibility
        display: ["eb-garamond", "EB Garamond", "serif"],
        headline: ["eb-garamond", "EB Garamond", "serif"],
        body: ["inter-variable", "Inter", "sans-serif"],
        ui: ["inter-variable", "Inter", "sans-serif"],
        playfair: ["eb-garamond", "EB Garamond", "serif"],
        manrope: ["inter-variable", "Inter", "sans-serif"],
        archivo: ["inter-variable", "Inter", "sans-serif"],
        bricolage: ["inter-variable", "Inter", "sans-serif"],
        garvis: ["var(--font-sans)", "Inter", "sans-serif"],
        quasimoda: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: [
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
      spacing: {
        18: "4.5rem",
        21: "5.25rem",
        23: "5.75rem",
      },
      boxShadow: {
        "elevation-flyout":
          "0 4px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
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
  ],
};
