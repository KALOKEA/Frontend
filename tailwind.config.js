/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        cream: '#faf8f5',
        'cream-2': '#f4f2ef',
        'cream-3': '#e8e4e0',
        rose: '#c8a4a5',
        'rose-d': '#a07e80',
        gray: '#6b6b6b',
        'gray-l': '#e8e4e0',
        'gray-ll': '#f4f2ef',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
