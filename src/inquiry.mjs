// Website inquiry -> Stagera. Validates a booking-form submission, then creates the client and an
// inquiry job in Stagera (two calls, in order, each with its own Idempotency-Key derived from the
// submission id so a retried submission replays instead of creating duplicates).

export const EVENT_TYPES = ['Weddings', 'Corporate Events', 'Concerts & Live Events', 'Private Parties', 'Rentals Only'];
export const GUESTS = ['Under 50', '50 to 150', '150 to 300', '300 to 1,000', '1,000+'];
export const BUDGETS = ['Under $2,500', '$2,500 to $5,500', '$5,500 to $8,500', '$8,500 to $12,500', '$12,500+', 'Not sure yet'];
const EVENT_NOUN = {
  'Weddings': 'Wedding',
  'Corporate Events': 'Corporate event',
  'Concerts & Live Events': 'Live event',
  'Private Parties': 'Private party',
  'Rentals Only': 'Rental'
};
export const DEFAULT_BASE = 'https://app.stagera.ai/api/v2';
const MIN_FILL_MS = 2500; // a person can't fill the form faster than this
const LIMITS = { name: 120, email: 200, phone: 40, company: 120, event_name: 160, venue: 200, venue_address: 300, notes: 4000 };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;
const ID_RE = /^[A-Za-z0-9-]{8,64}$/;

function str(v) { return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim() : ''; }
function realDate(s) {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
}

// Returns { ok: true, data } or { ok: false, errors: { field: message } }.
export function validate(body) {
  const errors = {};
  const d = {};
  for (const k of ['name', 'email', 'phone', 'company', 'event_type', 'event_name', 'start_date', 'end_date',
    'start_time', 'end_time', 'venue', 'venue_address', 'guests', 'budget', 'notes']) d[k] = str(body && body[k]);

  if (!d.name) errors.name = 'Add your name.';
  if (!d.email) errors.email = 'Add your email.';
  else if (!EMAIL_RE.test(d.email)) errors.email = 'That email doesn\'t look right.';
  if (d.phone && !/^[0-9+().\-\s]{7,}$/.test(d.phone)) errors.phone = 'That phone number doesn\'t look right.';
  if (d.event_type === 'Rentals only') d.event_type = 'Rentals Only'; // pages cached before the rename
  if (!EVENT_TYPES.includes(d.event_type)) errors.event_type = 'Pick a type of event.';
  if (!d.start_date) errors.start_date = 'Add the date.';
  else if (!realDate(d.start_date)) errors.start_date = 'That date doesn\'t look right.';
  if (d.end_date && !realDate(d.end_date)) errors.end_date = 'That date doesn\'t look right.';
  else if (d.end_date && d.start_date && d.end_date < d.start_date) errors.end_date = 'The end date is before the start date.';
  if (d.start_time && !TIME_RE.test(d.start_time)) errors.start_time = 'That time doesn\'t look right.';
  if (d.end_time && !TIME_RE.test(d.end_time)) errors.end_time = 'That time doesn\'t look right.';
  if (!d.venue) errors.venue = 'Add the venue, or "pickup" for rentals.';
  if (d.guests && !GUESTS.includes(d.guests)) errors.guests = 'Pick a guest amount.';
  if (d.budget && !BUDGETS.includes(d.budget)) errors.budget = 'Pick a budget range.';
  for (const k in LIMITS) if (d[k].length > LIMITS[k]) errors[k] = 'That\'s too long.';

  if (Object.keys(errors).length) return { ok: false, errors };
  if (!d.end_date) d.end_date = d.start_date;
  if (!d.event_name) d.event_name = EVENT_NOUN[d.event_type] + ' for ' + d.name;
  return { ok: true, data: d };
}

// The two Stagera request bodies, built from validated data.
export function stageraBodies(d) {
  const client = { name: d.name, email: d.email, notes: 'Inquiry from the Evo Live Pro website.' };
  if (d.phone) client.phone = d.phone;
  if (d.company) client.company_name = d.company;

  const lines = [];
  if (d.notes) lines.push(d.notes);
  if (d.guests) lines.push('Guests: ' + d.guests);
  if (d.budget) lines.push('Budget: ' + d.budget);
  lines.push('Sent from the website booking form.');
  const event = {
    name: d.event_name,
    start_date: d.start_date,
    end_date: d.end_date,
    venue: d.venue,
    event_type: d.event_type,
    notes: lines.join('\n')
  };
  if (d.start_time) event.event_start_time = d.start_time;
  if (d.end_time) event.event_end_time = d.end_time;
  if (d.venue_address) event.venue_address = d.venue_address;
  return { client, event };
}

