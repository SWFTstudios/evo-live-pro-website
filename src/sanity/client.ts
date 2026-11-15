import { cache } from 'react'
import { createClient } from '@sanity/client'
import { sanityEnv } from './env'

// Public, read-only client for published content. The datasets are public, so no token is needed.
// `useCdn` serves reads from Sanity's CDN, which is refreshed within seconds of a Publish.
const getClient = cache(() => {
  const { projectId, dataset, apiVersion, useCdn } = sanityEnv()
  return createClient({ projectId, dataset, apiVersion, useCdn, perspective: 'published' })
})

export const sanityFetch = async <T>(query: string, params: Record<string, unknown> = {}): Promise<T> =>
  getClient().fetch<T>(query, params, { cache: 'no-store' })
