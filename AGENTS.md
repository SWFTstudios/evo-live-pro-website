<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Content lives in Sanity. Schemas are in `studio/schemaTypes/`; after changing a schema or a GROQ query, run `pnpm typegen` and `pnpm --filter evo-live-pro-studio validate`.
- The website reads Sanity only through `src/lib/content.ts` (queries in `src/sanity/queries.ts`). Clean stega (`stegaClean`) from any value used in links, form values, comparisons, analytics or `<head>`.
- The site runs on Cloudflare Workers via OpenNext (`wrangler.jsonc`). Read env vars inside request handlers, never at module load.
