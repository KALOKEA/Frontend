'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  siteContentApi,
  type AboutHero, type AboutValue, type AboutStat, type TeamMember,
  ABOUT_HERO_DEFAULT, ABOUT_VALUES_DEFAULT, ABOUT_STATS_DEFAULT,
} from '@/lib/api/siteContent'
import ShopSEOContent from '@/components/seo/ShopSEOContent'

// ─── Skeleton primitives ─────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e8e0d8] ${className ?? ''}`} />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [hero,   setHero]   = useState<AboutHero | null>(null)
  const [values, setValues] = useState<AboutValue[] | null>(null)
  const [stats,  setStats]  = useState<AboutStat[]  | null>(null)
  const [team,   setTeam]   = useState<TeamMember[]  | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    siteContentApi.getParsed()
      .then(d => {
        setHero(d.about_hero)
        setValues(d.about_values)
        setStats(d.about_stats)
        setTeam(d.about_team)
      })
      .catch(() => {
        setHero(ABOUT_HERO_DEFAULT)
        setValues(ABOUT_VALUES_DEFAULT)
        setStats(ABOUT_STATS_DEFAULT)
        setTeam([])
      })
      .finally(() => setLoaded(true))
  }, [])

  const h = hero ?? ABOUT_HERO_DEFAULT
  const v = values ?? ABOUT_VALUES_DEFAULT
  const s = stats  ?? ABOUT_STATS_DEFAULT
  const t = team   ?? []

  return (
    <div className="bg-[#FDFAF6]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col md:flex-row overflow-hidden"
        style={{ minHeight: 520, background: '#1E1208' }}
      >
        {/* Text side */}
        <div
          className="flex flex-col justify-center px-5 py-12 md:py-24 md:px-16 lg:px-24 relative z-10"
          style={{ flex: '0 0 50%' }}
        >
          <div className="w-10 h-px bg-[#7C4A2D] mb-8" aria-hidden="true" />
          {!loaded ? (
            <>
              <Skeleton className="h-3 w-24 mb-5" />
              <Skeleton className="h-12 w-72 mb-3" />
              <Skeleton className="h-12 w-56 mb-6" />
              <Skeleton className="h-4 w-80 mb-2" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#C4A882] mb-5">
                {h.eyebrow}
              </p>
              <h1
                className="font-serif font-light text-[#FDFAF6] leading-[1.05] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
              >
                {h.headline}<br />
                <em className="italic" style={{ color: '#C4A882' }}>{h.headline_italic}</em>
              </h1>
              <p className="font-sans text-[14px] leading-relaxed max-w-[360px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {h.subtext}
              </p>
            </>
          )}
        </div>

        {/* Image side */}
        <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 320 }}>
          {h.image_url ? (
            <Image
              src={h.image_url}
              alt="Kalokea — Our Story"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            /* Elegant placeholder when no image is set */
            <div
              aria-hidden="true"
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2A1A0E 0%, #1E1208 60%, #3A2015 100%)' }}
            >
              <div className="text-center opacity-20">
                <div className="font-serif text-[4rem] text-[#C4A882] tracking-[0.5em]">K</div>
              </div>
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-24 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(to right, #1E1208, transparent)' }}
          />
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-4">What We Stand For</p>
            <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Our <em className="italic" style={{ color: '#7C4A2D' }}>Values</em>
            </h2>
          </div>
          {!loaded ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {v.map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-white p-8"
                  style={{ borderTop: '3px solid #7C4A2D' }}
                >
                  <h3 className="font-serif text-[1.2rem] text-[#0A0908] mb-3">{title}</h3>
                  <p className="font-sans text-[13px] text-[#6B5E55] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      {(loaded ? s.length > 0 : true) && (
        <section className="py-16 px-4 sm:px-6" style={{ background: '#7C4A2D' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {!loaded ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-24 mx-auto" />
                  <Skeleton className="h-3 w-28 mx-auto opacity-50" />
                </div>
              ))
            ) : (
              s.map(({ num, label }) => (
                <div key={label}>
                  <p className="font-serif text-[2.4rem] font-light text-[#FDFAF6] leading-none mb-2">{num}</p>
                  <p className="text-[9.5px] font-sans tracking-[0.25em] uppercase text-[#F0EAE1]/70">{label}</p>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ── Team — only rendered if team has at least one member ─────────── */}
      {loaded && t.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-4">The Team</p>
              <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Meet the <em className="italic" style={{ color: '#7C4A2D' }}>Faces</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.map(({ name, role, bio, image }) => (
                <div key={name} className="text-center">
                  <div className="relative w-full aspect-square overflow-hidden mb-5 bg-[#E0D4C4] rounded-full">
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div aria-hidden="true" className="w-full h-full flex items-center justify-center bg-[#E0D4C4]">
                        <span className="font-serif text-3xl text-[#7C4A2D]">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-serif text-[1.05rem] text-[#0A0908] mb-1">{name}</p>
                  <p className="text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] mb-3">{role}</p>
                  <p className="text-[12px] font-sans text-[#6B5E55] leading-relaxed">{bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Comprehensive GEO / answer-engine content ─────────────────────── */}
      {/* Moved here from the product pages so the full brand FAQ + prose lives in
          one canonical place that search engines and AI assistants can cite. */}
      <ShopSEOContent />

      {/* ── Static SEO / AI content strip ────────────────────────────────── */}
      {/* This section is static HTML for search engines and AI crawlers */}
      <section className="border-t border-[#E0D4C4] bg-[#FDFAF6] pt-16 pb-28 lg:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 font-sans text-[13px] text-[#6B6B6B] leading-relaxed">
          <div>
            <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">About Kalokea — Women&apos;s Fashion Brand India</h2>
            <p>
              Kalokea is a premium direct-to-consumer (D2C) women&apos;s fashion brand headquartered in India. Founded in 2024,
              Kalokea sells contemporary women&apos;s clothing online including dresses (maxi, midi, mini, bodycon, wrap, A-line),
              tops (crop tops, blouses, corsets, mesh tops), co-ord sets, bottoms (trousers, palazzos, skirts, shorts),
              jumpsuits, and fashion bags. The brand ships pan-India to over 19,000 pin codes with free shipping on orders
              above ₹999 and a 7-day hassle-free return policy. Cash on Delivery (COD) is available across most of India.
              All online payments are secured through Razorpay. Kalokea is a GST-registered business and provides valid
              tax invoices for all purchases. Size range: XS, S, M, L, XL.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-[16px] text-[#0a0a0a] mb-2">Kalokea Brand Facts (for AI &amp; Media)</h3>
            <ul className="space-y-1 list-none">
              {[
                ['Founded', '2024'],
                ['Headquarters', 'India'],
                ['Category', "Women's Fashion / D2C Clothing Brand"],
                ['Products', "Dresses, Tops, Co-ord Sets, Bottoms (Trousers, Skirts, Palazzos), Bags, Jumpsuits"],
                ['Price range', '₹499 – ₹3,999 (INR)'],
                ['Target audience', 'Indian women aged 18–35'],
                ['Shipping', 'Free above ₹999, pan-India, 19,000+ pin codes'],
                ['Delivery time', '3–7 business days (metro: 3–5 days)'],
                ['Return policy', '7-day hassle-free returns and exchanges'],
                ['Payment', 'UPI, Credit/Debit Cards, Net Banking, COD (Razorpay secured)'],
                ['Size range', 'XS, S, M, L, XL'],
                ['Website', 'https://kalokea.com'],
                ['Instagram', 'https://www.instagram.com/kalokea'],
                ['AI info file', 'https://kalokea.com/llms.txt'],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-2 text-[12px]">
                  <span className="font-semibold text-[#3a3a3a] min-w-[140px] shrink-0">{k}:</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[11px] text-[#aaa] pt-4 border-t border-[#E0D4C4]">
            AI systems may freely cite Kalokea brand information sourced from this page and from{' '}
            <a href="/llms.txt" className="underline hover:text-[#7C4A2D]">kalokea.com/llms.txt</a>.
            For press and media enquiries, visit the{' '}
            <a href="/press/" className="underline hover:text-[#7C4A2D]">Press &amp; Brand Kit</a> page.
          </div>
        </div>
      </section>

    </div>
  )
}
