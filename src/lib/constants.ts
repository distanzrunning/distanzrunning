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
      headline: 'var(--font-playfair), Playfair Display, Georgia, Times New Roman, serif',
      body: 'var(--font-body), Source Serif 4, Georgia, serif',
      ui: 'var(--base-font), Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      mono: 'var(--font-mono), JetBrains Mono, Courier New, monospace',
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