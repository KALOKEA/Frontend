/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Custom loader (Cloudinary transforms) — gives real responsive/optimized
    // images even though output:'export' disables Next's built-in optimizer.
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },
  trailingSlash: true,
}
module.exports = nextConfig
