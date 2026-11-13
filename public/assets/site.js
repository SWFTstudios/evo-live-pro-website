// Evo Live Pro: shared behavior.
// Menu, search, dialogs (focus handling), phone keyboard sizing, animation pause,
// language picker and forms.
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var onHome = !!document.getElementById('hero');
  var home = onHome ? '' : '/';
  var reduced = function () { return root.classList.contains('motion-off'); };

  // ---------- Animation pause (WCAG 2.2.2) ----------
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var applyMotion = function (off) {
    root.classList.toggle('motion-off', off);
    $$('[data-toggle-motion]').forEach(function (b) {
      b.setAttribute('aria-pressed', off ? 'true' : 'false');
      var l = $('.motion-label', b); if (l) l.textContent = off ? 'Play animations' : 'Pause animations';
    });
    $$('video').forEach(function (v) {
      if (off) { v.removeAttribute('autoplay'); v.pause(); }
      else { var p = v.play && v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  };
  var savedMotion = store.get('evo-motion');
  applyMotion(savedMotion ? savedMotion === 'off' : mq.matches);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle-motion]');
    if (!b) return;
    var off = !root.classList.contains('motion-off');
    store.set('evo-motion', off ? 'off' : 'on');
    applyMotion(off);
  });

  // ---------- Visible viewport + on-screen keyboard ----------
  // Overlays are sized to the part of the screen that is actually visible, so
  // nothing hides behind the keyboard. Floating bars step aside while typing.
  var kbSignal = false, kbFocus = false;
  var coarse = window.matchMedia('(pointer: coarse)');
  var TEXT = /^(text|search|email|tel|url|number|password)$/i;
  var isText = function (el) { return !!el && ((el.tagName === 'INPUT' && TEXT.test(el.type || 'text')) || el.tagName === 'TEXTAREA'); };
  var vv = function () {
    var v = window.visualViewport;
    var h = v ? v.height : window.innerHeight;
    root.style.setProperty('--vvh', Math.round(h) + 'px');
    root.style.setProperty('--vvt', Math.round(v ? v.offsetTop : 0) + 'px');
    kbSignal = (window.innerHeight - h) > 120;
    root.classList.toggle('kbd', kbSignal || kbFocus);
  };
  if (window.visualViewport) { visualViewport.addEventListener('resize', vv); visualViewport.addEventListener('scroll', vv); }
  window.addEventListener('resize', vv);
  vv();
  document.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!coarse.matches || !isText(t)) return;
    kbFocus = true; root.classList.add('kbd');
    setTimeout(function () {
      if (document.activeElement === t && t.scrollIntoView) t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    }, 320);
  });
  document.addEventListener('focusout', function () {
    setTimeout(function () { if (!isText(document.activeElement)) { kbFocus = false; vv(); } }, 120);
  });

  // ---------- Dialogs ----------
  var modal = null, lastFocus = null, lockTop = 0;
  var background = function () { return $$('body > :not(.search):not(.menu):not(.sheet-wrap):not(script):not(.wipe)'); };
  var openModal = function (el, opts) {
    opts = opts || {};
    if (modal) closeModal(true);
    modal = el;
    lastFocus = opts.returnTo || document.activeElement;
    el.hidden = false;
    background().forEach(function (n) { n.inert = true; });
    lockTop = window.pageYOffset;
    root.style.setProperty('--lock-top', (-lockTop) + 'px');
    root.classList.add('modal-open');
    var f = opts.focus || $('[data-autofocus]', el) || $('input, button, a[href]', el);
    if (f) f.focus({ preventScroll: true });
  };
  var closeModal = function (silent) {
    if (!modal) return;
    var m = modal; modal = null;
    m.hidden = true;
    background().forEach(function (n) { n.inert = false; });
    root.classList.remove('modal-open');
    window.scrollTo({ top: lockTop, left: 0, behavior: 'instant' });
    if (!silent && lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    m.dispatchEvent(new CustomEvent('evo:closed'));
  };
  window.EvoModal = { open: openModal, close: closeModal, current: function () { return modal; } };
  document.addEventListener('keydown', function (e) {
    if (!modal) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
      .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------- Menu ----------
  var menu = document.getElementById('menu');
  if (menu) {
    menu.addEventListener('evo:closed', function () {
      $$('[data-open-menu]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ---------- Search ----------
  var STATIC = [
    ['DJ', 'Service', 'Open format DJs and MCs', home + '#services', 'dj music mc wedding'],
    ['Production', 'Service', 'Lighting, rigging, line arrays, FX', home + '#services', 'production lighting rigging truss'],
    ['Rentals', 'Service', 'Sound, LED, staging, DJ gear, FX', '/rentals', 'rent rental gear equipment'],
    ['AV installs', 'Service', 'LED walls, displays, playback', home + '#services', 'install av led screens'],
    ['The index', 'Work', 'Every event and the gear behind it', home + '#work', 'work portfolio photos events prom nba club festival wedding'],
    ['Tim & Dom', 'Crew', 'Liner notes on the founders', home + '#crew', 'about founders team tim dom'],
    ['Reviews', 'Clients', 'What people said', home + '#reviews', 'reviews testimonials'],
    ['Book your event', 'Contact', 'Date, venue, guests, budget', home + '#book', 'book contact quote price inquiry'],
    ['Call or text', 'Contact', '(201) 913-9558', 'tel:+12019139558', 'phone call text number'],
    ['Email', 'Contact', 'evolivepro@gmail.com', 'mailto:evolivepro@gmail.com', 'email contact message'],
    ['Instagram', 'Social', '@evolivepro', 'https://www.instagram.com/evolivepro/', 'instagram social photos videos'],
    ['Location', 'Contact', 'Lyndhurst, NJ 07071. Serving NJ and NYC', 'https://www.google.com/maps/search/?api=1&query=Lyndhurst%2C+NJ+07071', 'address location lyndhurst new jersey nyc warehouse pickup']
  ];
  var POPULAR = ['DJ', 'Rentals', 'The index', 'Tim & Dom', 'Book your event', 'Call or text'];
  var gearEntries = function () {
    var g = window.EvoGear; if (!g) return [];
    var names = {}; g.CATS.forEach(function (c) { names[c[0]] = c[2]; });
    return g.GEAR.map(function (x) { return [x[0], 'Gear', x[2], '/rentals?q=' + encodeURIComponent(x[0]), x[2] + ' ' + names[x[1]] + ' rent rental']; });
  };
  var CATEGORY = window.EvoGear ? window.EvoGear.CATS.slice(1).map(function (c) { return [c[2], 'Gear', c[3], '/rentals?cat=' + c[0], c[2] + ' ' + c[3]]; }) : [];
  var INDEX = STATIC.concat(CATEGORY, gearEntries());

  var overlay = document.getElementById('search');
  if (overlay) {
    var input = document.getElementById('search-input');
    var list = document.getElementById('search-list');
    var label = document.getElementById('search-label');
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var render = function () {
      var q = input.value.trim().toLowerCase();
      var hits = !q ? STATIC.filter(function (x) { return POPULAR.indexOf(x[0]) !== -1; })
        : INDEX.filter(function (x) { var h = x.join(' ').toLowerCase(); return q.split(/\s+/).every(function (w) { return h.indexOf(w) !== -1; }); });
      var total = hits.length;
      if (q && hits.length > 12) hits = hits.slice(0, 12);
      label.textContent = q ? total + (total === 1 ? ' result' : ' results') + (total > hits.length ? ', showing ' + hits.length : '') : 'Popular';
      list.innerHTML = hits.map(function (x) {
        var ext = /^(https?:|tel:|mailto:)/.test(x[3]);
        return '<a class="result" href="' + esc(x[3]) + '"' + (ext && /^https?:/.test(x[3]) ? ' rel="noopener"' : '') + '><span class="result-t"><b>' + esc(x[0]) + '</b><span>' + esc(x[2]) + '</span></span><span class="result-k">' + esc(x[1]) + '</span></a>';
      }).join('') + (q && !hits.length ? '<p class="result-none">Nothing yet. <a href="' + home + '#book">Ask us about it</a>.</p>' : '');
    };
    overlay.addEventListener('evo:closed', function () { input.value = ''; });
    input.addEventListener('input', render);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target === input) { var first = $('a', list); if (first) { closeModal(true); location.href = first.getAttribute('href'); } }
    });
  }

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-open-menu]'))) {
      e.preventDefault();
      t.setAttribute('aria-expanded', 'true');
      openModal(menu, { returnTo: t });
    } else if ((t = e.target.closest('[data-open-search]'))) {
      e.preventDefault();
      var from = modal === menu ? $('[data-open-menu]') : t;
      openModal(overlay, { focus: $('#search-input'), returnTo: from });
      $('#search-input').dispatchEvent(new Event('input'));
    } else if (e.target.closest('[data-close-search], [data-close-menu]')) {
      closeModal();
    } else if (modal && (modal === menu || modal === overlay) && (t = e.target.closest('a[href]')) && modal.contains(t)) {
      closeModal(true);
    }
  });

  // ---------- Language ----------
  // Visitors who pick a language get a Google Translate version of the page.
  // Browsers' own translate buttons also work: the page declares lang="en" and
  // keeps brand names, phone numbers and emails out of translation.
  var host = location.hostname;
  var translated = /\.translate\.goog$/.test(host);
  var originalUrl = function () {
    var h = host.replace(/\.translate\.goog$/, '').replace(/--/g, '\u0000').replace(/-/g, '.').replace(/\u0000/g, '-');
    var qs = new URLSearchParams(location.search);
    Array.from(qs.keys()).forEach(function (k) { if (k.indexOf('_x_tr_') === 0) qs.delete(k); });
    var s = qs.toString();
    return 'https://' + h + location.pathname + (s ? '?' + s : '') + location.hash;
  };
  var translateUrl = function (lang) {
    var u = new URL(translated ? originalUrl() : location.href);
    var h = u.hostname.replace(/-/g, '--').replace(/\./g, '-') + '.translate.goog';
    var q = new URLSearchParams(u.search);
    q.set('_x_tr_sl', 'en'); q.set('_x_tr_tl', lang); q.set('_x_tr_hl', 'en'); q.set('_x_tr_pto', 'wapp');
    return 'https://' + h + u.pathname + '?' + q.toString() + u.hash;
  };
  var PRIORITY = ['es', 'fr', 'pt', 'it', 'ht', 'zh-CN', 'zh-TW', 'ko', 'ru', 'pl', 'ar', 'hi', 'tl', 'vi', 'uk'];
  var ALL = ('af sq am ar hy az eu be bn bs bg ca ceb zh-CN zh-TW co hr cs da nl eo et tl fi fr fy gl ka de el gu ht ha haw iw hi hmn hu is ig id ga it ja jw kn kk km rw ko ku ky lo la lv lt lb mk mg ms ml mt mi mr mn my ne no or ps fa pl pt pa ro ru sm gd sr st sn sd si sk sl so es su sw sv tg ta tt te th tr tk uk ur ug uz vi cy xh yi yo zu').split(' ');
  var langName = function (code) {
    var map = { 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant', iw: 'he', jw: 'jv' };
    var c = map[code] || code;
    try {
      var nat = new Intl.DisplayNames([c], { type: 'language' }).of(c);
      var en = new Intl.DisplayNames(['en'], { type: 'language' }).of(c);
      return { en: en, label: nat && nat !== en ? nat + ' (' + en + ')' : en };
    } catch (e) { return { en: code, label: code }; }
  };
  var current = translated ? (new URLSearchParams(location.search).get('_x_tr_tl') || '') : '';
  var selects = $$('select[data-lang]');
  if (selects.length) {
    var opt = function (code) { var o = document.createElement('option'); o.value = code; o.textContent = langName(code).label; return o; };
    var rest = ALL.filter(function (c) { return PRIORITY.indexOf(c) === -1; }).sort(function (a, b) { return langName(a).en.localeCompare(langName(b).en); });
    selects.forEach(function (sel) {
      sel.innerHTML = '';
      var en = document.createElement('option'); en.value = ''; en.textContent = translated ? 'English (original)' : 'English'; sel.appendChild(en);
      var g1 = document.createElement('optgroup'); g1.label = 'Popular'; PRIORITY.forEach(function (c) { g1.appendChild(opt(c)); }); sel.appendChild(g1);
      var g2 = document.createElement('optgroup'); g2.label = 'All languages'; rest.forEach(function (c) { g2.appendChild(opt(c)); }); sel.appendChild(g2);
      sel.value = current;
      sel.addEventListener('change', function () { location.href = sel.value ? translateUrl(sel.value) : (translated ? originalUrl() : location.href); });
    });
  }
  if (translated) {
    var bar = document.createElement('div');
    bar.className = 't-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Translation notice');
    bar.innerHTML = '<span>This page is machine translated and may not be exact.</span> <a href="' + originalUrl().replace(/"/g, '&quot;') + '">View the original</a>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // ---------- Forms ----------
  // Until the Stagera integration is connected, a submitted form opens the visitor's
  // email app with every field filled in, addressed to Evo. Set data-endpoint on the
  // form to POST the fields there instead.
  var pretty = function (v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : v;
  };
  window.EvoSend = function (form, subject, extra) {
    var data = new FormData(form);
    var lines = [];
    data.forEach(function (v, k) { if (String(v).trim()) lines.push(k + ': ' + pretty(String(v))); });
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
