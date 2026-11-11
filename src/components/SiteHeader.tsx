'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { readQuote, subscribeQuote } from '@/lib/quote'

type Props = {
  businessName: string
  logoUrl: string
  links: { label: string; url: string }[]
  bookLabel: string
  rentLabel: string
}

const getSnapshot = () => String(readQuote().length)

export function SiteHeader({ businessName, logoUrl, links, bookLabel, rentLabel }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const count = Number(useSyncExternalStore(subscribeQuote, getSnapshot, () => '0'))

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const rentText = count > 0 ? `Quote (${count})` : rentLabel
  const rentHref = count > 0 ? '/contact?type=rent' : '/rentals'

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link href="/" className="logo" aria-label={`${businessName} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={businessName} />
        </Link>
        <nav className="nav-desktop" aria-label="Main">
          {links.map((link) => (
            <Link key={link.label} href={link.url} aria-current={pathname === link.url ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href={rentHref}
            className="btn btn--rent"
            data-track="cta_click"
            data-track-cta-id={count > 0 ? 'header_quote' : 'header_rent'}
            data-track-location="header"
          >
            {rentText}
          </Link>
          <Link
            href="/contact?type=book"
            className="btn btn--book"
            data-track="cta_click"
            data-track-cta-id="header_book"
            data-track-location="header"
          >
            {bookLabel}
          </Link>
        </div>
        <div className="menu">
          <button
            type="button"
            className="icon-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
          {open && (
            <nav id="mobile-menu" className="menu-panel" aria-label="Main">
              {links.map((link) => (
                <Link key={link.label} href={link.url} className="menu-link">
                  {link.label}
                </Link>
              ))}
              <Link
                href={rentHref}
                className="btn btn--rent"
                data-track="cta_click"
                data-track-cta-id={count > 0 ? 'menu_quote' : 'menu_rent'}
                data-track-location="mobile_menu"
              >
                {rentText}
              </Link>
              <Link
                href="/contact?type=book"
                className="btn btn--book"
                data-track="cta_click"
                data-track-cta-id="menu_book"
                data-track-location="mobile_menu"
              >
                {bookLabel}
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
