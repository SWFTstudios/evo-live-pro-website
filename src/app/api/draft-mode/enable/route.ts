import { createClient } from '@sanity/client'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { readToken, sanityEnv } from '@/sanity/env'

// Called by the Studio's Presentation tool (the visual editor). It checks the one-time secret the Studio
// stored in the dataset, using the read token, and only then turns on Draft Mode. Anyone else gets a 401.
//
// The handler is built per request on purpose: on Cloudflare Workers the token only exists in the
// environment while a request is being handled, not when this module is first loaded.
export async function GET(request: Request) {
  const token = readToken()
  if (!token) return new Response('Visual editing is not configured (SANITY_API_READ_TOKEN is missing).', { status: 503 })
  const { projectId, dataset, apiVersion } = sanityEnv()
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  return defineEnableDraftMode({ client }).GET(request)
}
