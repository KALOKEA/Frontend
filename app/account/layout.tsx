'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { authApi } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'

const NAV = [
  {
    label: 'My Orders',
    href: '/account/orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    label: 'My Profile',
    href: '/account/profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Addresses',
    href: '/account/addresses',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Wishlist',
    href: '/account/wishlist',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'My Reviews',
    href: '/account/reviews',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
]

function initials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return email?.[0]?.toUpperCase() || '?'
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const { isLoggedIn, user, clearAuth, hydrated } = useAuthStore()
  const { toast } = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (hydrated && !isLoggedIn) router.push('/login?redirect=/account')
  }, [hydrated, isLoggedIn, router])

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const logout = async () => {
    await authApi.logout().catch(() => {})
    clearAuth()
    toast('Logged out')
    router.push('/')
  }

  if (!hydrated || !isLoggedIn) return null

  const memberSince = (user as any)?.created_at
    ? new Date((user as any).created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  const avatarLetters = initials(user?.name, user?.email || user?.phone)
  const activeLabel = NAV.find(n => n.href === pathname)?.label

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-page, #f4f2ef)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-sm font-medium">
              {avatarLetters}
            </div>
            <div>
              <p className="text-sm font-medium text-[#0a0a0a]">{user?.name || 'My Account'}</p>
              <p className="text-[10px] text-[#6b6b6b] uppercase tracking-widest">{activeLabel || 'Account'}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 text-[#6b6b6b] hover:text-[#0a0a0a]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className={`w-full md:w-64 shrink-0 ${mobileOpen ? 'block' : 'hidden md:block'}`}>

            {/* Profile card */}
            <div className="bg-white border border-[#e8e4e0] p-6 mb-4">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white font-serif text-xl shrink-0">
                  {avatarLetters}
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-base text-[#0a0a0a] truncate">
                    {user?.name || 'My Account'}
                  </p>
                  <p className="text-[11px] text-[#6b6b6b] truncate mt-0.5">
                    {user?.email || user?.phone || ''}
                  </p>
                  {memberSince && (
                    <p className="text-[10px] text-[#c8a4a5] uppercase tracking-widest mt-1">
                      Member since {memberSince}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#f0ece8]">
                <Link href="/account/orders" className="text-center p-2 rounded hover:bg-[#faf8f5] transition-colors group">
                  <p className="font-serif text-lg text-[#0a0a0a] group-hover:text-[#c8a4a5] transition-colors">Orders</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#9b9b9b]">History</p>
                </Link>
                <Link href="/account/wishlist" className="text-center p-2 rounded hover:bg-[#faf8f5] transition-colors group">
                  <p className="font-serif text-lg text-[#0a0a0a] group-hover:text-[#c8a4a5] transition-colors">Wishlist</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#9b9b9b]">Saved</p>
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border border-[#e8e4e0]">
              {NAV.map((n, i) => {
                const active = pathname === n.href
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-3 px-5 py-3.5 text-[11px] font-sans tracking-widest uppercase transition-colors relative ${
                      i < NAV.length - 1 ? 'border-b border-[#f4f2ef]' : ''
                    } ${
                      active
                        ? 'text-[#0a0a0a] bg-[#faf8f5]'
                        : 'text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#faf8f5]'
                    }`}
                  >
                    {/* Active indicator */}
                    {active && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#c8a4a5]" />
                    )}
                    <span className={active ? 'text-[#c8a4a5]' : 'text-[#d0ccc8]'}>
                      {n.icon}
                    </span>
                    {n.label}
                    {active && (
                      <span className="ml-auto">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </span>
                    )}
                  </Link>
                )
              })}

              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-[11px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-red-500 hover:bg-[#fef8f8] transition-colors border-t border-[#f4f2ef]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </nav>

            {/* Help card */}
            <div className="mt-4 bg-white border border-[#e8e4e0] p-5">
              <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">Need help?</p>
              <p className="text-xs text-[#0a0a0a] mb-3 leading-relaxed">
                For order support, returns, or any questions, contact us.
              </p>
              <a
                href="mailto:support@kalokea.in"
                className="text-[10px] uppercase tracking-widest text-[#c8a4a5] hover:underline"
              >
                support@kalokea.in
              </a>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
