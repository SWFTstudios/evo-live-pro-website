'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { readQuote, subscribeQuote, writeQuote } from '@/lib/quote'

type Props = {
  initialMode: 'book' | 'rent'
  copy: { bookTitle: string; bookNote: string; rentTitle: string; rentNote: string; success: string }
  eventTypes: string[]
  budgets: string[]
  fulfillment: string[]
}

const getSnapshot = () => JSON.stringify(readQuote())
const getServerSnapshot = () => '[]'

export function ContactForm({ initialMode, copy, eventTypes, budgets, fulfillment }: Props) {
  const [mode, setMode] = useState<'book' | 'rent'>(initialMode)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const snapshot = useSyncExternalStore(subscribeQuote, getSnapshot, getServerSnapshot)
  const cart = useMemo(() => JSON.parse(snapshot) as string[], [snapshot])
  const book = mode === 'book'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const get = (key: string) => String(form.get(key) ?? '').trim()
    setStatus('sending')
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: book ? 'booking' : 'rental',
          name: get('name'),
          email: get('email'),
          phone: get('phone'),
          eventType: get('eventType'),
          eventDate: get('eventDate'),
          returnDate: get('returnDate'),
          venue: get('venue'),
          guestCount: get('guestCount'),
          budget: get('budget'),
          fulfillment: get('fulfillment'),
          notes: get('notes'),
          quoteItems: book ? '' : cart.join('\n'),
          website: get('website'),
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      if (!book) writeQuote([])
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="notice" role="status">
        <strong>{copy.success}</strong>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 20 }}>
      <div className="grid grid--cards" role="group" aria-label="What do you need?">
        <button type="button" className="choice choice--book" aria-pressed={book} onClick={() => setMode('book')}>
          <span className="tag" style={{ color: 'inherit' }}>Hire the crew</span>
          <h3>{copy.bookTitle}</h3>
          <span>{copy.bookNote}</span>
        </button>
        <button type="button" className="choice choice--rent" aria-pressed={!book} onClick={() => setMode('rent')}>
          <span className="tag" style={{ color: 'inherit' }}>Gear only</span>
          <h3>{copy.rentTitle}</h3>
          <span>{copy.rentNote}</span>
        </button>
      </div>

      {!book && cart.length > 0 && (
        <div className="card">
          <span className="eyebrow">In your quote ({cart.length})</span>
          <ul className="list-plain">
            {cart.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <label className="label">
          Name
          <input className="input" name="name" required autoComplete="name" />
        </label>
        <label className="label">
          Email
          <input className="input" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="label">
          Phone
          <input className="input" name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="label">
          {book ? 'Event date' : 'Pickup date'}
          <input className="input" name="eventDate" type="date" />
        </label>
        {!book && (
          <label className="label">
            Return date
            <input className="input" name="returnDate" type="date" />
          </label>
        )}
        {book ? (
          <>
            <label className="label">
              Venue
              <input className="input" name="venue" />
            </label>
            <label className="label">
              Type of event
              <select className="input" name="eventType" defaultValue="">
                <option value="">Choose one</option>
                {eventTypes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="label">
              Guest count
              <input className="input" name="guestCount" inputMode="numeric" />
            </label>
            <label className="label">
              Budget range
              <select className="input" name="budget" defaultValue="">
                <option value="">Choose one</option>
                {budgets.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="label">
            Pickup or delivery
            <select className="input" name="fulfillment" defaultValue="">
              <option value="">Choose one</option>
              {fulfillment.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <label className="label">
        {book ? 'Tell us the vibe (or which package)' : 'What gear do you need?'}
        <textarea className="input" name="notes" />
      </label>

      <div className="hp" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === 'error' && (
        <div className="notice notice--error" role="alert">
          Something went wrong sending that. Please try again, or call or email us.
        </div>
      )}

      <button type="submit" className={`btn ${book ? 'btn--book' : 'btn--rent'}`} style={{ alignSelf: 'flex-start' }} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : book ? 'Request a booking' : 'Request a rental quote'}
      </button>
    </form>
  )
}
