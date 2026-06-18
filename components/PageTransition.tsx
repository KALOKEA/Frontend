'use client'
/**
 * PageTransition
 *
 * Wraps page content with a subtle fade-in + slide-up animation on every
 * route change. The `key` prop re-mounts the div each time the pathname
 * changes, which re-triggers the CSS animation.
 *
 * Usage: wrap {children} in the root layout inside <ErrorBoundary>.
 */
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="animate-page-enter motion-reduce:animate-none motion-reduce:opacity-100">
      {children}
    </div>
  )
}
