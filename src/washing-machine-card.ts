import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cardStyles } from "./styles";
import { resolveState } from "./state-mapping";
import type { HassEntity, HomeAssistant, WashingMachineCardConfig, LovelaceCardEditor } from "./types";

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toMinutes(value: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u.startsWith("h")) return value * 60;
  if (u.startsWith("s")) return value / 60;
  return value; // assume minutes by default
}

const CARD_TAG = "washing-machine-card";
const EDITOR_TAG = "washing-machine-card-editor";

@customElement(CARD_TAG)
export class WashingMachineCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WashingMachineCardConfig;

  static styles = cardStyles;

  public setConfig(config: WashingMachineCardConfig): void {
    if (!config.status_entity) {
      throw new Error("You must set a status_entity (e.g. an operation-state sensor for your washing machine).");
    }
    this._config = config;
  }

  public getCardSize(): number {
    if (!this._config) return 1;
    const optionalRows = [
      this._config.program_entity || this._config.program_phase_entity,
      this._config.remaining_time_entity || this._config.finish_time_entity || this._config.progress_entity,
      this._config.power_entity,
      this._config.door_entity,
    ].filter(Boolean).length;
    return 2 + optionalRows;
  }

  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement(EDITOR_TAG) as unknown as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): WashingMachineCardConfig {
    const guess = Object.keys(hass.states).find((id) => {
      const lower = id.toLowerCase();
      return (
        (id.startsWith("sensor.") || id.startsWith("binary_sensor.")) &&
        (lower.includes("wash") || lower.includes("wasmachine") || lower.includes("laundry"))
      );
    });
    return {
      type: `custom:${CARD_TAG}`,
      status_entity: guess ?? "sensor.washing_machine_operation_state",
    };
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const statusState = this.hass.states[this._config.status_entity];
    if (!statusState) {
      return html`<ha-card>
        <div class="rows"><div class="row">Entity not found: ${this._config.status_entity}</div></div>
      </ha-card>`;
    }

    const resolved = resolveState(statusState.state, this._config.state_map);
    const name = this._config.name ?? statusState.attributes.friendly_name ?? "Washing machine";
    const icon = this._config.icon ?? resolved.icon;

    return html`
      <ha-card style=${`--wmc-status-color: ${resolved.color}`}>
        <div class="header">
          <ha-icon icon=${icon}></ha-icon>
          <div class="header-text">
            <span class="name">${name}</span>
            <span class="status-label">${resolved.label}</span>
          </div>
        </div>
        <div class="rows">
          ${this._renderProgram()} ${this._renderTiming()} ${this._renderPower()} ${this._renderDoor()}
        </div>
      </ha-card>
    `;
  }

  private _renderProgram() {
    const programEntity = this._config?.program_entity;
    const phaseEntity = this._config?.program_phase_entity;
    if (!programEntity && !phaseEntity) return nothing;

    const program = programEntity ? this.hass?.states[programEntity] : undefined;
    const phase = phaseEntity ? this.hass?.states[phaseEntity] : undefined;
    if (!program && !phase) return nothing;

    const label = [program?.state, phase?.state].filter(Boolean).join(" · ");
    if (!label) return nothing;

    return html`
      <div class="row">
        <ha-icon icon="mdi:washing-machine"></ha-icon>
        <span>${label}</span>
      </div>
    `;
  }

  private _renderTiming() {
    const remainingEntityId = this._config?.remaining_time_entity;
    const finishEntityId = this._config?.finish_time_entity;
    const progressEntityId = this._config?.progress_entity;
    if (!remainingEntityId && !finishEntityId && !progressEntityId) return nothing;

    const remaining = remainingEntityId ? this.hass?.states[remainingEntityId] : undefined;
    const finish = finishEntityId ? this.hass?.states[finishEntityId] : undefined;
    const progress = progressEntityId ? this.hass?.states[progressEntityId] : undefined;
    if (!remaining && !finish && !progress) return nothing;

    const remainingLabel = remaining
      ? `${remaining.state} ${remaining.attributes.unit_of_measurement ?? ""}`.trim()
      : undefined;
    const finishLabel = this._computeFinishLabel(finish, remaining);

    const progressValue = progress ? Number(progress.state) : NaN;
    const showBar = !Number.isNaN(progressValue);

    return html`
      <div class="row">
        <ha-icon icon="mdi:progress-clock"></ha-icon>
        <span>${remainingLabel ?? finishLabel ?? "Timing"}</span>
        ${remainingLabel && finishLabel ? html`<span class="value">${finishLabel}</span>` : nothing}
      </div>
      ${showBar
        ? html`<div class="progress-outer">
            <div class="progress-inner" style=${`width: ${Math.min(100, Math.max(0, progressValue))}%`}></div>
          </div>`
        : nothing}
    `;
  }

  private _computeFinishLabel(finish: HassEntity | undefined, remaining: HassEntity | undefined): string | undefined {
    if (finish) {
      const date = new Date(finish.state);
      if (!Number.isNaN(date.getTime())) {
        return `Ends ${formatTime(date)}`;
      }
    }
    if (remaining) {
      const value = Number(remaining.state);
      if (!Number.isNaN(value)) {
        const minutes = toMinutes(value, String(remaining.attributes.unit_of_measurement ?? "min"));
        return `~${formatTime(new Date(Date.now() + minutes * 60000))}`;
      }
    }
    return undefined;
  }

  private _renderPower() {
    const entityId = this._config?.power_entity;
    if (!entityId) return nothing;
    const entity = this.hass?.states[entityId];
    if (!entity) return nothing;

    const unit = entity.attributes.unit_of_measurement ?? "W";
    return html`
      <div class="row">
        <ha-icon icon="mdi:flash"></ha-icon>
        <span>Power</span>
        <span class="value">${entity.state} ${unit}</span>
      </div>
    `;
  }

  private _renderDoor() {
    const entityId = this._config?.door_entity;
    if (!entityId) return nothing;
    const entity = this.hass?.states[entityId];
    if (!entity) return nothing;

    const isOpen = entity.state === "on";
    const color = isOpen
      ? this._config?.door_open_color ?? "var(--warning-color, orange)"
      : this._config?.door_closed_color ?? "var(--wmc-secondary-color)";

    return html`
      <div class="row" style=${`color: ${color}`}>
        <ha-icon icon=${isOpen ? "mdi:door-open" : "mdi:door-closed"} style=${`color: ${color}`}></ha-icon>
        <span>Door</span>
        <span class="value" style=${`color: ${color}`}>${isOpen ? "Open" : "Closed"}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CARD_TAG]: WashingMachineCard;
  }
}

(window as unknown as { customCards: unknown[] }).customCards = (window as unknown as { customCards: unknown[] }).customCards || [];
(window as unknown as { customCards: Array<Record<string, string>> }).customCards.push({
  type: CARD_TAG,
  name: "Washing Machine Card",
  description: "A simple, easily customizable card for a washing machine's status, program, power and door state.",
});

import "./editor";
