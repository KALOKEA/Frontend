// Single source of truth for YouTube URL handling across the whole site
// (hero background, editorial background, product "Watch the Video", and any
// future placement). Handles every common URL shape so pasting ANY YouTube
// link just works:
//   • https://www.youtube.com/watch?v=ID
//   • https://youtu.be/ID
//   • https://www.youtube.com/embed/ID
//   • https://youtube.com/shorts/ID        ← Shorts (the format the client used)
//   • https://www.youtube.com/live/ID
//   • youtube-nocookie.com variants
// Extra query params (?si=…, &t=…) are ignored.

/** Extract an 11-char YouTube video id, or null if the string isn't a YouTube URL. */
export function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const m = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m ? m[1] : null
}

/** True if the string is a recognisable YouTube link. */
export function isYouTube(url: string | null | undefined): boolean {
  return youTubeId(url) !== null
}

/** Background-video embed URL: muted, autoplay, looping, no controls/branding. */
export function youTubeBackgroundEmbed(id: string): string {
  const p = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id, // required for loop to work on a single video
    controls: '0',
    showinfo: '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`
}

/** Standard embed URL with user controls — for the product "Watch the Video" player.
 *  Uses youtube-nocookie.com to avoid third-party cookie blocking in browsers that
 *  block cross-site iframes (Safari ITP, Firefox, uBlock etc.) which would show
 *  the "This content is blocked" error on the product page. */
export function youTubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
}
