import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

export const getClient = async () => getPayload({ config })

export type MediaRef = number | Media | null | undefined

export const resolveMedia = (media: MediaRef) => {
  if (!media || typeof media === 'number' || !media.url) return null
  return { url: media.url, alt: media.alt || '', isVideo: media.mimeType?.startsWith('video/') ?? false }
}

export const getSiteSettings = async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}
