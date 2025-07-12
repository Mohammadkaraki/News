/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e71d36',
          50: '#fef2f4',
          100: '#fee2e7',
          200: '#fec9d2',
          300: '#fda4b4',
          400: '#fb708c',
          500: '#f44667',
          600: '#e71d36',
          700: '#c61530',
          800: '#a5142d',
          900: '#8a152c',
        },
        secondary: {
          DEFAULT: '#2b2d42',
          50: '#f4f5f7',
          100: '#e8eaef',
          200: '#d1d5de',
          300: '#b0b5c7',
          400: '#888fac',
          500: '#6b7295',
          600: '#565c7a',
          700: '#444964',
          800: '#393c52',
          900: '#2b2d42',
        },
        tertiary: {
          DEFAULT: '#8d99ae',
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecf1',
          300: '#d8dde6',
          400: '#bec7d5',
          500: '#8d99ae',
          600: '#7f8da3',
          700: '#687590',
          800: '#535e75',
          900: '#424a5e',
        },
        light: '#edf2f4',
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'Noto Naskh Arabic', 'system-ui', 'sans-serif'],
        serif: ['Cairo', 'Tajawal', 'Georgia', 'serif'],
        arabic: ['Cairo', 'Tajawal', 'Noto Naskh Arabic', 'system-ui', 'sans-serif'],
        heading: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}; 