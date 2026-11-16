import type { Metadata } from 'next'
import Link from 'next/link'
import { PhotoGallery } from '@/components/PhotoGallery'
import { getPhotosData } from '@/lib/content'
import { resolveMedia } from '@/sanity/media'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Photos & video' }

export default async function PhotosPage() {
  const { gallery, settings } = await getPhotosData()

  const items = gallery.map((doc) => {
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
            <Link
              href="/contact?type=book"
              className="btn btn--book"
              data-track="cta_click"
              data-track-cta-id="photos_book"
              data-track-location="closing"
            >
              Book Evo
            </Link>
            <Link
              href="/rentals"
              className="btn btn--rent-outline"
              data-track="cta_click"
              data-track-cta-id="photos_rent"
              data-track-location="closing"
            >
              Rent the gear
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
