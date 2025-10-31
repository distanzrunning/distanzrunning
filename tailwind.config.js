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
        // UI font (Inter - sans-serif)
        sans: [
          'var(--base-font)',
          'InterVariable',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        // Headline font (Playfair Display - serif)
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        headline: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        // Body font (Source Serif 4 - serif for articles)
        body: ['var(--font-body)', 'Source Serif 4', 'Georgia', 'serif'],
        serif: ['var(--font-body)', 'Source Serif 4', 'Georgia', 'serif'],
        // Monospace font (JetBrains Mono - for data/stats)
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Tighter font sizing system with reduced line heights
        'xs': ['0.6875rem', { 
          lineHeight: '1.25', // Reduced from 1.4
          letterSpacing: '0.0025em',
          '--font-size-px': '11'
        }],
        'sm': ['0.8125rem', { 
          lineHeight: '1.25', // Reduced from 1.4
          letterSpacing: '0.0025em',
          '--font-size-px': '13'
        }],
        'base': ['0.9375rem', { 
          lineHeight: '1.3', // Reduced from 1.4
          letterSpacing: '0.0025em',
          '--font-size-px': '15'
        }],
        'lg': ['1.0625rem', { 
          lineHeight: '1.25', // Reduced from 1.4
          letterSpacing: '0.0025em',
          '--font-size-px': '17'
        }],
        'xl': ['1.25rem', { 
          lineHeight: '1.3', // Reduced from 1.4
          letterSpacing: '0',
          '--font-size-px': '20'
        }],
        '2xl': ['1.5rem', { 
          lineHeight: '1.15', // Reduced from 1.25
          letterSpacing: '-0.025em',
          '--font-size-px': '24'
        }],
        '3xl': ['1.875rem', { 
          lineHeight: '1.15', // Reduced from 1.25
          letterSpacing: '-0.025em',
          '--font-size-px': '30'
        }],
        '4xl': ['3rem', {
          lineHeight: '1.1', // Reduced from 1.2
          letterSpacing: '-0.02em',
          '--font-size-px': '48'
        }],
        
        // Quartr's exact pixel sizes with tighter line heights
        '[17px]': ['17px', {
          lineHeight: '22px', // Reduced from 25px
          '--font-size-px': '17'
        }],
        '[19px]': ['19px', {
          lineHeight: '25px', // Reduced from 28px
          '--font-size-px': '19'
        }],
        '[21px]': ['21px', {
          lineHeight: '22px', // Reduced from 24px
          '--font-size-px': '21'
        }],
        '[22px]': ['22px', {
          lineHeight: '24px', // Reduced from 25px
          '--font-size-px': '22'
        }],
        '[35px]': ['35px', {
          lineHeight: '36px', // Reduced from 40px
          '--font-size-px': '35'
        }],
        '[56px]': ['56px', {
          lineHeight: '52px', // Reduced from 56px
          '--font-size-px': '56'
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
        'distanz': '1042px', // Maintain Quartr-inspired container width
        'quartr': '1042px', // Legacy
        'text': '720px', // Optimal reading width for articles
        'content': '1200px', // Standard content width
        'wide': '1440px', // Wide layouts
      },
      spacing: {
        '18': '4.5rem',
        '21': '5.25rem',
        '23': '5.75rem',
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
          maxWidth: '1042px',
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
          maxWidth: '1042px',
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
          maxWidth: '1042px',
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
          maxWidth: '1042px',
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

        // Distanz font features (Inter variable font)
        '.distanz-font-features': {
          fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
        },

        // Legacy
        '.quartr-font-features': {
          fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
        },
      });
    },
  ],
};