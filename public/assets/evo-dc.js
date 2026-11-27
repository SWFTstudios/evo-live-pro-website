/* Evo Live Pro page runtime: renders the design's .dc templates ({{ }}, <sc-if>, <sc-for>)
   and keeps them live with morphdom. Shared by the Node build (pre-render) and the browser. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EvoDC = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var EVENTS = { onClick: 'click', onChange: 'change', onSubmit: 'submit', onKeyDown: 'keydown', onFocus: 'focus', onMouseEnter: 'mouseenter', onInput: 'input' };
  var BOOL = { autoPlay: 'autoplay', muted: 'muted', loop: 'loop', playsInline: 'playsinline', checked: 'checked', disabled: 'disabled', selected: 'selected', autoFocus: 'data-autofocus' };

  function look(ctx, e) {
    e = e.trim();
    if (e === 'true') return true;
    if (e === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
    var v = ctx, ks = e.split('.');
    for (var i = 0; i < ks.length; i++) { if (v == null) return undefined; v = v[ks[i]]; }
    return v;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function subst(s, ctx, H) {
    // event handlers and refs -> data attributes pointing into the handler table
    s = s.replace(/\s(on[A-Z]\w*|ref)="\{\{([^}]*)\}\}"/g, function (_, name, ex) {
      var fn = look(ctx, ex);
      if (typeof fn !== 'function' || !H) return '';
      H.push(fn);
      if (name === 'ref') return ' data-ref="' + (H.length - 1) + '"';
      var ev = EVENTS[name] || name.slice(2).toLowerCase();
      return ' data-ev-' + ev + '="' + (H.length - 1) + '"';
    });
    // boolean attributes
    s = s.replace(/\s(autoPlay|muted|loop|playsInline|checked|disabled|selected|autoFocus)="\{\{([^}]*)\}\}"/g, function (_, name, ex) {
      return look(ctx, ex) ? ' ' + BOOL[name] : '';
    });
    s = s.replace(/\s(autoPlay|muted|loop|playsInline|autoFocus)="(true|false)"/g, function (_, name, v) { return v === 'true' ? ' ' + BOOL[name] : ''; });
    s = s.replace(/\shint-placeholder-(val|count)="[^"]*"/g, '');
    return s.replace(/\{\{([^}]*)\}\}/g, function (_, e) {
      var v = look(ctx, e);
      if (v === undefined || v === null || typeof v === 'function') return '';
      if (typeof v === 'boolean') return v ? 'true' : 'false';
      return esc(v);
    });
  }

  function render(tpl, ctx, H) {
    var out = '', i = 0;
    while (i < tpl.length) {
      var a = tpl.indexOf('<sc-', i);
      if (a < 0) { out += subst(tpl.slice(i), ctx, H); break; }
      out += subst(tpl.slice(i, a), ctx, H);
      var tag = tpl.indexOf('<sc-if', a) === a ? 'sc-if' : 'sc-for';
      var close = tpl.indexOf('>', a), open = tpl.slice(a, close + 1);
      var depth = 1, re = new RegExp('<' + tag + '[\\s>]|</' + tag + '>', 'g'), mm;
      re.lastIndex = close + 1;
      while ((mm = re.exec(tpl))) { if (mm[0][1] === '/') { depth--; if (!depth) break; } else depth++; }
      var inner = tpl.slice(close + 1, mm.index);
      i = mm.index + tag.length + 3;
      if (tag === 'sc-if') {
        if (look(ctx, open.match(/value="\{\{([^}]*)\}\}"/)[1])) out += render(inner, ctx, H);
      } else {
        var list = look(ctx, open.match(/list="\{\{([^}]*)\}\}"/)[1]) || [];
        var as = open.match(/as="(\w+)"/)[1];
        for (var k = 0; k < list.length; k++) { var c = Object.create(ctx); c[as] = list[k]; out += render(inner, c, H); }
      }
    }
    return out;
  }

  function makeComponent(logicSrc, props, env) {
    var DCLogic = function (p) { this.props = p || {}; this.state = {}; };
    DCLogic.prototype.setState = function (patch) {
      var s = typeof patch === 'function' ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, s);
      if (this._schedule) this._schedule();
    };
    DCLogic.prototype.forceUpdate = function () { if (this._schedule) this._schedule(); };
    var f = new Function('DCLogic', 'window', 'document', 'setTimeout', logicSrc + '\n;return Component;');
    var C = f(DCLogic, env.window, env.document, env.setTimeout);
    return new C(props);
  }

  function mount(el, tpl, logicSrc, props) {
    var morphdom = window.morphdom, H = [];
    var c = makeComponent(logicSrc, props, { window: window, document: document, setTimeout: window.setTimeout.bind(window) });
    var queued = false, first = true;
    function paint() {
      queued = false;
      H = [];
      var html = render(tpl, c.renderVals(), H);
      var next = document.createElement(el.tagName);
      next.innerHTML = html;
      morphdom(el, next, {
        childrenOnly: true,
        onBeforeElUpdated: function (from, to) {
          if (from === document.activeElement && (from.tagName === 'INPUT' || from.tagName === 'TEXTAREA') && from.type !== 'checkbox') {
            to.value = from.value;
          }
          if (from.tagName === 'VIDEO' && from.isEqualNode(to)) return false;
          // Form fields marked data-keep hold what the visitor typed; re-renders leave them alone.
          if (from.hasAttribute && from.hasAttribute('data-keep')) return false;
          return true;
        }
      });
      el.__handlers = H;
      var refs = el.querySelectorAll('[data-ref]');
      for (var i = 0; i < refs.length; i++) { var fn = H[+refs[i].getAttribute('data-ref')]; if (fn) fn(refs[i]); }
      var af = el.querySelector('[data-autofocus]');
      if (af && af !== document.activeElement && af.offsetParent !== null) af.focus();
      if (first) { first = false; if (c.componentDidMount) c.componentDidMount(); }
    }
    c._schedule = function () { if (!queued) { queued = true; (window.queueMicrotask || setTimeout)(paint); } };
    function handler(type) {
      return function (e) {
        var attr = 'data-ev-' + type, n = e.target;
        while (n && n !== el.parentNode) {
          if (n.getAttribute && n.hasAttribute(attr)) {
            if (type === 'mouseenter' && e.relatedTarget && n.contains(e.relatedTarget)) return;
            var fn = el.__handlers[+n.getAttribute(attr)];
            if (fn) fn.call(n, e);
            if (type !== 'mouseenter' && type !== 'focus') return;
            return;
          }
          n = n.parentNode;
        }
      };
    }
    el.addEventListener('click', handler('click'));
    el.addEventListener('submit', handler('submit'));
    el.addEventListener('keydown', handler('keydown'));
    el.addEventListener('focusin', handler('focus'));
    el.addEventListener('mouseover', handler('mouseenter'));
    // React-style onChange fires on every keystroke for text fields
    el.addEventListener('input', function (e) {
      var t = e.target;
      if (t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT') return;
      handler('change')(e);
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT') handler('change')(e);
    });
    paint();
    return c;
  }

  return { render: render, makeComponent: makeComponent, mount: mount };
});
