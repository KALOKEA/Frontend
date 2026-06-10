'use client'
import { useEffect, useState } from 'react'

/**
 * Back-to-top button.
 * Matches reference styles.css:
 *   position:fixed; bottom:96px; right:32px; width:42px; height:42px
 *   opacity:0 → opacity:1 (.show) when scrollY > 400
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed z-40 flex items-center justify-center transition-all duration-300 focus:outline-none"
      style={{
        bottom: 96,
        right: 32,
        width: 42,
        height: 42,
        background: '#FDFAF6',
        border: '1px solid #E0D4C4',
        color: '#7C4A2D',
        boxShadow: '0 2px 20px rgba(10,8,6,0.08)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  )
}
