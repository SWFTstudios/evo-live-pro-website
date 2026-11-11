// Evo motion prototype: first-load intro on Home and the Book / Rent hand-off.
// Timing is built on 128 BPM (one beat = 0.469s), the tempo of the music Evo plays.
(function () {
  const root = document.documentElement;
  const done = () => root.classList.remove('evo-intro', 'evo-handoff');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const embedded = window.self !== window.top;
  if (!window.gsap || reduced) { done(); return; }

  gsap.registerPlugin(CustomEase, SplitText, DrawSVGPlugin);
  const B = 60 / 128;
  CustomEase.create('evo', 'M0,0 C0.72,0 0.12,1 1,1');
  CustomEase.create('evoOut', 'M0,0 C0.16,0.84 0.3,1 1,1');

  const ACCENTS = { 'rgb(230, 48, 127)': '#E6307F', 'rgb(0, 212, 240)': '#00D4F0' };
  const TARGETS = ['contact.html', 'rentals.html'];

  function accentLink(el) {
    const a = el && el.closest && el.closest('a[href]');
    if (!a) return null;
    const href = a.getAttribute('href');
    if (!TARGETS.includes(href)) return null;
    const color = ACCENTS[getComputedStyle(a).backgroundColor];
    return color ? { a, href, color } : null;
  }

  // Reveal a page's headline line by line, then the rest of the block.
  function revealHeading(h1, delay) {
    if (!h1) return gsap.timeline();
    const tl = gsap.timeline({ delay });
    const split = SplitText.create(h1, { type: 'lines', mask: 'lines' });
    tl.from(split.lines, { yPercent: 110, duration: B * 1.6, ease: 'evoOut', stagger: B / 4 });
    const before = h1.previousElementSibling;
    const after = [];
    let n = h1.nextElementSibling;
    while (n && after.length < 2) { after.push(n); n = n.nextElementSibling; }
    if (before) tl.from(before, { autoAlpha: 0, y: 12, duration: B, ease: 'evoOut' }, 0);
    if (after.length) tl.from(after, { autoAlpha: 0, y: 24, duration: B * 1.4, ease: 'evoOut', stagger: B / 3 }, B / 2);
    tl.eventCallback('onComplete', () => split.revert());
    return tl;
  }

  // ---------- First load on Home ----------
  function intro() {
    const curtain = document.createElement('div');
    curtain.className = 'evo-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML =
      '<div class="evo-beam l"></div><div class="evo-beam r"></div>' +
      '<div class="evo-mark"><svg viewBox="0 0 100 116" fill="none" aria-hidden="true">' +
      '<path d="M50 3 L96 29.5 L96 86.5 L50 113 L4 86.5 L4 29.5 Z" stroke="#F4F4F0" stroke-width="6" stroke-linejoin="miter"/></svg>' +
      '<img src="assets/logo-mark.png" alt=""></div>' +
      '<button type="button" class="evo-skip">SKIP INTRO</button>';
    document.body.appendChild(curtain);
    done();

    const hero = document.querySelector('#dc-root section');
    const h1 = hero && hero.querySelector('h1');
    const path = curtain.querySelector('path');
    const tl = gsap.timeline({ defaults: { ease: 'evo' }, onComplete: () => curtain.remove() });

    tl.from(path, { drawSVG: '0%', duration: B * 1.5 })
      .to('.evo-beam.l', { autoAlpha: 1, duration: B / 2 }, B * 0.75)
      .to('.evo-beam.r', { autoAlpha: 1, duration: B / 2 }, B * 0.75)
      .fromTo('.evo-beam.l', { rotate: -58 }, { rotate: 14, duration: B * 2.2 }, B * 0.75)
      .fromTo('.evo-beam.r', { rotate: 58 }, { rotate: -14, duration: B * 2.2 }, B * 0.75)
      .to('.evo-mark img', { autoAlpha: 1, duration: B / 2 }, B * 1.25)
      .to(path, { autoAlpha: 0, duration: B / 2 }, B * 1.5)
      .to('.evo-mark', { scale: 0.92, autoAlpha: 0, duration: B * 0.75 }, B * 2.4)
      .to(curtain, { clipPath: 'inset(0% 0% 100% 0%)', duration: B * 1.5 }, B * 2.6)
      .add(revealHeading(h1, 0), B * 3);

    const skip = () => { tl.progress(1); };
    curtain.querySelector('.evo-skip').addEventListener('click', skip);
    window.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { skip(); window.removeEventListener('keydown', k); } });
    try { sessionStorage.setItem('evo-intro-seen', '1'); } catch (e) {}
  }

  // ---------- Arriving from a Book / Rent click ----------
  function arrive(data) {
    const flood = document.createElement('div');
    flood.className = 'evo-flood';
    flood.style.background = data.color;
    flood.innerHTML = '<span></span>';
    flood.firstChild.textContent = data.label;
    document.body.appendChild(flood);
    done();
    try { sessionStorage.removeItem('evo-handoff'); } catch (e) {}

    const h1 = document.querySelector('#dc-root h1');
    gsap.timeline({ onComplete: () => flood.remove() })
      .to(flood.firstChild, { yPercent: -60, autoAlpha: 0, duration: B, ease: 'evo' }, B * 0.25)
      .to(flood, { clipPath: 'inset(0% 0% 100% 0%)', duration: B * 1.5, ease: 'evo' }, B * 0.5)
      .add(revealHeading(h1, 0), B * 1);
  }

  // ---------- Leaving through a Book / Rent click ----------
  let leaving = false;
  document.addEventListener('click', (e) => {
    if (leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const hit = accentLink(e.target);
    if (!hit) return;
    e.preventDefault();
    leaving = true;
    const label = hit.href === 'rentals.html' ? 'Rent Gear' : 'Book Evo';
    const r = hit.a.getBoundingClientRect();
    const flood = document.createElement('div');
    flood.className = 'evo-flood';
    flood.style.background = hit.color;
    flood.innerHTML = '<span></span>';
    flood.firstChild.textContent = label;
    document.body.appendChild(flood);
    const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
    try { sessionStorage.setItem('evo-handoff', JSON.stringify({ color: hit.color, label })); } catch (err) {}
    gsap.timeline({ onComplete: () => { location.href = hit.href; } })
      .fromTo(flood, { clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px)', duration: B * 1.25, ease: 'evo' })
      .fromTo(flood.firstChild, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: B, ease: 'evoOut' }, B * 0.6);
  });
  // Coming back with the browser's back button: clear the flood left on the old page.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { leaving = false; document.querySelectorAll('.evo-flood').forEach((f) => f.remove()); }
  });

  // ---------- Hover: a light cone swings into the Book / Rent buttons ----------
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const hit = accentLink(e.target);
    if (!hit || hit.a.contains(e.relatedTarget)) return;
    const a = hit.a;
    if (getComputedStyle(a).position === 'static') a.style.position = 'relative';
    a.style.overflow = 'hidden';
    let cone = a.querySelector('.evo-cone');
    if (!cone) { cone = document.createElement('span'); cone.className = 'evo-cone'; cone.setAttribute('aria-hidden', 'true'); a.appendChild(cone); }
    gsap.fromTo(cone, { rotate: -38, autoAlpha: 0 }, { rotate: 0, autoAlpha: 1, duration: B * 1.2, ease: 'evoOut', overwrite: true });
  });
  document.addEventListener('pointerout', (e) => {
    const hit = accentLink(e.target);
    if (!hit || hit.a.contains(e.relatedTarget)) return;
    const cone = hit.a.querySelector('.evo-cone');
    if (cone) gsap.to(cone, { rotate: 30, autoAlpha: 0, duration: B * 0.8, ease: 'evo', overwrite: true });
  });

  // ---------- Start ----------
  function start() {
    let handoff = null;
    try { handoff = JSON.parse(sessionStorage.getItem('evo-handoff') || 'null'); } catch (e) {}
    if (handoff && !embedded) arrive(handoff);
    else if (root.classList.contains('evo-intro')) intro();
    else done();
  }
  const go = () => (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start, start);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
