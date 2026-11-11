'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

const contactMethod = (href: string) => {
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('sms:')) return 'text'
  if (href.startsWith('mailto:')) return 'email'
  if (/instagram\.com/i.test(href)) return 'instagram'
  return null
}

// One listener for the whole site. Mark any element with data-track="event_name" and
// optional data-track-* attributes (data-track-cta-id="hero_book" becomes cta_id: "hero_book").
export function TrackClicks(): null {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tagged = target.closest<HTMLElement>('[data-track]')
      if (tagged) {
        const params: Record<string, string> = {}
        for (const [key, value] of Object.entries(tagged.dataset)) {
          if (key.startsWith('track') && key !== 'track' && value) {
            const name = key
              .slice(5)
              .replace(/^[A-Z]/, (c) => c.toLowerCase())
              .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
            params[name] = value
          }
        }
        if (!params.cta_text) params.cta_text = (tagged.textContent || '').trim().slice(0, 60)
        track(tagged.dataset.track!, params)
        return
      }
      const link = target.closest<HTMLAnchorElement>('a[href]')
      const method = link ? contactMethod(link.getAttribute('href') || '') : null
      if (link && method) {
        track('contact_click', { method, location: link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : 'page' })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
