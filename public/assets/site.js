// Evo Live Pro: shared behavior (search overlay + forms).
(function () {
  'use strict';
  var onHome = !!document.getElementById('hero');
  var home = onHome ? '' : '/';

  // ---------- Search ----------
  var INDEX = [
    ['DJ', 'Service', 'Open format DJs and MCs', home + '#services', 'dj music mc wedding'],
    ['Production', 'Service', 'Lighting, rigging, line arrays, FX', home + '#services', 'production lighting rigging truss'],
    ['Rentals', 'Service', 'Sound, LED, staging, DJ gear, FX', '/rentals', 'rent rental gear equipment'],
    ['AV installs', 'Service', 'LED walls, displays, playback', home + '#services', 'install av led screens'],
    ['The index', 'Work', 'Every event and the gear behind it', home + '#work', 'work portfolio photos events prom nba club festival wedding'],
    ['Tim & Dom', 'Crew', 'Liner notes on the founders', home + '#crew', 'about founders team tim dom'],
    ['Sound', 'Gear', 'RCF columns, line arrays, tops, subs, mics, mixers', '/rentals?cat=sound', 'speakers rcf evox subs mic microphone audio mixer shure'],
    ['Visuals', 'Gear', 'LED walls and media screens', '/rentals?cat=visuals', 'led wall tv screen video'],
    ['Lighting', 'Gear', 'Moving heads, lasers, uplights, strobes', '/rentals?cat=lighting', 'lights moving head uplight strobe laser hex'],
    ['Staging', 'Gear', 'Stage decks, truss, power, cable ramps', '/rentals?cat=staging', 'stage riser truss deck power cable'],
    ['DJ gear', 'Gear', 'CDJs, mixers, booths, facades', '/rentals?cat=dj', 'cdj mixer controller booth facade humpter pioneer alphatheta'],
    ['Special FX', 'Gear', 'Cold sparks, CO2, low fog, haze, photo booth', '/rentals?cat=fx', 'sparks co2 fog haze clouds confetti photo booth'],
    ['Reviews', 'Clients', 'What people said', home + '#reviews', 'reviews testimonials'],
    ['Book', 'Contact', 'Date, venue, guests, budget', home + '#book', 'book contact quote price phone email']
  ];
  var POPULAR = ['DJ', 'The index', 'Special FX', 'Tim & Dom', 'Book'];

  var overlay = document.getElementById('search');
  if (overlay) {
    var input = document.getElementById('search-input');
    var list = document.getElementById('search-list');
    var label = document.getElementById('search-label');
    var lastFocus = null;

    var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var render = function () {
      var q = input.value.trim().toLowerCase();
      var hits = !q ? INDEX.filter(function (x) { return POPULAR.indexOf(x[0]) !== -1; })
        : INDEX.filter(function (x) { var h = x.join(' ').toLowerCase(); return q.split(/\s+/).every(function (w) { return h.indexOf(w) !== -1; }); });
      label.textContent = q ? hits.length + (hits.length === 1 ? ' result' : ' results') : 'Popular';
      list.innerHTML = hits.map(function (x) {
        return '<a class="result" href="' + esc(x[3]) + '"><span class="result-t"><b>' + esc(x[0]) + '</b><span>' + esc(x[2]) + '</span></span><span class="result-k">' + esc(x[1]) + '</span></a>';
      }).join('') + (q && !hits.length ? '<p style="margin:16px 12px;color:#BDBDB8">Nothing yet. <a href="' + home + '#book">Ask us about it</a>.</p>' : '');
    };
    var open = function () {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      render();
      input.focus();
    };
    var close = function () {
      overlay.hidden = true;
      input.value = '';
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-open-search]')) { e.preventDefault(); open(); }
      else if (e.target.closest('[data-close-search]')) close();
      else if (!overlay.hidden && e.target.closest('.result, #search-list a')) close();
    });
    input.addEventListener('input', render);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') { var first = list.querySelector('a'); if (first) { close(); location.href = first.getAttribute('href'); } }
    });
    window.EvoSearch = { open: open, close: close };
  }

  // ---------- Forms ----------
  // Until the Stagera integration is connected, a submitted form opens the visitor's
  // email app with every field filled in, addressed to Evo. Set data-endpoint on the
  // form to POST the fields there instead.
  window.EvoSend = function (form, subject, extra) {
    var data = new FormData(form);
    var lines = [];
    data.forEach(function (v, k) { if (String(v).trim()) lines.push(k + ': ' + v); });
    if (extra) lines = lines.concat(extra);
    var endpoint = form.getAttribute('data-endpoint');
    if (endpoint) {
      return fetch(endpoint, { method: 'POST', body: data }).then(function (r) { if (!r.ok) throw new Error('send failed'); });
    }
    location.href = 'mailto:evolivepro@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    return Promise.resolve();
  };

  var book = document.getElementById('book-form');
  if (book) {
    book.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (book.querySelector('[name="Name"]') || {}).value || '';
      window.EvoSend(book, 'Event inquiry' + (name ? ' from ' + name : '')).then(function () {
        book.hidden = true;
        var sent = document.getElementById('book-sent');
        sent.hidden = false;
        sent.setAttribute('tabindex', '-1');
        sent.focus();
      });
    });
  }
})();
