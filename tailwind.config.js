// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',
      },
      backgroundColor: {
        'primary-light': '#f9e8ee', // A very light tint of your secondary for subtle backgrounds
      },
      textColor: {
        primary: '#e43c81',
        secondary: '#eeb6cd',
        dark: '#000000',
        light: '#f7f7f7',
        muted: '#6b7280',
      },
      borderColor: {
        primary: '#e43c81',
        secondary: '#eeb6cd',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}