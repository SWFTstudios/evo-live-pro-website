import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

export function SiteFooter({ settings, logoUrl }: { settings: SiteSetting; logoUrl: string }) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={settings.businessName} style={{ height: 30, width: 'auto' }} />
            <p className="muted" style={{ fontSize: 15, maxWidth: '32ch' }}>
              {settings.footerNote}
            </p>
          </div>
          <div className="footer-col">
            <span className="muted">Pages</span>
            {(settings.navigation ?? []).map((link) => (
              <Link key={link.id ?? link.label} href={link.url}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <span className="muted">Call or text</span>
            {settings.phone && <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>}
            <span className="muted">Email</span>
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            <span className="muted">Based in</span>
            <span>{settings.location}</span>
          </div>
          <div className="footer-col">
            <span className="muted">Follow</span>
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram {settings.instagramHandle}
              </a>
            )}
          </div>
        </div>
        <div className="footer-legal">
          © {year} {settings.copyright}
        </div>
      </div>
    </footer>
  )
}
