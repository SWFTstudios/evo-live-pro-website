'use client'

type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// Pushes an event for Google Tag Manager. Safe to call when GTM is not installed.
// Never send names, emails or phone numbers here.
export const track = (event: string, params: Params = {}) => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, page_path: window.location.pathname, ...params })
}
