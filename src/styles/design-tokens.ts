/**
 * Distanz Running Design System - Design Tokens
 *
 * Single source of truth for all design decisions.
 * These tokens are used to generate CSS variables and Tailwind config.
 *
 * Adobe Fonts Project ID: bua7sld
 */

export const fonts = {
  sans: '"inter-variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: '"eb-garamond", "EB Garamond", Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 550,
  bold: 600,
} as const;

export const colors = {
  // Brand Colors
  brand: {
    black: "#000000",
    white: "#FFFFFF",
    electricPink: "#E43C81",
    electricPink60: "#EE6FA5", // Lighter variant at 60% lightness
  },

  // Asphalt (Greyscale) - Named after running surfaces
  asphalt: {
    5: "#0D0D0D",
    10: "#1A1A1A",
    20: "#333333",
    35: "#595959",
    50: "#808080",
    70: "#B3B3B3",
    85: "#D9D9D9",
    95: "#F2F2F2",
    98: "#FAFAFA",
    100: "#FFFFFF",
  },

  // Pace Purple - Primary accent for Training/Tempo content (HSL: 262°, 60%)
  // 1 color with 6 variations
  pacePurple: {
    20: "#1F1352",
    30: "#2E1C7A",
    45: "#452BB8",
    55: "#5E3FD1",
    90: "#DBD6F5",
    95: "#EDEBFA",
  },

  // Volt Green - Secondary accent for Nutrition/Wellness (HSL: 146°, 100%)
  // 2 colors with 4 variations each
  voltGreen: {
    45: "#00733A",
    55: "#008C47",
    90: "#CCF5E0",
    95: "#E6FAEF",
  },

  // Signal Orange - Secondary accent for Gear/Equipment (HSL: 14°, 100%)
  signalOrange: {
    45: "#732600",
    55: "#8C2F00",
    90: "#F5D6CC",
    95: "#FAEBE6",
  },

  // Track Red - Tertiary accent for Races/Events (HSL: 0°, 79%)
  // 2 colors with 4 variations each
  trackRed: {
    45: "#B81616",
    55: "#D11B1B",
    90: "#F5D2D2",
    95: "#FAE9E9",
  },

  // Trail Brown - Tertiary accent for Routes/Exploration (HSL: 25°, 59%)
  trailBrown: {
    45: "#73391D",
    55: "#8C4623",
    90: "#F5E6D9",
    95: "#FAF2EC",
  },

  // Canvas - Subtle background colors
  // 2 colors with 3 variations each
  canvas: {
    // Warm canvas (beige/cream tint)
    warm85: "#E8E6E0",
    warm90: "#F0EEE8",
    warm95: "#F8F7F4",
    // Cool canvas (blue/grey tint)
    cool85: "#E0E6E8",
    cool90: "#E8EEF0",
    cool95: "#F4F7F8",
  },

  // Semantic Colors - Light Mode
  semantic: {
    light: {
      textDefault: "rgb(17, 24, 39)",
      textSubtle: "rgb(107, 114, 128)",
      textSubtler: "rgb(172, 176, 184)",
      textForceTint: "rgb(249, 250, 250)",
      textForceShade: "rgb(17, 24, 39)",
      textInverted: "rgb(249, 250, 250)",
      textDisabled: "rgb(172, 176, 184)",
      textAccent: "rgb(228, 60, 129)",
      textAccentSubtle: "rgb(238, 182, 205)",

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
      textAccent: "rgb(228, 60, 129)",

      borderNeutral: "rgb(45, 45, 45)",
      borderNeutralHover: "rgb(64, 64, 64)",

      surface: "rgb(12, 12, 13)",
      canvas: "rgb(10, 10, 10)",
    },
  },
} as const;

export const typography = {
  // Font Sizes (in rem)
  fontSize: {
    xs: "0.6875rem", // 11px
    sm: "0.8125rem", // 13px
    base: "0.9375rem", // 15px
    md: "0.9375rem", // 15px
    lg: "1.0625rem", // 17px
    xl: "1.1875rem", // 19px
    "2xl": "1.3125rem", // 21px
    h6: "1.5rem", // 24px
    h5: "1.75rem", // 28px
    h4: "2.375rem", // 38px
    h3: "2.75rem", // 44px
    h2: "3.625rem", // 58px
    h1: "4.25rem", // 68px
    featureH3: "2.5rem", // 40px
    featureH2: "3.5rem", // 56px
    featureH1: "4.5rem", // 72px
    featureBody: "1.25rem", // 20px
    featureQuote: "2rem", // 32px
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
  mobile: {
    columns: 4,
    gutter: "16px",
    margin: "16px",
  },
  tablet: {
    columns: 12,
    gutter: "24px",
    margin: "32px",
  },
  desktop: {
    columns: 18,
    gutter: "24px",
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
export type AsphaltColor = keyof typeof colors.asphalt;
export type PacePurpleColor = keyof typeof colors.pacePurple;
export type VoltGreenColor = keyof typeof colors.voltGreen;
export type SignalOrangeColor = keyof typeof colors.signalOrange;
export type TrackRedColor = keyof typeof colors.trackRed;
export type TrailBrownColor = keyof typeof colors.trailBrown;
export type CanvasColor = keyof typeof colors.canvas;
export type SemanticLightColor = keyof typeof colors.semantic.light;
export type SemanticDarkColor = keyof typeof colors.semantic.dark;
