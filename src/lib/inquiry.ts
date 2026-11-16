// Validation for the contact form and rental quote cart. Pure functions, no I/O, so they are easy to test.

export const MAX_BODY_BYTES = 16 * 1024

const SHORT_FIELDS = [
  'phone',
  'eventType',
  'eventDate',
  'returnDate',
  'venue',
  'guestCount',
  'budget',
  'fulfillment',
] as const
const LONG_FIELDS = ['quoteItems', 'notes'] as const

const SHORT_MAX = 500
const LONG_MAX = 4000
const NAME_MAX = 120
const EMAIL_MAX = 200
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type InquiryInput = {
  kind: 'booking' | 'rental'
  name: string
  email: string
} & Partial<Record<(typeof SHORT_FIELDS)[number] | (typeof LONG_FIELDS)[number], string>>

export type ParseResult =
  | { status: 'ok'; data: InquiryInput }
  | { status: 'spam' }
  | { status: 'invalid'; fields: string[] }

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/**
 * Turns an untrusted request body into a clean inquiry.
 * - A filled-in `website` field is the spam trap (real people never see it): reported as spam so the route
 *   can answer success without storing anything, which tells bots nothing.
 * - Unknown keys are dropped, every value is trimmed and length-limited, empty optionals are omitted.
 */
export const parseInquiry = (body: unknown): ParseResult => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { status: 'invalid', fields: ['body'] }
  const raw = body as Record<string, unknown>

  if (text(raw.website)) return { status: 'spam' }

  const fields: string[] = []
  const kind = raw.kind === 'booking' || raw.kind === 'rental' ? raw.kind : null
  if (!kind) fields.push('kind')

  const name = text(raw.name)
  if (!name || name.length > NAME_MAX) fields.push('name')

  const email = text(raw.email)
  if (!email || email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) fields.push('email')

  const optional: Record<string, string> = {}
  for (const [keys, max] of [
    [SHORT_FIELDS, SHORT_MAX],
    [LONG_FIELDS, LONG_MAX],
  ] as const) {
    for (const key of keys) {
      const value = text(raw[key])
      if (value.length > max) fields.push(key)
      else if (value) optional[key] = value
    }
  }

  if (fields.length > 0 || !kind) return { status: 'invalid', fields }
  return { status: 'ok', data: { kind, name, email, ...optional } }
}
