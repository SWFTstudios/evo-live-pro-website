import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { MediaOrPlaceholder } from '@/components/Media'
import { getClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'About us' }

export default async function AboutPage() {
  const payload = await getClient()
  const [page, team] = await Promise.all([
    payload.findGlobal({ slug: 'about-page', depth: 2 }),
    payload.find({ collection: 'team', sort: 'sortOrder', limit: 20, depth: 1 }),
  ])
  const words = (page.threeWords ?? []).map((w) => w.word)

  return (
    <>
      <section className="section">
        <div className="wrap split split--2">
          <div className="stack">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>{page.headline}</h1>
            {page.originStory && (
              <div className="rich">
                <RichText data={page.originStory} />
              </div>
            )}
          </div>
          <div className="stack">
            <div className="card-media" style={{ aspectRatio: '4 / 5' }}>
              <MediaOrPlaceholder media={page.groupPhoto} placeholder="Photo · founders together" />
            </div>
            {page.groupPhotoCaption && <span className="eyebrow">{page.groupPhotoCaption}</span>}
          </div>
        </div>
      </section>

      {team.docs.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{page.crewTitle}</h2>
            </div>
            <div className="grid grid--cards">
              {team.docs.map((person) => (
                <div key={person.id} className="stack">
                  <div className="card-media" style={{ aspectRatio: '4 / 5' }}>
                    <MediaOrPlaceholder media={person.portrait} placeholder={`Portrait · ${person.name}`} />
                  </div>
                  <h3>{person.name}</h3>
                  <span className="eyebrow">{person.jobTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(page.offTheRecord ?? []).length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>{page.offTheRecordTitle}</h2>
            </div>
            {(page.offTheRecord ?? []).map((row) => (
              <div key={row.id ?? row.question} className="qa">
                <span className="eyebrow">{row.question}</span>
                {(row.answers ?? []).map((a) => {
                  const person = typeof a.person === 'object' ? a.person : null
                  return (
                    <p key={a.id ?? a.answer}>
                      <strong style={{ color: 'var(--laser)' }}>{person?.name?.toUpperCase() ?? ''}</strong>{' '}
                      {a.answer}
                    </p>
                  )
                })}
              </div>
            ))}
            {words.length > 0 && (
              <div className="stack" style={{ marginTop: 40 }}>
                <span className="eyebrow">What Evo brings that others don&apos;t, in three words</span>
                <h2>{words.join(' · ')}</h2>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section section--stage">
        <div className="wrap cta-band">
          <h2>Let&apos;s build your night</h2>
          <Link
            href="/contact?type=book"
            className="btn btn--book"
            data-track="cta_click"
            data-track-cta-id="about_book"
            data-track-location="closing"
          >
            Book Evo
          </Link>
        </div>
      </section>
    </>
  )
}
