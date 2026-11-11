import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const base = (settings.siteUrl || '').replace(/\/+$/, '')
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/preview'] }],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  }
}
