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
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',
        
        // Quartr's exact color system
        'textDefault': 'rgb(var(--color-textDefault))',
        'textSubtle': 'rgb(var(--color-textSubtle))',
        'textSubtler': 'rgb(var(--color-textSubtler))',
        'textForceTint': 'rgb(var(--color-textForceTint))',
        'textForceShade': 'rgb(var(--color-textForceShade))',
        'textInverted': 'rgb(var(--color-textInverted))',
        'textDisabled': 'rgb(var(--color-textDisabled))',
        'textAccent': 'rgb(var(--color-textAccent))',
        'textAccentSubtle': 'rgb(var(--color-textAccentSubtle))',
        
        // Additional Quartr colors
        'borderNeutralSubtle': 'rgb(var(--color-borderNeutralSubtle))',
        'surface': 'rgb(var(--color-surface))',
        'canvas': 'rgb(var(--color-canvas))',
        'greyCold400': 'rgb(var(--color-greyCold400))',
      },
      backgroundColor: {
        'primary-light': '#f9e8ee',
        
        // Quartr background colors
        'surface': 'rgb(var(--color-surface))',
        'canvas': 'rgb(var(--color-canvas))',
      },
      textColor: {
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',
        
        // Quartr text colors
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
        
        // Quartr border colors
        'borderNeutralSubtle': 'rgb(var(--color-borderNeutralSubtle))',
      },
      fontFamily: {
        sans: [
          'var(--base-font)', 
          'InterVariable', 
          'Inter', 
          'system-ui', 
          'sans-serif'
        ],
        playfair: ['var(--font-playfair)', 'serif'],
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
        'quartr': '1042px',
      },
      spacing: {
        '18': '4.5rem',
        '21': '5.25rem',
        '23': '5.75rem',
      },
      animation: {
        'rotate': 'rotate 6s linear infinite',
        'flip': 'flip 6s steps(2) infinite',
      },
      keyframes: {
        rotate: {
          'to': { transform: 'rotate(180deg)' },
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
    function({ addComponents, theme }) {
      addComponents({
        // Quartr's exact article container from their CSS
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

        // Article container matching Quartr exactly
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

        // Quartr's exact font features
        '.quartr-font-features': {
          fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
        },
      });
    },
  ],
};