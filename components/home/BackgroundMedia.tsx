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
}: Props) {
  const ytId = isVideo ? youTubeId(video) : null

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0a0a0a' }}>
      {ytId ? (
        // YouTube background — sized by HEIGHT so video always fills top-to-bottom.
        // height:100% = fills the container exactly top to bottom.
        // width:177.78vh = 16:9 ratio of the viewport height → naturally wider
        // than screen on standard monitors; overflow-hidden clips the sides.
        // No filters — video plays as-is.
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={youTubeBackgroundEmbed(ytId)}
            title="Background video"
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none border-0"
            style={{
              height: '100%',        /* fills container top to bottom exactly */
              width: '177.78vh',     /* 16:9 × viewport height — natural ratio */
              minWidth: '56.25vw',   /* fallback: at least covers landscape width */
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
