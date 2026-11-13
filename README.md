# Evo Live Pro Website

Website for Evo Live Pro, an audio-visual and live event production company. Designed and built by [SWFT Studios](https://swftstudios.com).

## Status

Early setup. The site is being built on an open source CMS so the client can edit content without touching code.

## Goals

- Present Evo Live Pro's services, past events and contact options
- Let the client update copy, images and pages through a CMS
- Fast, responsive and accessible on every device

## Project structure

```
public/
  index.html          Home: hero, services, work index, Tim & Dom, spec sheet, reviews, booking
  rentals.html        Rentals catalog with categories, search and a quote cart
  404.html            Not found page
  assets/site.css     Shared styles (design direction "E · Studio")
  assets/site.js      Search overlay and form sending
  assets/home.js      Section tabs, booking bar, work index
  assets/rentals.css  Rentals styles
  assets/rentals.js   Rentals inventory (2026 Master Inventory) and quote cart
  assets/media/       Photos (WebP), hero video, logo
  assets/media/gear/  Rental product photos; mapped to items in assets/gear.js (PHOTOS)
  preview/            Earlier wireframes and motion prototype (noindex)
wrangler.jsonc        Cloudflare Worker config (name: evo-live-pro-website)
```

### Forms

The booking form and the rental quote open the visitor's email app with every field filled in, addressed to evolivepro@gmail.com. Once the Stagera integration is ready, set `data-endpoint` on the form (`#book-form` in `index.html`, `#q-form` in `rentals.html`) to POST the fields there instead.

### Content still needed

- Origin story for the "Liner notes" section and Dom's answers
- Client reviews
- Product photos for rental items (cards show placeholders)
- Rental pricing (cards show "Price on request")

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
