'use client'
import { useEffect, useRef, useState } from 'react'
import { settingsApi, type PublicSettings } from '@/lib/api/settings'
import { X, Copy, Check, Zap } from 'lucide-react'

function pad(n: number) { return String(n).padStart(2, '0') }

function getTimeLeft(endTime: string) {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s, total: diff }
}

export default function FlashSaleBanner() {
  const [sale, setSale] = useState<PublicSettings | null>(null)
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch flash sale settings on mount (public endpoint — no auth)
  useEffect(() => {
    settingsApi.getPublic()
      .then(s => {
        if (s.flash_sale_enabled && s.flash_sale_end_time) {
          setSale(s)
          setTimeLeft(getTimeLeft(s.flash_sale_end_time))
        }
      })
      .catch(() => {})
  }, [])

  // Countdown tick
  useEffect(() => {
    if (!sale?.flash_sale_end_time) return
    const timer = setInterval(() => {
      const tl = getTimeLeft(sale.flash_sale_end_time)
      setTimeLeft(tl)
      if (!tl) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [sale])

  // Restore dismissed state from sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('flash-dismissed') === '1') setDismissed(true)
  }, [])

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem('flash-dismissed', '1')
  }

  async function copyCoupon(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  if (!sale || !timeLeft || dismissed) return null

  const { h, m, s } = timeLeft

  return (
    <div
      className="w-full bg-[#0a0a0a] text-white text-center py-2.5 px-4 text-sm relative z-50"
      role="banner"
      aria-label={`${sale.flash_sale_label} — ends in ${h}h ${m}m ${s}s`}
    >
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* Icon + label */}
        <span className="flex items-center gap-1.5 font-medium">
          <Zap size={14} className="text-amber-400 fill-amber-400" aria-hidden="true" />
          {sale.flash_sale_label || 'Flash Sale'}
          {sale.flash_sale_discount_pct > 0 && (
            <span className="ml-1 text-amber-400 font-semibold">
              {sale.flash_sale_discount_pct}% OFF
            </span>
          )}
        </span>

        {/* Countdown */}
        <span className="flex items-center gap-1 text-xs font-mono bg-white/10 px-2 py-0.5 rounded">
          <span aria-label={`${h} hours`}>{pad(h)}</span>
          <span className="text-amber-400 animate-pulse">:</span>
          <span aria-label={`${m} minutes`}>{pad(m)}</span>
          <span className="text-amber-400 animate-pulse">:</span>
          <span aria-label={`${s} seconds`}>{pad(s)}</span>
        </span>

        {/* Coupon */}
        {sale.flash_sale_coupon && (
          <button
            onClick={() => copyCoupon(sale.flash_sale_coupon)}
            className="flex items-center gap-1.5 border border-white/30 px-2.5 py-0.5 text-xs rounded hover:bg-white/10 transition-colors"
            aria-label={`Copy coupon code ${sale.flash_sale_coupon}`}
          >
            <span className="font-mono font-semibold tracking-wider">
              {sale.flash_sale_coupon}
            </span>
            {copied
              ? <Check size={12} className="text-green-400" aria-hidden="true" />
              : <Copy size={12} className="opacity-70" aria-hidden="true" />}
          </button>
        )}

        {/* Shop now link */}
        <a
          href="/shop/?sort=newest"
          className="text-xs text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors"
        >
          Shop now
        </a>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss flash sale banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
