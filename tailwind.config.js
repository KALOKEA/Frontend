/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand
        black:      '#0a0a0a',
        cream:      '#faf8f5',
        'cream-2':  '#f4f2ef',
        'cream-3':  '#e8e4e0',
        rose:       '#c8a4a5',
        'rose-d':   '#a07e80',
        gray:       '#6b6b6b',
        'gray-l':   '#e8e4e0',
        'gray-ll':  '#f4f2ef',
        // Extended palette (design upgrade)
        ink:        '#1a1a1a',   // softer black for hovers/layers
        parch:      '#f0ece8',   // warm parchment between cream and border
        sand:       '#d4b896',   // warm caramel accent
        mauve:      '#7a5c5d',   // deep rose for hover states
        blush:      '#e8d5c4',   // light blush for bg tints
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 4px 20px rgba(0,0,0,0.06)',
        'float': '0 16px 40px rgba(0,0,0,0.10)',
        'glow':  '0 0 20px rgba(200,164,165,0.25)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartPulse: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmerSweep: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer:       'shimmer 1.5s infinite',
        'fade-up':     'fadeInUp 0.65s ease forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'slide-left':  'slideInLeft 0.65s ease forwards',
        'scale-in':    'scaleIn 0.5s ease forwards',
        'heart-pulse': 'heartPulse 0.35s ease',
        'shimmer-sweep':'shimmerSweep 0.9s linear',
        marquee:       'marquee 20s linear infinite',
      },
      transitionDelay: {
        '75':  '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}
