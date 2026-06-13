// KALOKEA Service Worker v1
// Strategy: cache-first for static shells, network-first for API & pages
const CACHE_NAME = 'kalokea-v1'
const STATIC_ASSETS = [
  '/',
  '/shop/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
]

// ── Install: pre-cache static shell ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// ── Activate: delete old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ── Fetch: network-first for API/pages, cache-first for assets ────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin non-image, chrome-extension etc.
  if (request.method !== 'GET') return
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return

  // API calls → network only (never serve stale API data)
  if (url.hostname.includes('railway.app') || url.pathname.startsWith('/api/')) return

  // Static assets (JS, CSS, fonts, images) → cache-first with network fallback
  if (
    url.pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|svg|ico|webp|avif)$/) ||
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') return response
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // HTML pages → network-first, fall back to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200) return response
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})

// ── Push notifications (future) ───────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'KALOKEA', {
      body: data.body || '',
      icon: '/logo.png',
      badge: '/favicon-32x32.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'))
})
