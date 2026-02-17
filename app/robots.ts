import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/thank-you'],
      },
    ],
    sitemap: 'https://latimorehub.vercel.app/sitemap.xml',
  }
}
