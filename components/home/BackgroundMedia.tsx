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
  objectPosition = 'center top',
  priority = false,
  mediaClassName = '',
  fallbackSrc,
}: Props) {
  const ytId = isVideo ? youTubeId(video) : null

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#1E1208' }}>
      {ytId ? (
        // YouTube background — muted autoplay loop. A 16:9 box sized to at least
        // fill the panel (min-width/height + aspect-ratio) gives an object-cover
        // effect that no plain iframe otherwise has.
        <iframe
          src={youTubeBackgroundEmbed(ytId)}
          title="Background video"
          aria-hidden="true"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
          style={{ width: 'auto', height: 'auto', minWidth: '100%', minHeight: '100%', aspectRatio: '16 / 9' }}
        />
      ) : isVideo && video ? (
        <video
          key={video}
          src={video}
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
          onError={
            fallbackSrc
              ? (e) => {
                  const el = e.currentTarget as HTMLImageElement
                  if (el.src !== fallbackSrc) el.src = fallbackSrc
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
