'use client'

import { useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { track } from '@/lib/analytics'
import { readQuote, subscribeQuote, writeQuote } from '@/lib/quote'

type Props = {
  initialMode: 'book' | 'rent'
  copy: { bookTitle: string; bookNote: string; rentTitle: string; rentNote: string; success: string }
  eventTypes: string[]
  budgets: string[]
  fulfillment: string[]
  instagram?: { url: string; handle: string } | null
}

const getSnapshot = () => JSON.stringify(readQuote())
const getServerSnapshot = () => '[]'

export function ContactForm({ initialMode, copy, eventTypes, budgets, fulfillment, instagram }: Props) {
  const [mode, setMode] = useState<'book' | 'rent'>(initialMode)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const snapshot = useSyncExternalStore(subscribeQuote, getSnapshot, getServerSnapshot)
  const cart = useMemo(() => JSON.parse(snapshot) as string[], [snapshot])
  const book = mode === 'book'
  const started = useRef(false)

  const onFirstInput = () => {
    if (started.current) return
    started.current = true
    track('form_start', { form_type: book ? 'booking' : 'rental' })
  }

  const switchMode = (next: 'book' | 'rent') => {
    if (next === mode) return
    setMode(next)
    track('select_inquiry_type', { form_type: next === 'book' ? 'booking' : 'rental' })
  }

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
      // No personal details in analytics: only the shape of the request.
      track('generate_lead', {
        lead_type: book ? 'booking' : 'rental',
        event_type: get('eventType') || undefined,
        budget: get('budget') || undefined,
        fulfillment: get('fulfillment') || undefined,
        item_count: book ? undefined : cart.length,
        has_date: Boolean(get('eventDate')),
      })
      if (!book) writeQuote([])
      setStatus('sent')
    } catch (err) {
      track('form_error', { form_type: book ? 'booking' : 'rental', reason: err instanceof Error ? err.message : 'unknown' })
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="stack" style={{ gap: 20 }}>
        <div className="notice" role="status">
          <strong>{copy.success}</strong>
        </div>
        <div className="card">
          <span className="eyebrow">What happens next</span>
          <ol className="next-steps">
            <li>We check the date and the gear against our calendar.</li>
            <li>We reply with a plan and a price, usually within one business day.</li>
            <li>You lock it in, and we handle load-in, the show and breakdown.</li>
          </ol>
        </div>
        {instagram && (
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-cta"
            data-track="cta_click"
            data-track-cta-id="post_lead_instagram"
            data-track-location="contact_success"
          >
            While you wait, see recent shows on Instagram {instagram.handle} →
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} onInput={onFirstInput} onChange={onFirstInput} className="stack" style={{ gap: 20 }}>
      <div className="grid grid--cards" role="group" aria-label="What do you need?">
        <button type="button" className="choice choice--book" aria-pressed={book} onClick={() => switchMode('book')}>
          <span className="tag" style={{ color: 'inherit' }}>Hire the crew</span>
          <h3>{copy.bookTitle}</h3>
          <span>{copy.bookNote}</span>
        </button>
        <button type="button" className="choice choice--rent" aria-pressed={!book} onClick={() => switchMode('rent')}>
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
