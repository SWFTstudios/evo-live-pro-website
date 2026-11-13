// Evo Live Pro: home page behavior (section tabs, booking bar, work index).
(function () {
  'use strict';

  // ---------- Work index ----------
  var WORK = [
    ['Paramus Prom', 'Prom', '65" TV booth · 12×8 truss · 8 movers · RCF tops + subs', 'paramus-prom'],
    ['NBA Tip-Off', 'Corporate', 'LED wall content · DJ facade · column speakers', 'nba-led-wall'],
    ['Dancing on the clouds', 'Wedding', 'Low fog · spotlight · first dance audio', 'dancing-clouds'],
    ['Club night', 'Club', 'CO2 blasters · strobe panels · beams on truss', 'club-night'],
    ['Festival main stage', 'Festival', 'LED video wall · LED booth facade · stage lighting', 'festival-main-stage'],
    ['Ballroom wedding', 'Wedding', 'Lit facade · truss uprights · 4 movers · tops + subs', 'ballroom-wedding'],
    ['Sweet 16', 'Private', '65" TV booth (white) · 4 movers · RCF tops + subs', 'sweet-16'],
    ['Kearny Tree Lighting', 'Town event', 'Stage deck · PA · backline · uplighting', 'kearny-tree-lighting'],
    ["New Year's Eve", 'Private', 'DJ · column speakers · mirror balls', 'new-years-eve']
  ];
  var listEl = document.getElementById('work-list');
  var shots = document.querySelectorAll('#work-preview img');
  var title = document.getElementById('work-title');
  var num = document.getElementById('work-num');
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  if (listEl) {
    listEl.innerHTML = WORK.map(function (w, i) {
      return '<a role="listitem" class="work-row' + (i === 0 ? ' on' : '') + '" href="#book" data-i="' + i + '">' +
        '<span class="work-num">' + pad(i + 1) + '</span>' +
        '<img class="work-thumb" src="/assets/media/' + w[3] + '.webp" alt="" loading="lazy">' +
        '<span class="work-t"><span class="disp">' + esc(w[0]) + '</span><span>' + esc(w[2]) + '</span></span>' +
        '<span class="work-end"><span class="work-type hide-sm">' + esc(w[1]) + '</span><span class="work-arrow" aria-hidden="true">→</span></span>' +
        '</a>';
    }).join('');
    var current = 0;
    var pick = function (i) {
      if (i === current) return;
      listEl.children[current].classList.remove('on');
      listEl.children[i].classList.add('on');
      if (shots[current]) shots[current].classList.remove('on');
      if (shots[i]) shots[i].classList.add('on');
      title.textContent = WORK[i][0];
      num.textContent = pad(i + 1) + ' / ' + pad(WORK.length);
      current = i;
    };
    var hover = function (e) { var row = e.target.closest('.work-row'); if (row) pick(+row.getAttribute('data-i')); };
    listEl.addEventListener('mouseover', hover);
    listEl.addEventListener('focusin', hover);
  }

  // ---------- Section tabs + booking bar ----------
  var ids = ['services', 'work', 'crew', 'gear', 'reviews', 'book'];
  var tabs = {};
  document.querySelectorAll('.tab[data-spy]').forEach(function (t) { tabs[t.getAttribute('data-spy')] = t; });
  var hero = document.getElementById('hero');
  var bookSec = document.getElementById('book');
  var bar = document.getElementById('book-bar');
  var barLinks = bar ? bar.querySelectorAll('a, button') : [];
  var active = null;
  var barOn = false;
  var ticking = false;

  var update = function () {
    ticking = false;
    var cur = null;
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= 160) cur = ids[i];
    }
    if (cur !== active) {
      if (active && tabs[active]) { tabs[active].classList.remove('on'); tabs[active].removeAttribute('aria-current'); }
      if (cur && tabs[cur]) {
        tabs[cur].classList.add('on');
        tabs[cur].setAttribute('aria-current', 'true');
        var nav = tabs[cur].parentElement;
        if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: tabs[cur].offsetLeft - 16, behavior: 'smooth' });
      }
      active = cur;
    }
    var vh = window.innerHeight || 800;
    var show = hero.getBoundingClientRect().bottom < 0 && !(bookSec.getBoundingClientRect().top < vh * 0.7);
    if (show !== barOn && bar) {
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      barLinks.forEach(function (l) { l.tabIndex = show ? 0 : -1; });
      barOn = show;
    }
  };
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Keep the hero video playing where browsers are strict about autoplay.
  var v = document.querySelector('.hero video');
  if (v) { v.muted = true; var p = v.play && v.play(); if (p && p.catch) p.catch(function () {}); }
})();
