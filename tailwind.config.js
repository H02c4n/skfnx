/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Tiempos Headline', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#f5f2ef',
          100: '#e8e2db',
          200: '#d6cec4',
          300: '#b2a59b',   // main primary
          400: '#9b8b7f',
          500: '#7d6b5e',
          600: '#5e4e42',
          700: '#4a3d33',
          800: '#3a3028',
          900: '#2c2420',
        },
        secondary: {
          50: '#faf7f0',
          100: '#f2ecd9',
          200: '#ded0b6',   // main secondary
          300: '#c9b89a',
          400: '#b09b78',
          500: '#947d58',
        },
        accent: {
          300: '#be7b72',   // tertiary
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}