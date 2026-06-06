const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ─── In-memory GET cache ────────────────────────────────────────────────────
// Caches GET responses for 60 s so navigating back to a page is instant and
// concurrent identical requests are de-duplicated into a single in-flight fetch.
const GET_TTL = 60_000
interface CacheEntry { data: unknown; expires: number }
const memCache = new Map<string, CacheEntry>()

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

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method === 'GET'

  // Return cached result for anonymous GET requests (no auth header needed)
  if (isGet && !accessToken) {
    const hit = cacheGet<T>(path)
    if (hit !== null) return hit
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }

  const json = await res.json()
  const result: T = json.data !== undefined ? json.data : json

  // Cache anonymous GET responses
  if (isGet && !accessToken) cacheSet(path, result)

  return result
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (!res.ok) return false
    const json = await res.json()
    const token = json.data?.access_token || json.access_token
    if (token) { setAccessToken(token); return true }
    return false
  } catch {
    return false
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export default api
