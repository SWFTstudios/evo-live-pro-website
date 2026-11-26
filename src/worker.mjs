// Cloudflare Worker: serves public/ as static assets and handles the booking form's POST /api/inquiry.
import { handleInquiry } from './inquiry.mjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/inquiry') return handleInquiry(request, env);
    if (url.pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  }
};
