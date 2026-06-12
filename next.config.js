// Bundle analyser: run `ANALYZE=true npm run build` to open the report.
// Gracefully skipped if the package isn't installed (production builds).
let withBundleAnalyzer = (c) => c
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
} catch { /* not installed — no-op */ }

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

  // ── Compiler optimisations for production (100K user scale) ────────────────
  compiler: {
    // Strip console.log/debug in production builds — reduces bundle size and
    // prevents accidental data leakage via browser console on prod
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Experimental perf flags ─────────────────────────────────────────────────
  experimental: {
    // Enables the optimised package imports transform — tree-shakes large icon
    // and UI packages (e.g. lucide-react, @heroicons) so only used icons are
    // bundled. Significant JS size reduction at 100K-user scale.
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
    ],
  },
}
module.exports = withBundleAnalyzer(nextConfig)
