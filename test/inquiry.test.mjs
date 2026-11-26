// Tests for the website -> Stagera inquiry handler. Stagera is mocked; nothing calls the live API.
// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry, validate, stageraBodies } from '../src/inquiry.mjs';
import worker from '../src/worker.mjs';

const SITE = 'https://evolivepro.example';
const good = {
  name: 'Jordan Rivera', email: 'jordan@example.com', phone: '(201) 555-0100', company: 'Rivera Events',
  event_type: 'Weddings', event_name: '', start_date: '2027-06-12', end_date: '',
  start_time: '17:30', end_time: '23:00', venue: 'The Venetian', venue_address: '546 River Dr, Garfield, NJ',
  guests: '150 to 300', budget: '$5,500 to $8,500', notes: 'Cold sparks for the first dance.',
  website: '', submission_id: '3f2a9c4e-1b7d-4e8a-9c3f-2a1b7d4e8a9c', elapsed_ms: 42000
};

function req(body, headers = {}) {
  return new Request(SITE + '/api/inquiry', {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json', Origin: SITE }, headers),
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

// A fake Stagera: records calls and answers from a script of responses.
function fakeStagera(responses) {
  const calls = [];
  const fetchFn = async (url, init) => {
    calls.push({ url, method: init.method, headers: init.headers, body: JSON.parse(init.body) });
    const r = responses[calls.length - 1] || { status: 500, body: {} };
    return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'Content-Type': 'application/json' } });
  };
  return { calls, fetchFn };
}
const ok = () => [
  { status: 201, body: { id: 'c1d2e3f4-0000-4000-8000-000000000001', name: 'Jordan Rivera' } },
  { status: 201, body: { id: 'e1d2e3f4-0000-4000-8000-000000000002', status: 'inquiry' } }
];
const env = { STAGERA_API_KEY: 'stg_test_abc', STAGERA_API_BASE: 'https://stagera.test/api/v2/' };
const quiet = { info() {}, error() {} };

test('creates the client, then the inquiry job with that client', async () => {
  const s = fakeStagera(ok());
  const res = await handleInquiry(req(good), env, { fetchFn: s.fetchFn, log: quiet });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(s.calls.length, 2);

  const [c, e] = s.calls;
  assert.equal(c.url, 'https://stagera.test/api/v2/clients');
  assert.equal(c.method, 'POST');
  assert.equal(c.headers.Authorization, 'Bearer stg_test_abc');
  assert.deepEqual(c.body, {
    name: 'Jordan Rivera', email: 'jordan@example.com', phone: '(201) 555-0100',
    company_name: 'Rivera Events', notes: 'Inquiry from the Evo Live Pro website.'
  });

  assert.equal(e.url, 'https://stagera.test/api/v2/events');
  assert.equal(e.body.client_id, 'c1d2e3f4-0000-4000-8000-000000000001');
  assert.equal(e.body.name, 'Wedding for Jordan Rivera');
  assert.equal(e.body.start_date, '2027-06-12');
  assert.equal(e.body.end_date, '2027-06-12', 'end date defaults to the start date');
  assert.equal(e.body.event_start_time, '17:30');
  assert.equal(e.body.event_end_time, '23:00');
  assert.equal(e.body.venue, 'The Venetian');
  assert.equal(e.body.venue_address, '546 River Dr, Garfield, NJ');
  assert.equal(e.body.event_type, 'Weddings');
  assert.match(e.body.notes, /Cold sparks/);
  assert.match(e.body.notes, /Guests: 150 to 300/);
  assert.match(e.body.notes, /Budget: \$5,500 to \$8,500/);

  assert.equal(c.headers['Idempotency-Key'], 'evo-' + good.submission_id + '-client');
  assert.equal(e.headers['Idempotency-Key'], 'evo-' + good.submission_id + '-event');
});

test('a retried submission sends the same idempotency keys', async () => {
  const a = fakeStagera(ok()), b = fakeStagera(ok());
  await handleInquiry(req(good), env, { fetchFn: a.fetchFn, log: quiet });
  await handleInquiry(req(good), env, { fetchFn: b.fetchFn, log: quiet });
  assert.deepEqual(a.calls.map(c => c.headers['Idempotency-Key']), b.calls.map(c => c.headers['Idempotency-Key']));
});

test('optional fields are left out when empty', async () => {
  const s = fakeStagera(ok());
  const body = Object.assign({}, good, { phone: '', company: '', start_time: '', end_time: '', venue_address: '', guests: '', budget: '', notes: '' });
  await handleInquiry(req(body), env, { fetchFn: s.fetchFn, log: quiet });
  assert.deepEqual(Object.keys(s.calls[0].body).sort(), ['email', 'name', 'notes']);
  for (const k of ['event_start_time', 'event_end_time', 'venue_address']) assert.ok(!(k in s.calls[1].body), k);
});

test('reads a client id nested under data', async () => {
  const s = fakeStagera([{ status: 201, body: { data: { id: 'nested-id-1234' } } }, { status: 201, body: {} }]);
  const res = await handleInquiry(req(good), env, { fetchFn: s.fetchFn, log: quiet });
  assert.equal(res.status, 200);
  assert.equal(s.calls[1].body.client_id, 'nested-id-1234');
});

