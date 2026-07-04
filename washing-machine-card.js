/**
 * Washing Machine Card
 * A simple, easily customizable Home Assistant Lovelace card for a washing machine.
 * Vanilla JS, no build step: edit this file directly and reload the browser.
 *
 * https://github.com/ProAdmin007/HA-Custom-Washing-Machine-Card
 */

const CARD_TAG = "washing-machine-card";
const EDITOR_TAG = "washing-machine-card-editor";

// ============================================
// STATUS MAPPING
// Vendor/integration status strings vary (Home Connect's "Run"/"Finished", others
// differ), so raw states are matched case-insensitively by substring against this
// table rather than hardcoding one vendor's vocabulary. Unmapped states fall back
// to a title-cased display of the raw string instead of erroring.
// ============================================

const DEFAULT_STATE_MAP = {
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
  unknown: { label: "Unknown", icon: "mdi:help-circle-outline", color: "var(--disabled-text-color)" },
};

function titleCase(text) {
  return text
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// Status keys considered "not running" — used to reset the derived progress
// baseline (see _computeEffectiveRemainingMinutes) so a new cycle starts fresh.
const RESTING_STATUS_KEYS = new Set([
  "idle", "off", "inactive", "ready", "finish", "done", "complete", "abort", "unavailable", "unknown",
]);

function resolveState(rawState, overrides) {
  const merged = { ...DEFAULT_STATE_MAP, ...overrides };
  const normalized = rawState.toLowerCase();

  if (merged[normalized]) return { key: normalized, ...merged[normalized] };

  const matches = Object.keys(merged)
    .filter((key) => normalized.includes(key))
    .sort((a, b) => b.length - a.length);
  if (matches.length > 0) return { key: matches[0], ...merged[matches[0]] };

  return { key: null, label: titleCase(rawState), icon: "mdi:washing-machine", color: "var(--primary-text-color)" };
}

function toMinutes(value, unit) {
  const u = String(unit).toLowerCase();
  if (u.startsWith("h")) return value * 60;
  if (u.startsWith("s")) return value / 60;
  return value; // assume minutes by default
}

// use24Hour: true forces 24-hour time, false forces 12-hour AM/PM, undefined
// leaves it to the browser's locale default.
function formatTime(date, use24Hour) {
  const options = { hour: "2-digit", minute: "2-digit" };
  if (typeof use24Hour === "boolean") options.hour12 = !use24Hour;
  return date.toLocaleTimeString([], options);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Some integrations expose the door as a binary_sensor ("on"/"off"), others as
// a plain sensor with a native-language text state (e.g. "Open"/"Dicht"). Only
// explicit "open" wording (or "on") counts as open; anything else — including
// unrecognized text — is treated as closed, which is the safer default.
function isDoorOpenState(state) {
  const normalized = String(state).toLowerCase();
  if (normalized === "on") return true;
  return normalized.includes("open") || normalized.includes("ajar");
}

// ============================================
// CARD
// ============================================

const STYLE = `
  :host {
    --wmc-icon-size: 40px;
    --wmc-text-color: var(--primary-text-color);
    --wmc-secondary-color: var(--secondary-text-color);
    --wmc-row-gap: 12px;
  }
  ha-card { padding: 16px; }
  ha-card.compact { padding: 12px 16px; }
  ha-card.clickable, .header.clickable { cursor: pointer; }
  ha-card.clickable { transition: background 0.15s ease; }
  ha-card.clickable:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04); }
  .header { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
  .icon-badge { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; background: color-mix(in srgb, var(--wmc-status-color, var(--wmc-secondary-color)) 18%, transparent); }
  .icon-badge .status-icon { --mdc-icon-size: 24px; color: var(--wmc-status-color, var(--wmc-secondary-color)); }
  .header-text { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
  .name { font-size: 16px; font-weight: 500; color: var(--wmc-text-color); }
  .status-label { font-size: 14px; color: var(--wmc-status-color, var(--wmc-secondary-color)); }
  .time-stat { display: flex; flex-direction: column; align-items: flex-end; text-align: right; flex: 0 0 auto; }
  .time-stat .time-label { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--wmc-secondary-color); }
  .time-stat .time-label ha-icon { --mdc-icon-size: 14px; }
  .time-stat .time-value { font-size: 18px; font-weight: 600; color: var(--wmc-status-color, var(--wmc-text-color)); }
  .rows { display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--wmc-text-color); }
  .row ha-icon { --mdc-icon-size: 20px; color: var(--wmc-secondary-color); }
  .row .value { margin-left: auto; color: var(--wmc-secondary-color); }
  .progress-outer { width: 100%; height: 6px; border-radius: 3px; background: var(--divider-color, #e0e0e0); overflow: hidden; margin: 4px 0 12px; }
  .progress-inner { height: 100%; background: var(--wmc-status-color, var(--primary-color)); transition: width 0.4s ease; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 12px; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); font-size: 12px; color: var(--wmc-secondary-color); }
  .chip ha-icon { --mdc-icon-size: 14px; color: inherit; }
  .compact-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .compact-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto; }
  .compact-title { font-size: 1.05em; font-weight: 600; color: var(--wmc-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .status-badge { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 16px; font-size: 0.85em; font-weight: 500; color: var(--wmc-text-color); background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); flex: 0 0 auto; }
  .status-badge ha-icon { --mdc-icon-size: 18px; color: var(--wmc-status-color, var(--wmc-secondary-color)); }
  .expand-chevron { --mdc-icon-size: 20px; color: var(--wmc-secondary-color); flex: 0 0 auto; transition: transform 0.2s ease; }
  .expand-chevron.expanded { transform: rotate(180deg); }
`;

class WashingMachineCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._expanded = false;
    this._progressBaseline = undefined;
  }

  setConfig(config) {
    if (!config || !config.status_entity) {
      throw new Error("You must set a status_entity (e.g. an operation-state sensor for your washing machine).");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    if (!this._config) return 1;
    if (this._isCompact()) return 1;
    const optionalRows = [
      this._config.program_entity || this._config.program_phase_entity,
      this._config.remaining_time_entity || this._config.finish_time_entity || this._config.progress_entity,
      this._config.power_entity,
      this._config.door_entity,
    ].filter(Boolean).length;
    return 2 + optionalRows;
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(hass) {
    const guess = Object.keys(hass.states).find((id) => {
      const lower = id.toLowerCase();
      return (
        (id.startsWith("sensor.") || id.startsWith("binary_sensor.")) &&
        (lower.includes("wash") || lower.includes("wasmachine") || lower.includes("laundry"))
      );
    });
    return { type: `custom:${CARD_TAG}`, status_entity: guess || "sensor.washing_machine_operation_state" };
  }

  // display: "compact" always collapses to the status-badge row; "expandable"
  // starts collapsed and toggles open on tap; "full" (default) always shows everything.
  _isCompact() {
    if (this._config.display === "compact") return true;
    if (this._config.display === "expandable") return !this._expanded;
    return false;
  }

  _isExpandable() {
    return this._config.display === "expandable";
  }

  _toggleExpanded() {
    this._expanded = !this._expanded;
    this._render();
  }

  // Dispatches HA's standard action event so tap_action/hold_action support the
  // full action vocabulary (more-info/toggle/navigate/perform-action/...).
  _fireAction(action) {
    const actionKey = `${action}_action`;
    if (!this._config[actionKey]) return;
    this.dispatchEvent(
      new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config: this._config, action } })
    );
  }

  // In expandable mode the tap toggles expand/collapse (on the whole card when
  // collapsed, on just the header once expanded, since the header is the part
  // that stays present in both states); tap_action/hold_action are ignored
  // while a card is expandable, matching the reserved gesture.
  _wireCardActions(compact) {
    const card = this.shadowRoot.querySelector("ha-card");
    if (!card) return;

    if (this._isExpandable()) {
      const toggleTarget = compact ? card : this.shadowRoot.querySelector(".header");
      if (toggleTarget) {
        toggleTarget.classList.add("clickable");
        toggleTarget.addEventListener("click", () => this._toggleExpanded());
      }
      return;
    }

    const hasTap = !!this._config.tap_action;
    const hasHold = !!this._config.hold_action;
    if (!hasTap && !hasHold) return;

    card.classList.add("clickable");
    if (hasTap) card.addEventListener("click", () => this._fireAction("tap"));
    if (hasHold) {
      let timer = null;
      let held = false;
      const start = () => {
        held = false;
        timer = setTimeout(() => {
          held = true;
          this._fireAction("hold");
        }, 500);
      };
      const end = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
      card.addEventListener("mousedown", start);
      card.addEventListener("mouseup", end);
      card.addEventListener("mouseleave", end);
      card.addEventListener("touchstart", start, { passive: true });
      card.addEventListener("touchend", end);
      card.addEventListener(
        "click",
        (e) => {
          if (held) {
            e.stopImmediatePropagation();
            held = false;
          }
        },
        true
      );
    }
  }

  _chip(icon, label, color) {
    const style = color ? ` style="color:${color}"` : "";
    return `<div class="chip"${style}><ha-icon icon="${icon}"${style}></ha-icon><span>${label}</span></div>`;
  }

  _renderProgramChip() {
    const cfg = this._config;
    if (!cfg.program_entity && !cfg.program_phase_entity) return "";
    const program = cfg.program_entity ? this._hass.states[cfg.program_entity] : undefined;
    const phase = cfg.program_phase_entity ? this._hass.states[cfg.program_phase_entity] : undefined;
    const label = [program?.state, phase?.state].filter(Boolean).map(escapeHtml).join(" · ");
    if (!label) return "";
    return this._chip("mdi:playlist-play", label);
  }

  // Formats the finish time alone (no "Ends"/"~" wording context — that's implied
  // by where it's rendered): a real finish_time_entity is exact, a value derived
  // from remaining_time_entity is prefixed with "~" since it's an estimate.
  _computeFinishLabel(finish, remaining) {
    const use24Hour = this._config.time_format_24h;
    if (finish) {
      const date = new Date(finish.state);
      if (!Number.isNaN(date.getTime())) return formatTime(date, use24Hour);
    }
    if (remaining) {
      const value = Number(remaining.state);
      if (!Number.isNaN(value)) {
        const minutes = toMinutes(value, remaining.attributes.unit_of_measurement || "min");
        return `~${formatTime(new Date(Date.now() + minutes * 60000), use24Hour)}`;
      }
    }
    return undefined;
  }

  // Minutes remaining right now, from whichever source is configured: a direct
  // remaining-time reading, or the gap to an absolute finish time.
  _computeEffectiveRemainingMinutes(remaining, finish) {
    if (remaining) {
      const value = Number(remaining.state);
      if (!Number.isNaN(value)) return toMinutes(value, remaining.attributes.unit_of_measurement || "min");
    }
    if (finish) {
      const date = new Date(finish.state);
      if (!Number.isNaN(date.getTime())) return (date.getTime() - Date.now()) / 60000;
    }
    return undefined;
  }

  // Without a dedicated progress_entity, derive a percentage from the remaining
  // time itself: remember the highest remaining value seen since the machine
  // started running as the 100% baseline, then progress = 1 - current/baseline.
  // Resets whenever the status returns to a resting state (idle/off/finished/...)
  // so the next cycle starts from a fresh baseline.
  _computeDerivedProgress(statusKey, effectiveMinutes) {
    if (RESTING_STATUS_KEYS.has(statusKey) || effectiveMinutes === undefined) {
      this._progressBaseline = undefined;
      return undefined;
    }
    if (this._progressBaseline === undefined || effectiveMinutes > this._progressBaseline) {
      this._progressBaseline = effectiveMinutes;
    }
    if (!this._progressBaseline) return undefined;
    return (1 - effectiveMinutes / this._progressBaseline) * 100;
  }

  // Gathers everything time/progress related once per render, shared by the
  // header's "Time left" stat, the progress bar, and the end-time chip.
  _computeTimeInfo(statusKey) {
    const cfg = this._config;
    if (!cfg.remaining_time_entity && !cfg.finish_time_entity && !cfg.progress_entity) return null;

    const remaining = cfg.remaining_time_entity ? this._hass.states[cfg.remaining_time_entity] : undefined;
    const finish = cfg.finish_time_entity ? this._hass.states[cfg.finish_time_entity] : undefined;
    const progress = cfg.progress_entity ? this._hass.states[cfg.progress_entity] : undefined;
    if (!remaining && !finish && !progress) return null;

    const remainingLabel = remaining
      ? escapeHtml(`${remaining.state} ${remaining.attributes.unit_of_measurement || ""}`.trim())
      : undefined;
    const endLabel = this._computeFinishLabel(finish, remaining);
    const effectiveMinutes = this._computeEffectiveRemainingMinutes(remaining, finish);
    const progressValue = progress ? Number(progress.state) : this._computeDerivedProgress(statusKey, effectiveMinutes);

    return { remainingLabel, endLabel, progressValue };
  }

  _renderTimeStat(timeInfo) {
    if (!timeInfo || !timeInfo.remainingLabel) return "";
    return `
      <div class="time-stat">
        <span class="time-label"><ha-icon icon="mdi:timer-outline"></ha-icon>Time left</span>
        <span class="time-value">${timeInfo.remainingLabel}</span>
      </div>
    `;
  }

  _renderBar(timeInfo) {
    const progressValue = timeInfo?.progressValue;
    if (typeof progressValue !== "number" || Number.isNaN(progressValue)) return "";
    const pct = Math.min(100, Math.max(0, progressValue));
    return `<div class="progress-outer"><div class="progress-inner" style="width:${pct}%"></div></div>`;
  }

  _renderEndChip(timeInfo) {
    if (!timeInfo || !timeInfo.endLabel) return "";
    return this._chip("mdi:clock-end", timeInfo.endLabel);
  }

  _renderPowerChip() {
    const cfg = this._config;
    if (!cfg.power_entity) return "";
    const entity = this._hass.states[cfg.power_entity];
    if (!entity) return "";
    const unit = entity.attributes.unit_of_measurement || "W";
    return this._chip("mdi:flash", escapeHtml(`${entity.state} ${unit}`));
  }

  _renderDoorChip() {
    const cfg = this._config;
    if (!cfg.door_entity) return "";
    const entity = this._hass.states[cfg.door_entity];
    if (!entity) return "";
    const isOpen = isDoorOpenState(entity.state);
    const color = isOpen ? cfg.door_open_color || "var(--warning-color, orange)" : cfg.door_closed_color || "var(--wmc-secondary-color)";
    return this._chip(isOpen ? "mdi:door-open" : "mdi:door-closed", isOpen ? "Open" : "Closed", color);
  }

  _render() {
    if (!this._config || !this._hass) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    const cfg = this._config;
    const statusState = this._hass.states[cfg.status_entity];
    if (!statusState) {
      this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card><div class="rows"><div class="row">Entity not found: ${escapeHtml(
        cfg.status_entity
      )}</div></div></ha-card>`;
      return;
    }

    const resolved = resolveState(statusState.state, cfg.state_map);
    const name = escapeHtml(cfg.name || statusState.attributes.friendly_name || "Washing machine");
    const icon = cfg.icon || resolved.icon;

    if (this._isCompact()) {
      this._renderCompact(resolved, name, icon);
      return;
    }

    const expandable = this._isExpandable();
    const timeInfo = this._computeTimeInfo(resolved.key);
    const chips = [this._renderProgramChip(), this._renderEndChip(timeInfo), this._renderPowerChip(), this._renderDoorChip()]
      .filter(Boolean)
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card style="--wmc-status-color: ${resolved.color}">
        <div class="header">
          <div class="icon-badge"><ha-icon class="status-icon" icon="${icon}"></ha-icon></div>
          <div class="header-text">
            <span class="name">${name}</span>
            <span class="status-label">${escapeHtml(resolved.label)}</span>
          </div>
          ${this._renderTimeStat(timeInfo)}
          ${expandable ? '<ha-icon class="expand-chevron expanded" icon="mdi:chevron-down"></ha-icon>' : ""}
        </div>
        ${this._renderBar(timeInfo)}
        ${chips ? `<div class="chips">${chips}</div>` : ""}
      </ha-card>
    `;
    this._wireCardActions(false);
  }

  _renderCompact(resolved, name, icon) {
    const expandable = this._isExpandable();
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card class="compact">
        <div class="compact-row">
          <span class="compact-left">
            ${expandable ? '<ha-icon class="expand-chevron" icon="mdi:chevron-down"></ha-icon>' : ""}
            <span class="compact-title">${name}</span>
          </span>
          <div class="status-badge" style="--wmc-status-color: ${resolved.color}">
            <ha-icon icon="${icon}"></ha-icon>
            <span>${escapeHtml(resolved.label)}</span>
          </div>
        </div>
      </ha-card>
    `;
    this._wireCardActions(true);
  }
}

customElements.define(CARD_TAG, WashingMachineCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: "Washing Machine Card",
  description: "A simple, easily customizable card for a washing machine's status, program, power and door state.",
});

// ============================================
// VISUAL CONFIGURATION EDITOR
// Home Assistant's own frontend already loads Lit for its internal components, so
// rather than bundling Lit as a dependency, we borrow the already-loaded LitElement
// via an internal HA element's prototype chain. This gives us <ha-form> (which needs
// a Lit-compatible host) for free, with zero build step and zero dependencies.
// Outside a real HA frontend (e.g. a plain test harness) this lookup fails and the
// editor simply isn't registered; YAML configuration still works everywhere.
// ============================================

const _haViewElement = customElements.get("hui-masonry-view") || customElements.get("hui-view");
const LitElement = _haViewElement ? Object.getPrototypeOf(_haViewElement) : undefined;

if (LitElement && !customElements.get(EDITOR_TAG)) {
  const html = LitElement.prototype.html;

  const SCHEMA = [
    { name: "status_entity", required: true, selector: { entity: {} } },
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
    { name: "icon", selector: { icon: {} } },
    { name: "time_format_24h", selector: { boolean: {} } },
    {
      name: "display",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "full", label: "Full (all details)" },
            { value: "compact", label: "Compact (status badge only)" },
            { value: "expandable", label: "Expandable (compact, tap to expand)" },
          ],
        },
      },
    },
    { name: "tap_action", selector: { ui_action: {} } },
    { name: "hold_action", selector: { ui_action: {} } },
  ];

  const LABELS = {
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
    icon: "Icon (optional)",
    time_format_24h: "Use 24-hour time (off = AM/PM)",
    display: "Display mode",
    tap_action: "Tap action (optional)",
    hold_action: "Hold action (optional)",
  };

  class WashingMachineCardEditor extends LitElement {
    static get properties() {
      return { hass: { type: Object }, _config: { type: Object } };
    }

    setConfig(config) {
      this._config = config;
    }

    _computeLabel = (schema) => LABELS[schema.name] || schema.name;

    _valueChanged(ev) {
      ev.stopPropagation();
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: ev.detail.value }, bubbles: true, composed: true }));
    }

    render() {
      if (!this.hass || !this._config) return html``;
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      `;
    }
  }

  customElements.define(EDITOR_TAG, WashingMachineCardEditor);
}
