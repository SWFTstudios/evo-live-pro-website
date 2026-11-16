import { createClient } from '@sanity/client'
import { sanityEnv } from './env'

// SERVER ONLY. This client can write, so it must never be imported from a client component.
// The token lives in SANITY_API_WRITE_TOKEN: a Cloudflare secret in production (`wrangler secret put`)
// and .env locally. Create it at sanity.io/manage -> API -> Tokens with the "Editor" role.
// Read lazily so the value is looked up per request (Workers only expose the environment then).
export const getWriteClient = () => {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return null
  const { projectId, dataset, apiVersion } = sanityEnv()
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'raw' })
}
