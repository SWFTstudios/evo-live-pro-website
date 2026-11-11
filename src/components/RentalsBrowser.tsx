'use client'

import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'
import { readQuote, subscribeQuote, writeQuote } from '@/lib/quote'

type Item = {
  id: number
  name: string
  category: string
  subcategory: string
  description: string
  priceLabel: string
  imageUrl: string | null
}
type Pack = { id: number; name: string; guests: string; price: string; gear: string }

const getSnapshot = () => JSON.stringify(readQuote())
const getServerSnapshot = () => '[]'

export function RentalsBrowser({ categories, items, packages }: { categories: string[]; items: Item[]; packages: Pack[] }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const snapshot = useSyncExternalStore(subscribeQuote, getSnapshot, getServerSnapshot)
  const cart = useMemo(() => JSON.parse(snapshot) as string[], [snapshot])

  const toggle = (key: string) => {
    const latest = readQuote()
    writeQuote(latest.includes(key) ? latest.filter((x) => x !== key) : [...latest, key])
  }

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return items.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (!needle) return true
      return [item.name, item.subcategory, item.description].some((text) => text.toLowerCase().includes(needle))
    })
  }, [items, category, search])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1)
    return map
  }, [items])

  return (
    <>
      <section className="section">
        <div className="wrap stack">
          <span className="eyebrow">Rentals · For planners, venues, DJs &amp; production teams</span>
          <h1>Show-ready gear</h1>
          <p className="lede">
            RCF audio, AlphaTheta and Pioneer DJ backline, intelligent lighting, LED walls and FX. Add what you need to your
            quote and we will confirm availability, delivery and setup.
          </p>
          <div className="badges">
            <span>Delivery + pickup</span>
            <span>Setup crew available</span>
            <span>Safety certified</span>
          </div>
        </div>
      </section>

      {packages.length > 0 && (
        <section className="section section--stage">
          <div className="wrap">
            <div className="section-head">
              <h2>Sound + DJ packages</h2>
              <span className="eyebrow">Sized by room · Includes setup + breakdown</span>
            </div>
            <div className="grid grid--cards">
              {packages.map((pack) => {
                const key = `${pack.name} Package`
                const on = cart.includes(key)
                return (
                  <div key={pack.id} className="card" style={{ background: 'var(--blackout)' }}>
                    <span className="tag">{pack.guests}</span>
                    <h3>{pack.name}</h3>
                    <span className="price price--rent">{pack.price}</span>
                    <p className="muted" style={{ fontSize: 15 }}>
                      {pack.gear}
                    </p>
                    <button
                      type="button"
                      className={`btn ${on ? 'btn--rent-outline' : 'btn--rent'}`}
                      style={{ marginTop: 'auto' }}
                      aria-pressed={on}
                      onClick={() => toggle(key)}
                    >
                      {on ? 'Added' : '+ Quote'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="catalog">
        <div className="wrap rentals-layout">
          <aside className="sticky stack" aria-label="Categories">
            <span className="eyebrow">Categories</span>
            <div className="cat-list">
              {['All', ...categories].map((name) => (
                <button
                  key={name}
                  type="button"
                  className="cat-btn"
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  <span>{name}</span>
                  <span className="count">{name === 'All' ? items.length : (counts.get(name) ?? 0)}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="stack">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end', justifyContent: 'space-between' }}>
              <h2>{category === 'All' ? 'All equipment' : category}</h2>
              <label className="label" style={{ minWidth: 220 }}>
                Search
                <input
                  className="input"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="CDJ, laser, subwoofer…"
                />
              </label>
            </div>
            {visible.length === 0 ? (
              <p className="muted">Nothing matches that search. Try another word or category.</p>
            ) : (
              <div className="grid grid--cards">
                {visible.map((item) => {
                  const on = cart.includes(item.name)
                  return (
                    <div key={item.id} className="item-card">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" loading="lazy" style={{ aspectRatio: '4 / 3', objectFit: 'contain' }} />
                      )}
                      <span className="tag">{item.subcategory || item.category}</span>
                      <h3>{item.name}</h3>
                      <p className="muted" style={{ fontSize: 14 }}>
                        {item.description}
                      </p>
                      <span className="price price--rent" style={{ fontSize: 17 }}>
                        {item.priceLabel}
                      </span>
                      <button
                        type="button"
                        className={`btn ${on ? 'btn--rent-outline' : 'btn--rent'}`}
                        aria-pressed={on}
                        onClick={() => toggle(item.name)}
                      >
                        {on ? 'Added' : '+ Quote'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="sticky quote-panel" id="quote" aria-live="polite">
            <h3>Your quote</h3>
            {cart.length === 0 ? (
              <p className="muted" style={{ fontSize: 15 }}>
                Nothing added yet. Tap + Quote on any item or package.
              </p>
            ) : (
              <div>
                {cart.map((name) => (
                  <div key={name} className="quote-line">
                    <span>{name}</span>
                    <button type="button" aria-label={`Remove ${name}`} onClick={() => toggle(name)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/contact?type=rent"
              className="btn btn--rent"
              aria-disabled={cart.length === 0}
              style={cart.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            >
              Send quote request
            </Link>
            <span className="eyebrow">Next: pick your rental dates</span>
          </aside>
        </div>
      </section>
    </>
  )
}
