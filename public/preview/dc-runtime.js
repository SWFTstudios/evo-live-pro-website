// Minimal renderer for the wireframe pages: fills {{holes}}, <sc-for>, <sc-if>
// and onClick bindings from the page's Component class.
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) { this.state = Object.assign({}, this.state, patch); if (this._render) this._render(); }
    forceUpdate() { if (this._render) this._render(); }
  }
  window.DCLogic = DCLogic;

  const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const ANY = /\{\{\s*([^}]+?)\s*\}\}/g;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    let v = scope;
    for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; }
    return v;
  }
  function interp(str, scope) {
    return str.replace(ANY, (_, p) => { const v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function bound(node, attr, scope) {
    const m = (node.getAttribute(attr) || '').match(WHOLE);
    return m ? lookup(m[1], scope) : undefined;
  }

  const registry = {};
  function component(name) {
    if (registry[name]) return registry[name];
    const suffix = name ? '-' + name : '';
    const tpl = document.getElementById('dc-template' + suffix);
    const logic = document.getElementById('dc-logic' + suffix);
    if (!tpl || !logic) return null;
    const decl = JSON.parse(logic.getAttribute('data-props') || '{}');
    const defaults = {};
    for (const k in decl) if (k[0] !== '$' && decl[k] && 'default' in decl[k]) defaults[k] = decl[k].default;
    const Cls = new Function('DCLogic', logic.textContent + '\nreturn Component;')(DCLogic);
    return (registry[name] = { tpl, defaults, Cls });
  }
  function instantiate(entry, props, host) {
    const c = new entry.Cls(Object.assign({}, entry.defaults, props));
    c._render = () => { host.textContent = ''; renderNodes(entry.tpl.content, host, c.renderVals() || {}); };
    c._render();
    return c;
  }

  function renderNodes(src, dst, scope) {
    for (const n of src.childNodes) {
      if (n.nodeType === 3) { dst.appendChild(document.createTextNode(interp(n.nodeValue, scope))); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.localName;
      if (tag === 'helmet') continue;
      if (tag === 'dc-import') {
        const entry = component(n.getAttribute('name'));
        if (!entry) continue;
        const props = {};
        for (const a of Array.from(n.attributes)) {
          if (a.name === 'name' || a.name.startsWith('hint-')) continue;
          const key = a.name.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
          const m = a.value.match(WHOLE);
          props[key] = m ? lookup(m[1], scope) : interp(a.value, scope);
        }
        const host = document.createElement('div');
        host.style.display = 'contents';
        instantiate(entry, props, host);
        dst.appendChild(host);
        continue;
      }
      if (tag === 'sc-for') {
        const as = n.getAttribute('as') || 'item';
        (bound(n, 'list', scope) || []).forEach((it, i) => {
          const s = Object.create(scope); s[as] = it; s.$index = i;
          renderNodes(n, dst, s);
        });
        continue;
      }
      if (tag === 'sc-if') { if (bound(n, 'value', scope)) renderNodes(n, dst, scope); continue; }
      const el = document.importNode(n, false);
      for (const a of Array.from(el.attributes)) {
        const m = a.value.match(WHOLE);
        if (a.name.startsWith('on') && m) {
          el.removeAttribute(a.name);
          const fn = lookup(m[1], scope);
          if (typeof fn === 'function') el.addEventListener(a.name.slice(2), fn);
        } else if (a.value.indexOf('{{') !== -1) {
          el.setAttribute(a.name, interp(a.value, scope));
        }
      }
      renderNodes(n.content || n, el, scope);
      dst.appendChild(el);
    }
  }

  function mount() {
    const root = document.getElementById('dc-root');
    const entry = component('');
    const c = new entry.Cls(Object.assign({}, entry.defaults));
    c._render = () => {
      root.textContent = '';
      renderNodes(entry.tpl.content, root, c.renderVals() || {});
      for (const f of root.querySelectorAll('form')) {
        f.addEventListener('submit', (e) => {
          e.preventDefault();
          const b = f.querySelector('[type=submit]');
          if (b) { b.textContent = 'Preview only: this will send to Stagera'; }
        });
      }
    };
    c._render();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
