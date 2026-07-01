/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, q = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = Symbol(), X = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (o) => new pt(typeof o == "string" ? o : o + "", void 0, V), vt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, i, r) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[r + 1], o[0]);
  return new pt(e, o, V);
}, wt = (o, t) => {
  if (q) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, tt = q ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return yt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: At, defineProperty: bt, getOwnPropertyDescriptor: Et, getOwnPropertyNames: St, getOwnPropertySymbols: xt, getPrototypeOf: Ct } = Object, g = globalThis, et = g.trustedTypes, Pt = et ? et.emptyScript : "", I = g.reactiveElementPolyfillSupport, P = (o, t) => o, H = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Pt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (o, t) => !At(o, t), st = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && bt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = Et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const c = i == null ? void 0 : i.call(this);
      r == null || r.call(this, n), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...St(e), ...xt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(tt(i));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var r;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : H).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const c = s.getPropertyOptions(i), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((r = c.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? c.converter : H;
      this._$Em = i;
      const d = a.fromAttribute(e, c.type);
      this[i] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    var n;
    if (t !== void 0) {
      const c = this.constructor;
      if (i === !1 && (r = this[t]), s ?? (s = c.getPropertyOptions(t)), !((s.hasChanged ?? F)(r, e) || s.useDefault && s.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(c._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: c } = n, a = this[r];
        c !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[P("elementProperties")] = /* @__PURE__ */ new Map(), b[P("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: b }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, it = (o) => o, L = O.trustedTypes, ot = L ? L.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ut = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + f, Ot = `<${_t}>`, A = document, T = () => A.createComment(""), U = (o) => o === null || typeof o != "object" && typeof o != "function", Z = Array.isArray, Tt = (o) => Z(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", k = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, nt = />/g, y = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ct = /"/g, mt = /^(?:script|style|textarea|title)$/i, Ut = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), m = Ut(1), S = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), v = A.createTreeWalker(A, 129);
function ft(o, t) {
  if (!Z(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Nt = (o, t) => {
  const e = o.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = C;
  for (let c = 0; c < e; c++) {
    const a = o[c];
    let d, p, h = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === C ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = nt : p[2] !== void 0 ? (mt.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = y) : p[3] !== void 0 && (n = y) : n === y ? p[0] === ">" ? (n = i ?? C, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? y : p[3] === '"' ? ct : at) : n === ct || n === at ? n = y : n === rt || n === nt ? n = C : (n = y, i = void 0);
    const _ = n === y && o[c + 1].startsWith("/>") ? " " : "";
    r += n === C ? a + Ot : h >= 0 ? (s.push(d), a.slice(0, h) + ut + a.slice(h) + f + _) : a + f + (h === -2 ? c : _);
  }
  return [ft(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Nt(t, e);
    if (this.el = N.createElement(d, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = v.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ut)) {
          const u = p[n++], _ = i.getAttribute(h).split(f), $ = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: r, name: $[2], strings: _, ctor: $[1] === "." ? Rt : $[1] === "?" ? Dt : $[1] === "@" ? Ht : j }), i.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: r }), i.removeAttribute(h));
        if (mt.test(i.tagName)) {
          const h = i.textContent.split(f), u = h.length - 1;
          if (u > 0) {
            i.textContent = L ? L.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(h[_], T()), v.nextNode(), a.push({ type: 2, index: ++r });
            i.append(h[u], T());
          }
        }
      } else if (i.nodeType === 8) if (i.data === _t) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += f.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(o, t, e = o, s) {
  var n, c;
  if (t === S) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const r = U(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = x(o, i._$AS(o, t.values), i, s)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    v.currentNode = i;
    let r = v.nextNode(), n = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new R(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Lt(r, this, t)), this._$AV.push(d), a = s[++c];
      }
      n !== (a == null ? void 0 : a.index) && (r = v.nextNode(), n++);
    }
    return v.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), U(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Tt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const n = new Mt(i, this), c = n.u(this.options);
      n.p(e), this.T(c), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new R(this.O(T()), this.O(T()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = it(t).nextSibling;
      it(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = x(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = x(this, c[s + a], e, a), d === S && (d = this._$AH[a]), n || (n = !U(d) || d !== this._$AH[a]), d === l ? t = l : t !== l && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Dt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ht extends j {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? l) === S) return;
    const s = this._$AH, i = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== l && (s === l || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Lt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const W = O.litHtmlPolyfillSupport;
W == null || W(N, R), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.3");
const zt = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new R(t.insertBefore(T(), r), r, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class E extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return S;
  }
}
var dt;
E._$litElement$ = !0, E.finalized = !0, (dt = w.litElementHydrateSupport) == null || dt.call(w, { LitElement: E });
const B = w.litElementPolyfillSupport;
B == null || B({ LitElement: E });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: F }, It = (o = jt, t, e) => {
  const { kind: s, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(e.name, o), s === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, o, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, o, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, o, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(o) {
  return (t, e) => typeof e == "object" ? It(o, t, e) : ((s, i, r) => {
    const n = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), n ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $t(o) {
  return G({ ...o, state: !0, attribute: !1 });
}
const kt = vt`
  :host {
    --wmc-icon-size: 40px;
    --wmc-text-color: var(--primary-text-color);
    --wmc-secondary-color: var(--secondary-text-color);
    --wmc-row-gap: 12px;
  }

  ha-card {
    padding: 16px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: var(--wmc-row-gap);
  }

  .header ha-icon {
    --mdc-icon-size: var(--wmc-icon-size);
    color: var(--wmc-status-color, var(--wmc-secondary-color));
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 16px;
    font-weight: 500;
    color: var(--wmc-text-color);
  }

  .status-label {
    font-size: 14px;
    color: var(--wmc-status-color, var(--wmc-secondary-color));
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--wmc-text-color);
  }

  .row ha-icon {
    --mdc-icon-size: 20px;
    color: var(--wmc-secondary-color);
  }

  .row .value {
    margin-left: auto;
    color: var(--wmc-secondary-color);
  }

  .progress-outer {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--divider-color, #e0e0e0);
    overflow: hidden;
    margin-top: 4px;
  }

  .progress-inner {
    height: 100%;
    background: var(--wmc-status-color, var(--primary-color));
    transition: width 0.4s ease;
  }
`, Wt = {
  run: { label: "Running", icon: "mdi:washing-machine", color: "var(--state-active-color, var(--primary-color))" },
  wash: { label: "Running", icon: "mdi:washing-machine", color: "var(--state-active-color, var(--primary-color))" },
  spin: { label: "Spinning", icon: "mdi:washing-machine", color: "var(--state-active-color, var(--primary-color))" },
  rinse: { label: "Rinsing", icon: "mdi:washing-machine", color: "var(--state-active-color, var(--primary-color))" },
  delayedstart: { label: "Delayed start", icon: "mdi:clock-outline", color: "var(--secondary-text-color)" },
  delayed_start: { label: "Delayed start", icon: "mdi:clock-outline", color: "var(--secondary-text-color)" },
  pause: { label: "Paused", icon: "mdi:pause-circle-outline", color: "var(--secondary-text-color)" },
  actionrequired: { label: "Action required", icon: "mdi:alert-circle-outline", color: "var(--warning-color, orange)" },
  action_required: { label: "Action required", icon: "mdi:alert-circle-outline", color: "var(--warning-color, orange)" },
  error: { label: "Error", icon: "mdi:alert-circle", color: "var(--error-color, red)" },
  fail: { label: "Error", icon: "mdi:alert-circle", color: "var(--error-color, red)" },
  abort: { label: "Aborted", icon: "mdi:stop-circle-outline", color: "var(--secondary-text-color)" },
  finish: { label: "Finished", icon: "mdi:check-circle-outline", color: "var(--success-color, green)" },
  done: { label: "Finished", icon: "mdi:check-circle-outline", color: "var(--success-color, green)" },
  complete: { label: "Finished", icon: "mdi:check-circle-outline", color: "var(--success-color, green)" },
  ready: { label: "Ready", icon: "mdi:washing-machine", color: "var(--secondary-text-color)" },
  idle: { label: "Idle", icon: "mdi:washing-machine", color: "var(--secondary-text-color)" },
  off: { label: "Off", icon: "mdi:washing-machine-off", color: "var(--secondary-text-color)" },
  inactive: { label: "Off", icon: "mdi:washing-machine-off", color: "var(--secondary-text-color)" },
  unavailable: { label: "Unavailable", icon: "mdi:help-circle-outline", color: "var(--disabled-text-color)" },
  unknown: { label: "Unknown", icon: "mdi:help-circle-outline", color: "var(--disabled-text-color)" }
};
function Bt(o) {
  return o.replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim().replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
function qt(o, t) {
  const e = { ...Wt, ...t }, s = o.toLowerCase();
  if (e[s])
    return e[s];
  const i = Object.keys(e).filter((r) => s.includes(r)).sort((r, n) => n.length - r.length);
  return i.length > 0 ? e[i[0]] : {
    label: Bt(o),
    icon: "mdi:washing-machine",
    color: "var(--primary-text-color)"
  };
}
var Vt = Object.defineProperty, Ft = Object.getOwnPropertyDescriptor, J = (o, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Ft(t, e) : t, r = o.length - 1, n; r >= 0; r--)
    (n = o[r]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && Vt(t, e, i), i;
};
const Zt = "washing-machine-card-editor", Gt = [
  { name: "status_entity", required: !0, selector: { entity: {} } },
  { name: "program_entity", selector: { entity: {} } },
  { name: "program_phase_entity", selector: { entity: {} } },
  { name: "remaining_time_entity", selector: { entity: {} } },
  { name: "finish_time_entity", selector: { entity: {} } },
  { name: "progress_entity", selector: { entity: {} } },
  { name: "power_entity", selector: { entity: { domain: ["sensor"] } } },
  { name: "door_entity", selector: { entity: { domain: ["binary_sensor"] } } },
  { name: "door_open_color", selector: { text: {} } },
  { name: "door_closed_color", selector: { text: {} } },
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} } }
], Jt = {
  status_entity: "Status entity",
  program_entity: "Program entity (optional)",
  program_phase_entity: "Program phase/step entity (optional)",
  remaining_time_entity: "Remaining time entity (optional)",
  finish_time_entity: "Finish time entity (optional)",
  progress_entity: "Progress % entity (optional)",
  power_entity: "Power entity (optional)",
  door_entity: "Door entity (optional)",
  door_open_color: "Door open color (optional, e.g. red or var(--error-color))",
  door_closed_color: "Door closed color (optional)",
  name: "Name (optional)",
  icon: "Icon (optional)"
};
let z = class extends E {
  constructor() {
    super(...arguments), this._computeLabel = (o) => Jt[o.name] ?? o.name;
  }
  setConfig(o) {
    this._config = o;
  }
  _valueChanged(o) {
    o.stopPropagation();
    const t = o.detail.value;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return !this.hass || !this._config ? m`` : m`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Gt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
};
J([
  G({ attribute: !1 })
], z.prototype, "hass", 2);
J([
  $t()
], z.prototype, "_config", 2);
z = J([
  gt(Zt)
], z);
var Kt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, K = (o, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Yt(t, e) : t, r = o.length - 1, n; r >= 0; r--)
    (n = o[r]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && Kt(t, e, i), i;
};
function ht(o) {
  return o.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function Qt(o, t) {
  const e = t.toLowerCase();
  return e.startsWith("h") ? o * 60 : e.startsWith("s") ? o / 60 : o;
}
const Y = "washing-machine-card", Xt = "washing-machine-card-editor";
let M = class extends E {
  setConfig(o) {
    if (!o.status_entity)
      throw new Error("You must set a status_entity (e.g. an operation-state sensor for your washing machine).");
    this._config = o;
  }
  getCardSize() {
    return this._config ? 2 + [
      this._config.program_entity || this._config.program_phase_entity,
      this._config.remaining_time_entity || this._config.finish_time_entity || this._config.progress_entity,
      this._config.power_entity,
      this._config.door_entity
    ].filter(Boolean).length : 1;
  }
  static getConfigElement() {
    return document.createElement(Xt);
  }
  static getStubConfig(o) {
    const t = Object.keys(o.states).find((e) => {
      const s = e.toLowerCase();
      return (e.startsWith("sensor.") || e.startsWith("binary_sensor.")) && (s.includes("wash") || s.includes("wasmachine") || s.includes("laundry"));
    });
    return {
      type: `custom:${Y}`,
      status_entity: t ?? "sensor.washing_machine_operation_state"
    };
  }
  render() {
    if (!this._config || !this.hass)
      return m``;
    const o = this.hass.states[this._config.status_entity];
    if (!o)
      return m`<ha-card>
        <div class="rows"><div class="row">Entity not found: ${this._config.status_entity}</div></div>
      </ha-card>`;
    const t = qt(o.state, this._config.state_map), e = this._config.name ?? o.attributes.friendly_name ?? "Washing machine", s = this._config.icon ?? t.icon;
    return m`
      <ha-card style=${`--wmc-status-color: ${t.color}`}>
        <div class="header">
          <ha-icon icon=${s}></ha-icon>
          <div class="header-text">
            <span class="name">${e}</span>
            <span class="status-label">${t.label}</span>
          </div>
        </div>
        <div class="rows">
          ${this._renderProgram()} ${this._renderTiming()} ${this._renderPower()} ${this._renderDoor()}
        </div>
      </ha-card>
    `;
  }
  _renderProgram() {
    var r, n, c, a;
    const o = (r = this._config) == null ? void 0 : r.program_entity, t = (n = this._config) == null ? void 0 : n.program_phase_entity;
    if (!o && !t) return l;
    const e = o ? (c = this.hass) == null ? void 0 : c.states[o] : void 0, s = t ? (a = this.hass) == null ? void 0 : a.states[t] : void 0;
    if (!e && !s) return l;
    const i = [e == null ? void 0 : e.state, s == null ? void 0 : s.state].filter(Boolean).join(" · ");
    return i ? m`
      <div class="row">
        <ha-icon icon="mdi:washing-machine"></ha-icon>
        <span>${i}</span>
      </div>
    ` : l;
  }
  _renderTiming() {
    var p, h, u, _, $, Q;
    const o = (p = this._config) == null ? void 0 : p.remaining_time_entity, t = (h = this._config) == null ? void 0 : h.finish_time_entity, e = (u = this._config) == null ? void 0 : u.progress_entity;
    if (!o && !t && !e) return l;
    const s = o ? (_ = this.hass) == null ? void 0 : _.states[o] : void 0, i = t ? ($ = this.hass) == null ? void 0 : $.states[t] : void 0, r = e ? (Q = this.hass) == null ? void 0 : Q.states[e] : void 0;
    if (!s && !i && !r) return l;
    const n = s ? `${s.state} ${s.attributes.unit_of_measurement ?? ""}`.trim() : void 0, c = this._computeFinishLabel(i, s), a = r ? Number(r.state) : NaN, d = !Number.isNaN(a);
    return m`
      <div class="row">
        <ha-icon icon="mdi:progress-clock"></ha-icon>
        <span>${n ?? c ?? "Timing"}</span>
        ${n && c ? m`<span class="value">${c}</span>` : l}
      </div>
      ${d ? m`<div class="progress-outer">
            <div class="progress-inner" style=${`width: ${Math.min(100, Math.max(0, a))}%`}></div>
          </div>` : l}
    `;
  }
  _computeFinishLabel(o, t) {
    if (o) {
      const e = new Date(o.state);
      if (!Number.isNaN(e.getTime()))
        return `Ends ${ht(e)}`;
    }
    if (t) {
      const e = Number(t.state);
      if (!Number.isNaN(e)) {
        const s = Qt(e, String(t.attributes.unit_of_measurement ?? "min"));
        return `~${ht(new Date(Date.now() + s * 6e4))}`;
      }
    }
  }
  _renderPower() {
    var s, i;
    const o = (s = this._config) == null ? void 0 : s.power_entity;
    if (!o) return l;
    const t = (i = this.hass) == null ? void 0 : i.states[o];
    if (!t) return l;
    const e = t.attributes.unit_of_measurement ?? "W";
    return m`
      <div class="row">
        <ha-icon icon="mdi:flash"></ha-icon>
        <span>Power</span>
        <span class="value">${t.state} ${e}</span>
      </div>
    `;
  }
  _renderDoor() {
    var i, r, n, c;
    const o = (i = this._config) == null ? void 0 : i.door_entity;
    if (!o) return l;
    const t = (r = this.hass) == null ? void 0 : r.states[o];
    if (!t) return l;
    const e = t.state === "on", s = e ? ((n = this._config) == null ? void 0 : n.door_open_color) ?? "var(--warning-color, orange)" : ((c = this._config) == null ? void 0 : c.door_closed_color) ?? "var(--wmc-secondary-color)";
    return m`
      <div class="row" style=${`color: ${s}`}>
        <ha-icon icon=${e ? "mdi:door-open" : "mdi:door-closed"} style=${`color: ${s}`}></ha-icon>
        <span>Door</span>
        <span class="value" style=${`color: ${s}`}>${e ? "Open" : "Closed"}</span>
      </div>
    `;
  }
};
M.styles = kt;
K([
  G({ attribute: !1 })
], M.prototype, "hass", 2);
K([
  $t()
], M.prototype, "_config", 2);
M = K([
  gt(Y)
], M);
window.customCards = window.customCards || [];
window.customCards.push({
  type: Y,
  name: "Washing Machine Card",
  description: "A simple, easily customizable card for a washing machine's status, program, power and door state."
});
export {
  M as WashingMachineCard
};
