import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaOrPlaceholder } from '@/components/Media'
import { getClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Events' }

export default async function EventsPage() {
  const payload = await getClient()
  const [page, services, weddings, alaCarte, venues] = await Promise.all([
    payload.findGlobal({ slug: 'events-page', depth: 1 }),
    payload.find({ collection: 'event-services', sort: 'sortOrder', limit: 20, depth: 1 }),
    payload.find({ collection: 'wedding-packages', sort: 'sortOrder', limit: 20 }),
    payload.find({ collection: 'a-la-carte', sort: 'sortOrder', limit: 60 }),
    payload.find({ collection: 'venues', sort: 'sortOrder', limit: 60 }),
  ])

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
            {services.docs.map((service) => (
              <article key={service.id} className="stack">
                <div className="card-media">
                  <MediaOrPlaceholder media={service.image} placeholder={`Photo · ${service.title}`} />
                </div>
                <h3>{service.title}</h3>
                <p className="muted" style={{ fontSize: 15 }}>
                  {service.description}
                </p>
                <Link href={service.ctaLink || '/contact'} className={`link-cta${service.accent === 'rent' ? ' link-cta--rent' : ''}`}>
                  {service.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {weddings.docs.length > 0 && (
        <section id="packages" className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">{page.weddingEyebrow}</span>
              <h2>{page.weddingTitle}</h2>
              <p className="muted">{page.weddingNote}</p>
            </div>
            <div className="grid grid--cards">
              {weddings.docs.map((tier) => (
                <div key={tier.id} className="card" style={{ background: 'var(--blackout)' }}>
                  <span className="tag">{tier.guestsLabel}</span>
                  <h3>{tier.name}</h3>
                  <span className="price price--book">{tier.priceLabel}</span>
                  <ul className="list-plain">
                    {(tier.includes ?? []).map((line) => (
                      <li key={line.id ?? line.item}>{line.item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/contact?type=book" className="btn btn--book">
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
            {alaCarte.docs.map((row) => (
              <div key={row.id} className="price-row">
                <span>{row.name}</span>
                <span>{row.priceLabel}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/rentals" className="link-cta link-cta--rent">
              Rent it instead →
            </Link>
          </div>
          {(page.capabilities ?? []).length > 0 && (
            <div className="grid grid--cards" style={{ marginTop: 48 }}>
              {(page.capabilities ?? []).map((cap) => (
                <div key={cap.id ?? cap.letter} className="card">
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

      {venues.docs.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{page.venuesTitle}</h2>
              <p className="muted">{page.venuesNote}</p>
            </div>
            <div className="brand-grid">
              {venues.docs.map((venue) => (
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
          <Link href="/contact?type=book" className="btn btn--book">
            {page.closingButton}
          </Link>
        </div>
      </section>
    </>
  )
}
