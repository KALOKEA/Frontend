/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── NEW brand palette (Session 12) ──────────────────────────────────
        ivory:      '#FDFAF6',   // warm off-white — main bg
        linen:      '#F2EAE0',   // slightly deeper warm bg
        stone:      '#E0D4C4',   // warm border / divider
        sand:       '#C4A882',   // warm gold-tan accent
        sienna: {
          DEFAULT: '#7C4A2D',   // primary terracotta accent
          light:   '#9E6544',   // hover sienna
          dark:    '#5C3520',   // pressed sienna
        },
        charcoal:   '#1A1612',   // warm near-black for dark sections
        'warm-gray':'#6B5E55',   // body text warm gray

        // ── LEGACY — kept for admin & older pages ────────────────────────────
        black:      '#0A0908',
        cream:      '#FDFAF6',   // remapped → ivory
        'cream-2':  '#F2EAE0',   // remapped → linen
        'cream-3':  '#E0D4C4',   // remapped → stone
        rose:       '#7C4A2D',   // remapped → sienna (all existing rose refs get sienna)
        'rose-d':   '#9E6544',   // remapped → sienna-light
        gray:       '#6B5E55',   // remapped → warm-gray
        'gray-l':   '#E0D4C4',   // remapped → stone
        'gray-ll':  '#F2EAE0',   // remapped → linen
        ink:        '#1A1612',   // remapped → charcoal
        parch:      '#EDE4D9',
        mauve:      '#5C3520',
        blush:      '#EDE4D9',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 4px 20px rgba(26,22,18,0.07)',
        'float': '0 16px 40px rgba(26,22,18,0.12)',
        'glow':  '0 0 24px rgba(124,74,45,0.18)',
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
        shimmer:        'shimmer 1.5s infinite',
        'fade-up':      'fadeInUp 0.65s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-left':   'slideInLeft 0.65s ease forwards',
        'scale-in':     'scaleIn 0.5s ease forwards',
        'heart-pulse':  'heartPulse 0.35s ease',
        'shimmer-sweep':'shimmerSweep 0.9s linear',
        marquee:        'marquee 22s linear infinite',
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
