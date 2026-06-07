'use client'

import { useEffect } from 'react'
import { authApi } from '@/lib/api/auth'
import { getAccessToken, tryRefresh } from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCartStore } from '@/lib/store/useCartStore'

// Proactive refresh interval — 12 minutes, well inside the 15-minute access token expiry.
// This keeps the session alive as long as the tab is open, without any user action.
// Must be shorter than the token lifetime; 12m gives a 3-minute safety margin.
const PROACTIVE_REFRESH_MS = 12 * 60 * 1000

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

    // Proactive token refresh — runs every 12 minutes while the tab is open.
    // Prevents the 15-minute access token from expiring on active sessions
    // without requiring the user to make a protected API call to trigger the
    // 401 → refresh flow.
    const proactiveRefresh = async () => {
      if (cancelled) return
      const { isLoggedIn } = useAuthStore.getState()
      if (!isLoggedIn) return
      // Attempt to rotate the refresh token cookie.
      // Do NOT call clearAuth() on failure: the cross-origin httpOnly cookie is
      // legitimately blocked by Chrome/Safari third-party cookie policies when the
      // frontend (kalokea.pages.dev) and backend (railway.app) are on different
      // eTLD+1 domains. A failed proactive refresh is NOT a sign that the user is
      // logged out — they may still have a valid access token in localStorage.
      // Auth expiry is handled naturally: the next protected API call returns 401,
      // tryRefresh() is attempted, and if that also fails, the request throws an
      // error that the UI handles. Let that path clear auth, not this timer.
      await tryRefresh().catch(() => {})
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
