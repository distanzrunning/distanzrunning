/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Distanz Brand Colors
        'electric-pink': '#e43c81',
        'volt-green': '#00D464',
        'signal-orange': '#FF5722',
        'pace-purple': '#7C3AED',
        'trail-brown': '#8B4513',
        'track-red': '#DC2626',

        // Primary palette
        'black': '#0A0A0A',
        'white': '#FFFFFF',
        'off-white': '#FAFAF8',

        // Gray scale
        'gray-900': '#1A1A1A',
        'gray-800': '#2D2D2D',
        'gray-700': '#404040',
        'gray-600': '#595959',
        'gray-500': '#737373',
        'gray-400': '#A6A6A6',
        'gray-300': '#D9D9D9',
        'gray-200': '#E6E6E6',
        'gray-100': '#F5F5F5',

        // Legacy/compatibility
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',

        // Semantic colors via CSS variables
        'textDefault': 'rgb(var(--color-textDefault))',
        'textSubtle': 'rgb(var(--color-textSubtle))',
        'textSubtler': 'rgb(var(--color-textSubtler))',
        'textForceTint': 'rgb(var(--color-textForceTint))',
        'textForceShade': 'rgb(var(--color-textForceShade))',
        'textInverted': 'rgb(var(--color-textInverted))',
        'textDisabled': 'rgb(var(--color-textDisabled))',
        'textAccent': 'rgb(var(--color-textAccent))',
        'textAccentSubtle': 'rgb(var(--color-textAccentSubtle))',

        'borderNeutral': 'rgb(var(--color-borderNeutral))',
        'borderNeutralHover': 'rgb(var(--color-borderNeutralHover))',
        'borderNeutralSubtle': 'rgb(var(--color-borderNeutralSubtle))',
        'surface': 'rgb(var(--color-surface))',
        'canvas': 'rgb(var(--color-canvas))',
        'greyCold400': 'rgb(var(--color-greyCold400))',
        'neutralBgSubtle': 'rgb(var(--color-neutralBgSubtle))',
      },
      backgroundColor: {
        'primary-light': '#f9e8ee',

        // Distanz background colors
        'surface': 'rgb(var(--color-surface))',
        'canvas': 'rgb(var(--color-canvas))',
        'neutralBgSubtle': 'rgb(var(--color-neutralBgSubtle))',
      },
      keyframes: {
        navContentIn: {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        navContentOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-10px) scale(0.98)' },
        },
        navViewportIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px) scaleY(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
        },
        navViewportOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
          '100%': { opacity: '0', transform: 'translateY(-8px) scaleY(0.95)' },
        },
        navIndicatorIn: {
          '0%': { opacity: '0', transform: 'translateY(6px) scaleX(0.8)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleX(1)' },
        },
        navIndicatorOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scaleX(1)' },
          '100%': { opacity: '0', transform: 'translateY(4px) scaleX(0.75)' },
        },
        navEnterFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-180px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        navEnterFromRight: {
          '0%': { opacity: '0', transform: 'translateX(180px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        navExitToLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-180px)' },
        },
        navExitToRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(180px)' },
        },
        megaMenuIn: {
          '0%': { opacity: '0', transform: 'scaleY(0.95) translateY(-20px)' },
          '100%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
        },
        megaMenuOut: {
          '0%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scaleY(0.95) translateY(-20px)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scaleY(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
        },
        slideUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scaleY(0.95)' },
        },
        megaMenuOpen: {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        megaMenuClose: {
          '0%': { opacity: '1', transform: 'scaleY(1)' },
          '100%': { opacity: '0', transform: 'scaleY(0)' },
        },
      },
      animation: {
        'nav-content-in': 'navContentIn 200ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-content-out': 'navContentOut 160ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-viewport-in': 'navViewportIn 220ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-viewport-out': 'navViewportOut 180ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-indicator-in': 'navIndicatorIn 160ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-indicator-out': 'navIndicatorOut 140ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-enter-from-left': 'navEnterFromLeft 180ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-enter-from-right': 'navEnterFromRight 180ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-exit-to-left': 'navExitToLeft 160ms cubic-bezier(.16,1,.3,1) forwards',
        'nav-exit-to-right': 'navExitToRight 160ms cubic-bezier(.16,1,.3,1) forwards',
        'mega-menu-in': 'megaMenuIn 250ms cubic-bezier(.16,1,.3,1) forwards',
        'mega-menu-out': 'megaMenuOut 200ms cubic-bezier(.16,1,.3,1) forwards',
        'slideDown': 'slideDown 250ms cubic-bezier(.16,1,.3,1) forwards',
        'slideUp': 'slideUp 200ms cubic-bezier(.16,1,.3,1) forwards',
        'mega-menu-open': 'megaMenuOpen 300ms cubic-bezier(.16,1,.3,1) forwards',
        'mega-menu-close': 'megaMenuClose 300ms cubic-bezier(.16,1,.3,1) forwards',
      },
      textColor: {
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',

        // Distanz semantic text colors
        'textDefault': 'rgb(var(--color-textDefault))',
        'textSubtle': 'rgb(var(--color-textSubtle))',
        'textSubtler': 'rgb(var(--color-textSubtler))',
        'textForceTint': 'rgb(var(--color-textForceTint))',
        'textForceShade': 'rgb(var(--color-textForceShade))',
        'textInverted': 'rgb(var(--color-textInverted))',
        'textDisabled': 'rgb(var(--color-textDisabled))',
        'textAccent': 'rgb(var(--color-textAccent))',
        'textAccentSubtle': 'rgb(var(--color-textAccentSubtle))',
      },
      borderColor: {
        primary: '#e43c81',
        secondary: '#eeb6cd',

        // Distanz border colors
        'borderNeutral': 'rgb(var(--color-borderNeutral))',
        'borderNeutralHover': 'rgb(var(--color-borderNeutralHover))',
        'borderNeutralSubtle': 'rgb(var(--color-borderNeutralSubtle))',
      },
      fontFamily: {
        // Distanz Typography System - Free Google Fonts
        // Display (Archivo Black) - Headlines only
        display: ['var(--font-display)', 'Archivo Black', 'Arial Black', 'sans-serif'],
        headline: ['var(--font-display)', 'Archivo Black', 'Arial Black', 'sans-serif'],
        archivo: ['var(--font-display)', 'Archivo Black', 'Arial Black', 'sans-serif'],

        // Body/UI (Bricolage Grotesque) - Variable font
        sans: [
          'var(--font-body)',
          'Bricolage Grotesque',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        body: ['var(--font-body)', 'Bricolage Grotesque', 'sans-serif'],
        ui: ['var(--font-body)', 'Bricolage Grotesque', 'sans-serif'],
        bricolage: ['var(--font-body)', 'Bricolage Grotesque', 'sans-serif'],

        // Monospace (JetBrains Mono) - Data, metadata, race times
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],

        // Legacy aliases for backwards compatibility
        playfair: ['var(--font-display)', 'Archivo Black', 'sans-serif'],
        inter: ['var(--font-body)', 'Bricolage Grotesque', 'sans-serif'],
        garvis: ['var(--font-display)', 'Archivo Black', 'sans-serif'],
        quasimoda: ['var(--font-body)', 'Bricolage Grotesque', 'sans-serif'],
        serif: ['var(--font-display)', 'Archivo Black', 'sans-serif'],
      },
      fontSize: {
        // Distanz Typography System - Archivo Black + Bricolage Grotesque

        // Metadata & Small Text (JetBrains Mono for metadata, Bricolage for captions)
        'xs': ['12px', {
          lineHeight: '1.4',
          letterSpacing: '0.05em',
          '--font-size-px': '12'
        }],
        'sm': ['13px', {
          lineHeight: '1.4',
          letterSpacing: '0.02em',
          '--font-size-px': '13'
        }],

        // UI & Forms (Bricolage Grotesque)
        'base': ['14px', {
          lineHeight: '1.4',
          letterSpacing: '0',
          '--font-size-px': '14'
        }],
        'nav': ['15px', {
          lineHeight: '1',
          letterSpacing: '0.01em',
          '--font-size-px': '15'
        }],

        // Body Text (Bricolage Grotesque)
        'body': ['clamp(16px, 1.5vw, 17px)', {
          lineHeight: '1.65',
          letterSpacing: '-0.003em',
          '--font-size-px': '17'
        }],
        'body-lg': ['clamp(17px, 1.5vw, 18px)', {
          lineHeight: '1.65',
          letterSpacing: '-0.003em',
          '--font-size-px': '18'
        }],

        // Lead Paragraphs (Bricolage Grotesque)
        'lead': ['clamp(19px, 2vw, 22px)', {
          lineHeight: '1.5',
          letterSpacing: '-0.005em',
          '--font-size-px': '21'
        }],

        // Pull Quotes (Archivo Black)
        'quote': ['clamp(24px, 3vw, 36px)', {
          lineHeight: '1.15',
          letterSpacing: '-0.01em',
          '--font-size-px': '30'
        }],

        // Headings - H4-H6 (Bricolage Grotesque Bold)
        'h6': ['18px', {
          lineHeight: '1.2',
          letterSpacing: '-0.005em',
          '--font-size-px': '18'
        }],
        'h5': ['20px', {
          lineHeight: '1.2',
          letterSpacing: '-0.005em',
          '--font-size-px': '20'
        }],
        'h4': ['clamp(18px, 2vw, 24px)', {
          lineHeight: '1.2',
          letterSpacing: '-0.005em',
          '--font-size-px': '22'
        }],

        // Headings - H3 (Archivo Black)
        'h3': ['clamp(24px, 3vw, 32px)', {
          lineHeight: '1.1',
          letterSpacing: '-0.01em',
          '--font-size-px': '28'
        }],

        // Headings - H2 (Archivo Black)
        'h2': ['clamp(32px, 4vw + 0.5rem, 48px)', {
          lineHeight: '1.0',
          letterSpacing: '-0.015em',
          '--font-size-px': '42'
        }],

        // Headings - H1 (Archivo Black)
        'h1': ['clamp(40px, 5vw + 1rem, 72px)', {
          lineHeight: '0.95',
          letterSpacing: '-0.02em',
          '--font-size-px': '64'
        }],

        // Stat Callouts (Archivo Black - Large numbers)
        'stat': ['clamp(48px, 6vw, 96px)', {
          lineHeight: '0.9',
          letterSpacing: '-0.03em',
          '--font-size-px': '72'
        }],

        // Newsletter Headers (Archivo Black)
        'newsletter': ['clamp(32px, 4vw, 42px)', {
          lineHeight: '1.0',
          letterSpacing: '-0.015em',
          '--font-size-px': '38'
        }],

        // Legacy Tailwind sizes for compatibility
        'xl': ['20px', {
          lineHeight: '1.5',
          letterSpacing: '0',
          '--font-size-px': '20'
        }],
        '2xl': ['24px', {
          lineHeight: '1.4',
          letterSpacing: '0',
          '--font-size-px': '24'
        }],
        '3xl': ['30px', {
          lineHeight: '1.3',
          letterSpacing: '-0.01em',
          '--font-size-px': '30'
        }],
        '4xl': ['36px', {
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          '--font-size-px': '36'
        }],
        '5xl': ['48px', {
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          '--font-size-px': '48'
        }],
        '6xl': ['60px', {
          lineHeight: '1.0',
          letterSpacing: '-0.02em',
          '--font-size-px': '60'
        }],
        '7xl': ['72px', {
          lineHeight: '0.95',
          letterSpacing: '-0.03em',
          '--font-size-px': '72'
        }],
      },
      lineHeight: {
        // Tighter line heights for more squared typography
        'snug': '1.25', // Reduced from 1.375
        'tight': '1.15', // Reduced from 1.25
        'normal': '1.35', // Reduced from 1.5
        'relaxed': '1.5', // Reduced from 1.625
        
        // Exact pixel line heights from Quartr
        '[23px]': '23px',
        '[24px]': '24px',
        '[25px]': '25px',
        '[28px]': '28px',
        '[40px]': '40px',
        '[56px]': '56px',
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        'semi-bold': '550', // Match Quartr's exact weight
        bold: '600',
      },
      letterSpacing: {
        'tight': '-0.025em',
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
      },
      maxWidth: {
        'distanz': '95%', // Wide container width for consistent layouts
        'quartr': '95%', // Legacy - updated to match new width
        'text': '720px', // Optimal reading width for articles (unchanged)
        'content': '95%', // Standard content width
        'wide': '95%', // Wide layouts
      },
      spacing: {
        '18': '4.5rem',
        '21': '5.25rem',
        '23': '5.75rem',
      },
      boxShadow: {
        'elevation-flyout': '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'rotate': 'rotate 3s linear infinite both',
        'flip': 'flip 6s steps(2) infinite',
      },
      keyframes: {
        rotate: {
          'to': {
            transform: 'rotate(90deg)',
            content: 'var(--tw-content)'
          },
        },
        flip: {
          'to': { transform: 'rotate(1turn)' },
        },
      },
    },
  },
  typography: (theme) => ({
    DEFAULT: {
      css: {
        lineHeight: '1.3',
        p: {
          marginTop: '0',
          marginBottom: '1rem',
        },
        h2: {
          marginTop: '1.25rem',
          marginBottom: '1rem',
        },
        h3: {
          marginTop: '1.25rem',
          marginBottom: '0.75rem',
        },
      },
    },
  }),

  plugins: [
    require('@tailwindcss/typography'),
    // TODO: Install @tailwindcss/container-queries package
    // require('@tailwindcss/container-queries'),
    function({ addComponents, theme }) {
      addComponents({
        // Distanz container system (Quartr-inspired)
        '.distanz-container': {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '95%',
          width: '100%',
          columnGap: '1.25rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        },
        '@media (min-width: 1024px)': {
          '.distanz-container': {
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          },
        },

        // Article container with top padding
        '.distanz-article-container': {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '95%',
          width: '100%',
          columnGap: '1.25rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '80px',
        },
        '@media (min-width: 1024px)': {
          '.distanz-article-container': {
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          },
        },

        '.distanz-full-col': {
          gridColumn: '1 / -1',
        },

        '.distanz-article-col': {
          gridColumn: '1 / -1',
          '@media (min-width: 1024px)': {
            gridColumnStart: '4',
            gridColumnEnd: '14',
          },
        },

        // Legacy Quartr classes for backwards compatibility
        '.quartr-container': {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '95%',
          width: '100%',
          columnGap: '1.25rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        },
        '@media (min-width: 1024px)': {
          '.quartr-container': {
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          },
        },

        '.quartr-article-container': {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '95%',
          width: '100%',
          columnGap: '1.25rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '80px',
        },
        '@media (min-width: 1024px)': {
          '.quartr-article-container': {
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          },
        },

        '.quartr-full-col': {
          gridColumn: '1 / -1',
        },

        '.quartr-article-col': {
          gridColumn: '1 / -1',
          '@media (min-width: 1024px)': {
            gridColumnStart: '4',
            gridColumnEnd: '14',
          },
        },

        // Distanz font features - enable OpenType features for better readability
        '.distanz-font-features': {
          fontFeatureSettings: "normal",
          fontVariantLigatures: "common-ligatures",
          fontVariantNumeric: "oldstyle-nums proportional-nums",
        },

        // Legacy (Inter-specific, kept for backwards compatibility)
        '.quartr-font-features': {
          fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
        },

        // IEEE-inspired bordered layout system
        // Outer wrapper with responsive width and margins
        '.main-wrapper': {
          position: 'relative',
          width: '100%',
          margin: '0 auto',
          minHeight: '100vh',
          overflow: 'visible',
        },
        '@media (min-width: 768px)': {
          '.main-wrapper': {
            width: '100%',
            maxWidth: '1585px',
          },
        },

        // Inner bordered container - full width with side borders
        '.main-bordered': {
          position: 'relative',
          width: '100%',
          overflow: 'visible',
        },
        '@media (min-width: 768px)': {
          '.main-bordered': {
            borderLeft: '1px solid rgb(var(--color-borderNeutral))',
            borderRight: '1px solid rgb(var(--color-borderNeutral))',
          },
        },

        // Vertical separator utility (borders only)
        '.v-sep': {
          borderLeft: '1px solid rgb(var(--color-borderNeutral))',
          borderRight: '1px solid rgb(var(--color-borderNeutral))',
        },
        '@media (max-width: 767px)': {
          '.v-sep': {
            borderLeft: 'none',
            borderRight: 'none',
          },
        },
      });
    },
    require('tailwindcss-animate'),
  ],
};
