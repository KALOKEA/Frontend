'use client'
import { useEffect, useRef, useState } from 'react'
import { youTubeId, youTubeEmbed } from '@/lib/utils/youtube'

/**
 * Cloudinary H.264 transcode so MOV / HEVC / AVI phone uploads play across all
 * browsers. The original URL is kept as a fallback <source>.
 */
function toTranscodedMp4(url: string): string {
  if (
    url.includes('res.cloudinary.com') &&
    url.includes('/video/upload/') &&
    !url.includes('vc_h264')
  ) {
    return url.replace('/video/upload/', '/video/upload/f_mp4,vc_h264,ac_aac/')
  }
  return url
}

/**
 * Self-contained product video player — one instance per video so each tracks
 * its OWN aspect ratio. A YouTube link renders a 16:9 iframe; an uploaded mp4
 * renders an autoplay-on-scroll <video>. Portrait/reel uploads are height-capped
 * (~520-530px) so a 9:16 video doesn't dominate the page.
 */
export default function ProductVideo({ url, productName }: { url: string; productName: string }) {
  const ytId = youTubeId(url)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)
  // 9:16 portrait default for phone uploads; corrected from real dimensions on
  // metadata load. maxWidth caps the rendered height for a given aspect ratio.
  const [box, setBox] = useState({ paddingBottom: '177.78%', maxWidth: '300px' })

  // Autoplay the mp4 when it scrolls into view (browsers block off-screen
  // autoplay); pause when it leaves. YouTube manages its own playback.
  useEffect(() => {
    if (ytId) return
    const vid = videoRef.current
    if (!vid) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {})
        else vid.pause()
      },
      { threshold: 0.3 },
    )
    obs.observe(vid)
    return () => obs.disconnect()
  }, [ytId])

  // ── YouTube (incl. Shorts) → 16:9 iframe ──────────────────────────────────
  if (ytId) {
    return (
      <div className="mx-auto w-full" style={{ maxWidth: 720 }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 6, background: '#0a0a0a' }}>
          <iframe
            src={youTubeEmbed(ytId)}
            title={`${productName} — video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      </div>
    )
  }

  if (error) return null

  // ── Uploaded mp4 ──────────────────────────────────────────────────────────
  const onMeta = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (!v.videoWidth || !v.videoHeight) return
    const isPortrait = v.videoHeight > v.videoWidth
    setBox({
      paddingBottom: `${(v.videoHeight / v.videoWidth) * 100}%`,
      // Portrait capped at 300px wide (~533px tall for 9:16); landscape wider.
      maxWidth: isPortrait ? '300px' : '640px',
    })
  }

  const transcoded = toTranscodedMp4(url)

  return (
    <div className="mx-auto w-full" style={{ maxWidth: box.maxWidth }}>
      <div style={{ position: 'relative', paddingBottom: box.paddingBottom, height: 0, overflow: 'hidden', background: '#0a0a0a', borderRadius: 6 }}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          onLoadedMetadata={onMeta}
          onError={() => setError(true)}
          aria-label={`${productName} video`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          {transcoded !== url && <source src={transcoded} type="video/mp4" />}
          <source src={url} />
        </video>
      </div>
    </div>
  )
}
