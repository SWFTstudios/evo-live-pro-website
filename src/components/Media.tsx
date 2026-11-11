import type { MediaRef } from '@/lib/payload'
import { resolveMedia } from '@/lib/payload'

type Props = {
  media: MediaRef
  placeholder: string
  autoPlayVideo?: boolean
}

export function MediaOrPlaceholder({ media, placeholder, autoPlayVideo }: Props) {
  const file = resolveMedia(media)
  if (!file) return <div className="placeholder">{placeholder}</div>
  if (file.isVideo) {
    return <video src={file.url} aria-label={file.alt} muted loop playsInline autoPlay={autoPlayVideo} controls={!autoPlayVideo} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={file.url} alt={file.alt} loading="lazy" />
}
