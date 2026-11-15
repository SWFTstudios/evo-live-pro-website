import { MAX_BODY_BYTES, parseInquiry } from '@/lib/inquiry'
import { getWriteClient } from '@/sanity/writeClient'

// The contact form and the rental quote cart post here. Inquiries are stored in Sanity as documents
// with IDs like `inquiry.<uuid>`: IDs containing a dot are not publicly readable, so customer names,
// emails and phone numbers stay private. Only this server route (with a write token) creates them.
//
// Payload still owns /api/[...slug] while it exists, so this lives at /api/inquiry (singular).

export const dynamic = 'force-dynamic'

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status })

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'unsupported_media_type' }, 415)
  }

  // Cheap rejection from the header, then a real check on what was actually read.
  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413)
  const raw = await request.text()
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413)

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'invalid', fields: ['body'] }, 400)
  }

  const result = parseInquiry(body)
  if (result.status === 'invalid') return json({ error: 'invalid', fields: result.fields }, 400)
  // Spam trap: answer success and store nothing, so a bot learns nothing.
  if (result.status === 'spam') return json({ ok: true }, 200)

  const client = getWriteClient()
  if (!client) {
    console.error('inquiry: SANITY_API_WRITE_TOKEN is not set, cannot store the inquiry')
    return json({ error: 'unavailable' }, 503)
  }

  try {
    await client.create({
      _id: `inquiry.${crypto.randomUUID()}`,
      _type: 'inquiry',
      status: 'new',
      submittedAt: new Date().toISOString(),
      ...result.data,
    })
  } catch (error) {
    // Logged for Workers observability. The client never sees Sanity's error text.
    console.error('inquiry: Sanity write failed', error instanceof Error ? error.message : error)
    return json({ error: 'storage_failed' }, 502)
  }

  return json({ ok: true }, 201)
}