test('honeypot and instant submits are dropped without calling Stagera', async () => {
  for (const body of [Object.assign({}, good, { website: 'http://spam.example' }), Object.assign({}, good, { elapsed_ms: 400 })]) {
    const s = fakeStagera(ok());
    const res = await handleInquiry(req(body), env, { fetchFn: s.fetchFn, log: quiet });
    assert.equal(res.status, 200);
    assert.equal(s.calls.length, 0);
  }
});

test('invalid submissions get field errors and no Stagera call', async () => {
  const cases = [
    [{ name: '' }, 'name'], [{ email: 'nope' }, 'email'], [{ venue: '' }, 'venue'],
    [{ start_date: '' }, 'start_date'], [{ start_date: '2027-02-30' }, 'start_date'],
    [{ end_date: '2027-06-01' }, 'end_date'], [{ start_time: '25:00' }, 'start_time'],
    [{ event_type: 'Bar mitzvah' }, 'event_type'], [{ budget: '$1' }, 'budget'], [{ notes: 'x'.repeat(4001) }, 'notes']
  ];
  for (const [patch, field] of cases) {
    const s = fakeStagera(ok());
    const res = await handleInquiry(req(Object.assign({}, good, patch)), env, { fetchFn: s.fetchFn, log: quiet });
    assert.equal(res.status, 422, field);
    const j = await res.json();
    assert.ok(j.errors[field], field + ' should be flagged');
    assert.equal(s.calls.length, 0);
  }
});

test('without an API key it says so and calls nothing', async () => {
  const s = fakeStagera(ok());
  const res = await handleInquiry(req(good), {}, { fetchFn: s.fetchFn, log: quiet });
  assert.equal(res.status, 503);
  assert.match((await res.json()).message, /913-9558/);
  assert.equal(s.calls.length, 0);
});

test('a Stagera error returns a friendly 502 and logs no personal details', async () => {
  const logged = [];
  const log = { info() {}, error(...a) { logged.push(JSON.stringify(a)); } };
  const s = fakeStagera([ok()[0], { status: 422, body: { error: { code: 'validation_error', message: 'venue is required', request_id: 'req-123' } } }]);
  const res = await handleInquiry(req(good), env, { fetchFn: s.fetchFn, log });
  assert.equal(res.status, 502);
  assert.match((await res.json()).message, /couldn't send/);
  assert.match(logged.join(' '), /validation_error/);
  assert.match(logged.join(' '), /req-123/);
  assert.doesNotMatch(logged.join(' '), /jordan|Rivera|555/i);
});

test('a client response with no id stops before creating the job', async () => {
  const s = fakeStagera([{ status: 201, body: { ok: true } }]);
  const res = await handleInquiry(req(good), env, { fetchFn: s.fetchFn, log: quiet });
  assert.equal(res.status, 502);
  assert.equal(s.calls.length, 1);
});

test('network failure returns 502', async () => {
  const res = await handleInquiry(req(good), env, { fetchFn: async () => { throw new TypeError('fetch failed'); }, log: quiet });
  assert.equal(res.status, 502);
});

test('rejects cross-site posts, wrong methods and non-JSON', async () => {
  const s = fakeStagera(ok());
  assert.equal((await handleInquiry(req(good, { Origin: 'https://evil.example' }), env, { fetchFn: s.fetchFn, log: quiet })).status, 403);
  assert.equal((await handleInquiry(new Request(SITE + '/api/inquiry'), env, { fetchFn: s.fetchFn, log: quiet })).status, 405);
  assert.equal((await handleInquiry(req('name=x', { 'Content-Type': 'application/x-www-form-urlencoded' }), env, { fetchFn: s.fetchFn, log: quiet })).status, 415);
  assert.equal((await handleInquiry(req('{not json'), env, { fetchFn: s.fetchFn, log: quiet })).status, 400);
  assert.equal(s.calls.length, 0);
});

test('a missing or odd submission id still works with a fresh key', async () => {
  const s = fakeStagera(ok());
  const res = await handleInquiry(req(Object.assign({}, good, { submission_id: '<script>' })), env, { fetchFn: s.fetchFn, log: quiet });
  assert.equal(res.status, 200);
  assert.match(s.calls[0].headers['Idempotency-Key'], /^evo-[0-9a-f-]{36}-client$/);
});

test('validate and stageraBodies fill in the event name and end date', () => {
  const v = validate(Object.assign({}, good, { event_type: 'Rentals only', venue: 'pickup' }));
  assert.ok(v.ok);
  const { event } = stageraBodies(v.data);
  assert.equal(event.name, 'Rental for Jordan Rivera');
  assert.equal(event.end_date, event.start_date);
  const named = validate(Object.assign({}, good, { event_name: "Sofia & Marc's wedding", end_date: '2027-06-13' }));
  assert.equal(stageraBodies(named.data).event.name, "Sofia & Marc's wedding");
  assert.equal(stageraBodies(named.data).event.end_date, '2027-06-13');
});

test('the worker routes /api/inquiry to the handler and everything else to the static site', async () => {
  let served = 0;
  const wenv = { ASSETS: { fetch: async () => { served++; return new Response('page'); } } };
  assert.equal(await (await worker.fetch(new Request(SITE + '/contact'), wenv)).text(), 'page');
  assert.equal((await worker.fetch(new Request(SITE + '/api/nope'), wenv)).status, 404);
  const r = await worker.fetch(req(good), wenv); // no key in this env -> 503 from the handler
  assert.equal(r.status, 503);
  assert.equal(served, 1);
});
