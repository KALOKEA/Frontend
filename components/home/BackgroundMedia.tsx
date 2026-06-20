'use client'
import { youTubeId, youTubeBackgroundEmbed } from '@/lib/utils/youtube'

// Shared hero/editorial background media renderer.
// Fixes two issues:
//   1. Blank-while-loading — the wrapper carries a dark placeholder colour so the
//      panel is never an empty white box before a large image downloads.
//   2. Video that "won't play" — supports BOTH a pasted YouTube/Shorts link
//      (rendered as a muted, autoplay, looping background iframe) AND a directly
//      uploaded .mp4/.webm file (rendered with a native <video> element).

// Re-exported so any existing `import { youTubeId } from './BackgroundMedia'` keeps working.
export { youTubeId }

interface Props {
  image: string
  video?: string
  isVideo: boolean
  alt?: string
  /** CSS object-position for image/video. Default 'center top'. */
  objectPosition?: string
  /** Eager + high fetch priority (above-the-fold hero). Otherwise lazy. */
  priority?: boolean
  /** Extra classes for the <img>/<video> (e.g. a hover zoom). */
  mediaClassName?: string
  /** Fallback image URL if the primary image fails to load. */
  fallbackSrc?: string
  /**
   * YouTube iframe width as a vh-based multiplier (default 177.78 = perfect 16:9).
   * Increase to crop sides more (video zooms in visually).
   * Decrease below 177.78 adds YouTube black bars (avoid).
   * Set via CMS hero_video_width field.
   */
  videoWidthVh?: number
  /**
   * Vertical shift % of hero height. 0 = top-aligned (default).
   * Positive = shift video DOWN (shows higher portion of video frame below headers).
   * E.g. 10 shifts video down 10% so model's head clears the navbar.
   */
  videoOffsetPct?: number
}

export default function BackgroundMedia({
  image,
  video = '',
  isVideo,
  alt = "Kalokea — Women's Fashion",
  objectPosition = 'center center',
  priority = false,
  mediaClassName = '',
  fallbackSrc,
  videoWidthVh = 177.78,
  videoOffsetPct = 0,
}: Props) {
  const ytId = isVideo ? youTubeId(video) : null

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0a0a0a' }}>
      {ytId ? (
        // YouTube background — height locked by inset-y-0 (top:0 + bottom:0).
        // Direct constraint = no percentage-height resolution issues.
        // width:177.78vh = 16:9 of viewport height, centred horizontally.
        // minWidth:100% ensures it covers on ultrawide screens.
        // No filters — video plays as-is, natural colours.
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={youTubeBackgroundEmbed(ytId)}
            title="Background video"
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute inset-y-0 left-1/2 pointer-events-none border-0"
            style={{
              width: `${videoWidthVh}vh`,  /* default 177.78vh = 16:9, increase to crop sides */
              minWidth: '100%',            /* cover full width on ultrawide */
              transform: `translateX(-50%) translateY(${videoOffsetPct}%)`,
            }}
          />
        </div>
      ) : isVideo && video ? (
        <video
          key={video}
          src={video}
          // Poster = the hero image, shown instantly while the mp4 buffers so the
          // panel is never a blank dark box on first load (the video equivalent of
          // the image-flash fix). Falls back to a Cloudinary first-frame .jpg.
          poster={image || (video ? video.replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, '.jpg') : undefined)}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover ${mediaClassName}`}
          style={{ objectPosition }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image}
          src={image}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${mediaClassName}`}
          style={{ objectPosition }}
          loading={priority ? 'eager' : 'lazy'}
          // @ts-expect-error fetchpriority is valid HTML but not yet in React types
          fetchpriority={priority ? 'high' : 'auto'}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            // First failure: swap to the fallback image. If that ALSO fails (or
            // there's no fallback), hide the broken <img> so the dark brand panel
            // shows instead of the browser's broken-image icon.
            if (fallbackSrc && el.src !== fallbackSrc) {
              el.src = fallbackSrc
            } else {
              el.style.visibility = 'hidden'
            }
          }}
        />
      )}
    </div>
  )
}
