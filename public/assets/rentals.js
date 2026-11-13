// Evo Live Pro: rentals catalog. Inventory from Evo's 2026 Master Inventory.
(function () {
  'use strict';
  var CATS = [
    ['all', 'All', 'All gear', 'Everything we own, tested before it leaves the warehouse.'],
    ['sound', 'Sound', 'Sound', 'RCF systems from compact columns to line arrays and subs, plus mics and mixers.'],
    ['visuals', 'Visuals', 'Visuals', 'Modular LED walls and media screens for any room.'],
    ['lighting', 'Lighting', 'Lighting', 'Moving heads, lasers, strobes and wireless uplighting.'],
    ['staging', 'Staging', 'Staging', 'Stage decks, truss, power and cable safety.'],
    ['dj', 'DJ', 'DJ gear', 'Club standard decks, mixers and statement booths.'],
    ['fx', 'FX', 'Special FX', 'Cold sparks, CO2, low fog, haze and more.']
  ];
  var GEAR = [
    ['RCF EVOX 12', 'sound', 'Column array system with a 15" sub, for ceremonies and mid-size rooms'],
    ['RCF EVOX J9', 'sound', 'Compact active 3-way column array with a 12" sub'],
    ['RCF EVOX J11 (white)', 'sound', 'Active 3-way column array in white, made for weddings'],
    ['RCF HDL6-A line array', 'sound', '1400 watt compact active line array for big rooms'],
    ['RCF ART 915A', 'sound', 'Powered 15" main speaker'],
    ['RCF NX 945-A', 'sound', 'Powered 15" main speaker for full dance floors'],
    ['AlphaTheta Wave-Eight', 'sound', 'Portable 8" speaker for small rooms and outdoor moments'],
    ['RCF SUB 18-AX', 'sound', 'Powered 18" subwoofer for real low end'],
    ['RCF SUB 8006-AS', 'sound', 'Dual 18" powered subwoofer'],
    ['Shure SLXD24D+ / SM58', 'sound', 'Dual digital wireless handheld rack with power conditioning'],
    ['Shure QLXD24 / SM58', 'sound', 'Dual digital wireless handheld rack'],
    ['Shure SM58', 'sound', 'Wired vocal mic with on/off switch'],
    ['Antenna distribution + paddles', 'sound', 'Extends wireless range in large venues'],
    ['Allen & Heath CQ-12T', 'sound', '12 channel digital mixer'],
    ['Allen & Heath CQ-18T', 'sound', '18 channel digital mixer'],
    ['Allen & Heath Qu-5D', 'sound', '38 channel digital mixer with Dante'],
    ['LED video wall', 'visuals', "Modular panels, from 8' × 4' up to 16.5' × 9.5'"],
    ['50" media screen', 'visuals', 'On a stand, truss or built into a DJ booth'],
    ['55" media screen', 'visuals', 'On a stand or truss for content and slideshows'],
    ['300W 3-in-1 hybrid moving head', 'lighting', 'Beam, spot and wash in one fixture'],
    ['275W beam moving head', 'lighting', 'Sharp aerial beams'],
    ['19x15W LED wash moving head', 'lighting', 'Zoom wash with aura FX'],
    ['Unity Raw 5 FB4 RGB laser', 'lighting', "High powered lasers, run by our operator. Tim's favorite flex"],
    ['350W retro hex light', 'lighting', 'The hexagon look from our Instagram'],
    ['260W LED strobe panel', 'lighting', 'Club and stage strobes'],
    ['18x18W LED par', 'lighting', 'Stage and room color'],
    ['LED wash light bar', 'lighting', 'Color washes for truss, stages and facades'],
    ['Wireless uplight', 'lighting', 'Battery uplighting for perimeter and facade color'],
    ['ADJ Wolfmix W1 + WMX Wing', 'lighting', 'Standalone DMX lighting control'],
    ['Stage decks + risers', 'staging', "From 4' × 8' up to 16' × 8'"],
    ['ProX StageQ 2x8', 'staging', 'Adjustable stage deck, 28" to 48" high'],
    ['ProX StageQ 4x8', 'staging', 'Adjustable stage deck, 28" to 48" high'],
    ['ProX F34 truss towers', 'staging', 'Truss towers in 4, 6.5 and 8 ft heights'],
    ['Weighted base plates', 'staging', '20", 24" and 32" plates for truss'],
    ['Power distribution', 'staging', 'Spider boxes and 20A, 30A, 50A feeders'],
    ['Jackery power stations', 'staging', 'Silent battery power from 300W to 5000W'],
    ['Rubberized cable ramps', 'staging', 'Heavy duty cable crossings for walkways'],
    ['Pioneer DJ CDJ-3000', 'dj', 'Club standard media player'],
    ['AlphaTheta CDJ-3000X', 'dj', 'Next generation club media player'],
    ['AlphaTheta XDJ-AZ', 'dj', '4 channel all-in-one DJ system'],
    ['Pioneer DJ DJM-A9', 'dj', '4 channel club mixer'],
    ['Pioneer DJ DJM-S11', 'dj', '2 channel battle mixer'],
    ['Pro DJ Link network switch', 'dj', 'Gigabit switch to link players'],
    ['Portable DJ booth (black)', 'dj', 'Clean folding booth'],
    ['Portable DJ booth (white)', 'dj', 'Clean folding booth for weddings'],
    ['Humpter B3 DJ console', 'dj', 'Premium booth that fits a 50" media screen'],
    ['65" TV DJ booth (white)', 'dj', 'White booth with a built-in screen for your graphics'],
    ['Glorious Sessions Cube XL', 'dj', 'Compact DJ booth'],
    ['Custom black acrylic facade', 'dj', 'Sleek front for any booth'],
    ['Cold spark machine', 'fx', 'Indoor-safe spark fountains for big moments. Permit fee applies'],
    ['CO2 stage blaster jet', 'fx', 'Cryo blasts on the drop'],
    ['CO2 handheld cannon', 'fx', 'Crowd level CO2 blasts'],
    ['CO2 siphon tank', 'fx', '20 lb and 50 lb tanks'],
    ['Dancing on the clouds', 'fx', 'Chauvet Nimbus low fog for first dances'],
    ['Water-based hazer', 'fx', 'Atmosphere so the beams show'],
    ['Confetti cannon', 'fx', 'For the big reveal'],
    ['Disco balls', 'fx', 'From 8" to 30"'],
    ['Salsa digital photo booth', 'fx', 'Digital photo booth with attendant']
  ];
  var catName = {}; CATS.forEach(function (c) { catName[c[0]] = c[2]; });
  var initials = function (n) { return n.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var state = { cat: 0, q: '', quote: {}, order: [], detail: -1, qty: 1 };
  try { var saved = JSON.parse(sessionStorage.getItem('evo-quote') || 'null'); if (saved && saved.order) { state.quote = saved.quote; state.order = saved.order; } } catch (e) {}
  var param = new URLSearchParams(location.search).get('cat');
  CATS.forEach(function (c, i) { if (c[0] === param) state.cat = i; });

  var $ = function (id) { return document.getElementById(id); };
  var grid = $('r-grid'), catsEl = $('r-cats'), ul = $('r-ul'), qInput = $('r-q');

  // category tabs
  catsEl.insertAdjacentHTML('beforeend', CATS.map(function (c, i) {
    return '<button type="button" class="r-cat" role="tab" data-i="' + i + '" aria-selected="false">' + esc(c[1]) + '</button>';
  }).join(''));
  var tabBtns = catsEl.querySelectorAll('.r-cat');
  var moveUl = function () { var b = tabBtns[state.cat]; ul.style.width = b.offsetWidth + 'px'; ul.style.transform = 'translateX(' + b.offsetLeft + 'px)'; };

  var filtered = function () {
    var cur = CATS[state.cat][0], q = state.q.trim().toLowerCase();
    return GEAR.filter(function (g) {
      if (state.cat > 0 && g[1] !== cur) return false;
      if (!q) return true;
      var h = (g[0] + ' ' + g[2] + ' ' + catName[g[1]]).toLowerCase();
      return q.split(/\s+/).every(function (w) { return h.indexOf(w) !== -1; });
    });
  };

  var renderGrid = function () {
    var items = filtered();
    grid.innerHTML = items.map(function (g) {
      var i = GEAR.indexOf(g), added = !!state.quote[g[0]];
      return '<div class="r-card' + (added ? ' added' : '') + '">' +
        '<button type="button" class="r-open" data-open="' + i + '" aria-label="View ' + esc(g[0]) + '">' +
        '<span class="r-ph"><span class="disp">' + esc(initials(g[0])) + '</span></span>' +
        '<span class="r-meta"><span class="k">' + esc(catName[g[1]]) + '</span><span class="n">' + esc(g[0]) + '</span><span class="p">Price on request</span></span></button>' +
        '<button type="button" class="r-add" data-toggle="' + i + '" aria-pressed="' + added + '" aria-label="' + (added ? 'Remove ' : 'Add ') + esc(g[0]) + (added ? ' from quote' : ' to quote') + '">' +
        (added ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>'
               : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>') +
        '</button></div>';
    }).join('');
    var q = state.q.trim();
    $('r-count').textContent = items.length + (items.length === 1 ? ' item' : ' items') + (q ? ' matching "' + q + '"' : '');
    $('r-empty').hidden = items.length !== 0;
  };

  var renderCat = function () {
    var c = CATS[state.cat];
    tabBtns.forEach(function (b, i) { b.setAttribute('aria-selected', i === state.cat ? 'true' : 'false'); });
    $('r-banner').querySelectorAll('img').forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-cat') === c[0]); });
    $('r-title').textContent = c[2];
    $('r-blurb').textContent = c[3];
    moveUl();
  };

  var count = function () { return state.order.reduce(function (s, n) { return s + state.quote[n]; }, 0); };
  var renderQuote = function (pop) {
    var n = count();
    var badge = $('q-count');
    badge.textContent = n;
    $('q-btn').setAttribute('aria-label', 'Open quote, ' + n + (n === 1 ? ' item' : ' items'));
    if (pop) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
    var bar = $('q-bar');
    var show = n > 0 && $('quote').hidden && $('detail').hidden;
    bar.classList.toggle('show', show);
    bar.tabIndex = show ? 0 : -1;
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    $('q-bar-label').textContent = n + (n === 1 ? ' item' : ' items') + ' in your quote';
    $('q-none').hidden = n > 0;
    $('q-list').innerHTML = state.order.map(function (name) {
      var g = GEAR.filter(function (x) { return x[0] === name; })[0];
      return '<li><span><b>' + esc(name) + '</b><small>' + esc(catName[g[1]]) + ' · qty ' + state.quote[name] + '</small></span><button type="button" class="q-rm" data-remove="' + esc(name) + '" aria-label="Remove ' + esc(name) + '">Remove</button></li>';
    }).join('');
    try { sessionStorage.setItem('evo-quote', JSON.stringify({ quote: state.quote, order: state.order })); } catch (e) {}
  };

  var setQty = function (name, qty) {
    if (qty > 0) { if (!state.quote[name]) state.order.push(name); state.quote[name] = qty; }
    else { delete state.quote[name]; state.order = state.order.filter(function (n) { return n !== name; }); }
    renderQuote(true);
    renderGrid();
  };

  // sheets
  var lastFocus = null;
  var openSheet = function (id) {
    lastFocus = document.activeElement;
    $(id).hidden = false;
    document.body.style.overflow = 'hidden';
    var f = $(id).querySelector('.sheet button, .sheet input');
    if (f) f.focus();
    renderQuote(false);
  };
  var closeSheets = function () {
    $('detail').hidden = true; $('quote').hidden = true;
    document.body.style.overflow = '';
    renderQuote(false);
    if (lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus();
  };
  var openDetail = function (i) {
    var g = GEAR[i];
    state.detail = i; state.qty = state.quote[g[0]] || 1;
    $('d-ph').innerHTML = '<span><span class="disp" style="display:block;font-size:56px">' + esc(initials(g[0])) + '</span>Product photo coming</span>';
    $('d-cat').textContent = catName[g[1]];
    $('d-name').textContent = g[0];
    $('d-note').textContent = g[2] + '. Delivery, setup and pickup available. Pair it with a tech for the night if you want someone running it.';
    $('d-qty').textContent = state.qty;
    $('d-add').textContent = state.quote[g[0]] ? 'Update quote' : 'Add to quote';
    openSheet('detail');
  };

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('.r-cat'))) {
      var i = +t.getAttribute('data-i');
      if (i === state.cat) return;
      state.cat = i;
      renderCat();
      grid.classList.add('fading');
      setTimeout(function () { renderGrid(); grid.classList.remove('fading'); }, 180);
      history.replaceState(null, '', i ? '?cat=' + CATS[i][0] : location.pathname);
    } else if ((t = e.target.closest('[data-toggle]'))) {
      var g = GEAR[+t.getAttribute('data-toggle')];
      setQty(g[0], state.quote[g[0]] ? 0 : 1);
      var again = grid.querySelector('[data-toggle="' + GEAR.indexOf(g) + '"]');
      if (again) again.focus();
    } else if ((t = e.target.closest('[data-open]'))) {
      openDetail(+t.getAttribute('data-open'));
    } else if ((t = e.target.closest('[data-remove]'))) {
      setQty(t.getAttribute('data-remove'), 0);
    } else if (e.target.closest('[data-open-quote]')) {
      closeSheets(); openSheet('quote');
    } else if (e.target.closest('[data-close-sheet]')) {
      closeSheets();
    }
  });
  $('d-minus').addEventListener('click', function () { state.qty = Math.max(1, state.qty - 1); $('d-qty').textContent = state.qty; });
  $('d-plus').addEventListener('click', function () { state.qty = Math.min(20, state.qty + 1); $('d-qty').textContent = state.qty; });
  $('d-add').addEventListener('click', function () { setQty(GEAR[state.detail][0], state.qty); closeSheets(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (!$('detail').hidden || !$('quote').hidden)) closeSheets(); });
  qInput.addEventListener('input', function () { state.q = qInput.value; renderGrid(); });
  $('r-clear').addEventListener('click', function () { qInput.value = ''; state.q = ''; renderGrid(); qInput.focus(); });
  window.addEventListener('resize', moveUl);

  $('q-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var items = state.order.map(function (n) { return '- ' + n + ' × ' + state.quote[n]; });
    var name = f.querySelector('[name="Name"]').value;
    window.EvoSend(f, 'Rental quote' + (name ? ' from ' + name : ''), items.length ? ['', 'Gear:'].concat(items) : ['', 'Gear: not sure yet, please suggest a package']).then(function () {
      $('q-body').hidden = true;
      $('q-sent').hidden = false;
    });
  });

  renderCat();
  renderGrid();
  renderQuote(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveUl);
})();
