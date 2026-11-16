// The public website. Override with SANITY_STUDIO_PREVIEW_ORIGIN (for example http://localhost:3000 in
// studio/.env when running the site locally). Change the default when the custom domain is connected.
export const SITE_URL =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'https://evo-live-pro-website.elombe.workers.dev'

// The test version of the site: a Cloudflare Worker preview version uploaded with
// `pnpm run upload:test`, which reads the "development" dataset. Used by the "Test content" workspace.
export const TEST_SITE_URL =
  process.env.SANITY_STUDIO_TEST_PREVIEW_ORIGIN || 'https://dev-evo-live-pro-website.elombe.workers.dev'
