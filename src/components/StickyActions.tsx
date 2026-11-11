'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { readQuote, subscribeQuote } from '@/lib/quote'

const getSnapshot = () => String(readQuote().length)

export function StickyActions({ phone, bookLabel, rentLabel }: { phone?: string | null; bookLabel: string; rentLabel: string }) {
  const pathname = usePathname()
  const count = Number(useSyncExternalStore(subscribeQuote, getSnapshot, () => '0'))
  if (pathname.startsWith('/contact')) return null
  const tel = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null

  return (
    <nav className="sticky-actions" aria-label="Quick actions">
      <Link
        href="/contact?type=book"
        className="btn btn--book"
        data-track="cta_click"
        data-track-cta-id="sticky_book"
        data-track-location="sticky_bar"
      >
        {bookLabel}
      </Link>
      <Link
        href={count > 0 ? '/contact?type=rent' : '/rentals'}
        className="btn btn--rent"
        data-track="cta_click"
        data-track-cta-id={count > 0 ? 'sticky_quote' : 'sticky_rent'}
        data-track-location="sticky_bar"
      >
        {count > 0 ? `Quote (${count})` : rentLabel}
      </Link>
      {tel && (
        <a href={tel} className="btn btn--outline sticky-actions__call" aria-label={`Call ${phone}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />
          </svg>
        </a>
      )}
    </nav>
  )
}
