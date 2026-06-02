'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { authApi } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'

const NAV = [
  { label: 'My Orders', href: '/account/orders' },
  { label: 'My Profile', href: '/account/profile' },
  { label: 'Addresses', href: '/account/addresses' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'My Reviews', href: '/account/reviews' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, user, clearAuth, hydrated } = useAuthStore()
  const { toast } = useToast()

  // Wait for the on-load session restore to settle before redirecting, or a
  // logged-in customer gets bounced to /login on every hard refresh.
  useEffect(() => {
    if (hydrated && !isLoggedIn) router.push('/login?redirect=/account')
  }, [hydrated, isLoggedIn, router])

  const logout = async () => {
    await authApi.logout().catch(() => {})
    clearAuth()
    toast('Logged out')
    router.push('/')
  }

  // While the session is being restored, render nothing (avoids a flash of the
  // account UI or a premature redirect).
  if (!hydrated || !isLoggedIn) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="border border-[#e8e4e0] p-5 mb-4">
            <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center text-white font-serif text-lg mb-2">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <p className="text-sm font-sans font-medium text-[#0a0a0a]">{user?.name || 'My Account'}</p>
            <p className="text-[10px] font-sans text-[#6b6b6b] truncate">{user?.email || user?.phone}</p>
          </div>

          <nav className="space-y-0">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`block px-3 py-2.5 text-[11px] font-sans tracking-widest uppercase border-b border-[#f4f2ef] transition-colors ${pathname === n.href ? 'text-[#0a0a0a] font-medium' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'}`}
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2.5 text-[11px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#c8a4a5] transition-colors"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
