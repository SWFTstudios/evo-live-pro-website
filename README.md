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
  assets/morphdom.min.js                    DOM patching used by the runtime
  assets/img/, assets/gear/                 Photos (WebP), hero video and gear cutouts
  preview/                                  Older wireframes, not linked from the site
wrangler.jsonc   Cloudflare Worker config (name: evo-live-pro-website)
```

Each page ships pre-rendered HTML for a fast first paint, plus the design template and
logic, which `evo-dc.js` uses to keep the page live. Pages are generated from the design
canvas files, so edit the design first and rebuild rather than editing the HTML by hand.

## Hosting

The site runs on a Cloudflare Worker named `evo-live-pro-website`, serving `public/` as static assets. Pushes to `main` deploy automatically through Cloudflare Workers Builds once the repo is connected in the dashboard.

## Getting started

```bash
npm install
npm run dev      # local preview at http://localhost:8787
npm run deploy   # manual deploy (needs a Cloudflare login or API token)
```

## Contributing

This repository is maintained by SWFT Studios. Issues and suggestions are welcome.

## License

All rights reserved by Evo Live Pro and SWFT Studios unless a license file says otherwise.
