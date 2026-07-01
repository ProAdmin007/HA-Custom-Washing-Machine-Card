/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, B = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (r) => new ht(typeof r == "string" ? r : r + "", void 0, V), gt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new ht(e, r, V);
}, yt = (r, t) => {
  if (B) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = N.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, X = B ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return $t(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: At, getOwnPropertyDescriptor: wt, getOwnPropertyNames: bt, getOwnPropertySymbols: Et, getPrototypeOf: St } = Object, $ = globalThis, tt = $.trustedTypes, xt = tt ? tt.emptyScript : "", k = $.reactiveElementPolyfillSupport, C = (r, t) => r, D = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? xt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (r, t) => !vt(r, t), et = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = et) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && At(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const c = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...bt(e), ...Et(e)];
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
      for (const i of s) e.unshift(X(i));
    } else t !== void 0 && e.push(X(t));
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
    return yt(t, this.constructor.elementStyles), t;
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
    var o;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : D).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const c = s.getPropertyOptions(i), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : D;
      this._$Em = i;
      const h = a.fromAttribute(e, c.type);
      this[i] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    var n;
    if (t !== void 0) {
      const c = this.constructor;
      if (i === !1 && (o = this[t]), s ?? (s = c.getPropertyOptions(t)), !((s.hasChanged ?? F)(o, e) || s.useDefault && s.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(c._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: c } = n, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), k == null || k({ ReactiveElement: w }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, st = (r) => r, z = P.trustedTypes, it = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, dt = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + f, Ct = `<${pt}>`, A = document, O = () => A.createComment(""), U = (r) => r === null || typeof r != "object" && typeof r != "function", Z = Array.isArray, Pt = (r) => Z(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", I = `[ 	
\f\r]`, x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, ot = />/g, g = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, at = /"/g, ut = /^(?:script|style|textarea|title)$/i, Ot = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = Ot(1), E = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), y = A.createTreeWalker(A, 129);
function mt(r, t) {
  if (!Z(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ut = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = x;
  for (let c = 0; c < e; c++) {
    const a = r[c];
    let h, p, d = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === x ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = ot : p[2] !== void 0 ? (ut.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = g) : p[3] !== void 0 && (n = g) : n === g ? p[0] === ">" ? (n = i ?? x, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? g : p[3] === '"' ? at : nt) : n === at || n === nt ? n = g : n === rt || n === ot ? n = x : (n = g, i = void 0);
    const _ = n === g && r[c + 1].startsWith("/>") ? " " : "";
    o += n === x ? a + Ct : d >= 0 ? (s.push(h), a.slice(0, d) + dt + a.slice(d) + f + _) : a + f + (d === -2 ? c : _);
  }
  return [mt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [h, p] = Ut(t, e);
    if (this.el = T.createElement(h, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = y.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(dt)) {
          const u = p[n++], _ = i.getAttribute(d).split(f), H = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: H[2], strings: _, ctor: H[1] === "." ? Mt : H[1] === "?" ? Rt : H[1] === "@" ? Ht : j }), i.removeAttribute(d);
        } else d.startsWith(f) && (a.push({ type: 6, index: o }), i.removeAttribute(d));
        if (ut.test(i.tagName)) {
          const d = i.textContent.split(f), u = d.length - 1;
          if (u > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(d[_], O()), y.nextNode(), a.push({ type: 2, index: ++o });
            i.append(d[u], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === pt) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(f, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += f.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(r, t, e = r, s) {
  var n, c;
  if (t === E) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = S(r, i._$AS(r, t.values), i, s)), t;
}
class Tt {
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
    y.currentNode = i;
    let o = y.nextNode(), n = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new R(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Nt(o, this, t)), this._$AV.push(h), a = s[++c];
      }
      n !== (a == null ? void 0 : a.index) && (o = y.nextNode(), n++);
    }
    return y.currentNode = A, i;
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
    t = S(this, t, e), U(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
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
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement(mt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new Tt(i, this), c = n.u(this.options);
      n.p(e), this.T(c), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new R(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = st(t).nextSibling;
      st(t).remove(), t = i;
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
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = S(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = S(this, c[s + a], e, a), h === E && (h = this._$AH[a]), n || (n = !U(h) || h !== this._$AH[a]), h === l ? t = l : t !== l && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Rt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ht extends j {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? l) === E) return;
    const s = this._$AH, i = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== l && (s === l || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const W = P.litHtmlPolyfillSupport;
W == null || W(T, R), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.3");
const Dt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new R(t.insertBefore(O(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class b extends w {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Dt(e, this.renderRoot, this.renderOptions);
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
    return E;
  }
}
var lt;
b._$litElement$ = !0, b.finalized = !0, (lt = v.litElementHydrateSupport) == null || lt.call(v, { LitElement: b });
const q = v.litElementPolyfillSupport;
q == null || q({ LitElement: b });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: F }, Lt = (r = zt, t, e) => {
  const { kind: s, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, r, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(r) {
  return (t, e) => typeof e == "object" ? Lt(r, t, e) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ft(r) {
  return G({ ...r, state: !0, attribute: !1 });
}
const jt = gt`
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
`, kt = {
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
function It(r) {
  return r.replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim().replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
function Wt(r, t) {
  const e = { ...kt, ...t }, s = r.toLowerCase();
  if (e[s])
    return e[s];
  const i = Object.keys(e).filter((o) => s.includes(o)).sort((o, n) => n.length - o.length);
  return i.length > 0 ? e[i[0]] : {
    label: It(r),
    icon: "mdi:washing-machine",
    color: "var(--primary-text-color)"
  };
}
var qt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, J = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Bt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && qt(t, e, i), i;
};
const Vt = "washing-machine-card-editor", Ft = [
  { name: "status_entity", required: !0, selector: { entity: {} } },
  { name: "program_entity", selector: { entity: {} } },
  { name: "remaining_time_entity", selector: { entity: {} } },
  { name: "power_entity", selector: { entity: { domain: ["sensor"] } } },
  { name: "door_entity", selector: { entity: { domain: ["binary_sensor"] } } },
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} } }
], Zt = {
  status_entity: "Status entity",
  program_entity: "Program entity (optional)",
  remaining_time_entity: "Remaining time entity (optional)",
  power_entity: "Power entity (optional)",
  door_entity: "Door entity (optional)",
  name: "Name (optional)",
  icon: "Icon (optional)"
};
let L = class extends b {
  constructor() {
    super(...arguments), this._computeLabel = (r) => Zt[r.name] ?? r.name;
  }
  setConfig(r) {
    this._config = r;
  }
  _valueChanged(r) {
    r.stopPropagation();
    const t = r.detail.value;
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
        .schema=${Ft}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
};
J([
  G({ attribute: !1 })
], L.prototype, "hass", 2);
J([
  ft()
], L.prototype, "_config", 2);
L = J([
  _t(Vt)
], L);
var Gt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, K = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Jt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && Gt(t, e, i), i;
};
const Y = "washing-machine-card", Kt = "washing-machine-card-editor";
let M = class extends b {
  setConfig(r) {
    if (!r.status_entity)
      throw new Error("You must set a status_entity (e.g. an operation-state sensor for your washing machine).");
    this._config = r;
  }
  getCardSize() {
    return this._config ? 2 + [this._config.program_entity, this._config.power_entity, this._config.door_entity].filter(
      Boolean
    ).length : 1;
  }
  static getConfigElement() {
    return document.createElement(Kt);
  }
  static getStubConfig(r) {
    const t = Object.keys(r.states).find((e) => {
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
    const r = this.hass.states[this._config.status_entity];
    if (!r)
      return m`<ha-card>
        <div class="rows"><div class="row">Entity not found: ${this._config.status_entity}</div></div>
      </ha-card>`;
    const t = Wt(r.state, this._config.state_map), e = this._config.name ?? r.attributes.friendly_name ?? "Washing machine", s = this._config.icon ?? t.icon;
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
          ${this._renderProgram()} ${this._renderPower()} ${this._renderDoor()}
        </div>
      </ha-card>
    `;
  }
  _renderProgram() {
    var n, c, a, h;
    const r = (n = this._config) == null ? void 0 : n.program_entity, t = (c = this._config) == null ? void 0 : c.remaining_time_entity;
    if (!r && !t) return l;
    const e = r ? (a = this.hass) == null ? void 0 : a.states[r] : void 0, s = t ? (h = this.hass) == null ? void 0 : h.states[t] : void 0;
    if (!e && !s) return l;
    const i = e == null ? void 0 : e.state, o = s ? `${s.state} ${s.attributes.unit_of_measurement ?? ""}`.trim() : void 0;
    return m`
      <div class="row">
        <ha-icon icon="mdi:progress-clock"></ha-icon>
        <span>${i ?? "Program"}</span>
        ${o ? m`<span class="value">${o}</span>` : l}
      </div>
    `;
  }
  _renderPower() {
    var s, i;
    const r = (s = this._config) == null ? void 0 : s.power_entity;
    if (!r) return l;
    const t = (i = this.hass) == null ? void 0 : i.states[r];
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
    var s, i;
    const r = (s = this._config) == null ? void 0 : s.door_entity;
    if (!r) return l;
    const t = (i = this.hass) == null ? void 0 : i.states[r];
    if (!t) return l;
    const e = t.state === "on";
    return m`
      <div class="row">
        <ha-icon icon=${e ? "mdi:door-open" : "mdi:door-closed"}></ha-icon>
        <span>Door</span>
        <span class="value">${e ? "Open" : "Closed"}</span>
      </div>
    `;
  }
};
M.styles = jt;
K([
  G({ attribute: !1 })
], M.prototype, "hass", 2);
K([
  ft()
], M.prototype, "_config", 2);
M = K([
  _t(Y)
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
