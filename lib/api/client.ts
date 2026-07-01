export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ─── In-memory GET cache + in-flight dedup ──────────────────────────────────
// memCache: completed GET responses cached 10 s so back-navigation is instant.
// inFlight: tracks in-progress fetches so concurrent identical GETs share one
//           real HTTP request (e.g. two components mounting on the same page).
const GET_TTL = 10_000  // 10 s — short enough that price/stock changes show quickly
interface CacheEntry { data: unknown; expires: number }
const memCache = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<unknown>>()

function cacheGet<T>(key: string): T | null {
  const entry = memCache.get(key)
  if (entry && entry.expires > Date.now()) return entry.data as T
  memCache.delete(key)
  return null
}
function cacheSet(key: string, data: unknown) {
  memCache.set(key, { data, expires: Date.now() + GET_TTL })
}
/** Call after a mutation so stale lists are re-fetched on next read. */
export function invalidateCache(prefix?: string) {
  if (!prefix) { memCache.clear(); return }
  // forEach avoids Map iterator (needs downlevelIteration tsconfig flag)
  memCache.forEach((_, k) => { if (k.startsWith(prefix)) memCache.delete(k) })
}

// ─── Token persistence (localStorage) ─────────────────────────────────────
// The access token is mirrored in localStorage so that:
//   1. Hard page-refreshes restore the token without needing the cross-origin
//      httpOnly refresh cookie (Chrome/Safari block it as "third-party" when
//      frontend (kalokea.pages.dev) and backend (railway.app) are on different
//      eTLD+1 domains).
//   2. Opening /admin in a new tab or from a bookmark works — sessionStorage
//      is tab-local and would be empty in a fresh tab.
// Security note: the access token expires in 24 hours and the long-lived
// refresh token stays in an httpOnly cookie (never localStorage). The tradeoff
// is acceptable for a production e-commerce store.
const LS_KEY = '_kal_at'

let accessToken: string | null = (() => {
  // Initialise from localStorage on module load (runs once on page load).
  // Guarded by try/catch — SSR or private-mode browsers may throw.
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null } catch { return null }
})()

export function setAccessToken(token: string | null) {
  accessToken = token
  try {
    if (token) localStorage.setItem(LS_KEY, token)
    else localStorage.removeItem(LS_KEY)
  } catch { /* localStorage unavailable — memory-only fallback */ }
}

export function getAccessToken() {
  return accessToken
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method === 'GET'
  // Only anonymous GETs are cacheable + dedupable (no per-user auth header).
  const dedupable = isGet && !accessToken

  if (dedupable) {
    const hit = cacheGet<T>(path)
    if (hit !== null) return hit
    // Deduplicate concurrent identical GETs — share one real in-flight request.
    const existing = inFlight.get(path)
    if (existing) return existing as Promise<T>
  }

  // Core network logic. Wrapped in a function so the resulting promise can be
  // registered for de-duplication and have its in-flight entry cleaned up on
  // EVERY exit path (success, HTTP error, 401, or network failure) via .finally
  // below — otherwise a single failed GET would leave a permanently-pending
  // promise that hangs every future request to the same path.
  const exec = async (): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers as Record<string, string>),
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    // Try to refresh token on 401
    if (res.status === 401 && path !== '/auth/refresh') {
      const refreshed = await tryRefresh()
      if (refreshed) {
        headers['Authorization'] = `Bearer ${accessToken}`
        const retry = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' })
        if (!retry.ok) {
          const err = await retry.json().catch(() => ({}))
          throw new Error(err.message || 'Request failed')
        }
        const retryJson = await retry.json()
        return retryJson.data !== undefined ? retryJson.data : retryJson
      }
      // Refresh failed — session is dead. Clear everything and send user to login
      // so they don't stay stuck seeing "Unauthorized" errors on every action.
      setAccessToken(null)
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('_kal_ses')
        }
      } catch { /* ignore */ }
      if (typeof window !== 'undefined') {
        // Guard: if already on the login page, do NOT redirect again — that
        // creates an infinite reload loop (401 on login page → redirect to
        // /login/?redirect=/login/ → reload → 401 again → repeat forever).
        const onLoginPage = window.location.pathname.startsWith('/login')
        if (!onLoginPage) {
          const loginUrl = '/login/?session=expired&redirect=' + encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = loginUrl
        }
      }
      throw new Error('Session expired. Please log in again.')
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `HTTP ${res.status}`)
    }

    const json = await res.json()
    // Smart unwrap: { data: X } → X  BUT  { data: [], meta: {} } → keep full object
    // Paginated responses always include a `meta` key alongside `data`. Unwrapping
    // those would silently discard pagination info, breaking all admin list pages.
    const result: T = (json.data !== undefined && json.meta === undefined) ? json.data : json

    // Cache successful anonymous GET responses.
    if (dedupable) cacheSet(path, result)
    return result
  }

  if (dedupable) {
    const flight = exec()
    inFlight.set(path, flight)
    // Remove the in-flight entry whether exec resolves OR rejects, so a single
    // failed GET can never leave a stuck promise behind. Concurrent callers that
    // grabbed `flight` above still settle with the same result/error.
    return flight.finally(() => { inFlight.delete(path) })
  }

  return exec()
}

// ─── Refresh mutex ─────────────────────────────────────────────────────────
// Prevents concurrent 401 retries from each firing their own /auth/refresh.
// Token rotation means only the FIRST refresh succeeds; subsequent calls with
// the same (now-rotated) cookie fail → token_version mismatch → "Session revoked".
// Solution: every concurrent caller waits on the same in-flight promise.
let _refreshInFlight: Promise<boolean> | null = null

export async function tryRefresh(): Promise<boolean> {
  if (_refreshInFlight) return _refreshInFlight

  _refreshInFlight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      if (!res.ok) return false
      const json = await res.json()
      const token = json.data?.access_token || json.access_token
      if (token) { setAccessToken(token); return true }
      return false
    } catch {
      return false
    } finally {
      _refreshInFlight = null
    }
  })()

  return _refreshInFlight
}

/**
 * Fetch a non-JSON endpoint (e.g. the HTML invoice page) with the same Bearer
 * auth header the rest of the API uses. Uses res.text() instead of res.json().
 */
export async function getText(path: string): Promise<string> {
  const headers: Record<string, string> = { 'X-Requested-With': 'XMLHttpRequest' }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  const res = await fetch(`${BASE_URL}${path}`, { headers, credentials: 'include' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export default api
