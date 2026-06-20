'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'
import { BASE_URL } from '@/lib/api/client'

const INSTAGRAM_HANDLE = 'kalokea.fashion'
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`

// Placeholder images shown while loading or when no API token is configured
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80',
]

interface IgPost {
  id: string
  media_url: string
  thumbnail_url?: string  // for video posts
  permalink: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
}

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function InstagramGrid() {
  const [posts, setPosts] = useState<IgPost[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [eyebrow, setEyebrow] = useState<string>(HERO_DEFAULTS.instagram_eyebrow)
  const [subtext, setSubtext] = useState<string>(HERO_DEFAULTS.instagram_subtext)

  useEffect(() => {
    getHomepageData()
      .then(d => {
        if (d.cms.instagram_eyebrow) setEyebrow(d.cms.instagram_eyebrow)
        if (d.cms.instagram_subtext) setSubtext(d.cms.instagram_subtext)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`${BASE_URL}/instagram-feed`)
      .then((r) => (r.ok && r.status !== 204) ? r.json() : null)
      .then((json) => {
        if (json?.data?.length) {
          setPosts(json.data.slice(0, 6))
        } else {
          setPosts(null)
        }
      })
      .catch(() => setPosts(null))
      .finally(() => setLoading(false))
  }, [])

  const items = posts
    ? posts.map((p) => ({
        src: p.media_type === 'VIDEO' ? (p.thumbnail_url || PLACEHOLDER_IMAGES[0]) : p.media_url,
        href: p.permalink,
      }))
    : PLACEHOLDER_IMAGES.map((src, i) => ({ src, href: INSTAGRAM_URL }))

  return (
    <section className="py-20 bg-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="eyebrow-center mb-4">{eyebrow}</div>
          <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#7C4A2D] transition-colors"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </h2>
          <p className="text-[12px] font-sans text-[#6B5E55] mt-2">{subtext}</p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {(loading ? PLACEHOLDER_IMAGES : items.map((i) => i.src)).map((src, idx) => {
            const href = loading ? INSTAGRAM_URL : (items[idx]?.href ?? INSTAGRAM_URL)
            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden aspect-square bg-[#E0D4C4]"
                aria-label={`Kalokea on Instagram — post ${idx + 1}`}
              >
                {/* Shimmer skeleton while loading */}
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E0D4C4] via-[#F0EAE1] to-[#E0D4C4] animate-pulse" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src as string}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement
                    el.src = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length]
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#7C4A2D] opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none" />
                {/* Instagram icon on hover — decorative, link already has aria-label */}
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <InstagramIcon />
                </div>
              </a>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] border border-[#7C4A2D] px-6 py-2.5 hover:bg-[#7C4A2D] hover:text-white transition-colors duration-300"
          >
            <span aria-hidden="true"><InstagramIcon /></span>
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  )
}
