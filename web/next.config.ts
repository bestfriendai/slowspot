import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // Static export for deployment
  trailingSlash: true, // Better compatibility with static hosting
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
