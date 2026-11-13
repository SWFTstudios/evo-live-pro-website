// Evo Live Pro: rentals catalog. Inventory lives in gear.js (2026 Master Inventory).
(function () {
  'use strict';
  var CATS = window.EvoGear.CATS, GEAR = window.EvoGear.GEAR;
  var catName = {}; CATS.forEach(function (c) { catName[c[0]] = c[2]; });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ICON = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4A4A48" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"></rect><circle cx="12" cy="14.5" r="3.5"></circle><circle cx="12" cy="7.5" r="1"></circle></svg>';

  var state = { cat: 0, q: '', quote: {}, order: [], detail: -1, qty: 1 };
  try { var saved = JSON.parse(sessionStorage.getItem('evo-quote') || 'null'); if (saved && saved.order) { state.quote = saved.quote; state.order = saved.order; } } catch (e) {}
  var params = new URLSearchParams(location.search);
  CATS.forEach(function (c, i) { if (c[0] === params.get('cat')) state.cat = i; });
  if (params.get('q')) state.q = params.get('q');

  var $ = function (id) { return document.getElementById(id); };
  var grid = $('r-grid'), catsEl = $('r-cats'), ul = $('r-ul'), qInput = $('r-q'), status = $('r-status');
  qInput.value = state.q;

  catsEl.insertAdjacentHTML('beforeend', CATS.map(function (c, i) {
    return '<button type="button" class="r-cat" data-i="' + i + '" aria-pressed="false">' + esc(c[1]) + '</button>';
  }).join(''));
  var tabBtns = catsEl.querySelectorAll('.r-cat');
  var moveUl = function () { var b = tabBtns[state.cat]; ul.style.width = b.offsetWidth + 'px'; ul.style.transform = 'translateX(' + b.offsetLeft + 'px)'; };
  var say = function (t) { status.textContent = ''; setTimeout(function () { status.textContent = t; }, 30); };

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
      return '<li class="r-card' + (added ? ' added' : '') + '">' +
        '<button type="button" class="r-open" data-open="' + i + '" aria-haspopup="dialog">' +
        '<span class="r-ph" aria-hidden="true">' + ICON + '</span>' +
        '<span class="r-meta"><span class="k">' + esc(catName[g[1]]) + '</span><span class="n">' + esc(g[0]) + '</span><span class="p">Price on request</span></span></button>' +
        '<button type="button" class="r-add" data-toggle="' + i + '" aria-pressed="' + added + '" aria-label="' + (added ? 'Remove ' : 'Add ') + esc(g[0]) + (added ? ' from quote' : ' to quote') + '">' +
        (added ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>'
               : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>') +
        '</button></li>';
    }).join('');
    var q = state.q.trim();
    $('r-count').textContent = items.length + (items.length === 1 ? ' item' : ' items') + (q ? ' matching "' + q + '"' : '');
    $('r-empty').hidden = items.length !== 0;
  };

  var renderCat = function () {
    var c = CATS[state.cat];
    tabBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', i === state.cat ? 'true' : 'false'); });
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
    document.querySelectorAll('[data-quote-count]').forEach(function (b) { b.textContent = n ? String(n) : ''; b.hidden = !n; });
    if (pop) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
    var bar = $('q-bar');
    var show = n > 0 && !window.EvoModal.current();
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
    var had = !!state.quote[name];
    if (qty > 0) { if (!state.quote[name]) state.order.push(name); state.quote[name] = qty; }
    else { delete state.quote[name]; state.order = state.order.filter(function (n) { return n !== name; }); }
    renderQuote(true);
    renderGrid();
    var n = count();
    say(qty > 0 ? name + (had ? ' updated in' : ' added to') + ' your quote. ' + n + (n === 1 ? ' item' : ' items') + ' total.' : name + ' removed from your quote. ' + n + (n === 1 ? ' item' : ' items') + ' left.');
  };

  var openSheet = function (id, focusId) {
    window.EvoModal.open($(id), focusId ? { focus: $(focusId) } : undefined);
    renderQuote(false);
  };
  var openDetail = function (i) {
    var g = GEAR[i];
    state.detail = i; state.qty = state.quote[g[0]] || 1;
    $('d-ph').innerHTML = ICON.replace('width="44" height="44"', 'width="72" height="72"');
    $('d-cat').textContent = catName[g[1]];
    $('d-name').textContent = g[0];
    $('d-note').textContent = g[2] + '. Delivery, setup and pickup available. Pair it with a tech for the night if you want someone running it.';
    $('d-qty').textContent = state.qty;
    $('d-add').textContent = state.quote[g[0]] ? 'Update quote' : 'Add to quote';
    openSheet('detail', 'd-add');
  };

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('.r-cat'))) {
      var i = +t.getAttribute('data-i');
      if (i === state.cat) return;
      state.cat = i;
      renderCat();
      grid.classList.add('fading');
      setTimeout(function () { renderGrid(); grid.classList.remove('fading'); }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
      say(CATS[i][2] + ' selected.');
      history.replaceState(null, '', i ? '?cat=' + CATS[i][0] : location.pathname);
    } else if ((t = e.target.closest('[data-toggle]'))) {
      var idx = +t.getAttribute('data-toggle'), g = GEAR[idx];
      setQty(g[0], state.quote[g[0]] ? 0 : 1);
      var again = grid.querySelector('[data-toggle="' + idx + '"]');
      if (again) again.focus();
    } else if ((t = e.target.closest('[data-open]'))) {
      openDetail(+t.getAttribute('data-open'));
    } else if ((t = e.target.closest('[data-remove]'))) {
      setQty(t.getAttribute('data-remove'), 0);
    } else if (e.target.closest('[data-open-quote]')) {
      var opener = e.target.closest('[data-open-quote]');
      if (window.EvoModal.current()) window.EvoModal.close(true);
      window.EvoModal.open($('quote'), { returnTo: opener });
      renderQuote(false);
    } else if (e.target.closest('[data-close-sheet]')) {
      window.EvoModal.close();
    }
  });
  $('d-minus').addEventListener('click', function () { state.qty = Math.max(1, state.qty - 1); $('d-qty').textContent = state.qty; });
  $('d-plus').addEventListener('click', function () { state.qty = Math.min(20, state.qty + 1); $('d-qty').textContent = state.qty; });
  $('d-add').addEventListener('click', function () { setQty(GEAR[state.detail][0], state.qty); window.EvoModal.close(); });
  ['detail', 'quote'].forEach(function (id) { $(id).addEventListener('evo:closed', function () { renderQuote(false); }); });
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
      $('q-sent').setAttribute('tabindex', '-1');
      $('q-sent').focus();
    });
  });

  renderCat();
  renderGrid();
  renderQuote(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveUl);
})();
