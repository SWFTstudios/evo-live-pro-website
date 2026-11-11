import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const base = (settings.siteUrl || '').replace(/\/+$/, '')
  if (!base) return []
  const pages: [string, number][] = [
    ['', 1],
    ['/rentals', 0.9],
    ['/events', 0.9],
    ['/photos', 0.7],
    ['/about', 0.6],
    ['/contact', 0.8],
  ]
  return pages.map(([path, priority]) => ({
    url: `${base}${path}`,
    changeFrequency: 'weekly',
    priority,
  }))
}
