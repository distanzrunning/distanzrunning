/**
 * Distanz Running Design System - Design Tokens
 *
 * Single source of truth for all design decisions.
 * These tokens are used to generate CSS variables and Tailwind config.
 *
 * Body/UI: Geist Sans (`geist/font/sans`, self-hosted variable font)
 * Mono/data: Geist Mono (`geist/font/mono`, self-hosted variable font)
 * Editorial headings: EB Garamond (Google Fonts via `next/font/google`)
 */

export const fonts = {
  sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: 'var(--font-eb-garamond), Georgia, "Times New Roman", serif',
  mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
} as const;

export const fontWeights = {
  light: 300, // Rarely used, large display text only
  regular: 400, // Body text, paragraphs
  medium: 500, // Headings, emphasis
  semibold: 600, // Buttons, strong emphasis
  bold: 700, // Maximum emphasis, rarely used
} as const;

export const colors = {
  // Brand Colors - Core identity
  brand: {
    black: "#000000",
    white: "#FFFFFF",
  },

  // Canvas - Subtle background colors
  // 2 colors with 3 variations each for light mode, 2 colors for dark mode
  canvas: {
    // Light mode - Warm canvas (beige/cream tint)
    warm85: "#E8E6E0",
    warm90: "#F0EEE8",
    warm95: "#F8F7F4",
    // Light mode - Cool canvas (blue/grey tint)
    cool85: "#E0E6E8",
    cool90: "#E8EEF0",
    cool95: "#F4F7F8",
    // Dark mode - Warm canvas (subtle warm elevation)
    darkWarm: "#1A1816",
    // Dark mode - Cool canvas (subtle cool elevation)
    darkCool: "#16181A",
  },

  // Status/Feedback Colors - For forms, validation, alerts
  // Maps category colors to semantic status meanings
  status: {
    success: {
      text: "#008C47", // Volt Green 55 - readable on light backgrounds
      textSubtle: "#00733A", // Volt Green 45 - darker variant
      bg: "#E6FAEF", // Volt Green 95 - light fill
      bgSubtle: "#CCF5E0", // Volt Green 90 - emphasis fill
      border: "#008C47", // Volt Green 55 - borders
    },
    warning: {
      text: "#8C2F00", // Signal Orange 55 - readable on light backgrounds
      textSubtle: "#732600", // Signal Orange 45 - darker variant
      bg: "#FAEBE6", // Signal Orange 95 - light fill
      bgSubtle: "#F5D6CC", // Signal Orange 90 - emphasis fill
      border: "#8C2F00", // Signal Orange 55 - borders
    },
    error: {
      text: "#D11B1B", // Track Red 55 - readable on light backgrounds
      textSubtle: "#B81616", // Track Red 45 - darker variant
      bg: "#FAE9E9", // Track Red 95 - light fill
      bgSubtle: "#F5D2D2", // Track Red 90 - emphasis fill
      border: "#D11B1B", // Track Red 55 - borders
    },
    info: {
      text: "#5E3FD1", // Pace Purple 55 - readable on light backgrounds
      textSubtle: "#452BB8", // Pace Purple 45 - darker variant
      bg: "#EDEBFA", // Pace Purple 95 - light fill
      bgSubtle: "#DBD6F5", // Pace Purple 90 - emphasis fill
      border: "#5E3FD1", // Pace Purple 55 - borders
    },
  },

  // Semantic Colors - Light Mode (Legacy - kept for compatibility)
  semantic: {
    light: {
      textDefault: "rgb(17, 24, 39)",
      textSubtle: "rgb(107, 114, 128)",
      textSubtler: "rgb(172, 176, 184)",
      textForceTint: "rgb(249, 250, 250)",
      textForceShade: "rgb(17, 24, 39)",
      textInverted: "rgb(249, 250, 250)",
      textDisabled: "rgb(172, 176, 184)",
      textAccent: "rgb(0, 112, 243)",
      textAccentSubtle: "rgb(153, 197, 255)",

      borderNeutral: "rgb(229, 229, 229)",
      borderNeutralHover: "rgb(204, 204, 204)",
      borderNeutralSubtle: "rgb(231, 231, 231)",

      surface: "rgb(255, 255, 255)",
      canvas: "rgb(247, 247, 247)",
      neutralBgSubtle: "rgb(247, 247, 247)",
      greyCold400: "rgb(140, 145, 156)",
    },

    // Semantic Colors - Dark Mode
    dark: {
      textDefault: "rgb(249, 250, 250)",
      textSubtle: "rgb(172, 176, 184)",
      textSubtler: "rgb(107, 114, 128)",
      textInverted: "rgb(17, 24, 39)",
      textAccent: "rgb(0, 112, 243)",

      borderNeutral: "rgb(45, 45, 45)",
      borderNeutralHover: "rgb(64, 64, 64)",

      surface: "rgb(12, 12, 13)",
      canvas: "rgb(10, 10, 10)",
    },
  },
} as const;

