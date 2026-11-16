import type { NextConfig } from 'next'

// The content editor (Sanity Studio) is its own app. Old bookmarks to /admin still land there.
const STUDIO_URL = process.env.SANITY_STUDIO_URL || 'https://evo-live-pro.sanity.studio'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/admin', destination: STUDIO_URL, permanent: false },
      { source: '/admin/:path*', destination: STUDIO_URL, permanent: false },
      { source: '/studio', destination: STUDIO_URL, permanent: false },
    ]
  },
}

export default nextConfig
