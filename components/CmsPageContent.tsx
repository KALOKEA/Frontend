'use client'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

interface Props {
  slug: string
  staticContent?: string
}

export default function CmsPageContent({ slug, staticContent }: Props) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/cms/${slug}`)
      .then(r => r.json())
      .then(data => {
        // Backend wraps all responses in { success, data, timestamp }
        const payload = data?.data ?? data
        if (payload?.content) setHtml(payload.content)
        else if (staticContent) setHtml(staticContent)
      })
      .catch(() => { if (staticContent) setHtml(staticContent) })
      .finally(() => setLoading(false))
  }, [slug, staticContent])

  if (loading && !staticContent) {
    return <div className="py-8 text-center text-[#6b6b6b] text-sm animate-pulse">Loading…</div>
  }

  const raw = html ?? staticContent ?? ''
  const safe = typeof window !== 'undefined' ? DOMPurify.sanitize(raw) : raw

  const cx = [
    'prose prose-sm max-w-none text-[#6b6b6b] leading-loose',
    '[&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-[#0a0a0a] [&_h2]:mt-8 [&_h2]:mb-3',
    '[&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-[#0a0a0a] [&_h3]:mt-6 [&_h3]:mb-2',
    '[&_p]:mb-4 [&_a]:text-[#7C4A2D] [&_a]:underline [&_strong]:text-[#0a0a0a]',
    '[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1',
  ].join(' ')

  return (
    <div
      className={cx}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}
