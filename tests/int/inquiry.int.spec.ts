import { describe, expect, it } from 'vitest'
import { parseInquiry } from '@/lib/inquiry'

const valid = { kind: 'booking', name: ' Pat Smith ', email: 'pat@example.com' }

describe('parseInquiry', () => {
  it('accepts a minimal booking and trims values', () => {
    const result = parseInquiry({ ...valid, phone: ' 555-0100 ', notes: '' })
    expect(result).toEqual({
      status: 'ok',
      data: { kind: 'booking', name: 'Pat Smith', email: 'pat@example.com', phone: '555-0100' },
    })
  })

  it('keeps rental quote items and drops unknown keys', () => {
    const result = parseInquiry({ ...valid, kind: 'rental', quoteItems: 'RCF EVOX 12\nCDJ-3000', admin: true, _id: 'x' })
    expect(result.status).toBe('ok')
    if (result.status === 'ok') {
      expect(result.data.quoteItems).toBe('RCF EVOX 12\nCDJ-3000')
      expect(result.data).not.toHaveProperty('admin')
      expect(result.data).not.toHaveProperty('_id')
    }
  })

  it('treats a filled spam-trap field as spam without errors', () => {
    expect(parseInquiry({ ...valid, website: 'http://spam.example' })).toEqual({ status: 'spam' })
  })

  it('reports every invalid field', () => {
    expect(parseInquiry({ kind: 'nope', name: '', email: 'not-an-email' })).toEqual({
      status: 'invalid',
      fields: ['kind', 'name', 'email'],
    })
  })

  it('rejects over-long values', () => {
    const result = parseInquiry({ ...valid, phone: 'x'.repeat(501), notes: 'y'.repeat(4001) })
    expect(result).toEqual({ status: 'invalid', fields: ['phone', 'notes'] })
  })

  it('rejects bodies that are not objects', () => {
    const bodies: unknown[] = [null, 'text', 5, []]
    for (const body of bodies) expect(parseInquiry(body)).toEqual({ status: 'invalid', fields: ['body'] })
  })

  it('ignores non-string values', () => {
    const result = parseInquiry({ ...valid, phone: 5, notes: { a: 1 } })
    expect(result).toMatchObject({ status: 'ok', data: { kind: 'booking' } })
    if (result.status === 'ok') expect(result.data).not.toHaveProperty('phone')
  })
})
