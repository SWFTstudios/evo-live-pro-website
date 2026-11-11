'use client'

const KEY = 'evo-quote'
const EVENT = 'evo-quote-change'

export const readQuote = (): string[] => {
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export const writeQuote = (items: string[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Storage can be blocked (private mode). The cart just won't persist.
  }
  window.dispatchEvent(new Event(EVENT))
}

export const subscribeQuote = (callback: () => void) => {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
