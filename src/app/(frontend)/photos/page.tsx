import type { Metadata } from 'next'
import Link from 'next/link'
import { PhotoGallery } from '@/components/PhotoGallery'
import { getClient, getSiteSettings, resolveMedia } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Photos & video' }

export default async function PhotosPage() {
  const payload = await getClient()
  const [gallery, settings] = await Promise.all([
    payload.find({ collection: 'gallery', sort: 'sortOrder', limit: 300, depth: 1 }),
    getSiteSettings(),
  ])

  const items = gallery.docs.map((doc) => {
    const file = resolveMedia(doc.media)
    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      large: Boolean(doc.large),
      isVideo: Boolean(doc.isVideo),
      url: file?.url ?? null,
      fileIsVideo: file?.isVideo ?? false,
      videoUrl: doc.videoUrl ?? null,
    }
  })

  return (
    <>
      <section className="section">
        <div className="wrap stack">
          <span className="eyebrow">Photos &amp; video</span>
          <h1>See the work</h1>
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-cta">
              More on Instagram {settings.instagramHandle} →
            </a>
          )}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <PhotoGallery items={items} />
        </div>
      </section>
      <section className="section section--stage">
        <div className="wrap cta-band">
          <h2>Want this at your event?</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/contact?type=book" className="btn btn--book">
              Book Evo
            </Link>
            <Link href="/rentals" className="btn btn--rent-outline">
              Rent the gear
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
