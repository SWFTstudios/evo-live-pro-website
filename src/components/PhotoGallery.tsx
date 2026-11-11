'use client'

import { useCallback, useEffect, useState } from 'react'
import { track } from '@/lib/analytics'

type Item = {
  id: number
  title: string
  category: string
  large: boolean
  isVideo: boolean
  url: string | null
  fileIsVideo: boolean
  videoUrl: string | null
}

const LABELS: Record<string, string> = {
  weddings: 'Weddings',
  corporate: 'Corporate',
  concerts: 'Concerts',
  'private-parties': 'Private Parties',
  'behind-the-scenes': 'Behind the Scenes',
}

const pretty = (slug: string) => LABELS[slug] ?? slug

function Thumb({ item, big }: { item: Item; big?: boolean }) {
  if (item.url && item.fileIsVideo) {
    return <video src={item.url} muted playsInline controls={big} aria-label={item.title} />
  }
  if (item.url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.url} alt={item.title} loading="lazy" />
  }
  return <div className="placeholder">{item.isVideo ? '▶ Video' : 'Photo'} · {item.title}</div>
}

export function PhotoGallery({ items }: { items: Item[] }) {
  const [tab, setTab] = useState('All')
  const [open, setOpen] = useState<number | null>(null)

  const categories = Array.from(new Set(items.map((i) => i.category)))
  const hasVideo = items.some((i) => i.isVideo)
  const tabs = ['All', ...categories.map(pretty), ...(hasVideo ? ['Video'] : [])]

  const visible = items.filter((item) => {
    if (tab === 'All') return true
    if (tab === 'Video') return item.isVideo
    return pretty(item.category) === tab
  })

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null || visible.length === 0 ? i : (i + dir + visible.length) % visible.length)),
    [visible.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, step])

  if (items.length === 0) {
    return <p className="muted">Photos are coming soon. Check back shortly.</p>
  }

  const current = open !== null ? visible[open] : null

  return (
    <>
      <div className="tabs" role="group" aria-label="Filter by category">
        {tabs.map((name) => (
          <button key={name} type="button" className="tab" aria-pressed={tab === name} onClick={() => { setTab(name); setOpen(null); track('gallery_filter', { category: name }) }}>
            {name}
          </button>
        ))}
      </div>
      <div className="masonry">
        {visible.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`tile${item.large && tab === 'All' ? ' tile--large' : ''}`}
            onClick={() => {
              setOpen(index)
              track('gallery_open', { item_title: item.title, category: pretty(item.category), is_video: item.isVideo })
            }}
            aria-label={`Open ${item.title}`}
          >
            <Thumb item={item} />
            <span className="tile__caption">
              <span className="tag">{item.isVideo ? '▶ Video · ' : ''}{pretty(item.category)}</span>
              <strong>{item.title}</strong>
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
            <span className="eyebrow">{current.title}</span>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close">✕</button>
          </div>
          <div className="lightbox__body" onClick={(e) => e.stopPropagation()}>
            <Thumb item={current} big />
            {current.videoUrl && (
              <p style={{ marginTop: 12, textAlign: 'center' }}>
                <a className="link-cta" href={current.videoUrl} target="_blank" rel="noopener noreferrer">Watch the video →</a>
              </p>
            )}
          </div>
          {visible.length > 1 && (
            <div style={{ position: 'absolute', bottom: 16, display: 'flex', gap: 12 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous">←</button>
              <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next">→</button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
