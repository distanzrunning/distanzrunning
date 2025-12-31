// src/lib/constants.ts
export const BRAND = {
  colors: {
    // Primary brand colors
    electricPink: '#e43c81',    // Primary action, links, interactive elements
    voltGreen: '#00D464',       // Success, positive stats
    signalOrange: '#FF5722',    // Breaking news, alerts
    pacePurple: '#7C3AED',      // Premium content, featured
    trailBrown: '#8B4513',      // Trail running content
    trackRed: '#DC2626',        // Track & field content

    // Base palette
    black: '#0A0A0A',           // Primary black (slightly warm)
    white: '#FFFFFF',           // Pure white
    offWhite: '#FAFAF8',        // Background white

    // Gray scale
    gray900: '#1A1A1A',         // Headlines
    gray800: '#2D2D2D',         // Subheadings
    gray700: '#404040',         // Body text
    gray600: '#595959',         // Secondary text
    gray500: '#737373',         // Captions
    gray400: '#A6A6A6',         // Disabled
    gray300: '#D9D9D9',         // Borders
    gray200: '#E6E6E6',         // Dividers
    gray100: '#F5F5F5',         // Backgrounds

    // Legacy compatibility
    primary: '#e43c81',
    secondary: '#eeb6cd',
    dark: '#000000',
    light: '#f7f7f7',
    muted: '#6b7280',
  },
  typography: {
    fontFamilies: {
      // Distanz Typography System - Free Google Fonts
      display: 'Archivo Black, Arial Black, sans-serif',                         // Headlines (H1-H3)
      headline: 'Archivo Black, Arial Black, sans-serif',                        // Display font (alias)
      body: 'Bricolage Grotesque, -apple-system, BlinkMacSystemFont, sans-serif', // Body text, paragraphs
      ui: 'Bricolage Grotesque, sans-serif',                                     // Navigation, buttons, forms
      mono: 'JetBrains Mono, Courier New, monospace',                            // Race times, data, metadata
    },
    weights: {
      // Archivo Black weights (only 400 available)
      archivoBlack: 400,

      // Bricolage Grotesque weights (variable font 300-800)
      bricolageLight: 300,
      bricolageRegular: 400,
      bricolageMedium: 500,
      bricolageSemiBold: 600,
      bricolageBold: 700,
      bricolageExtraBold: 800,

      // JetBrains Mono weights
      jetbrainsRegular: 400,
      jetbrainsMedium: 500,
      jetbrainsSemiBold: 600,
    },
    sizes: {
      // Metadata (JetBrains Mono)
      metadata: '13px',

      // Body & Content (Bricolage Grotesque)
      caption: '14px',
      body: 'clamp(16px, 1.5vw, 17px)',
      lead: 'clamp(19px, 2vw, 22px)',

      // UI Elements (Bricolage Grotesque)
      label: '13px',
      nav: '15px',
      button: '15px',

      // Headings - Minor (Bricolage Grotesque)
      h6: '18px',
      h5: '20px',
      h4: 'clamp(18px, 2vw, 24px)',

      // Headings - Major (Archivo Black)
      h3: 'clamp(24px, 3vw, 32px)',
      h2: 'clamp(32px, 4vw + 0.5rem, 48px)',
      h1: 'clamp(40px, 5vw + 1rem, 72px)',

      // Special Elements
      quote: 'clamp(24px, 3vw, 36px)',      // Archivo Black
      stat: 'clamp(48px, 6vw, 96px)',        // Archivo Black
      newsletter: 'clamp(32px, 4vw, 42px)',  // Archivo Black
    },
    lineHeights: {
      superTight: 0.9,   // Large stat numbers
      ultraTight: 0.95,  // H1 headlines
      tight: 1.0,        // H2, newsletter
      snug: 1.1,         // H3 subsections
      comfortable: 1.2,  // H4-H6, pull quotes
      normal: 1.4,       // Captions, small text
      relaxed: 1.5,      // Lead paragraphs
      loose: 1.65,       // Body text
    },
    letterSpacing: {
      tightest: '-0.03em',  // Large stats
      tighter: '-0.02em',   // H1
      tight: '-0.015em',    // H2, newsletter
      snug: '-0.01em',      // H3, pull quotes
      slight: '-0.005em',   // H4-H6, lead
      minimal: '-0.003em',  // Body text
      none: '0',
      wide: '0.01em',       // Navigation
      wider: '0.02em',      // Buttons, metadata
      widest: '0.08em',     // Stat labels, uppercase
    },
  },
  layout: {
    maxWidth: {
      text: '720px',      // Optimal reading width
      content: '1200px',  // Standard content
      wide: '1440px',     // Wide layouts
      full: '1920px',     // Full-width sections
    },
    containerWidth: '1042px', // Quartr-inspired grid container
  },
  spacing: {
    unit: '4px', // Base spacing unit
  },
}