import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge middleware: server-side route protection via the refresh_token httpOnly cookie.
 *
 * The access token lives only in memory (cleared on refresh). The refresh_token
 * cookie is the only persistent session signal accessible at the edge. If it is
 * absent, the user cannot possibly be logged in, so redirect them to /login.
 *
 * This is defense-in-depth (the backend guards every endpoint with JwtAuthGuard /
 * AdminGuard too), but prevents the HTML shell of /admin from rendering for
 * unauthenticated visitors.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Presence of the httpOnly refresh_token cookie means the user has an active
  // session (or recently expired one — AuthBootstrap will re-validate on mount).
  const hasSession = request.cookies.has('refresh_token')

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Only run on routes that require authentication.
  // Static files, API routes, and public pages are excluded automatically.
  matcher: [
    '/checkout/:path*',
    '/account/:path*',
    '/admin/:path*',
  ],
}
