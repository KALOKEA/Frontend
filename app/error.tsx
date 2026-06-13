'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log for debugging; swap for Sentry/Datadog in production
    console.error('[Kalokea Error]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div>
        <p className="font-serif text-8xl text-[#e8e4e0] mb-4">!</p>
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Something went wrong</h1>
        <p className="text-sm font-sans text-[#6b6b6b] mb-8">
          We hit an unexpected error. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#2a2a2a] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#faf8f5] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}