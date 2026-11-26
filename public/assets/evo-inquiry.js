/* Evo Live Pro: sends the "Tell us about your event" booking form to /api/inquiry, which puts it
   into Stagera as a new inquiry. Used by the page logic on Home and Contact. */
(function () {
  var FIELDS = ['name', 'email', 'phone', 'company', 'event_type', 'event_name', 'start_date', 'end_date',
    'start_time', 'end_time', 'venue', 'venue_address', 'guests', 'budget', 'notes', 'website'];
  var SORRY = 'We couldn\'t send that just now. Please call or text (201) 913-9558, or email evolivepro@gmail.com.';

  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  // One id per form; kept across retries so a resend can't create a second inquiry.
  function Inquiry() { this.id = newId(); this.started = Date.now(); }

  Inquiry.prototype.send = function (form) {
    var data = {}, els = form.elements;
    for (var i = 0; i < FIELDS.length; i++) {
      var el = els.namedItem(FIELDS[i]);
      data[FIELDS[i]] = el ? String(el.value || '') : '';
    }
    data.submission_id = this.id;
    data.elapsed_ms = Date.now() - this.started;
    return fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (j) {
        if (res.ok && j.ok) return { ok: true };
        var errs = j.errors || {}, first = Object.keys(errs)[0];
        if (first) {
          var el = els.namedItem(first);
          if (el && el.focus) el.focus();
          return { ok: false, message: errs[first] };
        }
        return { ok: false, message: j.message || SORRY };
      });
    }, function () { return { ok: false, message: SORRY }; });
  };

  window.EvoInquiry = Inquiry;
})();
