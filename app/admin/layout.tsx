'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'
import AdminSidebar from '@/components/admin/Sidebar'
import Spinner from '@/components/ui/Spinner'

/**
 * Shared admin shell: session-aware client-side guard + sidebar layout.
 *
 * Waits for `hydrated` (set by AuthBootstrap once /auth/me settles) before
 * deciding, so an admin isn't bounced to /login on a hard refresh. NOTE: this
 * is defense-in-depth only — real protection is the backend AdminGuard on every
 * /admin and mutation endpoint. (middleware.ts route protection is P1-8.)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoggedIn, hydrated } = useAuthStore()

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) { router.replace('/login'); return }
    if (user?.role !== 'admin') { router.replace('/'); return }
  }, [hydrated, isLoggedIn, user, router])

  if (!hydrated || !isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#faf8f5]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  )
}
