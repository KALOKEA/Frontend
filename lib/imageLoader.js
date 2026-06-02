// Custom next/image loader — lets us serve responsive, optimized images on
// Cloudflare static export (output:'export' disables Next's built-in optimizer).
//
// For Cloudinary delivery URLs it injects f_auto (modern formats) + q (quality)
// + w (the width Next requests) so each <Image> gets a right-sized, compressed
// asset. Local assets and already-transformed/other URLs pass through untouched.
export default function cloudinaryLoader({ src, width, quality }) {
  if (!src || src.startsWith('/') || src.startsWith('data:')) return src

  const marker = '/image/upload/'
  if (src.includes('res.cloudinary.com') && src.includes(marker)) {
    const after = src.split(marker)[1] || ''
    const firstSeg = after.split('/')[0] || ''
    // If transforms are already present (e.g. "f_auto,q_auto,w_400"), don't
    // double-inject — return the URL as-is.
    const alreadyTransformed = /[a-z]_/.test(firstSeg)
    if (alreadyTransformed) return src
    const params = `f_auto,q_${quality || 'auto'},w_${width},c_limit`
    return src.replace(marker, `${marker}${params}/`)
  }

  // Any other remote host: leave unchanged.
  return src
}
