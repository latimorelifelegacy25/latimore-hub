/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
              "frame-src https://globalfinancialimpact.fillout.com https://latimorelifelegacy.fillout.com https://calendly.com https://calendar.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|woff2|woff)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  // Redirect www → non-www handled by Vercel domain config
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: false },
    ]
  },
}

module.exports = nextConfig
