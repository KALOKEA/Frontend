'use client'
import { useState, useEffect } from 'react'

const MESSAGES = [
  'Free shipping on orders above ₹999 — Shop Now',
  'New arrivals just dropped — Explore the collection',
  'Easy 7-day returns · No questions asked',
  'Secure checkout · UPI · Razorpay · COD available',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Dismissed this session? stay hidden.
    if (sessionStorage.getItem('ann-dismissed')) {
      setVisible(false)
      return
    }

    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % MESSAGES.length)
        setFading(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="relative bg-[#c8a4a5] text-white text-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 py-2.5">
        <p
          className="text-[10px] font-sans tracking-[0.2em] uppercase leading-tight transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {MESSAGES[current]}
        </p>
      </div>
      {/* Dismiss button */}
      <button
        onClick={() => {
          setVisible(false)
          sessionStorage.setItem('ann-dismissed', '1')
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