function pickId(j) {
  if (!j || typeof j !== 'object') return null;
  return j.id || (j.data && (j.data.id || (j.data.client && j.data.client.id))) || (j.client && j.client.id) || null;
}

class StageraError extends Error {
  constructor(step, status, code, requestId) {
    super('Stagera ' + step + ' failed (' + status + (code ? ' ' + code : '') + ')');
    this.step = step; this.status = status; this.code = code; this.requestId = requestId;
  }
}

async function post(fetchFn, base, key, path, body, idemKey, step) {
  let res;
  try {
    res = await fetchFn(base + path, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Idempotency-Key': idemKey
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000)
    });
  } catch (e) {
    throw new StageraError(step, 0, e && e.name === 'TimeoutError' ? 'timeout' : 'network');
  }
  let j = null;
  try { j = await res.json(); } catch (e) { /* empty or non-JSON body */ }
  if (!res.ok) {
    const err = j && j.error;
    throw new StageraError(step, res.status, err && err.code, err && err.request_id);
  }
  return j;
}

// Creates the client, then the inquiry job. Returns { clientId, eventId }.
export async function createInquiry(d, submissionId, { apiKey, baseUrl = DEFAULT_BASE, fetchFn = fetch }) {
  const base = baseUrl.replace(/\/+$/, '');
  const { client, event } = stageraBodies(d);
  const c = await post(fetchFn, base, apiKey, '/clients', client, 'evo-' + submissionId + '-client', 'client');
  const clientId = pickId(c);
  if (!clientId) throw new StageraError('client', 200, 'no_client_id');
  const e = await post(fetchFn, base, apiKey, '/events', Object.assign({ client_id: clientId }, event), 'evo-' + submissionId + '-event', 'event');
  return { clientId, eventId: pickId(e) };
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

const SORRY = 'We couldn\'t send that just now. Please email evolivepro@gmail.com.';

// POST /api/inquiry
export async function handleInquiry(request, env = {}, { fetchFn = fetch, log = console } = {}) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });

  const origin = request.headers.get('Origin');
  if (origin) {
    let same = false;
    try { same = new URL(origin).host === new URL(request.url).host; } catch (e) { /* bad Origin */ }
    if (!same) return json(403, { ok: false, message: 'Forbidden.' });
  }
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json(415, { ok: false, message: 'Send JSON.' });
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > 20000) return json(413, { ok: false, message: 'That\'s too long.' });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { ok: false, message: 'Bad request.' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { ok: false, message: 'Bad request.' });

  // Spam: a filled honeypot or an instant submit gets a normal-looking success and is dropped.
  if (str(body.website) || (typeof body.elapsed_ms === 'number' && body.elapsed_ms < MIN_FILL_MS)) {
    log.info && log.info('inquiry dropped as spam');
    return json(200, { ok: true });
  }

  const v = validate(body);
  if (!v.ok) return json(422, { ok: false, message: 'Check the highlighted fields.', errors: v.errors });

  if (!env.STAGERA_API_KEY) {
    log.error('inquiry not sent: STAGERA_API_KEY is not set');
    return json(503, { ok: false, message: SORRY });
  }

  const submissionId = ID_RE.test(str(body.submission_id)) ? str(body.submission_id) : crypto.randomUUID();
  try {
    const r = await createInquiry(v.data, submissionId, { apiKey: env.STAGERA_API_KEY, baseUrl: env.STAGERA_API_BASE || DEFAULT_BASE, fetchFn });
    log.info && log.info('inquiry created in Stagera', { eventId: r.eventId });
    return json(200, { ok: true });
  } catch (e) {
    // No personal details in logs: just where it failed and Stagera's code and request id.
    log.error('inquiry failed', { step: e.step, status: e.status, code: e.code, requestId: e.requestId });
    return json(502, { ok: false, message: SORRY });
  }
}
