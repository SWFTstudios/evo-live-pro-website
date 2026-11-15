import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaOrPlaceholder } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { getAboutData } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'About us' }

export default async function AboutPage() {
  const { page, team } = await getAboutData()
  const words = page.threeWords ?? []

  return (
    <>
      <section className="section">
        <div className="wrap split split--2">
          <div className="stack">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>{page.headline}</h1>
            {page.originStory && page.originStory.length > 0 && (
              <div className="rich">
                <RichText value={page.originStory} />
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

      {team.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>{page.crewTitle}</h2>
            </div>
            <div className="grid grid--cards">
              {team.map((person) => (
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
              <div key={row._key} className="qa">
                <span className="eyebrow">{row.question}</span>
                {(row.answers ?? []).map((a) => {
                  const person = a.person
                  return (
                    <p key={a._key}>
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
