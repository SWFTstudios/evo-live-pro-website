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
public/          Static files served by the Worker (index.html, 404.html)
wrangler.jsonc   Cloudflare Worker config (name: evo-live-pro-website)
```

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
