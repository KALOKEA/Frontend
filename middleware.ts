/**
 * ⚠️  DEAD CODE — this middleware file is intentionally non-functional.
 *
 * WHY: With `output: 'export'` in next.config.mjs, Next.js generates a fully
 * static site. Static exports do NOT support edge middleware — Next.js throws
 * "Middleware cannot be used with 'output: export'" at build time.
 *
 * Cloudflare Pages serves the static files directly. There is no Node/Edge
 * runtime that could intercept requests and run this code.
 *
 * HOW AUTH PROTECTION ACTUALLY WORKS:
 * - Backend guards: Every API endpoint uses JwtAuthGuard or AdminGuard.
 *   An unauthenticated request simply gets a 401/403 from the backend.
 * - Client-side redirect: account/layout.tsx and admin pages call useAuthStore
 *   and push('/login') if hydrated && !isLoggedIn.
 * - AuthBootstrap.tsx restores the session from the refresh_token cookie
 *   on first load (httpOnly cookie → POST /auth/refresh → access token in memory).
 *
 * This file is kept so that if the project ever migrates away from static export
 * (e.g. to Next.js server/edge runtime or a custom server), middleware-based
 * protection can be re-enabled by removing the output: 'export' config option.
 *
 * The matcher config below is intentionally set to an empty array so that
 * even if this code somehow ran, it would match nothing.
 */

export function middleware() {
  // No-op. See comment above.
}

export const config = {
  matcher: [], // Empty: do not match any routes
}

