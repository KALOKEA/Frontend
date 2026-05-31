'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const WORDS = ['Confident', 'Elegant', 'Powerful', 'Unstoppable']

export default function HeroBanner() {
  const [wordIdx, setWordIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIdx((prev) => (prev + 1) % WORDS.length)
        setFade(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-[#faf8f5] py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-6">
          New Collection 2026
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#0a0a0a] mb-4 leading-none">
          Fashion for the{' '}
          <span
            className="italic text-[#c8a4a5] transition-opacity duration-300"
            style={{ opacity: fade ? 1 : 0 }}
          >
            {WORDS[wordIdx]}
          </span>
        </h1>
        <p className="font-sans text-sm text-[#6b6b6b] max-w-lg mx-auto mb-10 leading-relaxed">
          Discover styles that speak before you do. Bold designs, quality fabrics, prices that make sense.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-8 py-4 hover:bg-[#2a2a2a] transition-colors"
          >
            Shop New Arrivals
          </Link>
          <Link
            href="/shop?category=sale"
            className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-8 py-4 hover:bg-[#0a0a0a] hover:text-white transition-colors"
          >
            View Sale
          </Link>
        </div>
      </div>

      {/* Trust strip */}
      <div className="mt-16 bg-[#0a0a0a] -mx-4 px-4 py-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ['Free Shipping', 'On orders above ₹999'],
            ['Easy Returns', '7-day hassle-free returns'],
            ['Secure Payment', 'Razorpay encrypted checkout'],
            ['Made in India', 'Supporting local artisans'],
          ].map(([title, sub]) => (
            <div key={title}>
              <p className="text-[10px] font-sans tracking-widest uppercase text-white mb-1">{title}</p>
              <p className="text-[10px] font-sans text-[#6b6b6b]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
