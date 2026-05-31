'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import CartIcon from './CartIcon'
import MobileMenu from './MobileMenu'
import { useAuthStore } from '@/lib/store/useAuthStore'

const NAV = [
  { label: 'New Arrivals', href: '/shop?category=new-arrivals' },
  { label: 'Dresses', href: '/shop?category=dresses' },
  { label: 'Tops', href: '/shop?category=tops' },
  { label: 'Bottoms', href: '/shop?category=bottoms' },
  { label: 'Shoes', href: '/shop?category=shoes' },
  { label: 'Bags', href: '/shop?category=bags' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Sale', href: '/shop?category=sale', rose: true },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-30 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : 'border-b border-[#e8e4e0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-1 text-[#0a0a0a]"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-[#0a0a0a] uppercase">
              KALOKEA
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-[10px] font-sans tracking-widest uppercase transition-colors ${n.rose ? 'text-[#c8a4a5] hover:text-[#a07e80]' : 'text-[#0a0a0a] hover:text-[#c8a4a5]'}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link href="/shop" className="p-1 text-[#0a0a0a] hover:text-[#c8a4a5]" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </Link>
              {/* Wishlist */}
              <Link href={isLoggedIn ? '/account/wishlist' : '/login'} className="p-1 text-[#0a0a0a] hover:text-[#c8a4a5]" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </Link>
              {/* Account */}
              <Link href={isLoggedIn ? '/account' : '/login'} className="p-1 text-[#0a0a0a] hover:text-[#c8a4a5]" aria-label="Account">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
