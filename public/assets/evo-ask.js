/* Evo Live Pro: the "Planning something?" pill and the help modal it opens.
   The modal has two tabs: Ask Tim & Dom (message goes to their email app) and Search the site.
   Other scripts can open it with EvoAsk.open({ tab: 'ask' | 'search', message: '...' }). */
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

  var ICON_SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>';
  var ICON_CHAT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    var pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'ea-pill';
    pill.setAttribute('popovertarget', 'ea-modal');
    pill.setAttribute('aria-haspopup', 'dialog');
    pill.innerHTML = '<span class="ea-dot" aria-hidden="true"></span><span class="ea-pill-text"><b>Planning something?</b><small>Ask Tim &amp; Dom or search the site</small></span><span class="ea-pill-go" aria-hidden="true">' + ICON_CHAT + '</span>';

    var m = document.createElement('div');
    m.id = 'ea-modal';
    m.className = 'ea-modal';
    m.setAttribute('popover', '');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'ea-title');
    m.innerHTML =
      '<div class="ea-head"><div><span class="ea-eyebrow">Evo Live Pro</span><h2 id="ea-title" class="ea-title">How can we help?</h2></div>' +
      '<button type="button" class="ea-x" popovertarget="ea-modal" popovertargetaction="hide" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div>' +
      '<div class="ea-tabs" role="tablist" aria-label="Choose how to get help">' +
      '<button type="button" class="ea-tab" role="tab" id="ea-tab-ask" aria-controls="ea-p-ask" data-tab="ask">' + ICON_CHAT + 'Ask Tim &amp; Dom</button>' +
      '<button type="button" class="ea-tab" role="tab" id="ea-tab-search" aria-controls="ea-p-search" data-tab="search">' + ICON_SEARCH + 'Search the site</button></div>' +
      '<div class="ea-body">' +
      '<div class="ea-panel" id="ea-p-ask" role="tabpanel" aria-labelledby="ea-tab-ask">' +
      '<p class="ea-lede">Ask about anything: a date, a piece of gear, a crazy idea. Write it however you\'d say it. It goes straight to Tim and Dom.</p>' +
      '<form class="ea-form" novalidate>' +
      '<div class="ea-row2"><div class="ea-field"><label for="ea-name">Name</label><input id="ea-name" name="name" autocomplete="name" placeholder="Jordan"></div>' +
      '<div class="ea-field"><label for="ea-from">Email or phone</label><input id="ea-from" name="from" autocomplete="email" placeholder="you@email.com"></div></div>' +
      '<div class="ea-field"><label for="ea-msg">Message</label><textarea id="ea-msg" name="body" required placeholder="Sweet 16 in March, about 150 guests. Can you do DJ, lights and a cold spark entrance?"></textarea></div>' +
      '<button type="submit" class="ea-send">Send message</button>' +
      '<div class="ea-or">or reach us directly</div>' +
      '<div class="ea-quick"><a href="tel:' + PHONE + '">Call</a><a href="sms:' + PHONE + '">Text</a><a href="mailto:' + EMAIL + '">Email</a></div>' +
      '</form></div>' +
      '<div class="ea-panel" id="ea-p-search" role="tabpanel" aria-labelledby="ea-tab-search" hidden>' +
      '<div class="ea-search">' + ICON_SEARCH + '<label for="ea-q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search the site</label>' +
      '<input id="ea-q" type="search" autocomplete="off" placeholder="Weddings, LED walls, pricing…"></div>' +
      '<p class="ea-label" id="ea-res-label" aria-live="polite">Popular</p><ul class="ea-results" id="ea-results"></ul></div>' +
      '</div>';

    document.body.appendChild(pill);
    document.body.appendChild(m);

    var tabs = m.querySelectorAll('.ea-tab');
    var q = m.querySelector('#ea-q'), list = m.querySelector('#ea-results'), label = m.querySelector('#ea-res-label');
    var msg = m.querySelector('#ea-msg');

    function setTab(name, focus) {
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].getAttribute('data-tab') === name;
        tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
        tabs[i].tabIndex = on ? 0 : -1;
        document.getElementById(tabs[i].getAttribute('aria-controls')).hidden = !on;
      }
      if (focus) (name === 'search' ? q : msg).focus();
    }

    function renderResults() {
      var term = q.value.trim().toLowerCase();
      var hits = !term ? INDEX.filter(function (x) { return POPULAR.indexOf(x[0]) !== -1; })
        : INDEX.filter(function (x) { var h = x.join(' ').toLowerCase(); return term.split(/\s+/).every(function (w) { return h.indexOf(w) !== -1; }); });
      label.textContent = term ? hits.length + (hits.length === 1 ? ' result' : ' results') : 'Popular';
      if (!hits.length) {
        list.innerHTML = '<li class="ea-none">Nothing on the site for that yet. <button type="button" class="ea-link" data-ask-about>Ask Tim &amp; Dom about it</button>.</li>';
        return;
      }
      list.innerHTML = hits.map(function (x) {
        return '<li><a class="ea-res" href="' + esc(x[3]) + '"><span><b>' + esc(x[0]) + '</b><small>' + esc(x[2]) + '</small></span><em>' + esc(x[1]) + '</em></a></li>';
      }).join('');
    }

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () { setTab(this.getAttribute('data-tab'), true); });
      tabs[i].addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var next = this.getAttribute('data-tab') === 'ask' ? 'search' : 'ask';
        setTab(next, false);
        m.querySelector('[data-tab="' + next + '"]').focus();
      });
    }
    q.addEventListener('input', renderResults);
    q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var first = list.querySelector('a');
      if (first) { e.preventDefault(); first.click(); }
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('[data-ask-about]')) {
        msg.value = 'I was looking for "' + q.value.trim() + '" on the site. ';
        setTab('ask', true);
        return;
      }
      if (e.target.closest('a')) m.hidePopover();
    });

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
        setTab(opts.tab || 'ask', false);
        if (opts.message) msg.value = opts.message;
        renderResults();
        opts = {};
        setTimeout(function () { (m.querySelector('[aria-selected="true"]').getAttribute('data-tab') === 'search' ? q : msg).focus(); }, 30);
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
      open: function (o) { opts = o || {}; if (m.matches(':popover-open')) { m.hidePopover(); } m.showPopover(); }
    };
    setTab('ask', false);
    renderResults();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
