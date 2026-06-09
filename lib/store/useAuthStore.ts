'use client'
import { create } from 'zustand'
import { setAccessToken } from '@/lib/api/client'

// ── Stored-session persistence ─────────────────────────────────────────────
// We mirror the user object in localStorage alongside the access token so that
// a hard page-refresh restores auth state instantly — without waiting for a
// /auth/me round-trip or depending on the httpOnly refresh cookie (which may
// be blocked by browsers when the frontend and backend are on different
// eTLD+1 domains, e.g. kalokea.in → railway.app).
//
// Security: we never store the refresh token in localStorage.  Only the user
// object (non-sensitive profile data) is persisted here. The access token is
// already stored under _kal_at by lib/api/client.ts for the same cross-domain
// reason.  The session is capped at 7 days; after that the user must log in
// again regardless.
const LS_SESSION_KEY = '_kal_ses'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface StoredSession { user: User; ts: number }

export function saveStoredSession(user: User): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(LS_SESSION_KEY, JSON.stringify({ user, ts: Date.now() } satisfies StoredSession))
  } catch { /* private-mode / quota exceeded — silently skip */ }
}

export function loadStoredSession(): StoredSession | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(LS_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSession
    if (!parsed?.user || !parsed?.ts) return null
    if (Date.now() - parsed.ts > SESSION_TTL_MS) {
      localStorage.removeItem(LS_SESSION_KEY)
      return null
    }
    return parsed
  } catch { return null }
}

export function clearStoredSession(): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(LS_SESSION_KEY)
  } catch {}
}

// ── Store ──────────────────────────────────────────────────────────────────
interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role: string
  created_at?: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  isLoggedIn: boolean
  hydrated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  setHydrated: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  hydrated: false,

  setAuth: (token, user) => {
    setAccessToken(token)
    saveStoredSession(user)          // refresh the 7-day localStorage window
    set({ user, accessToken: token, isLoggedIn: true })
  },

  clearAuth: () => {
    setAccessToken(null)
    clearStoredSession()             // wipe the stored session on explicit logout
    set({ user: null, accessToken: null, isLoggedIn: false })
  },

  setHydrated: (v) => set({ hydrated: v }),
}))
