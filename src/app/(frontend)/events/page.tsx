import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaOrPlaceholder } from '@/components/Media'
import { stegaClean } from '@sanity/client/stega'
import { getEventsData } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Events' }

export default async function EventsPage() {
  const { page, services, weddings, alaCarte, venues } = await getEventsData()

  return (
    <>
      <section className="section">
        <div className="wrap stack">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.headline}</h1>
          <p className="lede">{page.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>{page.servicesTitle}</h2>
          </div>
          <div className="grid grid--cards">
            {services.map((service) => (
              <article key={service.id} className="stack">
                <div className="card-media">
                  <MediaOrPlaceholder media={service.image} placeholder={`Photo · ${service.title}`} />
                </div>
                <h3>{service.title}</h3>
                <p className="muted" style={{ fontSize: 15 }}>
                  {service.description}
                </p>
                <Link
                  href={stegaClean(service.ctaLink) || '/contact'}
                  className={`link-cta${stegaClean(service.accent) === 'rent' ? ' link-cta--rent' : ''}`}
                  data-track="cta_click"
                  data-track-cta-id={`events_service_${stegaClean(service.title).toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                  data-track-location="event_services"
                >
                  {service.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {weddings.length > 0 && (
        <section id="packages" className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">{page.weddingEyebrow}</span>
              <h2>{page.weddingTitle}</h2>
              <p className="muted">{page.weddingNote}</p>
            </div>
            <div className="grid grid--cards">
              {weddings.map((tier) => (
                <div key={tier.id} className="card" style={{ background: 'var(--blackout)' }}>
                  <span className="tag">{tier.guestsLabel}</span>
                  <h3>{tier.name}</h3>
                  <span className="price price--book">{tier.priceLabel}</span>
                  <ul className="list-plain">
                    {(tier.includes ?? []).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link
                href="/contact?type=book"
                className="btn btn--book"
                data-track="cta_click"
                data-track-cta-id="events_wedding_check_date"
                data-track-location="wedding_packages"
              >
                {page.weddingButton}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{page.alaCarteEyebrow}</span>
            <h2>{page.alaCarteTitle}</h2>
            <p className="muted">{page.alaCarteNote}</p>
          </div>
          <div className="price-rows">
            {alaCarte.map((row) => (
              <div key={row.id} className="price-row">
                <span>{row.name}</span>
                <span>{row.priceLabel}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link
              href="/rentals"
              className="link-cta link-cta--rent"
              data-track="cta_click"
              data-track-cta-id="events_rent_instead"
              data-track-location="a_la_carte"
            >
              Rent it instead →
            </Link>
          </div>
          {(page.capabilities ?? []).length > 0 && (
            <div className="grid grid--cards" style={{ marginTop: 48 }}>
              {(page.capabilities ?? []).map((cap) => (
                <div key={cap._key} className="card">
                  <span className="price price--book">{cap.letter}</span>
                  <h3>{cap.title}</h3>
                  <p className="muted" style={{ fontSize: 15 }}>
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {venues.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{page.venuesTitle}</h2>
              <p className="muted">{page.venuesNote}</p>
            </div>
            <div className="brand-grid">
              {venues.map((venue) => (
                <div key={venue.id} className="brand">
                  {venue.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap cta-band">
          <h2>{page.closingHeadline}</h2>
          <Link
            href="/contact?type=book"
            className="btn btn--book"
            data-track="cta_click"
            data-track-cta-id="events_closing_book"
            data-track-location="closing"
          >
            {page.closingButton}
          </Link>
        </div>
      </section>
    </>
  )
}
