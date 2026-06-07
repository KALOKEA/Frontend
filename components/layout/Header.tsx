'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Auto-focus the search input when the overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    router.push(`/shop?search=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <header className={`sticky top-0 z-30 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : 'border-b border-[#e8e4e0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger (mobile) — min 44×44px touch target */}
            <button
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0a0a0a] -ml-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
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

            {/* Icons — min 44×44px touch targets on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 -mr-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
              {/* Wishlist — hidden on smallest mobile to save header space */}
              <Link href={isLoggedIn ? '/account/wishlist' : '/login'} className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </Link>
              {/* Account */}
              <Link href={isLoggedIn ? '/account' : '/login'} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors" aria-label="Account">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSearchOpen(false)}
          />
          {/* Search bar — sits at the top */}
          <div className="relative bg-white border-b border-[#e8e4e0] px-4 sm:px-6 py-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dresses, tops, bags…"
                className="flex-1 text-base font-sans text-[#0a0a0a] placeholder-[#9b9b9b] outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#9b9b9b] hover:text-[#0a0a0a] text-xl leading-none"
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-4 py-2 text-[11px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-40 transition-colors shrink-0"
              >
                Search
              </button>
            </form>
            {/* Quick links */}
            <div className="max-w-2xl mx-auto mt-3 flex flex-wrap gap-2 pl-7">
              {['Dresses', 'Tops', 'Sale', 'New Arrivals'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchOpen(false)
                    router.push(`/shop?category=${term.toLowerCase().replace(/ /g, '-')}`)
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#6b6b6b] border border-[#e8e4e0] px-3 py-1 hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
