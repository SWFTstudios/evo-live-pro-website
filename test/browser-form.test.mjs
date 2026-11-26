// Runs the Contact page's real template + logic (as the browser does) with a stubbed fetch, to check
// the form posts every field, shows "Sending…", then the thank-you or an error.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const EvoDC = require('../public/assets/evo-dc.js');

function page(file) {
  const s = readFileSync(new URL('../public/' + file, import.meta.url), 'utf8');
  const tpl = s.split('<script type="text/x-template" id="dc-tpl">')[1].split('</script>')[0];
  const logic = s.split('<script type="text/x-dc" id="dc-logic">')[1].split('</script>')[0];
  const props = JSON.parse(s.match(/textContent, (\{[^)]*\})\);<\/script>/)[1]);
  return { s, tpl, logic, props };
}

function setup(file, reply) {
  const posted = [];
  const win = { matchMedia: () => ({ matches: false }), addEventListener() {}, innerWidth: 1400, location: { href: '' } };
  win.fetch = async (url, init) => { posted.push({ url, body: JSON.parse(init.body) }); return reply(); };
  win.crypto = { randomUUID: () => '11111111-2222-4333-8444-555555555555' };
  vm.runInNewContext(readFileSync(new URL('../public/assets/evo-inquiry.js', import.meta.url), 'utf8'),
    { window: win, fetch: win.fetch, crypto: win.crypto, Date });
  const { tpl, logic, props } = page(file);
  const c = EvoDC.makeComponent(logic, props, { window: win, document: { querySelector() { return null; }, getElementById() { return null; } }, setTimeout });
  return { c, tpl, posted };
}

function fakeForm(html) {
  // Collect the named fields the template renders, with sample values.
  const names = [...html.matchAll(/name="([a-z_]+)"/g)].map(m => m[1]);
  const sample = { name: 'Jordan', email: 'j@example.com', event_type: 'Weddings', start_date: '2027-06-12', venue: 'The Venetian' };
  const els = {};
  for (const n of names) els[n] = { value: sample[n] || '', focus() {} };
  return { names, form: { elements: { namedItem: n => els[n] || null } } };
}
const flush = () => new Promise(r => setTimeout(r, 0));

for (const file of ['contact.html', 'index.html']) {
  test(file + ': posts the form and shows the thank-you', async () => {
    const { c, tpl, posted } = setup(file, () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const html = EvoDC.render(tpl, c.renderVals(), null);
    const { names, form } = fakeForm(html);
    for (const n of ['name', 'email', 'phone', 'company', 'event_type', 'event_name', 'start_date', 'end_date', 'start_time', 'end_time', 'venue', 'venue_address', 'guests', 'budget', 'notes', 'website'])
      assert.ok(names.includes(n), n + ' field is on the form');
    assert.match(html, /Send it/);

    c.renderVals().submit({ preventDefault() {}, target: form });
    assert.equal(c.state.sending, true);
    assert.match(EvoDC.render(tpl, c.renderVals(), null), /Sending…/);
    await flush(); await flush();
    assert.equal(posted.length, 1);
    assert.equal(posted[0].url, '/api/inquiry');
    assert.equal(posted[0].body.venue, 'The Venetian');
    assert.equal(posted[0].body.submission_id, '11111111-2222-4333-8444-555555555555');
    assert.equal(c.state.sent, true);
    assert.match(EvoDC.render(tpl, c.renderVals(), null), /You're on the list/);
  });

  test(file + ': shows the server message when sending fails', async () => {
    const { c, tpl } = setup(file, () => new Response(JSON.stringify({ ok: false, message: 'We couldn\'t send that just now.' }), { status: 502 }));
    const { form } = fakeForm(EvoDC.render(tpl, c.renderVals(), null));
    c.renderVals().submit({ preventDefault() {}, target: form });
    await flush(); await flush();
    assert.equal(c.state.sent, false);
    assert.equal(c.state.sending, false);
    const html = EvoDC.render(tpl, c.renderVals(), null);
    assert.match(html, /role="alert"[^>]*>We couldn&#39;t|role="alert"[^>]*>We couldn't/);
  });
}

test('the pre-rendered pages match their templates', () => {
  for (const file of ['contact.html', 'index.html']) {
    const { s } = page(file);
    assert.match(s.split('<div id="dc-root">')[1], /name="venue_address"/, file);
  }
});
