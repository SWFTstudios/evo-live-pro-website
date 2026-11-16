import { cache } from 'react'
import { draftMode } from 'next/headers'
import { createClient } from '@sanity/client'
import { readToken, sanityEnv } from './env'

// Published content for visitors: no token needed (public dataset), served from Sanity's CDN.
const publishedClient = cache(() => {
  const { projectId, dataset, apiVersion, useCdn } = sanityEnv()
  return createClient({ projectId, dataset, apiVersion, useCdn, perspective: 'published' })
})

// Draft Mode is only turned on by the Studio's Presentation tool (the visual editor), through
// /api/draft-mode/enable, which checks a secret the Studio created. Editors then see unpublished
// drafts, and text carries invisible "stega" markers so they can click any text to edit it.
const draftClient = cache(() => {
  const { projectId, dataset, apiVersion, studioUrl } = sanityEnv()
  const token = readToken()
  if (!token) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'drafts',
    stega: { enabled: true, studioUrl },
  })
})

const isDraftMode = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // draftMode() is unavailable outside a request (for example at build time).
    return false
  }
}

export type FetchOptions = {
  /** Set to false for anything that ends up in <head>, links or logic. Stega must never reach SEO tags. */
  stega?: boolean
}

export const sanityFetch = async <T>(
  query: string,
  params: Record<string, unknown> = {},
  { stega = true }: FetchOptions = {},
): Promise<T> => {
  if (await isDraftMode()) {
    const client = draftClient()
    if (client) return client.fetch<T>(query, params, { cache: 'no-store', stega })
    console.warn('Draft Mode is on but SANITY_API_READ_TOKEN is not set: showing published content.')
  }
  return publishedClient().fetch<T>(query, params, { cache: 'no-store' })
}
