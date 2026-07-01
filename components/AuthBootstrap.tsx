'use client'

import { useEffect } from 'react'
import { authApi } from '@/lib/api/auth'
import { getAccessToken, tryRefresh } from '@/lib/api/client'
import { useAuthStore, loadStoredSession } from '@/lib/store/useAuthStore'
import { useCartStore } from '@/lib/store/useCartStore'

// How often to proactively rotate the access token while the tab is open.
// Must be shorter than the backend's token lifetime (typically 15 min).
// 10 min gives a 5-min safety margin even if the backend uses a 15-min TTL.
const PROACTIVE_REFRESH_MS = 10 * 60 * 1000

/**
 * Restores auth state on every page load / hard refresh.
 *
 * FAST PATH (localStorage)
 * ------------------------
 * If there is a valid stored session (user object + timestamp within 7 days),
 * we call setAuth() and setHydrated(true) IMMEDIATELY — no spinner, no wait.
 * This prevents the "flash of logged-out state" that used to log users out on
 * every refresh when the cross-domain httpOnly refresh cookie was blocked.
 *
 * Then we fire a background /auth/me to verify with the server and refresh
 * user data (name changes, role changes, etc.) without blocking the UI.
 *
 * SLOW PATH (no stored session)
 * -----------------------------
 * No localStorage entry found (first login, 7-day expiry, or explicit logout).
 * Call /auth/me which triggers the 401 → /auth/refresh → /auth/me flow.
 * On success: setAuth() + merge cart.
 * On failure: remain as guest.
 *
 * WHY two paths?
 * The httpOnly refresh cookie is sometimes blocked by browsers when the
 * frontend (kalokea.com) and backend (railway.app) are on different eTLD+1
 * domains (Chrome/Safari SameSite policies). The fast path makes auth
 * independent of the cookie for routine page refreshes. The cookie is still
 * used for the proactive token rotation below.
 *
 * Renders nothing; mounted once in the root layout.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    let cancelled = false

    const restore = async () => {
      const stored = loadStoredSession()

      if (stored) {
        // ── FAST PATH: restore from localStorage immediately ────────────────
        // Set auth state right now so layouts never see hydrated=true + isLoggedIn=false.
        // Access token may be expired, but the next protected API call will
        // handle the 401 -> tryRefresh flow transparently.
        const currentToken = getAccessToken() ?? ''
        useAuthStore.getState().setAuth(currentToken, stored.user)

        // For admin paths we MUST verify the role with the server before hydrating.
        // If a customer was promoted to staff, their stored session still has
        // role:'customer'. Hydrating immediately would make AdminLayoutClient see
        // isAdminAreaUser=false and redirect to / — too early, wrong role.
        // On non-admin paths we hydrate instantly (no visible delay for customers).
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
        if (!isAdminPath && !cancelled) useAuthStore.getState().setHydrated(true)

        // Background server verification: refresh the token + update user data.
        // On admin paths this ALSO controls when hydrated flips to true.
        ;(async () => {
          try {
            const user = await authApi.me()
            if (cancelled || !user) return
            // Update user data in case anything changed (name, role, permissions).
            // Use the current token — may have been refreshed already by the
            // 401-retry chain inside authApi.me(). Fall back to empty string so
            // setAuth() keeps the existing value rather than clearing it.
            const token = getAccessToken() ?? ''
            useAuthStore.getState().setAuth(token, user)
            // Merge + load the server cart now that we have a fresh token.
            await useCartStore.getState().mergeOnLogin()
          } catch {
            // me() failed — try an explicit refresh before giving up.
            const refreshed = await tryRefresh().catch(() => false)
            if (refreshed && !cancelled) {
              try {
                const user = await authApi.me()
                const token = getAccessToken()
                if (user && token && !cancelled) {
                  useAuthStore.getState().setAuth(token, user)
                  await useCartStore.getState().mergeOnLogin()
                }
              } catch { /* still failed — stored session stays, token refreshes on next API call */ }
            }
            // If refresh also failed (cross-domain cookie blocked), that is OK.
            // The stored session keeps isLoggedIn=true. The user can browse their
            // account pages; any protected API call will attempt tryRefresh() again.
          } finally {
            // Admin paths: hydrate here — after role is confirmed from server.
            // Non-admin paths: already hydrated above; this is a harmless no-op.
            if (isAdminPath && !cancelled) useAuthStore.getState().setHydrated(true)
          }
        })()
      } else {
        // ── SLOW PATH: no stored session — try server-side restore ──────────
        try {
          const user = await authApi.me()
          const token = getAccessToken()
          if (cancelled || !user || !token) return
          useAuthStore.getState().setAuth(token, user)
          await useCartStore.getState().mergeOnLogin()
        } catch {
          // Not logged in — remain a guest.
          await useCartStore.getState().guestHydrate()
        } finally {
          if (!cancelled) useAuthStore.getState().setHydrated(true)
        }
      }
    }

    restore()

    // Proactive token rotation every 10 minutes.
    // Keeps the access token fresh while the tab is open without requiring
    // the user to make a protected API call.  On failure we do NOT call
    // clearAuth() — the cross-domain cookie may be blocked and the stored
    // session handles persistence independently.
    const proactiveRefresh = async () => {
      if (cancelled) return
      const { isLoggedIn } = useAuthStore.getState()
      if (!isLoggedIn) return
      await tryRefresh().catch(() => {})
    }

    const refreshTimer = setInterval(proactiveRefresh, PROACTIVE_REFRESH_MS)

    // Also refresh on tab focus (device wake / screen unlock / long background).
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
