/* Evo Live Pro: the "Planning something?" pill and the contact form it opens, plus the site search
   that header search buttons marked data-ea-search open (the home page keeps its own search).
   Other scripts can open the contact form with EvoAsk.open({ message: '...' }). */
(function () {
  var EMAIL = 'evolivepro@gmail.com', PHONE = '+12019139558';

  // Everything the site search knows about: [title, kind, description, link, extra keywords]
  var INDEX = [
    ['Home', 'Page', 'DJ, production, rentals and AV installs', '/', 'home evo live pro'],
    ['DJ', 'Service', 'Open format DJs and MCs', '/#services', 'dj music mc wedding'],
    ['Production', 'Service', 'Lighting, rigging, line arrays, FX', '/#services', 'production lighting rigging truss'],
    ['AV installs', 'Service', 'LED walls, displays, playback', '/#services', 'install av led screens'],
    ['The index', 'Work', 'Every event and the gear behind it', '/#work', 'work portfolio events prom nba club festival sweet 16 kearny new year'],
    ['Reviews', 'Clients', 'What people said', '/#reviews', 'reviews testimonials'],
    ['About Us', 'Page', 'Origins, capabilities, Tim & Dom', '/about', 'about founders team tim dom story'],
    ['Tim & Dom', 'Crew', 'The two people behind Evo', '/about#crew', 'crew founders team tim dom'],
    ['Rentals', 'Page', 'Sound, LED, staging, DJ gear and FX to rent', '/rentals', 'rent rental gear equipment'],
    ['Rental catalog', 'Rentals', 'Every piece of gear, with photos', '/rentals#catalog', 'speakers rcf evox subs mic microphone audio led wall tv projector moving head uplight strobe laser cdj mixer booth facade'],
    ['Rental packages', 'Rentals', 'Bundled sound and light kits', '/rentals#packages', 'package bundle kit'],
    ['Rental quote', 'Rentals', 'Build a list and get a quote', '/rentals#quote', 'quote price cost estimate'],
    ['Special FX', 'Gear', 'Cold sparks, CO2, low fog, haze', '/rentals#catalog', 'sparks co2 fog haze clouds'],
    ['Events', 'Page', 'Weddings, corporate, live, private parties', '/events', 'events'],
    ['Weddings', 'Events', 'Ceremony, cocktail hour and reception', '/events#weddings', 'wedding bride ceremony reception first dance'],
    ['Wedding packages', 'Events', 'Packages and pricing', '/events#packages', 'packages pricing price cost'],
    ['À la carte', 'Events', 'Add-ons you can pick one by one', '/events#alacarte', 'add on extras alacarte uplighting photo booth'],
    ['Corporate', 'Events', 'Brand events, activations, conferences', '/events#corporate', 'corporate brand company conference'],
    ['Live events', 'Events', 'Concerts, festivals, town events', '/events#live', 'concert festival stage live town'],
    ['Private parties', 'Events', 'Sweet 16s, proms, birthdays, NYE', '/events#private', 'sweet 16 prom birthday party private'],
    ['Venues', 'Events', 'Where we have worked', '/events#venues', 'venues halls ballroom'],
    ['Photos', 'Page', 'Real Evo setups and behind the scenes', '/photos', 'photos gallery pictures'],
    ['Contact Us', 'Page', 'Phone, email, warehouse, booking form', '/contact', 'contact phone email address lyndhurst'],
    ['Book your date', 'Contact', 'Date, venue, guests, budget', '/contact#book', 'book booking date availability quote price']
  ];
  var POPULAR = ['The index', 'Wedding packages', 'Rental catalog', 'Tim & Dom', 'Book your date'];

  var ICON_CHAT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path></svg>';
  var ICON_X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  // On phones, focusing a field on open pops the keyboard over the form, so only do it with a mouse.
  var FINE = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function buildContact() {
    var pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'ea-pill';
    pill.setAttribute('popovertarget', 'ea-modal');
    pill.setAttribute('aria-haspopup', 'dialog');
    pill.innerHTML = '<span class="ea-dot" aria-hidden="true"></span><span class="ea-pill-text"><b>Planning something?</b><small>Ask Tim &amp; Dom</small></span><span class="ea-pill-go" aria-hidden="true">' + ICON_CHAT + '</span>';

    var m = document.createElement('div');
    m.id = 'ea-modal';
    m.className = 'ea-modal';
    m.setAttribute('popover', '');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'ea-title');
    m.innerHTML =
      '<div class="ea-head"><div><span class="ea-eyebrow">Contact Evo</span><h2 id="ea-title" class="ea-title">Ask Tim &amp; Dom</h2></div>' +
      '<button type="button" class="ea-x" popovertarget="ea-modal" popovertargetaction="hide" aria-label="Close">' + ICON_X + '</button></div>' +
      '<div class="ea-body">' +
      '<p class="ea-lede">A date, a piece of gear, a crazy idea. Write it however you\'d say it. It goes straight to Tim and Dom.</p>' +
      '<form class="ea-form" novalidate>' +
      '<div class="ea-row2"><div class="ea-field"><label for="ea-name">Name</label><input id="ea-name" name="name" autocomplete="name" placeholder="Jordan"></div>' +
      '<div class="ea-field"><label for="ea-from">Email or phone</label><input id="ea-from" name="from" autocomplete="email" placeholder="you@email.com"></div></div>' +
      '<div class="ea-field"><label for="ea-msg">Message</label><textarea id="ea-msg" name="body" required placeholder="Sweet 16 in March, about 150 guests. Can you do DJ, lights and a cold spark entrance?"></textarea></div>' +
      '<button type="submit" class="ea-send">Send message</button>' +
      '<div class="ea-or">or reach us directly</div>' +
      '<div class="ea-quick"><a href="tel:' + PHONE + '">Call</a><a href="sms:' + PHONE + '">Text</a><a href="mailto:' + EMAIL + '">Email</a></div>' +
      '</form></div>';

    document.body.appendChild(pill);
    document.body.appendChild(m);
    var msg = m.querySelector('#ea-msg');

    m.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var body = msg.value.trim(), nm = m.querySelector('#ea-name').value.trim(), from = m.querySelector('#ea-from').value.trim();
      if (!body) { msg.focus(); return; }
      var text = body + ((nm || from) ? '\n\nFrom: ' + [nm, from].filter(Boolean).join(', ') : '') + '\n\nSent from ' + location.href;
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Question from the Evo website') + '&body=' + encodeURIComponent(text);
    });

    var opts = {};
    m.addEventListener('toggle', function (e) {
      var open = e.newState === 'open';
      pill.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        if (opts.message) msg.value = opts.message;
        opts = {};
        m.querySelector('.ea-body').scrollTop = 0;
        if (FINE) setTimeout(function () { msg.focus(); }, 30);
      }
    });

    // Show the pill once the visitor has scrolled a little; hide it near the page's own booking form.
    function onScroll() {
      var book = document.getElementById('book') || document.getElementById('quote');
      var nearForm = book && book.getBoundingClientRect().top < (window.innerHeight || 800) * 0.6 && book.getBoundingClientRect().bottom > 0;
      pill.classList.toggle('is-on', window.scrollY > 160 && !nearForm);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    window.EvoAsk = {
      open: function (o) { opts = o || {}; if (m.matches(':popover-open')) m.hidePopover(); m.showPopover(); }
    };
  }

  function buildSearch() {
    var s = document.createElement('div');
    s.id = 'ea-search';
    s.className = 'ea-search-modal';
    s.setAttribute('popover', '');
    s.setAttribute('role', 'dialog');
    s.setAttribute('aria-modal', 'true');
    s.setAttribute('aria-label', 'Search the site');
    s.innerHTML =
      '<div class="ea-s-wrap"><div class="ea-s-bar">' +
      '<label for="ea-q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search the site</label>' +
      '<input id="ea-q" type="search" autocomplete="off" enterkeyhint="search" placeholder="What are you looking for?">' +
      '<button type="button" class="ea-x" popovertarget="ea-search" popovertargetaction="hide" aria-label="Close search">' + ICON_X + '</button></div>' +
      '<p class="ea-label" id="ea-res-label" aria-live="polite">Popular</p><ul class="ea-results" id="ea-results"></ul></div>';
    document.body.appendChild(s);

    var q = s.querySelector('#ea-q'), list = s.querySelector('#ea-results'), label = s.querySelector('#ea-res-label');
    function render() {
      var term = q.value.trim().toLowerCase();
      var hits = !term ? INDEX.filter(function (x) { return POPULAR.indexOf(x[0]) !== -1; })
        : INDEX.filter(function (x) { var h = x.join(' ').toLowerCase(); return term.split(/\s+/).every(function (w) { return h.indexOf(w) !== -1; }); });
      label.textContent = term ? hits.length + (hits.length === 1 ? ' result' : ' results') : 'Popular';
      list.innerHTML = hits.length ? hits.map(function (x) {
        return '<li><a class="ea-res" href="' + esc(x[3]) + '"><span><b>' + esc(x[0]) + '</b><small>' + esc(x[2]) + '</small></span><em>' + esc(x[1]) + '</em></a></li>';
      }).join('') : '<li class="ea-none">Nothing on the site for that yet. <button type="button" class="ea-link" data-ask-about>Ask Tim &amp; Dom about it</button>.</li>';
    }
    q.addEventListener('input', render);
    q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var first = list.querySelector('a');
      if (first) { e.preventDefault(); first.click(); }
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('[data-ask-about]')) {
        var term = q.value.trim();
        s.hidePopover();
        if (window.EvoAsk) window.EvoAsk.open({ message: 'I was looking for "' + term + '" on the site. ' });
        return;
      }
      if (e.target.closest('a')) s.hidePopover();
    });
    s.addEventListener('toggle', function (e) { if (e.newState === 'open') { q.value = ''; render(); setTimeout(function () { q.focus(); }, 30); } });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-ea-search]')) { e.preventDefault(); s.showPopover(); }
    });
    render();
  }

  function build() {
    buildContact();
    if (document.querySelector('[data-ea-search]')) buildSearch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
