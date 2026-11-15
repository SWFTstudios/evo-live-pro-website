// The shape every image and video has after the GROQ projections in ./queries.ts.
export type MediaRef = { url?: string | null; alt?: string | null; isVideo?: boolean | null } | null | undefined

export const resolveMedia = (media: MediaRef) => {
  if (!media?.url) return null
  return { url: media.url, alt: media.alt || '', isVideo: Boolean(media.isVideo) }
}
