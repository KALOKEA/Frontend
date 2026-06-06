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
    // f_auto   → serve WebP/AVIF automatically (browser picks best)
    // q_auto:good → Cloudinary's "good" quality tier (smaller files, great quality)
    // w_<width> → responsive sizing
    // dpr_auto → high-DPI retina support without doubling file size
    // c_limit  → never upscale
    const q = quality || 'auto:good'
    const params = `f_auto,q_${q},w_${width},dpr_auto,c_limit`
    return src.replace(marker, `${marker}${params}/`)
  }

  // Any other remote host: leave unchanged.
  return src
}
