# Evo Live Pro Website

The website for **Evo Live Pro**, a DJ, sound, lighting and LED video company in Lyndhurst, NJ. Designed and built by [SWFT Studios](https://swftstudios.com).

This guide explains how everything works in plain words. You do not need to be a programmer to understand the first half.

**Jump to:**
[The big idea](#the-big-idea) ·
[For Tim and Dom: editing the site](#for-tim-and-dom-editing-the-site) ·
[For developers: running it](#for-developers-running-it-on-your-computer) ·
[Going live](#going-live-checklist) ·
[Changing what can be edited](#changing-what-can-be-edited) ·
[Troubleshooting](#troubleshooting) ·
[Word list](#word-list)

---

## The big idea

Think of a restaurant.

- The **dining room** is what guests see: the tables, the lights, the menu. That is the **website**.
- The **kitchen** is where the staff works. Guests never see it. That is the **Studio**, where you edit.
- The **pantry** is where the ingredients are kept. That is **Sanity's Content Lake**, which stores every word, price and photo.

When Tim changes a price in the kitchen and presses **Publish**, the dining-room menu changes within seconds. Nobody has to write code.

```
   A visitor's phone or laptop              Tim and Dom
              │                                  │
              ▼                                  ▼
   ┌─────────────────────────┐      ┌──────────────────────────────┐
   │  THE WEBSITE            │      │  THE STUDIO                  │
   │  Cloudflare Workers     │      │  evo-live-pro.sanity.studio  │
   │  Home, Rentals, Events, │      │  (also reachable at /admin)  │
   │  Photos, About, Contact │      │  Content · Visual editor     │
   └───────────┬─────────────┘      └──────────────┬───────────────┘
               │   reads published content         │  edits, publishes
               └──────────────┬────────────────────┘
                              ▼
              ┌──────────────────────────────────┐
              │  Sanity                          │
              │  • Content Lake = the pantry     │
              │    (text, prices, inquiries)     │
              │  • Image CDN = the photo box     │
              │    (resizes photos for phones)   │
              └──────────────────────────────────┘
```

### The tools, in kid-friendly terms

| Tool | What it is | The restaurant version |
| --- | --- | --- |
| **Sanity Studio** | The place where you edit the site. Hosted by Sanity at `evo-live-pro.sanity.studio`. | The kitchen |
| **Visual editor** | A tab in the Studio that shows the real website. Click any text or photo on it to change it. | Tasting the dish while you cook |
| **Sanity Content Lake** | Where all the content is stored, with a full history of every change. | The pantry |
| **Next.js** | The tool that builds the pages visitors see. | The dining room |
| **Cloudflare Workers** | The computers that run the website, all over the world, so it loads fast. | The building |
| **GitHub** | Where the code is saved, with a history of every change. | The recipe book |

---

## For Tim and Dom: editing the site

Go to **https://evo-live-pro.sanity.studio** (or add `/admin` to the website address, it sends you there). Log in with the account SWFT Studios invited.

**The rule of the Studio:** change something, then press **Publish** (bottom right). Changes are saved as a *draft* as you type, but **only published changes appear on the website**. A green dot means published; a yellow dot means there is an unpublished draft.

### Two ways to edit

1. **Visual editor (easiest).** Click **Visual editor** at the top. You see the real website. Click any headline, price or photo and an editing panel opens next to it. Your changes show in the preview as you type, then press **Publish**.
2. **Content.** Click **Content** at the top for the lists: Inbox, Rentals, Events & Pricing, Pages & Content, Library. The **Overview** at the top shows new inquiries and shortcuts.

### Where do I go to change...?

| I want to... | Go to (under Content) | What to do |
| --- | --- | --- |
| Change a rental price | **Rentals → Equipment (Inventory)** | Open the item. Change **Price shown on the website**. Publish. |
| Add a new piece of gear | **Rentals → Equipment (Inventory)** | Click the **+** (Create). Fill in the name, pick a category, type a price. Publish. |
| Hide gear we can't rent right now | **Rentals → Equipment (Inventory)** | Open the item and turn off **Available**. Publish. It disappears from the site but is not deleted. **Hidden items** lists everything hidden. |
| Add a picture to a piece of gear | **Rentals → Equipment (Inventory)** | Open the item. Drop a photo on **Image**, type the **Alt text**. Publish. |
| Add or rename a category (like "Lighting") | **Rentals → Equipment Categories** | Add or edit it. **Sort order** controls the order. |
| Change the room-size packages | **Rentals → Sound + DJ Packages** | Edit the name, guest count, price or what's included. |
| Change a wedding package | **Events & Pricing → Wedding Packages** | Edit it. Each line under "What is included" is its own bullet. |
| Change an add-on price | **Events & Pricing → À la carte Pricing** | Edit the price or add a new row. |
| Add photos or videos to the gallery | **Library → Photos & Videos** | Create, upload the photo (or paste a YouTube/Instagram link), pick a category. Turn on **Show in "Recent setups"** to put it on the home page. |
| Change words on a page | **Pages & Content → Home / About / Events / Contact Page**, or the **Visual editor** | Change the text, Publish. |
| Change the phone number, email or menu | **Pages & Content → Site Settings** | Edit the tabs, Publish. It changes on every page. |
| Add a brand to "Brands we've produced for" | **Pages & Content → Brands We Produced For** | Create. A logo is optional. |
| Add a team member | **Pages & Content → Team** | Create. Add a portrait if you have one. |
| Read messages from customers | **Inbox** | Every Contact form and rental quote lands here. Change **Status** (New, In progress, Quoted, Booked, Closed) to keep track. |
| Add someone who can log in | Ask SWFT Studios | People are invited at sanity.io/manage → Members. |

### Tips that save you from headaches

- **Publish.** If the website doesn't show your change, you probably haven't published it.
- **Sort order:** smaller numbers show first. Use 10, 20, 30 so you can squeeze something new between them (like 15).
- **Price boxes are just text.** Type the price exactly how customers should see it: `From $1,200`, `(2) $600`, or `Price on quote`.
- **Photos:** every photo needs a short description in **Alt text** (for example, "DJ booth with two CDJ-3000 players"). It helps blind visitors and Google. Photos are resized automatically for phones, so upload the best quality you have.
- **Videos:** keep uploaded clips short (the 10–15 second hero loop is fine). For longer videos, paste a YouTube or Instagram link instead: uploaded video files are served as plain downloads and use a lot of bandwidth.
- **The red message** under a field means it can't be empty or the value isn't valid.
- **Mistakes can be undone.** Every document has a history (the clock icon). Pick an older version and restore it.
- **Hiding is safer than deleting.** Turn off **Available** (gear) or **Published** (FAQs, testimonials) instead of deleting.
- Pages show **placeholder boxes** (grey stripes with a label) wherever a photo has not been uploaded yet.

---

## For developers: running it on your computer

### What you need first

1. **Node.js** 22.12 or newer.
2. **pnpm**: `corepack enable` (or `npm install -g pnpm`).
3. **Git**, and a Sanity account that is a member of the Evo Live Pro project.

### Setup

```bash
git clone https://github.com/SWFTstudios/evo-live-pro-website.git
cd evo-live-pro-website
pnpm install
cp .env.example .env          # website settings (reads the "development" dataset)
cp studio/.env.example studio/.env
```

For the contact form and the visual editor to work locally, put two tokens in `.env` (create them at [sanity.io/manage](https://www.sanity.io/manage) → Evo Live Pro → API → Tokens):

- `SANITY_API_WRITE_TOKEN`: role **Editor**. Stores inquiries.
- `SANITY_API_READ_TOKEN`: role **Viewer**. Lets the visual editor show drafts.

**Never commit them.** `.env` is ignored by git.

```bash
pnpm dev        # the website at http://localhost:3000
pnpm studio     # the Studio at http://localhost:3333 (in a second terminal)
```

To preview your local website inside the Studio's visual editor, set `SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000` in `studio/.env`.

### Commands you will use

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs the website locally |
| `pnpm studio` | Runs the Studio locally |
| `pnpm seed` | Loads Tim's inventory, prices and page text into the **development** dataset. Safe to run twice. `SEED_RESET=true pnpm seed` wipes and reloads it (never inquiries). |
| `pnpm migrate` | Copies content and photos from the old Payload site into Sanity (see [Going live](#going-live-checklist)) |
| `pnpm typegen` | Regenerates `src/sanity/types.ts` from the schemas |
| `pnpm exec tsc --noEmit` | Checks the code for type mistakes |
| `pnpm lint` | Checks code style |
| `pnpm test` | Unit tests, then browser tests (starts `pnpm dev` itself) |
| `pnpm preview` | Builds for Cloudflare and runs it in Cloudflare's runtime locally |
| `pnpm run deploy` | Builds and publishes the website to Cloudflare |
| `pnpm run upload` | Builds and uploads a new version **without** sending visitors to it (gives a preview URL) |
| `pnpm run upload:test` | Updates the test site (`dev-evo-live-pro-website…workers.dev`), which reads the development dataset |
| `pnpm studio:deploy` | Publishes the Studio to evo-live-pro.sanity.studio |

### What is in the folders

```
evo-live-pro-website/
├── src/                          THE WEBSITE (Next.js)
│   ├── app/(frontend)/           The public pages and their styles
│   ├── app/api/inquiry/          Receives the contact form, stores it in Sanity
│   ├── app/api/draft-mode/       Turns the visual editor's preview on and off
│   ├── components/               Header, footer, rentals browser, form, preview tools...
│   ├── lib/content.ts            Every page's data comes from here
│   ├── lib/inquiry.ts            Checks contact-form input
│   └── sanity/                   Sanity client, GROQ queries, generated types
├── studio/                       THE STUDIO (Sanity)
│   ├── schemaTypes/              What can be edited: documents, singletons, shared fields
│   ├── structure/                The sidebar (Inbox, Rentals, Events & Pricing...)
│   ├── presentation/             Which page shows which document (visual editor)
│   ├── components/               The Overview screen and branding
│   └── scripts/                  Seed and Payload-migration scripts
├── tests/                        Unit tests (tests/int) and browser tests (tests/e2e)
├── public/brand/                 Default logo files
├── public/preview/               The original clickable wireframe shown to Tim. Kept for reference.
├── analytics/                    Google Tag Manager setup
├── docs/sanity-migration-plan.md How the move from Payload to Sanity was done
├── wrangler.jsonc                Cloudflare Worker settings
└── open-next.config.ts           Settings for running Next.js on Cloudflare
```

### Documents and singletons

- A **document type** is a *list* of similar things, like all your equipment. (Payload called these collections.)
- A **singleton** is a *single page of settings*, like the Home Page text. There is only ever one. (Payload called these globals.)

| In the Studio | Type | What it holds |
| --- | --- | --- |
| Inbox | `inquiry` | Contact form and rental quote submissions (private) |
| Equipment Categories | `equipmentCategory` | Groups like Lighting, DJ Equipment |
| Equipment (Inventory) | `equipment` | Each rentable item: name, category, price text, image, available |
| Sound + DJ Packages | `rentalPackage` | Room-sized packages on the Rentals page |
| Wedding Packages | `weddingPackage` | The four wedding tiers |
| À la carte Pricing | `alaCarteItem` | Add-on prices |
| Event Services | `eventService` | Cards on the Events page |
| Team | `teamMember` | People on the About page |
| Brands We Produced For | `brand` | Brand names or logos on the home page |
| Venues We Know | `venue` | Venues on the Events page |
| Testimonials, FAQs | `testimonial`, `faq` | Trust content on the home page |
| Photos & Videos | `galleryItem` | The gallery |
| Home, About, Events, Contact Page | singletons | The words and settings for each page |
| Site Settings | singleton | Phone, email, menu, footer, logos, Google description, tracking |

### How a change travels

1. Tim edits a price in the Studio. It is saved as a **draft** while he types.
2. He presses **Publish**. Sanity stores the new version.
3. A visitor opens the Rentals page. The Worker asks Sanity's CDN for the published content and builds the page.
4. The visitor sees the new price, usually within a few seconds of publishing.

Pages are built fresh for every visitor (`force-dynamic`), reading from Sanity's CDN, which updates within seconds of a publish. If traffic grows, this is the place to add caching.

### The visual editor (how it works)

The Studio's **Visual editor** (Sanity's Presentation tool) loads the website in a frame. It calls `/api/draft-mode/enable` with a one-time secret it stored in Sanity; the site checks the secret with the read token and turns on Next.js **Draft Mode** for that browser only. In Draft Mode the site reads drafts instead of published content and hides invisible markers ("stega") in the text, so clicking text opens the right field. Visitors never get Draft Mode, drafts or the markers.

The markers must not reach links, phone numbers, form options, the quote cart, analytics or `<head>`. `src/lib/content.ts` and a few `stegaClean()` calls in pages clean those values. Analytics (GTM) is switched off in preview.

### The rental quote cart and the contact form

On the Rentals page a visitor taps **+ Quote** on gear. The list is kept in their own browser (`localStorage`, key `evo-quote`) and follows them to the Contact form. The form posts to `/api/inquiry`, which checks every field, then stores the inquiry in Sanity with the write token. It lands in the Studio's **Inbox**.

Inquiry documents have IDs like `inquiry.<random>`. IDs containing a dot are not publicly readable, so customer names, emails and phone numbers stay private even though the content dataset is public.

The form has a hidden "trap" field that real people never see. If a bot fills it in, the site answers "thanks" and stores nothing. For heavier spam, add [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/).

### Who can do what

- **Anyone** can read the published website and send the contact form.
- **Project members** (invited at sanity.io/manage) can log in to the Studio. **Administrators** can also change the Google Tag Manager ID and manage members; **Editors** can edit and publish content.
- Inquiries are only readable with a token or by logged-in members.

---

## Going live (checklist)

The website runs on the Cloudflare Worker `evo-live-pro-website`. These steps take it from the old Payload site to Sanity. They are listed in order.

1. **Tokens.** ✅ *Done (Nov 2026): tokens `website-write` and `website-read` exist and are set as Worker secrets.* To replace them: at sanity.io/manage → API → Tokens, create `website-write` (Editor) and `website-read` (Viewer), then add them to the Worker:
   ```bash
   pnpm wrangler secret put SANITY_API_WRITE_TOKEN
   pnpm wrangler secret put SANITY_API_READ_TOKEN
   ```
2. **CORS.** ✅ *Done for the workers.dev address, the test site and localhost.* When the custom domain is connected, add it at sanity.io/manage → API → CORS origins with **Allow credentials** on.
3. **Move the real content.** While the old Payload site is still live, copy its content and photos into Sanity, first as a test, then for real:
   ```bash
   PAYLOAD_URL=https://evo-live-pro-website.elombe.workers.dev PAYLOAD_EMAIL=... PAYLOAD_PASSWORD=... \
     SANITY_STUDIO_DATASET=development pnpm migrate
   PAYLOAD_URL=... PAYLOAD_EMAIL=... PAYLOAD_PASSWORD=... \
     SANITY_STUDIO_DATASET=production MIGRATE_ALLOW_PRODUCTION=true pnpm migrate
   ```
   The script prints a table comparing counts and stops if anything doesn't match. (Running it against `development` replaces seeded content with the same IDs only; run `SEED_RESET=true pnpm seed` afterwards if you want the seed back.)
4. **Check inquiries are private.** After the migration, this must return `"result":[]` from any computer:
   `curl 'https://ax3lhw5y.apicdn.sanity.io/v2026-11-01/data/query/production?query=*%5B_type%3D%3D%22inquiry%22%5D'`
5. **Point the site at production.** In `wrangler.jsonc`, set `"SANITY_DATASET": "production"`. Commit it.
6. **Deploy.** `pnpm run upload` first to get a preview URL and check it, then `pnpm run deploy`. (If Workers Builds is connected to the repo, set its build command to `pnpm run deploy`. It no longer needs a Cloudflare token or database access at build time.)
7. **Deploy the Studio.** ✅ *Deployed to https://evo-live-pro.sanity.studio.* Redeploy after schema changes with `pnpm studio:deploy`. Invite Tim and Dom at sanity.io/manage → Members.
8. **After 30 days**, once nobody misses the old site: export and delete the old Payload D1 database and R2 bucket (`evo-live-pro-website`) in the Cloudflare dashboard, and delete the `PAYLOAD_SECRET` Worker secret. The `feat/payload-cms` branch keeps the Payload version if you ever need it.

### The test site and the "Test content" workspace

The Studio has two workspaces (switch at the top left):

- **Evo Live Pro**: the real content (`production` dataset). Its visual editor shows the live website.
- **Test content**: seeded sample content (`development` dataset). Its visual editor shows a test version of the website at `https://dev-evo-live-pro-website.elombe.workers.dev`, so you can try things without touching the live site.

The test version is a Cloudflare preview version of the same Worker: it never receives normal visitors. Upload or refresh it with:

```bash
pnpm wrangler login        # once
pnpm run upload:test       # builds, then uploads a preview version with the alias "dev", reading the development dataset
```

### What it costs

The Worker is about 1.5 MB gzipped, under the 3 MB limit of the Cloudflare Workers **Free** plan. The Payload version needed the Paid plan. Sanity's Free plan covers this project; it allows two datasets (`production` and `development`).

---

## Changing what can be edited

Say Tim wants a new field, like "Weight" on equipment.

1. Add the field to `studio/schemaTypes/documents/equipment.ts`:
   ```ts
   defineField({ name: 'weight', title: 'Weight', type: 'string' }),
   ```
2. Add `weight` to the equipment projection in `src/sanity/queries.ts`, and show it in `src/components/RentalsBrowser.tsx`.
3. Run `pnpm typegen`, then `pnpm studio:deploy` so editors see the field.
4. Commit and deploy the website.

Adding fields needs no database migration. Renaming or removing a field that already has content does: write a content migration (`npx sanity migration create`) so old documents follow.

---

## Known limits

- **Crop and hotspot** set on photos in the Studio are not applied on the website yet (images are resized by width only).
- **Preview refreshes the whole page** on each edit, rather than updating live.
- **No emails yet.** New inquiries wait in the Inbox. A good next step is emailing Tim on each new inquiry (a Sanity webhook or the inquiry route could send it).
- **Spam protection is basic** (a hidden trap field). Add Turnstile if spam appears.
- **The seeded About page story is a placeholder.** Fill it in from the Studio.
- **Uploaded video files** are not streamed; keep them short or use YouTube/Instagram links.
- The quote cart is a *request*, not a booking. Prices marked "Price on quote" are confirmed by a person.

---

## Troubleshooting

| What you see | What it probably means | What to do |
| --- | --- | --- |
| A change doesn't show on the website | It is still a draft | Press **Publish** in the Studio |
| The website shows seed or test content | The Worker reads the `development` dataset | Set `SANITY_DATASET` to `production` in `wrangler.jsonc` and deploy |
| The visual editor says it can't connect, or shows a blank frame | The site address isn't allowed, or the read token is missing | Check `SANITY_STUDIO_PREVIEW_ORIGIN`, the CORS origins, and the `SANITY_API_READ_TOKEN` secret |
| `/api/draft-mode/enable` answers 401 | The preview secret was missing, wrong or expired | Open the page from the Studio's Visual editor, not directly |
| The contact form shows an error | `SANITY_API_WRITE_TOKEN` is missing or wrong (the route answers 503 or 502) | Set the secret; check the Worker's logs in the Cloudflare dashboard |
| Pages are empty after deploying | The dataset has no published content yet | Run the migration (or the seed for testing), then publish |
| A CORS error in the browser console | The address isn't in Sanity's CORS origins | Add it at sanity.io/manage → API → CORS origins |
| Types look wrong after a schema change | Generated types are stale | `pnpm typegen` |
| `pnpm migrate` stops with a count mismatch | Something failed or a dataset already had other content | Read the table and warnings; the raw export is in `studio/.migration/` |

---

## Word list

- **Alt text**: a short description of a photo for screen readers and Google.
- **CDN**: copies of the content kept close to visitors so pages load fast.
- **Dataset**: one set of content in Sanity. `production` is the real site; `development` is for testing.
- **Deploy**: publishing your changes so the world can see them.
- **Draft**: a saved change that is not on the website yet.
- **GROQ**: the query language the website uses to ask Sanity for content.
- **Portable Text**: Sanity's format for rich text (bold, links, headings).
- **Publish**: making a draft live on the website.
- **Singleton**: a document there is only ever one of, like Site Settings.
- **Studio**: the editing app at evo-live-pro.sanity.studio.
- **Token**: a secret key that lets the website write inquiries or read drafts. Never share or commit one.
- **Visual editor**: the Studio tab that shows the website and lets you click to edit.
- **Worker**: a small program that runs on Cloudflare's network. The website is one.
- **Wrangler**: Cloudflare's command-line tool.

---

## Contributing

This repository is maintained by SWFT Studios. Issues and suggestions are welcome.

## License

All rights reserved by Evo Live Pro and SWFT Studios unless a license file says otherwise. Sanity, Next.js and the other open-source tools used here keep their own licenses.
