/* Evo Live Pro: event lightbox. Any element with data-event="<slug>" opens that event's photos and videos.
   Prev/next walk through the event's media, then continue into the next event.
   To add media to an event, add entries to its `media` list: { src, alt } for a photo, { video, poster, alt } for a video. */
(function () {
  var EVENTS = [
    { slug: 'paramus-prom', title: 'Paramus Prom', type: 'Prom', gear: '65" TV booth · 12×8 truss · 8 movers · RCF 945 + 8003',
      media: [{ src: '/assets/img/setup-prom.webp', alt: 'White DJ booth with a 65 inch screen under goal post truss with eight moving lights in a chandelier ballroom' }] },
    { slug: 'nba-tip-off', title: 'NBA Tip-Off', type: 'Corporate', gear: 'LED wall content · DJ facade · column speakers',
      media: [{ src: '/assets/img/install-nba.webp', alt: 'Large LED video wall with flanking screens and a DJ facade in a corporate event space' }] },
    { slug: 'dancing-on-the-clouds', title: 'Dancing on the clouds', type: 'Wedding', gear: 'Low fog · spotlight · first dance audio',
      media: [{ video: '/assets/img/clouds.mp4', poster: '/assets/img/clouds-poster.webp', alt: 'Video: couple sharing a first dance on low fog under a spotlight' }] },
    { slug: 'club-night', title: 'Club night', type: 'Club', gear: 'CO2 blasters · strobe panels · beams on truss',
      media: [{ src: '/assets/img/fx-co2.webp', alt: 'DJ firing a CO2 jet over a cheering crowd in a nightclub' }] },
    { slug: 'festival-main-stage', title: 'Festival main stage', type: 'Festival', gear: 'LED video wall · LED booth facade · stage lighting',
      media: [{ src: '/assets/img/concert-ledwall.webp', alt: 'DJ on an outdoor stage in front of an LED wall and LED booth facade' }] },
    { slug: 'ballroom-wedding', title: 'Ballroom wedding', type: 'Wedding', gear: 'Lit facade · truss uprights · 4 movers · tops + subs',
      media: [{ src: '/assets/img/setup-ballroom.webp', alt: 'Blue lit DJ facade between truss uprights with moving heads and speakers in a gilded ballroom' }] },
    { slug: 'sweet-16', title: 'Sweet 16', type: 'Private', gear: '65" TV booth (white) · 4 movers · RCF 945 + 8003',
      media: [{ src: '/assets/img/setup-sweet16.webp', alt: 'White DJ booth with custom Sweet 16 graphic on the screen, moving heads on white columns' }] },
    { slug: 'kearny-tree-lighting', title: 'Kearny Tree Lighting', type: 'Town event', gear: 'Stage deck · PA · backline · uplighting',
      media: [{ src: '/assets/img/staging-kearny.webp', alt: 'Aluminum stage deck with mics and speakers lit for a town tree lighting festival' }] },
    { slug: 'new-years-eve', title: "New Year's Eve", type: 'Private', gear: 'DJ · column speakers · mirror balls',
      media: [{ src: '/assets/img/private-nye.webp', alt: "DJ playing a New Year's Eve party" }] }
  ];

  var dlg, stage, titleEl, kickerEl, gearEl, countEl, thumbsEl, ev = 0, item = 0, opener = null;
  var ARROW = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6') + '"></path></svg>'; };

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'eg';
    dlg.setAttribute('aria-labelledby', 'eg-title');
    dlg.innerHTML =
      '<div class="eg-top"><div><span class="eg-kicker" id="eg-kicker"></span><h2 class="eg-title" id="eg-title"></h2><p class="eg-gear" id="eg-gear"></p></div>' +
      '<button type="button" class="ea-x" data-eg="close" aria-label="Close gallery"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div>' +
      '<div class="eg-stage" id="eg-stage" aria-live="polite"></div>' +
      '<button type="button" class="eg-nav eg-prev" data-eg="prev" aria-label="Previous">' + ARROW(-1) + '</button>' +
      '<button type="button" class="eg-nav eg-next" data-eg="next" aria-label="Next">' + ARROW(1) + '</button>' +
      '<div class="eg-bot"><span class="eg-count" id="eg-count"></span><div class="eg-thumbs" id="eg-thumbs"></div>' +
      '<button type="button" class="eg-cta" data-eg="ask">Build something like this</button></div>';
    document.body.appendChild(dlg);
    stage = dlg.querySelector('#eg-stage'); titleEl = dlg.querySelector('#eg-title'); kickerEl = dlg.querySelector('#eg-kicker');
    gearEl = dlg.querySelector('#eg-gear'); countEl = dlg.querySelector('#eg-count'); thumbsEl = dlg.querySelector('#eg-thumbs');
    // The nav buttons sit over the stage, so move them inside it for positioning.
    stage.appendChild(dlg.querySelector('.eg-prev')); stage.appendChild(dlg.querySelector('.eg-next'));

    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-eg]');
      if (!b) { if (e.target === dlg) dlg.close(); return; }
      var a = b.getAttribute('data-eg');
      if (a === 'close') dlg.close();
      else if (a === 'prev') step(-1);
      else if (a === 'next') step(1);
      else if (a === 'thumb') { item = +b.getAttribute('data-i'); show(); }
      else if (a === 'ask') {
        var t = EVENTS[ev].title;
        opener = null; // focus moves into the help modal, not back to the row
        dlg.close();
        if (window.EvoAsk) window.EvoAsk.open({ tab: 'ask', message: 'We loved the ' + t + ' setup. Could you do something like it for our event? ' });
        else location.href = '/contact#book';
      }
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
    dlg.addEventListener('close', function () {
      var v = stage.querySelector('video'); if (v) v.pause();
      document.documentElement.style.overflow = '';
      if (opener && opener.focus) opener.focus();
    });
    var x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    });
  }

  function step(d) {
    var n = EVENTS[ev].media.length;
    item += d;
    if (item >= n) { ev = (ev + 1) % EVENTS.length; item = 0; }
    else if (item < 0) { ev = (ev - 1 + EVENTS.length) % EVENTS.length; item = EVENTS[ev].media.length - 1; }
    show();
  }

  function show() {
    var e = EVENTS[ev], m = e.media[item];
    titleEl.textContent = e.title;
    kickerEl.textContent = e.type + ' · Event ' + (ev + 1) + ' of ' + EVENTS.length;
    gearEl.textContent = e.gear;
    countEl.textContent = e.media.length > 1 ? (item + 1) + ' / ' + e.media.length : (e.media[0].video ? '1 video' : '1 photo');
    var old = stage.querySelector('.eg-media'); if (old) { if (old.pause) old.pause(); old.remove(); }
    var el;
    if (m.video) {
      el = document.createElement('video');
      el.src = m.video; el.poster = m.poster || ''; el.controls = true; el.playsInline = true; el.muted = true; el.loop = true; el.autoplay = true;
      el.setAttribute('aria-label', m.alt);
    } else {
      el = document.createElement('img');
      el.src = m.src; el.alt = m.alt; el.decoding = 'async';
    }
    el.className = 'eg-media';
    stage.insertBefore(el, stage.firstChild);
    thumbsEl.innerHTML = '';
    if (e.media.length > 1) {
      e.media.forEach(function (t, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'eg-thumb'; b.setAttribute('data-eg', 'thumb'); b.setAttribute('data-i', i);
        b.setAttribute('aria-label', (t.video ? 'Video ' : 'Photo ') + (i + 1));
        if (i === item) b.setAttribute('aria-current', 'true');
        var im = document.createElement('img'); im.src = t.poster || t.src; im.alt = ''; b.appendChild(im);
        thumbsEl.appendChild(b);
      });
    }
    // Preload the next image so sliding feels instant.
    var nx = e.media[item + 1] || (EVENTS[(ev + 1) % EVENTS.length].media[0]);
    if (nx && (nx.src || nx.poster)) { var p = new Image(); p.src = nx.src || nx.poster; }
  }

  function open(slug, from) {
    if (!dlg) build();
    var i = EVENTS.findIndex(function (e) { return e.slug === slug; });
    if (i < 0) return false;
    ev = i; item = 0; opener = from || null;
    show();
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
    dlg.querySelector('[data-eg="next"]').focus();
    return true;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-event]');
    if (!t || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (open(t.getAttribute('data-event'), t)) e.preventDefault();
  });

  window.EvoGallery = { open: open, events: EVENTS };
})();
