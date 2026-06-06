'use client'

import { useEffect } from 'react'
import { authApi } from '@/lib/api/auth'
import { getAccessToken } from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCartStore } from '@/lib/store/useCartStore'

/**
 * Restores the auth session on every app load / hard refresh.
 *
 * The access token lives only in memory (cleared on refresh), but the refresh
 * token is an httpOnly cookie that survives. Calling /auth/me with no access
 * token returns 401, which the API client transparently handles by hitting
 * /auth/refresh (using the cookie), storing the new access token, and retrying.
 * So a single me() call both refreshes the token and returns the user.
 *
 * On success we populate the auth store and hydrate the server cart. On failure
 * (no/expired refresh cookie) we stay logged out — no error surfaced to the user.
 *
 * Renders nothing; mounted once in the root layout.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const user = await authApi.me()
        const token = getAccessToken()
        if (cancelled || !user || !token) return
        useAuthStore.getState().setAuth(token, user)
        // mergeOnLogin: server-merges guest session cart, pushes any
        // localStorage-only leftovers, then loads the authoritative user cart.
        await useCartStore.getState().mergeOnLogin()
      } catch {
        // Not logged in (no valid refresh cookie) — remain a guest.
        // Hydrate the guest server cart so items added on another device/browser
        // are visible here too (session_id is persisted in localStorage).
        await useCartStore.getState().guestHydrate()
      } finally {
        // Mark restore as settled so guarded pages can safely evaluate auth.
        if (!cancelled) useAuthStore.getState().setHydrated(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
