import Link from 'next/link'
import { FaqList } from '@/components/FaqList'
import { MediaOrPlaceholder } from '@/components/Media'
import { getClient, getSiteSettings, resolveMedia } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getClient()
  const [home, settings, featured, brands, faqs, testimonials] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1 }),
    getSiteSettings(),
    payload.find({
      collection: 'gallery',
      where: { featuredOnHome: { equals: true } },
      sort: 'sortOrder',
      limit: 8,
      depth: 1,
    }),
    payload.find({ collection: 'brands', sort: 'sortOrder', limit: 60, depth: 1 }),
    payload.find({ collection: 'faqs', where: { published: { equals: true } }, sort: 'sortOrder', limit: 20 }),
    payload.find({
      collection: 'testimonials',
      where: { published: { equals: true } },
      sort: 'sortOrder',
      limit: 6,
      depth: 1,
    }),
  ])
  const video = resolveMedia(home.heroVideo)
  const backup = resolveMedia(home.heroImage)
  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    description: settings.seoDescription ?? undefined,
    url: settings.siteUrl ?? undefined,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    image: resolveMedia(settings.shareImage)?.url,
    address: settings.location
      ? { '@type': 'PostalAddress', addressLocality: 'Lyndhurst', addressRegion: 'NJ', postalCode: '07071', addressCountry: 'US' }
      : undefined,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
    makesOffer: ['DJ services', 'Sound system rental', 'Lighting rental', 'LED video wall rental', 'Event production'].map(
      (name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } }),
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section className="hero">
        {video ? (
          <video className="hero__media" src={video.url} poster={backup?.url} muted loop playsInline autoPlay aria-hidden="true" />
        ) : backup ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__media" src={backup.url} alt="" />
        ) : (
          <div className="hero__beams" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        <div className="wrap hero__inner">
          <span className="eyebrow hero__rise">{home.eyebrow}</span>
          <h1 className="hero__rise hero__rise--2">{home.headline}</h1>
          <p className="lede hero__rise hero__rise--3">{home.subheadline}</p>
          <div className="paths hero__rise hero__rise--4">
            <div className="path path--book">
              <span className="eyebrow">{home.bookLabel}</span>
              <Link
                href="/contact?type=book"
                className="btn btn--book"
                data-track="cta_click"
                data-track-cta-id="hero_book"
                data-track-location="hero"
              >
                {home.bookButton}
              </Link>
            </div>
            <div className="path path--rent">
              <span className="eyebrow">{home.rentLabel}</span>
              <Link
                href="/rentals"
                className="btn btn--rent"
                data-track="cta_click"
                data-track-cta-id="hero_rent"
                data-track-location="hero"
              >
                {home.rentButton}
              </Link>
            </div>
          </div>
          {home.trustBadges && home.trustBadges.length > 0 && (
            <div className="badges hero__rise hero__rise--5">
              {home.trustBadges.map((b) => (
                <span key={b.id ?? b.text}>{b.text}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {brands.docs.length > 0 && (
        <section id="partners" className="marquee" aria-label={home.brandsTitle ?? 'Brands we have produced for'}>
          <span className="marquee__label eyebrow">{home.brandsTitle}</span>
          <div className="marquee__viewport">
            <div className="marquee__track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="marquee__list" aria-hidden={copy === 1 ? true : undefined}>
                  {brands.docs.map((brand) => {
                    const logo = resolveMedia(brand.logo)
                    return (
                      <li key={`${copy}-${brand.id}`} className="marquee__item">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo.url} alt={copy === 0 ? brand.name : ''} loading="lazy" />
                        ) : (
                          brand.name
                        )}
                      </li>
                    )
                  })}
                </ul>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>{home.whatWeDoTitle}</h2>
            <p className="lede">{home.whatWeDoIntro}</p>
          </div>
          <div className="grid grid--cards">
            {(home.services ?? []).map((service, i) => (
              <article key={service.id ?? service.title} className="stack service" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="card-media">
                  <MediaOrPlaceholder media={service.image} placeholder={`Photo · ${service.title}`} />
                </div>
                <h3>{service.title}</h3>
                <p className="muted" style={{ fontSize: 15 }}>
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(home.howSteps ?? []).length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2>{home.howTitle}</h2>
            </div>
            <ol className="steps">
              {(home.howSteps ?? []).map((step, i) => (
                <li key={step.id ?? step.title} className="step" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p className="muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {featured.docs.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2>{home.recentSetupsTitle}</h2>
            </div>
            <div className="masonry" data-reveal>
              {featured.docs.map((item) => (
                <Link
                  key={item.id}
                  href="/photos"
                  className={`tile${item.large ? ' tile--large' : ''}`}
                  data-track="cta_click"
                  data-track-cta-id="home_recent_setup"
                  data-track-location="recent_setups"
                  data-track-cta-text={item.title}
                >
                  <MediaOrPlaceholder media={item.media} placeholder={item.category.replace(/-/g, ' ')} />
                  <span className="tile__caption">
                    <span className="tag">{item.category.replace(/-/g, ' ')}</span>
                    <strong>{item.title}</strong>
                  </span>
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
              <Link href="/photos" className="link-cta" data-track="cta_click" data-track-cta-id="home_all_photos" data-track-location="recent_setups">
                View all photos →
              </Link>
              <Link href="/events" className="link-cta" data-track="cta_click" data-track-cta-id="home_all_events" data-track-location="recent_setups">
                See all events →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section section--stage">
        <div className="wrap grid grid--wide">
          <div className="card card--glow-book" data-reveal style={{ background: 'var(--blackout)' }}>
            <span className="eyebrow">{home.weddingTeaserLabel}</span>
            <span className="price price--book">{home.weddingTeaserPrice}</span>
            <p className="muted">{home.weddingTeaserText}</p>
            <Link
              href="/events#packages"
              className="link-cta"
              data-track="cta_click"
              data-track-cta-id="home_wedding_packages"
              data-track-location="packages_teaser"
            >
              {home.weddingTeaserButton}
            </Link>
          </div>
          <div className="card card--glow-rent" data-reveal style={{ background: 'var(--blackout)', transitionDelay: '90ms' }}>
            <span className="eyebrow">{home.soundTeaserLabel}</span>
            <span className="price price--rent">{home.soundTeaserPrice}</span>
            <p className="muted">{home.soundTeaserText}</p>
            <Link
              href="/rentals"
              className="link-cta link-cta--rent"
              data-track="cta_click"
              data-track-cta-id="home_rental_packages"
              data-track-location="packages_teaser"
            >
              {home.soundTeaserButton}
            </Link>
          </div>
        </div>
      </section>

      {testimonials.docs.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2>{home.testimonialsTitle}</h2>
            </div>
            <div className="grid grid--wide">
              {testimonials.docs.map((t, i) => (
                <figure key={t.id} className="quote" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    {t.eventType && <span className="muted"> · {t.eventType}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.docs.length > 0 && (
        <section className="section">
          <div className="wrap split split--faq">
            <div className="section-head" data-reveal>
              <h2>{home.faqTitle}</h2>
              <p className="muted">
                Still wondering?{' '}
                {tel ? (
                  <a href={tel} className="link-cta">
                    Call or text {settings.phone}
                  </a>
                ) : null}
              </p>
            </div>
            <div data-reveal>
              <FaqList items={faqs.docs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
            </div>
          </div>
        </section>
      )}

      <section className="section closing">
        <div className="wrap closing__inner" data-reveal>
          <h2>{home.closingHeadline}</h2>
          <p className="lede">{home.closingText}</p>
          <div className="closing__actions">
            <Link
              href="/contact?type=book"
              className="btn btn--book"
              data-track="cta_click"
              data-track-cta-id="closing_book"
              data-track-location="closing"
            >
              {settings.bookButtonLabel ?? 'Book Evo'}
            </Link>
            <Link
              href="/rentals"
              className="btn btn--rent"
              data-track="cta_click"
              data-track-cta-id="closing_rent"
              data-track-location="closing"
            >
              {settings.rentButtonLabel ?? 'Rent gear'}
            </Link>
            {tel && (
              <a href={tel} className="link-cta">
                or call {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
