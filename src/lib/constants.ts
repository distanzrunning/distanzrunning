// src/lib/constants.ts
export const BRAND = {
  colors: {
    // Primary brand colors
    electricPink: "#e43c81", // Primary action, links, interactive elements
    voltGreen: "#00D464", // Success, positive stats
    signalOrange: "#FF5722", // Breaking news, alerts
    pacePurple: "#7C3AED", // Premium content, featured
    trailBrown: "#8B4513", // Trail running content
    trackRed: "#DC2626", // Track & field content

    // Base palette
    black: "#0A0A0A", // Primary black (slightly warm)
    white: "#FFFFFF", // Pure white
    offWhite: "#FAFAF8", // Background white

    // Gray scale
    gray900: "#1A1A1A", // Headlines
    gray800: "#2D2D2D", // Subheadings
    gray700: "#404040", // Body text
    gray600: "#595959", // Secondary text
    gray500: "#737373", // Captions
    gray400: "#A6A6A6", // Disabled
    gray300: "#D9D9D9", // Borders
    gray200: "#E6E6E6", // Dividers
    gray100: "#F5F5F5", // Backgrounds

    // Legacy compatibility
    primary: "#e43c81",
    secondary: "#eeb6cd",
    dark: "#000000",
    light: "#f7f7f7",
    muted: "#6b7280",
  },
  typography: {
    fontFamilies: {
      // Distanz Typography System - Inter + EB Garamond
      // Adobe Fonts uses lowercase hyphenated names: "inter-variable", "eb-garamond"
      sans: "inter-variable, Inter, -apple-system, BlinkMacSystemFont, sans-serif", // News, UI, headlines
      serif: "eb-garamond, Georgia, Times New Roman, serif", // Features, long-form

      // Aliases
      display: "eb-garamond, serif", // Headlines
      headline: "eb-garamond, serif", // Headlines
      body: "inter-variable, Inter, sans-serif", // Body (news)
      ui: "inter-variable, Inter, sans-serif", // UI elements
      feature: "eb-garamond, Georgia, serif", // Feature content
    },
    weights: {
      // Inter weights
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    sizes: {
      // Small Text & Metadata (Inter)
      label: "11px",
      caption: "12px",
      overline: "12px",

      // UI Elements (Inter)
      buttonSm: "12px",
      button: "14px",
      buttonLg: "16px",
      nav: "14px",

      // Body Text - News (Inter)
      bodySm: "14px",
      body: "16px",

      // Body Text - Features (EB Garamond)
      bodyFeature: "19px",
      subhead: "22px",

      // Headings - News (Inter)
      h3News: "22px",
      h2News: "28px",
      h1News: "36px",
      displayNews: "48px",

      // Headings - Features (EB Garamond)
      h3Feature: "24px",
      h2Feature: "30px",
      h1Feature: "40px",
      displayFeature: "52px",

      // Generic/Legacy
      h6: "18px",
      h5: "20px",
      h4: "22px",
      h3: "clamp(22px, 2.5vw, 28px)",
      h2: "clamp(28px, 3.5vw, 36px)",
      h1: "clamp(32px, 4.5vw, 48px)",

      // Special Elements
      quote: "26px", // EB Garamond
      stat: "clamp(48px, 6vw, 96px)", // Inter
    },
    lineHeights: {
      superTight: 0.9, // Large stat numbers
      ultraTight: 1.0, // Display headlines
      tight: 1.1, // Display features
      snug: 1.15, // H1 features
      comfortable: 1.2, // H1 news, H2-H6
      normal: 1.3, // H3-H4, overlines
      relaxed: 1.4, // Captions, quotes, subhead
      loose: 1.5, // News body
      looser: 1.6, // Feature body
    },
    letterSpacing: {
      tightest: "-0.03em", // Large stats
      tighter: "-0.02em", // Display news
      tight: "-0.015em", // H1 news
      snug: "-0.01em", // H2 news, H1 feature
      slight: "-0.005em", // H3-H5
      none: "0", // Body, captions
      wide: "0.01em", // Feature body, buttons
      wider: "0.02em", // Small labels
      widest: "0.03em", // Tags
      ultraWide: "0.08em", // Overlines, uppercase
    },
  },
  layout: {
    maxWidth: {
      text: "720px", // Optimal reading width
      content: "1200px", // Standard content
      wide: "1440px", // Wide layouts
      full: "1920px", // Full-width sections
    },
    containerWidth: "1042px", // Distanz design system grid container
  },
  spacing: {
    unit: "4px", // Base spacing unit
  },
};
