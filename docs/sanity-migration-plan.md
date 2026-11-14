# Migration plan: Payload CMS → Sanity

**Audience:** the coding agent (Cursor) that will implement this, plus SWFT Studios reviewers.
**Starting point:** branch `feat/payload-cms` at commit `f922630` ("Journey-based site experience and Google Tag Manager tracking").
**Goal:** the public site looks and behaves exactly as it does today. Only the content backend moves from Payload (D1 + R2, embedded at `/admin`) to Sanity (Content Lake + Sanity Studio).

> Work through the phases in order. Each phase ends with **acceptance checks**. Do not start the next phase until they pass. Commit after each phase with a clear message. Do not delete Payload code until Phase 7.

---

## 0. Read this first

### 0.1 What exists today (do not re-discover, it is listed here)

| Area | Today (Payload) | Files |
| --- | --- | --- |
| Framework | Next.js 16.4.6 App Router, React 19.2, deployed to Cloudflare Workers with `@opennextjs/cloudflare` 1.20.16 | `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc` |
| CMS | Payload 3.93 embedded in the Next app at `/admin`, with REST at `/api/*` | `src/payload.config.ts`, `src/app/(payload)/**` |
| Database | Cloudflare D1 (`binding: D1`, id `7499c93e-…`) | `wrangler.jsonc`, `src/migrations/**` |
| Files | Cloudflare R2 (`binding: R2`) via `@payloadcms/storage-r2`. No resizing (no `sharp` on Workers) | `src/collections/Media.ts` |
| Collections | `inquiries`, `equipment-categories`, `equipment`, `rental-packages`, `wedding-packages`, `a-la-carte`, `event-services`, `team`, `brands`, `venues`, `testimonials`, `faqs`, `gallery`, `media`, `users` | `src/collections/*.ts` |
| Globals | `site-settings`, `home-page`, `about-page`, `events-page`, `contact-page` | `src/globals/*.ts` |
| Data access | `getClient()` → `payload.find` / `payload.findGlobal`; `resolveMedia()` → `{ url, alt, isVideo }` | `src/lib/payload.ts`, every `src/app/(frontend)/**/page.tsx`, `layout.tsx`, `robots.ts`, `sitemap.ts` |
| Rich text | Lexical (`about-page.originStory` only), rendered with `@payloadcms/richtext-lexical/react` | `src/app/(frontend)/about/page.tsx` |
| Form | `ContactForm.tsx` POSTs JSON to Payload REST `/api/inquiries`. Honeypot field `website` rejected in `Inquiries.beforeValidate` | `src/components/ContactForm.tsx`, `src/collections/Inquiries.ts` |
| Types | Generated `src/payload-types.ts` (only `SiteFooter.tsx` imports it directly; pages rely on inferred types) | |
| Admin UI | Webflow-style theme + SWFT × Evo co-branding, custom dashboard home, list cells | `src/app/(payload)/custom.scss`, `src/components/admin/*` |
| Seed | `scripts/seed.ts` (all of Tim's inventory, packages, prices, copy). `SEED_RESET=true` wipes and reloads | `scripts/seed.ts` |
| Rendering | Every route is `export const dynamic = 'force-dynamic'` | |
| Analytics | GTM via `gtmId` in Site Settings; `track()` events. **Unaffected by this migration** except where `gtmId` is read from | `src/components/GoogleTagManager.tsx`, `src/lib/analytics.ts`, `analytics/` |
| Tests | Vitest int test that calls Payload; Playwright admin + frontend e2e | `tests/**` |
| Live | `https://evo-live-pro-website.elombe.workers.dev` (Payload version is deployed, D1 has the initial migration, content may have been edited there) | |

Untouched by this migration: `src/app/(frontend)/styles.css`, all public-site components' markup/CSS, `src/lib/quote.ts`, `src/lib/analytics.ts`, `src/components/{Reveal,StickyActions,TrackClicks,GoogleTagManager,FaqList,PhotoGallery,SiteHeader}.tsx` (props may change type only), `public/brand/**`, `public/preview/**`, `analytics/**`.

### 0.2 Decisions already made (do not re-open them)

1. **Sanity Studio is a separate app in `studio/`, deployed with `sanity deploy`** to `https://evo-live-pro.sanity.studio` (pick the closest free hostname). The Next app's `/admin` becomes a redirect to it.
   *Why:* embedding the Studio (`next-sanity/studio`) pulls the `sanity` package into the Worker's server bundle, which is what forced the Workers Paid plan and the brittle OpenNext/Next version pinning. A standalone Studio keeps the Worker small and lets the Studio upgrade independently.
2. **One Sanity project, two datasets:** `production` (live site) and `development` (local dev, tests, previews). Both **public** read.
3. **Inquiries are stored in Sanity**, not D1, so Tim has one dashboard. Because the datasets are public, inquiry documents **must not be publicly readable**. Use private document IDs: every inquiry `_id` is `inquiry.<uuid>` (IDs containing a `.` are only readable with a token). Phase 0 spike must prove this; fallback is a separate **private** dataset `inquiries` (see 0.4).
4. **Writes only happen server-side** through a Next route handler using `SANITY_API_WRITE_TOKEN`. No token ever reaches the browser.
5. **Images use Sanity's image CDN** (`@sanity/image-url`). This replaces the "no resizing / no cropping" limitation. Enable `hotspot: true` on every image.
6. **Keep the content model 1:1 with Payload** (same field names, same labels, same descriptions/help text, same defaults, same groups in the sidebar) so the README and Tim's mental model barely change. Field names stay camelCase as they are now.
7. **Ordering stays a `sortOrder` number field** (parity, easy migration). Drag-and-drop ordering (`@sanity/orderable-document-list`) is an optional follow-up, not part of this plan.
8. **Rendering stays dynamic** in the first pass (no Next data cache on Workers). Reads go through Sanity's API CDN (`useCdn: true`), which invalidates within seconds of a publish. Live/instant updates and visual editing are Phase 8 (optional).
9. **Payload stays deployed until cutover** (Phase 6). Real content is exported from the live Payload site, not just re-seeded.
10. Package manager stays **pnpm**. Node stays `>=22.12` (Sanity's minimum; current engines field already satisfies it).

### 0.3 Rules for the agent

- Install the **latest stable** versions at the time you run it and record them in the PR description. At time of writing: `sanity` 6.x, `next-sanity` 13.x (peer: `next ^16`, `react ^19.2.3`, `@sanity/client ^8.11`, `styled-components ^6.1`), `@sanity/client` 8.x, `@sanity/image-url` 2.x, `@portabletext/react` 8.x. Check peer ranges before installing; do not use `--force` or `--legacy-peer-deps` to paper over a conflict.
- Read `AGENTS.md`: this Next.js version has breaking changes. Read `node_modules/next/dist/docs/` before touching routing, caching or config.
- Never commit tokens. `.env*` is already git-ignored except `.env.example`.
- Keep every user-facing label and help text from the Payload configs. Tim reads them.
- `pnpm exec tsc --noEmit` must pass at the end of every phase.

### 0.4 Phase 0 spike (do this first, ~1 hour, throwaway)

Before building anything, prove two risky assumptions with a scratch script against the `development` dataset:

1. **Private IDs.** Create a document `{_id: 'inquiry.test-123', _type: 'inquiry', name: 'x'}` with a write token. Then, with **no token**, query `*[_type == "inquiry"]` against both `apicdn.sanity.io` and `api.sanity.io`. Both must return `[]`. With a read token, it must return the doc. Open the Studio and confirm the document appears in the Inquiries list and is editable. Delete it after.
   - If any of this fails, switch decision 3 to: a second dataset `inquiries` with **private** ACL; Studio gets a second workspace (or the `inquiry` type is only registered in that workspace); the route handler writes there. Note the change at the top of this file.
2. **Worker bundle.** After Phase 3 builds, run `pnpm exec opennextjs-cloudflare build && pnpm exec wrangler deploy --dry-run --outdir .wrangler/dry` and record the gzipped size. If it is under 3 MB, note that the Workers **Free** plan now suffices (README "What it costs" must be updated in Phase 7).

---

## 1. Sanity project and Studio scaffold

### 1.1 Accounts and project (human steps; the agent writes them into the README and asks the user to do them)

1. At sanity.io/manage create project **Evo Live Pro** (organization: SWFT Studios). Note the **project ID**.
2. Create datasets `production` and `development` (public).
3. **API → CORS origins:** add `http://localhost:3000`, `http://localhost:3333`, `https://evo-live-pro-website.elombe.workers.dev`, and the custom domain once connected. Credentials **off** for all of them (the site never sends a user token).
4. **API → Tokens:** create `website-write` (role **Editor**) for the route handler and seed/migration scripts. Optionally `website-read` (role **Viewer**) for Phase 8 drafts.
5. **Members:** invite Tim and Dom. Give Dom/Tim **Administrator** or **Editor** per the current Payload roles. (Check which roles the plan tier offers and document the outcome in the README.)

### 1.2 Repo layout

Add a pnpm workspace so the Studio has its own dependencies and never enters the Next bundle.

```
evo-live-pro-website/
├── pnpm-workspace.yaml        packages: ['studio']   (root app stays the root package)
├── studio/
│   ├── package.json           name: evo-live-pro-studio; scripts: dev, build, deploy, typegen, seed, migrate
│   ├── sanity.config.ts
│   ├── sanity.cli.ts          projectId/dataset from env; studioHost: 'evo-live-pro'; typegen config
│   ├── .env.example           SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET
│   ├── schemaTypes/
│   │   ├── index.ts
│   │   ├── objects/           mediaImage.ts, videoFile.ts, link.ts, …
│   │   ├── documents/         one file per former collection
│   │   └── singletons/        one file per former global
│   ├── structure/             index.ts (desk structure), singletons.ts
│   ├── components/            CoBrand.tsx, DashboardHome.tsx (ports of src/components/admin)
│   ├── theme.ts
│   ├── static/                swft-badge.webp, logo-mark.png (copied from public/brand)
│   └── scripts/
│       ├── seed.ts            port of /scripts/seed.ts
│       └── migrate-from-payload.ts
└── …existing Next app…
```

- Scaffold with `pnpm create sanity@latest --project <id> --dataset development --template clean --typescript --output-path studio` and then delete the sample schema.
- Remove `"ii": "pnpm install --ignore-workspace"` from root `package.json` (it fights the new workspace) or update the README accordingly.
- Root `package.json` scripts to add: `"studio": "pnpm --filter evo-live-pro-studio dev"`, `"studio:deploy": "pnpm --filter evo-live-pro-studio deploy"`, `"typegen": "pnpm --filter evo-live-pro-studio typegen"`.

### 1.3 Acceptance

- `pnpm studio` opens a Studio at `http://localhost:3333` with an empty schema and you can log in.
- `pnpm dev` (Payload) still works unchanged.

---

## 2. Content model (schemas)

### 2.1 Type mapping rules

| Payload | Sanity |
| --- | --- |
| `text` | `string` |
| `textarea` | `text` (`rows: 3`) |
| `email` | `string` + `validation: r => r.email()` |
| `number` | `number` |
| `checkbox` | `boolean` + `initialValue` |
| `select` | `string` + `options: { list: [{title, value}], layout: 'radio' or 'dropdown' }` |
| `relationship` (single) | `reference` (`to: [{ type: '…' }]`) |
| `upload` → `media` (images only) | `mediaImage` object (see 2.2) |
| `upload` → `media` (image **or** video) | separate `image: mediaImage` + `video: videoFile` fields (see per-type notes) |
| `array` of `{ value: text }` | `array` of `string` |
| `array` of objects | `array` of named inline objects (`defineArrayMember({ type: 'object', name: '…' })`) with a `preview` |
| `richText` (Lexical) | Portable Text: `array` of `block` (styles: normal, h3; marks: strong, em, link) |
| `tabs` | `groups` on the document + `group:` on each field. First group `default: true` |
| `required: true` | `validation: r => r.required()` |
| `maxRows` / `maxLength` | `r.max(n)` |
| `defaultValue` | `initialValue` (for arrays, include `_key`s) |
| `admin.description` | `description` |
| `admin.position: 'sidebar'` | no sidebar in Sanity: put these fields in a trailing `settings` group or at the end of the field list |
| `label` | `title` |
| `labels.plural`, `admin.group` | handled in desk structure (2.5) |
| `hooks.beforeValidate` slugify | `slug` field with `options: { source: 'name', slugify }` reusing `src/lib/slugify.ts` logic (copy it into `studio/lib/slugify.ts`) |
| `access` | Sanity roles + private IDs (see 2.6) |

Use `defineType` / `defineField` / `defineArrayMember` everywhere. Give every document type an `icon` (from `@sanity/icons`) and a `preview` that matches Payload's `useAsTitle` and `defaultColumns`.

### 2.2 Shared objects (`studio/schemaTypes/objects/`)

- **`mediaImage`**: `type: 'image'`, `options: { hotspot: true }`, field `alt` (`string`, required, description: "Short description of the picture, for screen readers and Google."). This replaces the Payload `media` collection: alt text lives on each use. Accept `image/*`.
- **`videoFile`**: `type: 'file'`, `options: { accept: 'video/mp4,video/webm' }`, field `alt` (string). Description: "MP4 works best. Keep it short."
- Reusable field helpers (port `src/fields/orderField.ts`) in `studio/schemaTypes/fields.ts`:
  - `sortOrderField()` → `number`, title "Sort order", `initialValue: 100`, same description.
  - `priceLabelField(initial = 'Price on quote')` → `string`, title "Price shown on the website", same description.

### 2.3 Documents (one per former collection)

Sanity `_type` uses camelCase singular names. Keep Payload slugs in a comment for traceability.

| `_type` (Payload slug) | Fields (same names as Payload) | Notes |
| --- | --- | --- |
| `equipmentCategory` (`equipment-categories`) | `name`*, `slug` (slug, source name), `sortOrder` | Preview: name + `#sortOrder` |
| `equipment` (`equipment`) | `name`*, `category`* → ref `equipmentCategory`, `subcategory`, `description` (title "Short description"), `priceLabel`, `image` (mediaImage), `sortOrder`, `available` (boolean, initial true) | Preview: title name, subtitle `category->name · priceLabel`, media image. Add `(Hidden)` to subtitle when `available == false` (replaces `StatusCell`/`CategoryCell`). Add ordering options by sortOrder and by name |
| `rentalPackage` (`rental-packages`) | `name`*, `guestsLabel` ("Guest count"), `priceLabel` (initial `$0+`), `gear`* (text, "What is included"), `sortOrder` | |
| `weddingPackage` (`wedding-packages`) | `name`*, `guestsLabel`, `priceLabel` (initial `$0`), `includes` (array of **string**, title "What is included"), `sortOrder` | Payload stored `{item}` objects; migrate to plain strings |
| `alaCarteItem` (`a-la-carte`) | `name`*, `priceLabel` (initial `$0`), `sortOrder` | |
| `eventService` (`event-services`) | `title`*, `description`* (text), `ctaLabel` (initial `Plan an event →`), `ctaLink` (initial `/contact`), `accent` (`book`/`rent`, radio, initial `book`), `image`, `sortOrder` | |
| `teamMember` (`team`) | `name`*, `jobTitle`, `portrait` (mediaImage), `sortOrder` | |
| `brand` (`brands`) | `name`*, `logo` (mediaImage, alt optional here), `sortOrder` | |
| `venue` (`venues`) | `name`*, `sortOrder` | |
| `testimonial` (`testimonials`) | `quote`*, `name`*, `eventType` ("Event"), `photo`, `published` (initial true), `sortOrder` | |
| `faq` (`faqs`) | `question`*, `answer`*, `published` (initial true), `sortOrder` | |
| `galleryItem` (`gallery`) | `title`*, `category`* (weddings, corporate, concerts, private-parties, behind-the-scenes), `image` (mediaImage), `video` (videoFile), `videoUrl`, `isVideo`, `large`, `featuredOnHome`, `sortOrder` | Payload had one `media` upload that could be either; split into `image` + `video`. Add validation: at least one of image/video/videoUrl (warning, not error, so placeholders still work). Keep `isVideo` for parity but set it automatically in the migration when a video is present |
| `inquiry` (`inquiries`) | `kind`* (booking/rental), `status` (new, in-progress, quoted, booked, closed; initial `new`), `name`*, `email`*, `phone`, `eventType`, `eventDate` ("Date"), `returnDate`, `venue`, `guestCount`, `budget`, `fulfillment` ("Pickup or delivery"), `quoteItems` (text, "Items in the quote cart"), `notes` (text), `submittedAt` (datetime, readOnly) | All fields except `status` and `notes` are `readOnly: true` in the Studio. Preview: name, subtitle `kind · eventDate · status`. Default ordering `submittedAt desc` |

`*` = required.

`users` and `media` collections are **not** ported: Sanity manages members itself, and assets live in the Sanity asset library.

### 2.4 Singletons (one per former global)

Fixed document IDs (no `drafts.` hackery needed: the Studio handles drafts for them):

| `_type` = `_id` | Groups → fields | Notes |
| --- | --- | --- |
| `siteSettings` | **Business**: `businessName`*, `tagline`, `phone`, `email`, `location`, `instagramHandle`, `instagramUrl`, `logoWordmark`, `logoMark` · **Menu & buttons**: `navigation` (array of `{label*, url*}`), `bookButtonLabel`, `rentButtonLabel` · **Footer**: `footerNote`, `copyright` · **Tracking**: `gtmId` (regex validation `^GTM-[A-Z0-9]{4,12}$`, `readOnly` unless current user has the `administrator` role), `siteUrl` · **Google & sharing**: `seoTitle`, `seoDescription`, `shareImage` | Copy every `defaultValue` into `initialValue`. Group description for Tracking copied from Payload |
| `homePage` | **Hero**: `eyebrow`, `headline`*, `subheadline`, `heroVideo` (videoFile), `heroImage` (mediaImage), `bookLabel`, `bookButton`, `rentLabel`, `rentButton`, `trustBadges` (array of string) · **What we do**: `whatWeDoTitle`, `whatWeDoIntro`, `services` (array of `{title*, description*, image}`) · **How it works**: `howTitle`, `howSteps` (array of `{title*, text*}`, max 4) · **Proof & questions**: `testimonialsTitle`, `faqTitle`, `closingHeadline`, `closingText` · **Packages**: `recentSetupsTitle`, `weddingTeaser*` (4 fields), `soundTeaser*` (4 fields), `brandsTitle` | `trustBadges` was `{text}` objects in Payload → plain strings |
| `aboutPage` | `eyebrow`, `headline`*, `originStory` (Portable Text), `groupPhoto`, `groupPhotoCaption`, `crewTitle`, `offTheRecordTitle`, `offTheRecord` (array of `{question*, answers: array of {person* → ref teamMember, answer*}}`), `threeWords` (array of string, max 3) | |
| `eventsPage` | `eyebrow`, `headline`*, `intro`, `servicesTitle`, `wedding{Eyebrow,Title,Note,Button}`, `alaCarte{Eyebrow,Title,Note}`, `capabilities` (array of `{letter* max 1, title*, description*}`), `venuesTitle`, `venuesNote`, `closingHeadline`, `closingButton` | |
| `contactPage` | `eyebrow`, `headline`*, `intro`, `bookTitle`, `bookNote`, `rentTitle`, `rentNote`, `eventTypes`, `budgetRanges`, `fulfillmentOptions` (each array of string with the Payload defaults), `successMessage`, `sidePhoto` | Description: "Phone, email and address come from Site Settings." |

Singleton plumbing in `sanity.config.ts`:
- `schema.templates`: filter out singleton types so they cannot be created from "New document".
- `document.actions`: for singleton types keep only `publish`, `discardChanges`, `restore` (no duplicate/delete/unpublish).
- `document.newDocumentOptions`: also hide `inquiry` (inquiries are only created by the website).
- `document.actions` for `inquiry`: remove `duplicate`.

### 2.5 Desk structure (`studio/structure/index.ts`)

Mirror the Payload sidebar groups and plural labels exactly, in this order:

1. **Overview** (custom component, see Phase 5)
2. **Inbox** → "Inquiries (Form Submissions)" with child lists *New*, *In progress*, *All* (GROQ filters on `status`)
3. **Rentals** → Equipment (Inventory) [filtered child lists per category via `documentTypeList` + filter, plus *Hidden items* `available == false`], Equipment Categories, Sound + DJ Packages
4. **Events & Pricing** → Wedding Packages, À la carte Pricing
5. **Pages & Content** → Site Settings, Home Page, About Page, Events Page, Contact Page (singletons via `S.document().schemaType(t).documentId(t)`), then Event Services, Team, Brands We Produced For, Venues We Know, Testimonials, FAQs
6. **Library** → Photos & Videos (gallery), plus the built-in Media/asset browser if the `sanity-plugin-media` plugin is added (recommended: add it, it replaces the Payload Media list)

Every list uses `defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])` except Inquiries (`submittedAt desc`).

Also add `visionTool()` (only for administrators, or only in the `development` workspace).

### 2.6 Access model

| Payload rule | Sanity equivalent |
| --- | --- |
| Anyone can read content | Public datasets; site uses no token |
| Logged-in users edit | Project members with Editor/Administrator role |
| Admins manage users | Sanity project admin at sanity.io/manage |
| Only admins edit `gtmId` | `readOnly: ({ currentUser }) => !currentUser?.roles.some(r => r.name === 'administrator')` |
| Public can create inquiries | Next route handler with server-only write token (Phase 4) |
| Nobody outside can read inquiries | Private `inquiry.` ID prefix (or private dataset, per spike) |
| First user becomes admin | Not applicable (project creator is admin) |

### 2.7 Type generation

- In `studio/sanity.cli.ts` configure typegen: schema from `studio/schema.json`, queries from `../src/**/*.{ts,tsx}`, output `../src/sanity/types.ts`.
- Script `typegen`: `sanity schema extract --enforce-required-fields && sanity typegen generate`.
- Commit `src/sanity/types.ts`. Do not hand-edit.

### 2.8 Acceptance

- Studio shows the exact sidebar from 2.5, all singletons open as single forms, every field shows its Payload label and help text.
- Creating a document of each type with Payload defaults works; required validation fires.
- `pnpm typegen` produces `src/sanity/types.ts` without errors.
- `sanity schema validate` passes.

---

## 3. Data: seed script and Payload export

### 3.1 Seed (`studio/scripts/seed.ts`)

Port `scripts/seed.ts` data **verbatim** (equipment tuples, packages, à la carte, event services, venues, brands, team, FAQs, copy patches). Do not retype prices by hand; copy the arrays.

- Run with `sanity exec scripts/seed.ts --with-user-token` (or `@sanity/client` + `SANITY_API_WRITE_TOKEN`), dataset from `SANITY_STUDIO_DATASET`, default `development`. **Refuse to run against `production`** unless `SEED_ALLOW_PRODUCTION=true`.
- **Deterministic IDs** so it is idempotent: `equipmentCategory-${slug}`, `equipment-${slugify(name)}`, `rentalPackage-${slug}`, `faq-${n}`, etc. Singletons use their fixed IDs.
- Use one `client.transaction()` per type with `createIfNotExists` (default) or `createOrReplace` when `SEED_RESET=true`. With `SEED_RESET=true`, first delete all docs of the seeded types (never `inquiry`).
- References: `{ _type: 'reference', _ref: 'equipmentCategory-lighting' }`. Array items need `_key` (use a stable short hash of the content or index).
- Port the "only missing new content" behavior: the existing seed adds FAQs and home-page fields if missing. `createIfNotExists` + `patch().setIfMissing()` covers it.

### 3.2 Export from live Payload (`studio/scripts/migrate-from-payload.ts`)

Content on the live Payload site may have been edited after seeding, and uploaded images exist only in R2. Migrate real data, not seed data, into `production`.

1. Inputs: `PAYLOAD_URL=https://evo-live-pro-website.elombe.workers.dev`, `PAYLOAD_EMAIL`, `PAYLOAD_PASSWORD` (an admin account; needed to read inquiries), `SANITY_API_WRITE_TOKEN`, target dataset.
2. Log in: `POST {PAYLOAD_URL}/api/users/login` → JWT; send `Authorization: JWT <token>` on later requests.
3. For each collection: `GET /api/<slug>?depth=0&limit=0&pagination=false`. For each global: `GET /api/globals/<slug>?depth=0`. Write raw JSON to `studio/.migration/<slug>.json` (git-ignored) before transforming, so a failed run can resume.
4. Media: `GET /api/media?limit=0&pagination=false`. For each doc download `url` (absolute it against `PAYLOAD_URL`), upload with `client.assets.upload(isVideo ? 'file' : 'image', buffer, { filename })`. Keep a map `payloadMediaId → { assetId, alt, isVideo }` in `.migration/media-map.json` to make reruns skip finished uploads.
5. Transform with ID map `payload:<slug>:<id>` → Sanity ID (`<type>-<payloadId>`, inquiries `inquiry.<uuid>`):
   - uploads → `{ _type: 'mediaImage', alt, asset: { _type: 'reference', _ref: assetId } }` or `videoFile`.
   - gallery `media` → `image` or `video` depending on mime type; set `isVideo` true if video.
   - relationships → references.
   - `{value}` / `{text}` / `{item}` arrays → string arrays.
   - `originStory` Lexical JSON → Portable Text. Write a small converter for the nodes actually used (root → paragraph/heading → text with bold/italic format bits, link). Throw on unknown node types so nothing silently disappears.
   - inquiries: `createdAt` → `submittedAt`.
   - drop `id`, `createdAt`, `updatedAt`, `sizes`, Payload internals.
6. Write with `createOrReplace` in batched transactions (≤ 200 mutations each), documents published directly (no `drafts.` prefix).
7. Print a reconciliation table: counts per type in Payload vs Sanity, media uploaded/failed. Exit non-zero on any mismatch.

### 3.3 Acceptance

- `pnpm --filter evo-live-pro-studio seed` on an empty `development` dataset produces the same counts as the Payload seed (51 equipment items, 8 categories; compute the rest from the arrays) and running it twice changes nothing.
- `migrate-from-payload.ts` run against `development` first: reconciliation table all green; spot-check 5 equipment prices, an uploaded image, the About story, and one inquiry in the Studio.

---

## 4. Next.js data layer

### 4.1 Packages

Add to the **root** app: `next-sanity`, `@sanity/image-url`, `@portabletext/react`. `next-sanity` re-exports `createClient`, `defineQuery`, `groq`. It lists `sanity` and `styled-components` as peers; they are only needed for the embedded Studio, which we are not using. If the peer warning blocks install, add them as devDependencies **only** and verify (Phase 0 bundle check) that they are not in the Worker bundle. Prefer `@sanity/client` directly if `next-sanity` drags the Studio in.

### 4.2 Env (root `.env.example`)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-11-01
# Server only. Never prefix with NEXT_PUBLIC_.
SANITY_API_WRITE_TOKEN=
NEXT_PUBLIC_SANITY_STUDIO_URL=https://evo-live-pro.sanity.studio
```

`PAYLOAD_SECRET` stays until Phase 7. On Cloudflare: public vars go in `wrangler.jsonc` `vars` (they must also be present at build time for `NEXT_PUBLIC_*` inlining, so set them in Workers Builds env too); `SANITY_API_WRITE_TOKEN` via `wrangler secret put`.

### 4.3 New module `src/sanity/`

```
src/sanity/
├── env.ts        reads + asserts the env vars (throws a clear message if missing)
├── client.ts     createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
├── writeClient.ts server-only ('server-only' import) client with token, useCdn: false
├── image.ts      urlFor(source) via @sanity/image-url; helper imageSrc(img, { w, h }) → url with auto=format, fit=max
├── fetch.ts      sanityFetch<T>({ query, params }) → client.fetch(query, params, { cache: 'no-store' }) with React cache() per request
├── queries.ts    all GROQ queries with defineQuery (so typegen picks them up)
└── types.ts      generated (2.7)
```

### 4.4 Keep component churn near zero: GROQ projections return today's shapes

The pages currently consume `resolveMedia()` output `{ url, alt, isVideo } | null` and plain fields. Write GROQ fragments that return exactly that, so components only change their imports/types:

```ts
const image = (f: string) => `${f}{ "url": asset->url, alt, "isVideo": false, "lqip": asset->metadata.lqip, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`
const video = (f: string) => `${f}{ "url": asset->url, alt, "isVideo": true }`
// gallery: "media": coalesce(${video('video')}, ${image('image')})
```

Then:
- Replace `MediaRef`/`resolveMedia` in `src/components/Media.tsx` with a `MediaFile = { url: string; alt?: string | null; isVideo: boolean } | null` prop. For images, pass the URL through `imageSrc()` with a sensible width (hero 2000, cards 1200, gallery 1600, logos 600) to get resizing for free.
- Every list query mirrors the Payload `where` + `sort` + `limit`:

| Page | Payload call | GROQ |
| --- | --- | --- |
| layout, robots, sitemap, contact, home | `findGlobal('site-settings')` | `*[_id == "siteSettings"][0]{ ..., ${image('logoWordmark')}, ${image('logoMark')}, ${image('shareImage')} }` |
| home | `findGlobal('home-page')` | `*[_id == "homePage"][0]{ ..., ${video('heroVideo')}, ${image('heroImage')}, services[]{ ..., ${image('image')} } }` |
| home | gallery `featuredOnHome`, sort, limit 8 | `*[_type == "galleryItem" && featuredOnHome == true] \| order(sortOrder asc)[0...8]{ _id, title, category, large, videoUrl, isVideo, "media": coalesce(...) }` |
| home | brands limit 60 | `*[_type == "brand"] \| order(sortOrder asc)[0...60]{ _id, name, ${image('logo')} }` |
| home | faqs published | `*[_type == "faq" && published != false] \| order(sortOrder asc)[0...20]{ _id, question, answer }` |
| home | testimonials published limit 6 | `*[_type == "testimonial" && published != false] \| order(sortOrder asc)[0...6]{ ..., ${image('photo')} }` |
| rentals | categories, available equipment (limit 500), rental packages | `*[_type == "equipmentCategory"] \| order(sortOrder asc){ name }`, `*[_type == "equipment" && available != false] \| order(sortOrder asc)[0...500]{ _id, name, "category": coalesce(category->name, "Other"), subcategory, description, priceLabel, "imageUrl": image.asset->url }`, `*[_type == "rentalPackage"] \| order(sortOrder asc)` |
| events | events-page, event-services, wedding-packages, a-la-carte, venues | one query each, same sorts/limits |
| about | about-page depth 2, team | `*[_id == "aboutPage"][0]{ ..., ${image('groupPhoto')}, offTheRecord[]{ question, answers[]{ answer, "person": person->{ _id, name } } } }`, `*[_type == "teamMember"] \| order(sortOrder asc)[0...20]{ _id, name, jobTitle, ${image('portrait')} }` |
| photos | gallery limit 300 | same projection as home without the filter |
| contact | contact-page | `*[_id == "contactPage"][0]{ ..., ${image('sidePhoto')} }` |

Prefer fetching each page's data in **one** GROQ query with named keys (`{ "home": …, "settings": …, "faqs": … }`) instead of `Promise.all` of many requests.

- Field-shape changes to handle in components: `id` → `_id` (string; check `RentalsBrowser` and `PhotoGallery` keys/types); `eventTypes`/`budgetRanges`/`fulfillmentOptions`/`trustBadges`/`threeWords`/`includes` are now `string[]` (delete the `.map(r => r.value)` / `.map(w => w.word)` adapters); `originStory` is Portable Text.
- About page: replace `RichText` from `@payloadcms/richtext-lexical/react` with `<PortableText value={page.originStory} components={…} />` inside the same `.rich` wrapper. Map `h3`, `strong`, `em`, `link` (external links get `rel="noopener"`).
- `SiteFooter.tsx`: replace `import type { SiteSetting } from '@/payload-types'` with the generated query result type (e.g. `SiteSettingsQueryResult` from `@/sanity/types`).
- Null-safety: Sanity returns `null` for missing singletons. In `layout.tsx` and pages, fall back to the same defaults Payload's `defaultValue`s provided (centralize in `src/sanity/defaults.ts`) so the site renders even on an empty dataset. This is new behavior Payload gave for free.
- Keep `export const dynamic = 'force-dynamic'` for now (decision 8).

### 4.5 Do this behind a switch, page by page

Add `src/lib/content.ts` exposing the same functions each page needs (`getHomeData()`, `getRentalsData()`, …). Implement Sanity versions first, switch pages one at a time, compare visually against the Payload version on the same content (run migration into `development` first). No feature flag at runtime is needed; git history is the switch.

### 4.6 Images in `next.config.ts`

- Add `images.remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }]` (only matters if anything uses `next/image`; current components use `<img>`, keep it that way and rely on the Sanity CDN for resizing).
- Keep `localPatterns` for `/api/media/file/**` until Phase 7.

### 4.7 Acceptance

- Every public page renders from Sanity `development` with migrated content and is visually identical to the Payload version (Playwright screenshot comparison at 375px and 1280px for `/`, `/rentals`, `/events`, `/photos`, `/about`, `/contact`; differences only in image resolution).
- Empty dataset: every page still renders with defaults/placeholders, no 500s.
- Editing a price in the Studio and pressing **Publish** shows up on refresh within a few seconds.
- `tsc --noEmit` passes. No file under `src/app/(frontend)` or `src/components` (except admin) imports from `payload`, `@payloadcms/*`, `@/payload-types` or `@/lib/payload`.

---

## 5. Contact form → Sanity

### 5.1 Route handler `src/app/api/inquiries/route.ts`

Payload currently owns `/api/[...slug]`. While both coexist, create the new handler at **`src/app/api/inquiry/route.ts`** (singular) and point `ContactForm.tsx` at `/api/inquiry`. Rename to `/api/inquiries` in Phase 7 if desired (update the form and `analytics/README.md` if it mentions the path).

Behavior:
1. `POST` only; `export const runtime` left default (Node-compatible on OpenNext). Reject non-JSON and bodies > 16 KB (413).
2. Honeypot: if `website` is non-empty, return `200 { ok: true }` without writing (do not tell bots they failed; Payload threw, which returned an error, so this is an intentional improvement). Never store `website`.
3. Validate with a small hand-written validator or `zod` (add dependency): `kind ∈ {booking, rental}`; `name` 1–120 chars; `email` valid, ≤ 200; every other field optional string, trimmed, ≤ 500 chars; `quoteItems`, `notes` ≤ 4000. Unknown keys dropped. On failure return `400 { error: 'invalid', fields: [...] }`.
4. Write with the server-only write client: `create({ _id: \`inquiry.${crypto.randomUUID()}\`, _type: 'inquiry', status: 'new', submittedAt: new Date().toISOString(), ...fields })`.
5. Return `201 { ok: true }`. On Sanity error return `502` and log with `console.error` (shows in Workers observability). Never echo the token or the raw Sanity error to the client.
6. Optional but recommended: basic rate limit (Cloudflare WAF rate-limiting rule on `/api/inquiry`, documented in README) and Cloudflare Turnstile (already suggested in the README). Leave Turnstile as a follow-up unless trivial.

`ContactForm.tsx` keeps its current payload shape, analytics events and UX. Only the URL changes. `response.ok` covers 201.

### 5.2 Acceptance

- Submitting the booking form and the rental form (with cart items) on `localhost` creates `inquiry.*` docs in `development`; they show in Studio **Inbox → New** with readable fields; status editable.
- `curl 'https://<projectId>.apicdn.sanity.io/v<apiVersion>/data/query/development?query=*[_type=="inquiry"]'` with no token returns `"result":[]`.
- Honeypot filled → 200, nothing written. Invalid email → 400. Oversized body → 413.
- `generate_lead` analytics event still fires on success only.

---

## 6. Studio polish (parity with the Payload dashboard)

Port `src/components/admin/*` and `src/app/(payload)/custom.scss` intent, not code:

1. **Branding** (`studio/components/CoBrand.tsx`, `sanity.config.ts`): `title: 'Evo Live Pro CMS'`, `icon` = Evo logo mark, `studio.components.navbar` wrapper that shows the SWFT × Evo co-brand, login screen note. Copy brand images from `public/brand/` to `studio/static/`.
2. **Theme** (`studio/theme.ts`): dark scheme by default, Webflow-blue accent (`--wf-*` values from `custom.scss`) via `buildLegacyTheme` from `sanity`. Aim for "feels like the old dashboard", not pixel parity.
3. **Overview / dashboard home** (`studio/components/DashboardHome.tsx`): a custom Structure pane (first item in desk) or a `tools` entry showing: welcome by `currentUser.name`, counts (new inquiries, live equipment, hidden equipment, gallery items) via `useClient` + GROQ `count()`, and quick-action buttons (New equipment, New gallery item, Open Inbox) using `useRouter`/intent links. Same copy as the Payload `DashboardHome`.
4. **List previews** replace `CategoryCell` and `StatusCell` (done in 2.3).
5. **Workflow copy**: Sanity has **drafts**. Tim must press **Publish**, not Save. Add a short `description` at the top of each singleton and in the Overview pane: "Changes go live when you press Publish."
6. Deploy: `pnpm studio:deploy` → `https://evo-live-pro.sanity.studio`. Add that origin is auto-allowed; confirm.
7. `/admin` redirect in the Next app: `next.config.ts` `redirects()` → `{ source: '/admin/:path*', destination: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL, permanent: false }`. Add this in Phase 7 (while Payload still serves `/admin`, it would conflict).

### Acceptance

- Tim-level walkthrough of every row in the README "Where do I go to change…?" table works in the deployed Studio.

---

## 7. Cutover and Payload removal

### 7.1 Cutover (production)

1. Freeze edits in Payload (tell Tim). Tag current main/feature head: `git tag payload-final`.
2. Run `migrate-from-payload.ts` against **`production`** dataset. Reconciliation must be green.
3. Set production env: `wrangler.jsonc` `vars` (`NEXT_PUBLIC_SANITY_*`), `wrangler secret put SANITY_API_WRITE_TOKEN`, Workers Builds env vars for build-time `NEXT_PUBLIC_*`.
4. Deploy the Sanity version (7.3 must already be merged). Smoke test every page + one real form submission (then mark it Closed).
5. Rollback path: redeploy `payload-final` (D1/R2 are untouched until 7.4).

### 7.2 Delete Payload (same PR as the cutover build, after Phase 4–6 acceptance)

Delete:
- `src/payload.config.ts`, `src/payload-types.ts`, `src/collections/`, `src/globals/`, `src/access/`, `src/fields/`, `src/migrations/`, `src/lib/payload.ts`
- `src/app/(payload)/` (admin, REST, GraphQL routes, `custom.scss`, its `layout.tsx`, `importMap.js`)
- `src/components/admin/` (ported to `studio/components/`)
- `scripts/seed.ts` (ported to `studio/scripts/seed.ts`)
- `tests/helpers/login.ts`, `tests/helpers/seedUser.ts`, `tests/e2e/admin.e2e.spec.ts`, `tests/int/api.int.spec.ts`
- `test.env` if it only exists for Payload

Edit:
- `package.json`: remove `payload`, `@payloadcms/*`, `graphql`, and scripts `deploy:database`, `generate:importmap`, `generate:types:payload`, `payload`, `seed`, `devsafe` (keep if still useful). `deploy` becomes `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. `generate:types` → `wrangler types … && pnpm typegen`. Update `description`. Remove the `cloudflare.bindings.PAYLOAD_SECRET` block. Re-check whether `--max-old-space-size=8000` is still needed.
- `next.config.ts`: drop `withPayload`, `serverExternalPackages: ['jose', 'pg-cloudflare']`, the webpack `extensionAlias` block, and `localPatterns` for `/api/media/file/**`. Re-test whether `next build --webpack` is still required or Turbopack works (read the Next docs in `node_modules`). Add the `/admin` redirect.
- `tsconfig.json`: remove the `@payload-config` path alias.
- `wrangler.jsonc`: remove `d1_databases` and `r2_buckets` bindings (unless reused for OpenNext caching in Phase 8), add `vars`. Keep `nodejs_compat`, `global_fetch_strictly_public`, assets.
- Run `pnpm generate:types:cloudflare` to regenerate `cloudflare-env.d.ts`.
- `.env.example`: remove `PAYLOAD_SECRET`; keep `NODE_OPTIONS` only if still needed.
- `eslint.config.mjs`: remove Payload-specific ignores; try to fix the known "circular structure" lint crash now that Payload's config is gone.
- `vitest.config.mts` / `vitest.setup.ts`: remove Payload setup.
- `wrangler secret delete PAYLOAD_SECRET` (human step, after rollback window).

Verify with `rg -i "payload" --glob '!docs/**' --glob '!pnpm-lock.yaml'` → only intentional mentions (e.g. migration script, README history note).

### 7.3 Tests

- `tests/int/queries.int.spec.ts` (Vitest): against `development`, assert each page query returns the expected shape (non-null singletons after seed, equipment items have `name`, `priceLabel`, `category`).
- `tests/int/inquiry-route.int.spec.ts`: call the route handler function directly with a mocked write client: honeypot, validation, success, Sanity failure → 502.
- `tests/int/privacy.int.spec.ts`: anonymous query for `*[_type == "inquiry"]` returns `[]` on `development` (skip if no network; never skip in CI).
- `tests/e2e/frontend.e2e.spec.ts`: keep the homepage test; add rentals (an item from seed visible, "+ Quote" adds to cart, cart reaches contact form), events (wedding packages visible), contact form submit (against `development`, then clean up by deleting docs whose `name` starts with `e2e-`).
- Remove admin e2e (Studio is a separate hosted app; optional: one smoke test that `/admin` redirects to the Studio URL).
- Run Playwright with `--trace off`.

### 7.4 Decommission (human-approved, ≥ 30 days after cutover)

- Export D1 (`wrangler d1 export evo-live-pro-website --remote --output payload-final.sql`) and archive R2 contents somewhere durable, then delete the D1 database and R2 bucket. **Ask the user before deleting.**

---

## 8. Optional follow-ups (separate PRs, not required for parity)

1. **Instant updates + caching:** `defineLive` / `<SanityLive />` from `next-sanity` with tag-based revalidation, replacing `force-dynamic`. On OpenNext this needs a working Next data cache: configure `open-next.config.ts` with the R2 incremental cache (`NEXT_INC_CACHE_R2_BUCKET`, can reuse the existing R2 bucket) and a D1 or Durable Object tag cache. Alternatively a Sanity GROQ-powered webhook → `/api/revalidate` (secret-checked) calling `revalidateTag`.
2. **Visual editing / Presentation tool:** `presentationTool` in Studio + Next Draft Mode route (`/api/draft-mode/enable` via `defineEnableDraftMode`) + `SANITY_API_READ_TOKEN`. Lets Tim click-to-edit on the live preview.
3. **Email on new inquiry:** Sanity webhook (filter `_type == "inquiry" && delta::operation() == "create"`, projection without heavy fields) → Cloudflare Email Workers or Resend. Or send directly from the route handler after a successful create.
4. **Drag-and-drop ordering** with `@sanity/orderable-document-list` (migrate `sortOrder` → `orderRank`).
5. **Turnstile** on the contact form.
6. Scheduled publishing / content releases if Tim wants to prepare seasonal pricing.

---

## 9. README and docs updates (Phase 7, same PR)

Rewrite the parts of `README.md` that describe Payload, keeping the same friendly tone and structure:

- "The big idea" diagram: website (Cloudflare Worker) ↔ Sanity Content Lake; dashboard = Sanity Studio at `evo-live-pro.sanity.studio` (and `/admin` redirects there). R2/D1 removed from the picture.
- Tool table: replace Payload/D1/R2 rows with **Sanity Studio** (the kitchen), **Content Lake** (the pantry), **Sanity image CDN** (the photo box that also resizes).
- "For Tim and Dom": login is via Sanity (Google/email invite). **Publish, not Save.** Update every row of "Where do I go to change…?" with the new sidebar paths (they should match, since 2.5 mirrors them). Remove "Accounts → Users" row; replace with "Ask SWFT to invite them at sanity.io/manage". Photos: crop/hotspot now works; remove "upload at the exact size" tip.
- Developers: setup (`pnpm install`, `.env` + `studio/.env`, `pnpm studio`, `pnpm dev`, seed), commands table, folder tree, "Collections and globals, explained" → "Documents and singletons", "How a change travels" (Studio → Publish → Content Lake → CDN → page).
- Deploy: env vars, secret, `pnpm studio:deploy`, Workers Builds settings. Remove "production builds need Cloudflare" (no longer true: build no longer touches D1). Update cost section per Phase 0 bundle measurement.
- "Changing what the dashboard can edit": edit schema in `studio/schemaTypes`, `pnpm typegen`, update GROQ query, `pnpm studio:deploy`. **No migrations needed** for additive changes; renames need a content migration (`sanity migration create`).
- Known limits / Troubleshooting: remove PBKDF2, `loadManifest`, `database_id`, seed-already-exists rows; add CORS error, "changes not showing → did you Publish?", "missing NEXT_PUBLIC_SANITY_PROJECT_ID", token 401/403.
- Word list: add Dataset, GROQ, Portable Text, Publish/Draft, Studio, Token; remove Migration (Payload sense), Payload.
- `AGENTS.md`: add one line pointing to `studio/` for schema changes and `pnpm typegen` after edits.

---

## 10. Definition of done

- [ ] Public site on production renders entirely from Sanity `production`; visual diff vs Payload version shows no layout changes.
- [ ] Studio deployed, Tim and Dom invited, every task in the README table works for them.
- [ ] Contact form writes private `inquiry.*` docs; anonymous read returns nothing.
- [ ] All real content and media migrated from live Payload, reconciliation green.
- [ ] No Payload code or dependencies left; D1/R2 bindings removed from `wrangler.jsonc` (resources themselves kept until 7.4).
- [ ] `pnpm exec tsc --noEmit`, `pnpm test:int`, `pnpm test:e2e` pass; `pnpm lint` passes or the remaining failure is documented.
- [ ] README, `.env.example`, `studio/.env.example`, `AGENTS.md` updated.
- [ ] PR description lists installed Sanity/next-sanity versions, Worker bundle size, and the outcome of the Phase 0 spike.

## Suggested commit / PR sequence

1. `chore: scaffold Sanity studio workspace` (Phase 1)
2. `feat(studio): content model mirroring Payload collections and globals` (Phase 2)
3. `feat(studio): seed and Payload export scripts` (Phase 3)
4. `feat: read site content from Sanity` (Phase 4, one commit per page is fine)
5. `feat: contact form writes inquiries to Sanity` (Phase 5)
6. `feat(studio): co-branded theme, overview pane, desk structure polish` (Phase 6)
7. `chore: remove Payload, D1 and R2 bindings; update docs` (Phase 7)

Open one draft PR against `feat/payload-cms` (or `main` once that is merged) and push phases as commits so reviewers can follow along.
