'use client'

import { useEffect } from 'react'
import { authApi } from '@/lib/api/auth'
import { getAccessToken, tryRefresh } from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCartStore } from '@/lib/store/useCartStore'

// How often to proactively refresh the access token (6 days — well inside the 7d expiry).
// This keeps the session alive as long as the tab is open, without any user action.
const PROACTIVE_REFRESH_MS = 6 * 24 * 60 * 60 * 1000

/**
 * Restores the auth session on every app load / hard refresh.
 *
 * The access token lives only in memory (cleared on refresh), but the refresh
 * token is an httpOnly cookie that survives. Calling /auth/me with no access
 * token returns 401, which the API client transparently handles by hitting
 * /auth/refresh (using the cookie), storing the new access token, and retrying.
 * So a single me() call both refreshes the token and returns the user.
 *
 * On success: populate auth store + merge/load the server cart.
 * On failure (no/expired refresh cookie): remain a guest + load guest cart.
 *
 * Also starts a proactive refresh timer (every 6 days) so the session never
 * silently expires while the user is active in the tab.
 *
 * Renders nothing; mounted once in the root layout.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    let cancelled = false

    const restore = async () => {
      try {
        const user = await authApi.me()
        const token = getAccessToken()
        if (cancelled || !user || !token) return
        useAuthStore.getState().setAuth(token, user)
        // mergeOnLogin: server-merges guest session cart into user cart, then loads it.
        await useCartStore.getState().mergeOnLogin()
      } catch {
        // Not logged in — remain a guest.
        // Load any server-side guest cart (items added from another device / browser).
        await useCartStore.getState().guestHydrate()
      } finally {
        if (!cancelled) useAuthStore.getState().setHydrated(true)
      }
    }

    restore()

    // Proactive token refresh — runs every 6 days while the tab is open.
    // Prevents the access token from expiring on long sessions without requiring
    // the user to make a protected API call to trigger the 401 → refresh flow.
    const proactiveRefresh = async () => {
      if (cancelled) return
      const { isLoggedIn } = useAuthStore.getState()
      if (!isLoggedIn) return
      const ok = await tryRefresh() // rotates cookie + updates in-memory token
      if (!ok) useAuthStore.getState().clearAuth()
    }

    const refreshTimer = setInterval(proactiveRefresh, PROACTIVE_REFRESH_MS)

    // Also refresh when the tab becomes visible again after being backgrounded
    // (device sleep, screen lock, or long inactive period).
    const onVisibility = () => {
      if (document.visibilityState === 'visible') proactiveRefresh()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      clearInterval(refreshTimer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return null
}
