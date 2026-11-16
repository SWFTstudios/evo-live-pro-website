'use client'

import { useRouter } from 'next/navigation'
import { useIsPresentationTool } from 'next-sanity/hooks'
import { VisualEditing } from 'next-sanity/visual-editing'

// Only rendered in Draft Mode (see the layout). Turns on click-to-edit overlays, and re-renders the page
// whenever an editor changes something in the Studio, so the preview keeps up as they type.
export function PreviewTools() {
  const router = useRouter()
  const inPresentation = useIsPresentationTool()

  return (
    <>
      <VisualEditing
        refresh={() => {
          router.refresh()
          // Tells the overlay the refresh is under way; it waits before asking for the next one.
          return new Promise<void>((resolve) => setTimeout(resolve, 600))
        }}
      />
      {inPresentation === false && (
        // Someone opened a preview link directly (outside the Studio): give them a way out.
        <a href="/api/draft-mode/disable" className="btn btn--rent preview-exit">
          Exit preview
        </a>
      )}
    </>
  )
}
