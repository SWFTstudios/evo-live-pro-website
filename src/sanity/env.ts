// Read lazily (inside functions), never at import time: on Cloudflare Workers the environment is only
// available once a request is being handled.
//
// These are server-only on purpose. The browser never talks to Sanity (pages are rendered on the server,
// and writes go through a server route), so nothing here needs a NEXT_PUBLIC_ prefix.
export const sanityEnv = () => ({
  // The project ID and dataset names are not secrets (they are visible in every Sanity request).
  projectId: process.env.SANITY_PROJECT_ID || 'ax3lhw5y',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2026-11-01',
  // Set SANITY_USE_CDN=false to read straight from the API (always fresh, slower, counts toward API limits).
  useCdn: process.env.SANITY_USE_CDN !== 'false',
})