export const typography = {
  // Font Sizes
  // Headings use fluid typography: clamp(min, preferred, max)
  // Body text uses fixed sizes based on 16px base
  fontSize: {
    // Small text & metadata
    xs: "0.6875rem", // 11px
    sm: "0.75rem", // 12px

    // Body text (Inter) - fixed sizes
    base: "1rem", // 16px - standard body
    md: "1rem", // 16px - alias for base
    lg: "1.125rem", // 18px - body large / lead paragraphs
    xl: "1.25rem", // 20px - feature body

    // Headings (EB Garamond) - max values for fluid scaling
    // Fluid formula: clamp(min, preferred, max)
    h6: "1.5rem", // 24px → clamp(18px, 2vw, 24px)
    h5: "1.75rem", // 28px → clamp(20px, 2.5vw, 28px)
    h4: "2.375rem", // 38px → clamp(24px, 3vw, 38px)
    h3: "2.75rem", // 44px → clamp(28px, 3.5vw, 44px)
    h2: "3.625rem", // 58px → clamp(32px, 4.5vw, 58px)
    h1: "4.25rem", // 68px → clamp(36px, 5vw, 68px)

    // Display (EB Garamond) - hero headlines
    display: "4.5rem", // 72px → clamp(40px, 6vw, 72px)
    displayLarge: "5.25rem", // 84px → clamp(48px, 7vw, 84px)

    // Feature content (EB Garamond)
    featureBody: "1.25rem", // 20px
    featureQuote: "2rem", // 32px → clamp(24px, 3vw, 32px)
  },

  // Line Heights
  lineHeight: {
    tight: 1.05,
    snug: 1.1,
    normal: 1.15,
    relaxed: 1.25,
    loose: 1.3,
    spacious: 1.5,
  },

  // Letter Spacing (in em)
  letterSpacing: {
    tighter: "-0.03em",
    tight: "-0.02em",
    snug: "-0.01em",
    normal: "0em",
    wide: "0.0025em",
  },
} as const;

export const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px  ← Base unit
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
} as const;

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const grid = {
  // Grid Spacing - Standard spacing values for all layouts
  // Gap: spacing between elements (12px/16px)
  // Gutter: spacing between grid columns (24px/32px) - always 2× gap
  // Outside gutter: padding from viewport edge (24px/32px) - same as gutter
  spacing: {
    gap: "1rem", // 16px - standard element spacing within components
    gutter: "2rem", // 32px - column spacing in grid layouts (2× gap)
  },

  // Grid Layout - Responsive column system (Economist-inspired)
  // 4 columns (mobile) → 6 columns (medium) → 12 columns (large)
  small: {
    columns: 4,
    breakpoint: "0px", // < 600px
    gap: "12px", // element spacing
    gutter: "24px", // column spacing (2× gap)
    outsideGutter: "24px", // viewport padding
  },
  medium: {
    columns: 6,
    breakpoint: "600px", // ≥ 600px
    gap: "12px", // element spacing
    gutter: "24px", // column spacing (2× gap)
    outsideGutter: "24px", // viewport padding
  },
  large: {
    columns: 12,
    breakpoint: "960px", // ≥ 960px
    gap: "16px", // element spacing
    gutter: "32px", // column spacing (2× gap)
    outsideGutter: "32px", // viewport padding
    maxWidth: "1585px",
  },
} as const;

export const animation = {
  duration: {
    fast: "150ms",
    base: "300ms",
    slow: "500ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Type exports for TypeScript
export type FontFamily = keyof typeof fonts;
export type FontWeight = keyof typeof fontWeights;
export type BrandColor = keyof typeof colors.brand;
export type CanvasColor = keyof typeof colors.canvas;
export type SemanticLightColor = keyof typeof colors.semantic.light;
export type SemanticDarkColor = keyof typeof colors.semantic.dark;
