import Link from 'next/link'
import { MediaOrPlaceholder } from '@/components/Media'
import { getClient, resolveMedia } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getClient()
  const [home, featured, brands] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1 }),
    payload.find({
      collection: 'gallery',
      where: { featuredOnHome: { equals: true } },
      sort: 'sortOrder',
      limit: 8,
      depth: 1,
    }),
    payload.find({ collection: 'brands', sort: 'sortOrder', limit: 60, depth: 1 }),
  ])
  const video = resolveMedia(home.heroVideo)
  const backup = resolveMedia(home.heroImage)

  return (
    <>
      <section className="hero">
        {video ? (
          <video className="hero__media" src={video.url} poster={backup?.url} muted loop playsInline autoPlay aria-hidden="true" />
        ) : backup ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__media" src={backup.url} alt="" />
        ) : null}
        <div className="wrap hero__inner">
          <span className="eyebrow">{home.eyebrow}</span>
          <h1>{home.headline}</h1>
          <p className="lede">{home.subheadline}</p>
          <div className="paths">
            <div className="path">
              <span className="eyebrow">{home.bookLabel}</span>
              <Link href="/contact?type=book" className="btn btn--book">
                {home.bookButton}
              </Link>
            </div>
            <div className="path">
              <span className="eyebrow">{home.rentLabel}</span>
              <Link href="/rentals" className="btn btn--rent">
                {home.rentButton}
              </Link>
            </div>
          </div>
          {home.trustBadges && home.trustBadges.length > 0 && (
            <div className="badges">
              {home.trustBadges.map((b) => (
                <span key={b.id ?? b.text}>{b.text}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{home.whatWeDoTitle}</h2>
            <p className="lede">{home.whatWeDoIntro}</p>
          </div>
          <div className="grid grid--cards">
            {(home.services ?? []).map((service) => (
              <article key={service.id ?? service.title} className="stack">
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

      {featured.docs.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{home.recentSetupsTitle}</h2>
            </div>
            <div className="masonry">
              {featured.docs.map((item) => (
                <Link key={item.id} href="/photos" className={`tile${item.large ? ' tile--large' : ''}`}>
                  <MediaOrPlaceholder media={item.media} placeholder={item.category.replace(/-/g, ' ')} />
                  <span className="tile__caption">
                    <span className="tag">{item.category.replace(/-/g, ' ')}</span>
                    <strong>{item.title}</strong>
                  </span>
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
              <Link href="/photos" className="link-cta">
                View all photos →
              </Link>
              <Link href="/events" className="link-cta">
                See all events →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap grid grid--wide">
          <div className="card">
            <span className="eyebrow">{home.weddingTeaserLabel}</span>
            <span className="price price--book">{home.weddingTeaserPrice}</span>
            <p className="muted">{home.weddingTeaserText}</p>
            <Link href="/events#packages" className="link-cta">
              {home.weddingTeaserButton}
            </Link>
          </div>
          <div className="card">
            <span className="eyebrow">{home.soundTeaserLabel}</span>
            <span className="price price--rent">{home.soundTeaserPrice}</span>
            <p className="muted">{home.soundTeaserText}</p>
            <Link href="/rentals" className="link-cta link-cta--rent">
              {home.soundTeaserButton}
            </Link>
          </div>
        </div>
      </section>

      {brands.docs.length > 0 && (
        <section id="partners" className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{home.brandsTitle}</h2>
            </div>
            <div className="brand-grid">
              {brands.docs.map((brand) => {
                const logo = resolveMedia(brand.logo)
                return (
                  <div key={brand.id} className="brand">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo.url} alt={brand.name} loading="lazy" />
                    ) : (
                      brand.name
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
