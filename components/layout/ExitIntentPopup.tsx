'use client'
/**
 * ExitIntentPopup — newsletter subscription popup.
 *
 * Triggers on:
 *   Desktop: when the cursor exits the viewport from the top edge (mouse leaves window).
 *   Mobile:  after 45 s of not tapping (timer-based fallback — no mouseleave on touch).
 *
 * Suppression:
 *   • Once dismissed (× or "No thanks"), suppressed for 7 days via localStorage.
 *   • Successful subscribe also suppresses.
 *   • Checks suppression key before showing — will not re-show if already suppressed.
 */

import { useEffect, useRef, useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'
const DISMISS_KEY  = 'k_exit_popup_t'
const DISMISS_DAYS = 7

function isDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY)
    if (!v) return false
    return Date.now() - parseInt(v, 10) < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch { return false }
}

function storeDismiss() {
  try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch {}
}

export default function ExitIntentPopup() {
  const [open, setOpen]     = useState(false)
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const triggered = useRef(false)
  const inputRef  = useRef<HTMLInputElement>(null)

  // ── Trigger helpers ──────────────────────────────────────────────────────
  const tryShow = () => {
    if (triggered.current || isDismissed()) return
    triggered.current = true
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    storeDismiss()
  }

  // ── Attach exit-intent listeners ─────────────────────────────────────────
  useEffect(() => {
    // Desktop: mouse leaves viewport from the top
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) tryShow()
    }
    document.addEventListener('mouseleave', onMouseLeave)

    // Mobile / tablet: show after 45 s of inactivity
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    const mobileTimer = isMobile ? setTimeout(tryShow, 45_000) : null

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      if (mobileTimer !== null) clearTimeout(mobileTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Body scroll lock + auto-focus ────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open])

  // ── Escape key ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Subscribe ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      storeDismiss()
      setTimeout(() => setOpen(false), 3500)
    } catch {
      setStatus('error')
      setErrMsg('Something went wrong. Please try again.')
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0a0908]/55 z-[200] backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get 10% off — subscribe to the newsletter"
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="relative w-full max-w-[400px] bg-white shadow-2xl pointer-events-auto overflow-hidden animate-fade-up">

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-[#6b5c55] hover:text-[#0a0a0a] transition-colors"
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header — dark brand panel */}
          <div className="bg-[#1E1208] px-8 pt-8 pb-6 text-center">
            <p className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#C49070] mb-3">Exclusive Offer</p>
            <h2 className="font-serif text-[1.65rem] font-light text-white leading-tight mb-1">
              Before you go&hellip;
            </h2>
            <p className="font-sans text-[13px] text-white/55 leading-relaxed">
              Get <strong className="text-[#C49070]">10% off</strong> your first order — just for joining.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {status === 'success' ? (
              <div className="text-center py-2 space-y-2" role="status" aria-live="polite">
                <div className="text-3xl" aria-hidden="true">🎉</div>
                <p className="font-serif text-lg text-[#0a0a0a]">You&apos;re on the list!</p>
                <p className="text-[13px] text-[#6b5c55] leading-relaxed">
                  Use code{' '}
                  <strong className="font-mono text-[#7C4A2D] tracking-widest">WELCOME10</strong>
                  {' '}at checkout for 10% off.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[12.5px] font-sans text-[#6b5c55] leading-relaxed text-center mb-5">
                  New arrivals, style tips & exclusive deals — straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <label htmlFor="exit-popup-email" className="sr-only">Email address</label>
                  <input
                    ref={inputRef}
                    id="exit-popup-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                    placeholder="Your email address"
                    aria-describedby={status === 'error' ? 'exit-popup-error' : undefined}
                    className="w-full border border-[#e8e4e0] px-4 py-3 text-sm font-sans text-[#0a0a0a] placeholder:text-[#bdb0a4] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                  <p id="exit-popup-error" role="alert" className="text-[11px] font-sans text-red-500" aria-live="polite">
                    {status === 'error' ? errMsg : ''}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0a0a0a] text-white text-[10.5px] font-sans tracking-[0.22em] uppercase py-3.5 hover:bg-[#7C4A2D] disabled:opacity-50 transition-colors duration-200"
                  >
                    {status === 'loading' ? 'Subscribing…' : 'Claim My 10% Off'}
                  </button>
                </form>

                <button
                  onClick={close}
                  className="block w-full text-center text-[10px] font-sans text-[#b0a898] hover:text-[#6b5c55] mt-4 transition-colors uppercase tracking-widest"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
