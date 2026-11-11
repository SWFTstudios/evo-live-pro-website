import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { MediaOrPlaceholder } from '@/components/Media'
import { getClient, getSiteSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Contact us' }

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const payload = await getClient()
  const [page, settings] = await Promise.all([payload.findGlobal({ slug: 'contact-page', depth: 1 }), getSiteSettings()])
  const list = (rows: { value: string }[] | null | undefined) => (rows ?? []).map((r) => r.value)

  return (
    <section className="section">
      <div className="wrap split split--2">
        <div className="stack" style={{ gap: 28 }}>
          <div className="stack">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>{page.headline}</h1>
            <p className="lede">{page.intro}</p>
          </div>
          <ContactForm
            initialMode={type === 'rent' ? 'rent' : 'book'}
            copy={{
              bookTitle: page.bookTitle ?? 'Book Evo',
              bookNote: page.bookNote ?? '',
              rentTitle: page.rentTitle ?? 'Rent equipment',
              rentNote: page.rentNote ?? '',
              success: page.successMessage ?? 'Thanks! We got your request.',
            }}
            eventTypes={list(page.eventTypes)}
            budgets={list(page.budgetRanges)}
            fulfillment={list(page.fulfillmentOptions)}
          />
        </div>
        <aside className="stack" style={{ gap: 24 }}>
          <div className="card-media" style={{ aspectRatio: '4 / 3' }}>
            <MediaOrPlaceholder media={page.sidePhoto} placeholder="Photo · crew at load-in" />
          </div>
          <div className="stack">
            <span className="eyebrow">Call or text</span>
            <a href={`tel:${(settings.phone ?? '').replace(/[^\d+]/g, '')}`} className="price">
              {settings.phone}
            </a>
            <span className="eyebrow">Email</span>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <span className="eyebrow">Based in</span>
            <span>{settings.location}</span>
            <span className="eyebrow">Instagram</span>
            <a href={settings.instagramUrl ?? '#'} target="_blank" rel="noopener noreferrer">
              {settings.instagramHandle}
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
