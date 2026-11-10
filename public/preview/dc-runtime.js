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

  function renderNodes(src, dst, scope) {
    for (const n of src.childNodes) {
      if (n.nodeType === 3) { dst.appendChild(document.createTextNode(interp(n.nodeValue, scope))); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.localName;
      if (tag === 'helmet') continue;
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
    const tpl = document.getElementById('dc-template');
    const logic = document.getElementById('dc-logic');
    const root = document.getElementById('dc-root');
    const decl = JSON.parse(logic.getAttribute('data-props') || '{}');
    const props = {};
    for (const k in decl) if (k[0] !== '$' && decl[k] && 'default' in decl[k]) props[k] = decl[k].default;
    const Component = new Function('DCLogic', logic.textContent + '\nreturn Component;')(DCLogic);
    const c = new Component(props);
    c._render = () => {
      root.textContent = '';
      renderNodes(tpl.content, root, c.renderVals() || {});
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
