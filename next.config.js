/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Remove the X-Powered-By header — minor security + bandwidth improvement
  poweredByHeader: false,
  // Compress HTML/JS output (redundant with Cloudflare Brotli but good to have)
  compress: true,
  images: {
    // Custom loader (Cloudinary transforms) — gives real responsive/optimized
    // images even though output:'export' disables Next's built-in optimizer.
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
    // Prefer modern formats when Cloudinary delivers them (f_auto handles this)
    formats: ['image/avif', 'image/webp'],
    // Device sizes that match the responsive breakpoints in the design
    deviceSizes: [375, 640, 768, 1024, 1280, 1380, 1920],
    // Image sizes for the `sizes` prop on product cards and thumbnails
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  trailingSlash: true,
  // Strict mode catches hydration bugs early in development
  reactStrictMode: true,
}
module.exports = nextConfig
