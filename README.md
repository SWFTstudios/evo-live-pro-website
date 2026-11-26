# Evo Live Pro Website

Website for Evo Live Pro, an audio-visual and live event production company. Designed and built by [SWFT Studios](https://swftstudios.com).

## Status

Staging. The site matches the Layout E design: Home, About Us, Rentals, Events, Photos and Contact Us, with the Evo Ember color treatment. A CMS so the client can edit content without touching code is still planned.

## Goals

- Present Evo Live Pro's services, past events and contact options
- Let the client update copy, images and pages through a CMS
- Fast, responsive and accessible on every device

## Project structure

```
public/
  index.html, about.html, rentals.html,
  events.html, photos.html, contact.html   Pages built from the Layout E design
  404.html                                  Not-found page
  assets/evo-dc.js                          Small runtime that keeps each page interactive
                                            (search, rentals quote, filters, forms)
  assets/evo-inquiry.js                     Sends the booking form to /api/inquiry
  assets/morphdom.min.js                    DOM patching used by the runtime
  assets/img/, assets/gear/                 Photos (WebP), hero video and gear cutouts
  preview/                                  Older wireframes, not linked from the site
src/worker.mjs   Worker entry: static pages, plus POST /api/inquiry
src/inquiry.mjs  Booking form -> Stagera (validation, spam checks, the two API calls)
test/            node:test suites (Stagera is mocked; nothing calls the live API)
wrangler.jsonc   Cloudflare Worker config (name: evo-live-pro-website)
```

Each page ships pre-rendered HTML for a fast first paint, plus the design template and
logic, which `evo-dc.js` uses to keep the page live. Pages are generated from the design
canvas files, so edit the design first and rebuild rather than editing the HTML by hand.

## Hosting

The site runs on a Cloudflare Worker named `evo-live-pro-website`, serving `public/` as static assets. Pushes to `main` deploy automatically through Cloudflare Workers Builds once the repo is connected in the dashboard.

## Booking form and Stagera

The "Tell us about your event" form on Home and Contact posts to `/api/inquiry`. The Worker checks
it (required fields, formats, a hidden honeypot field and a minimum fill time), then creates the
client in Stagera with `POST /clients` and an inquiry job with `POST /events`, passing the new
`client_id`. Each call carries an `Idempotency-Key` built from a per-form submission id, so a
resend of the same form can't create a second client or job.

Settings:

- `STAGERA_API_KEY` (secret, needs `clients:write` and `events:write`). Set it with
  `npx wrangler secret put STAGERA_API_KEY` or in the Cloudflare dashboard. Never commit it.
  Without it the form shows a message asking people to call, text or email.
- `STAGERA_API_BASE` (plain var in `wrangler.jsonc`), default `https://app.stagera.ai/api/v2`.

For local testing put `STAGERA_API_KEY=...` in a `.dev.vars` file (git-ignored). Use a
`stg_test_` key so test inquiries don't land in the live pipeline.

## Getting started

```bash
npm install
npm run dev      # local preview at http://localhost:8787
npm test         # form and Stagera handler tests (no network)
npm run deploy   # manual deploy (needs a Cloudflare login or API token)
```

## Contributing

This repository is maintained by SWFT Studios. Issues and suggestions are welcome.

## License

All rights reserved by Evo Live Pro and SWFT Studios unless a license file says otherwise.
