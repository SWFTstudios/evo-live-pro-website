'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Fades [data-reveal] elements in as they scroll into view. Content is only hidden
// after this runs (html.reveal-ready), so it stays visible if JavaScript fails.
export function Reveal(): null {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
    let observerAlive = false
    const observer = new IntersectionObserver(
      (entries) => {
        observerAlive = true
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    for (const el of items) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) el.classList.add('is-visible')
      else observer.observe(el)
    }
    root.classList.add('reveal-ready')
    // Safety net: if the observer never reports (background tab, odd browser), show everything.
    const fallback = window.setTimeout(() => {
      if (observerAlive) return
      for (const el of items) el.classList.add('is-visible')
    }, 1500)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [pathname])
  return null
}
