'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import CartIcon from './CartIcon'
import MobileMenu from './MobileMenu'
import AnnouncementBar from './AnnouncementBar'
import FlashSaleBanner from './FlashSaleBanner'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { categoriesApi, type Category } from '@/lib/api/categories'

// Static nav anchors — category links are injected dynamically from active categories
const NAV_STATIC_START = [{ label: 'Shop', href: '/shop/' }]
const NAV_STATIC_END   = [{ label: 'Journal', href: '/blog/' }, { label: 'About', href: '/about/' }]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  // Admin has its own shell (sidebar). The storefront header must NOT render on
  // /admin — its z-900 layer was sitting on top of admin modals (e.g. the
  // email-log "Details" dialog appeared to do nothing because it opened behind it).
  const isAdmin = !!pathname?.startsWith('/admin')
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const { isLoggedIn } = useAuthStore()
  const [cats, setCats] = useState<Category[]>([])

  // Build nav links dynamically: Shop → active categories (max 5) → Journal → About
  const navLinks = [
    ...NAV_STATIC_START,
    ...cats.slice(0, 5).map(c => ({ label: c.name, href: `/shop/${c.slug}/` })),
    ...NAV_STATIC_END,
  ]

  // Load real categories for the search "browse categories" grid.
  useEffect(() => {
    categoriesApi.getAll()
      .then(d => {
        const list = Array.isArray(d) ? d : ((d as any)?.data || [])
        setCats(list.filter((c: Category) => c.is_active))
      })
      .catch(() => {})
  }, [])

  // Nav is always transparent (no white background ever).
  // Text/icon colour switches: white only on homepage hero (dark behind), dark everywhere else.
  const isHome = pathname === '/'
  const isTransparent = true
  const heroMode = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    handler() // set correct state immediately on mount (matches reference script.js)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Keep --header-h CSS variable in sync with actual rendered header height.
  // This handles FlashSaleBanner appearing/disappearing without hardcoding px values.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--header-h', el.offsetHeight + 'px')
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // On admin routes the storefront header isn't rendered, so reset the layout's
  // top padding to 0 (otherwise <main> keeps the storefront's --header-h gap).
  useEffect(() => {
    if (isAdmin) document.documentElement.style.setProperty('--header-h', '0px')
  }, [isAdmin])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    router.push(`/shop/?search=${encodeURIComponent(q)}`)
  }

  // Nav link colour — white on dark hero, dark on light pages / after scroll
  const linkCls = heroMode
    ? 'text-white/85 hover:text-white'
    : 'text-[#160F09] hover:text-[#7C4A2D]'

  // Icon button colour
  const iconCls = heroMode
    ? 'text-white hover:bg-white/10'
    : 'text-[#0A0806] hover:bg-[#F0EAE1]'

  // Never render the storefront chrome inside the admin panel.
  if (isAdmin) return null

  return (
    <>
      {/* ── Combined fixed header: flash banner + announcement bar + nav ────
          All three live inside one fixed block so they move together and the
          ResizeObserver can measure the real total height for --header-h. */}
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-[900]">

        {/* ── Flash sale banner — shown only when admin enables a flash sale ── */}
        <FlashSaleBanner />

        {/* ── Announcement bar — CMS-driven, marquee scrolling ── */}
        <AnnouncementBar />

        {/* ── Nav bar — transparent on home/top, white on scroll / inner pages ── */}
        <div
          className="bg-transparent transition-all duration-300"
        >
          {/* ── Desktop: left-logo layout matching design reference ────────── */}
          {/* Shown at lg (1024px+) to avoid cramped layout on tablets */}
          <div
            className="hidden lg:flex items-center justify-between gap-6 mx-auto"
            style={{ maxWidth: 1440, padding: '0 clamp(20px, 4vw, 52px)', height: 84 }}
          >
            {/* Logo — left-aligned */}
            {/* Fixed container forces the logo to fill the box (handles PNG with transparent padding) */}
            <Link href="/" aria-label="Kalokea Home" className="shrink-0 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kalokea-logo.png"
                alt="Kalokea"
                style={{
                  width: 200,
                  height: 'auto',
                  display: 'block',
                  transition: 'filter 0.3s',
                  filter: heroMode ? 'brightness(0) invert(1)' : 'none',
                }}
              />
            </Link>

            {/* Nav links — center */}
            <nav aria-label="Main navigation" className="flex items-center gap-6 xl:gap-8">
              {navLinks.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-[0.9rem] font-medium tracking-[0.07em] uppercase transition-colors duration-200 ${linkCls}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Actions — right */}
            <div className="flex items-center gap-4 xl:gap-5 shrink-0">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href={isLoggedIn ? '/account/wishlist/' : '/login/'}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </Link>

              {/* Account */}
              <Link
                href={isLoggedIn ? '/account/' : '/login/'}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>

              <CartIcon className={iconCls} />
            </div>
          </div>

          {/* ── Mobile/Tablet: hamburger-left, logo-center, cart-right (< lg) ── */}
          <div className="lg:hidden flex items-center justify-between px-4 h-[70px]">
            {/* Hamburger */}
            <button
              className={`w-10 h-10 flex items-center justify-center -ml-1 transition-colors rounded-full ${iconCls}`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" aria-label="Kalokea Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kalokea-logo.png"
                alt="Kalokea"
                style={{
                  width: 150,
                  height: 'auto',
                  display: 'block',
                  transition: 'filter 0.3s',
                  filter: heroMode ? 'brightness(0) invert(1)' : 'none',
                }}
              />
            </Link>

            {/* Cart */}
            <CartIcon />
          </div>
        </div>
      </header>

      {/* ── Search overlay ─────────────────────────────────────────────────── */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[950] flex flex-col animate-fade-in"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[#0A0806]/95" onClick={() => setSearchOpen(false)} />
          <div className="relative flex flex-col items-center justify-start pt-[120px] px-4">
            <div className="w-full max-w-[600px] border-b border-white/30 flex items-center gap-4 pb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.6" strokeLinecap="round" className="shrink-0" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for dresses, tops, bags…"
                  aria-label="Search products"
                  className="w-full bg-transparent border-none outline-none font-serif text-[2rem] text-white font-light placeholder-white/30"
                />
              </form>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close search"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="w-full max-w-[600px] mt-10">
              {/* Quick links */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[{ label: 'Shop All', slug: '' }, { label: 'New Arrivals', slug: 'new-arrivals' }, { label: 'Sale', slug: 'sale' }].map(q => (
                  <button
                    key={q.label}
                    onClick={() => { setSearchOpen(false); router.push(`/shop/${q.slug ? q.slug + '/' : ''}`) }}
                    className="px-4 py-2 rounded-full border border-white/25 text-white/80 hover:bg-white hover:text-[#0A0806] font-sans text-[0.7rem] tracking-[0.18em] uppercase transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Category browser — real categories with images */}
              {cats.length > 0 && (
                <>
                  <p className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-3">Browse Categories</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[48vh] overflow-y-auto pb-4">
                    {cats.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSearchOpen(false); router.push(`/shop/${c.slug}/`) }}
                        className="group relative overflow-hidden rounded aspect-[4/3] bg-[#1a1208]"
                        aria-label={c.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {c.image_url && (
                          <img src={c.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300" />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center text-white font-serif text-[1.05rem] tracking-wide text-center px-2">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} cats={cats} />
    </>
  )
}
