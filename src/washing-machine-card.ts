import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cardStyles } from "./styles";
import { resolveState } from "./state-mapping";
import type { HomeAssistant, WashingMachineCardConfig, LovelaceCardEditor } from "./types";

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
    const optionalRows = [this._config.program_entity, this._config.power_entity, this._config.door_entity].filter(
      Boolean
    ).length;
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
          ${this._renderProgram()} ${this._renderPower()} ${this._renderDoor()}
        </div>
      </ha-card>
    `;
  }

  private _renderProgram() {
    const programEntity = this._config?.program_entity;
    const timeEntity = this._config?.remaining_time_entity;
    if (!programEntity && !timeEntity) return nothing;

    const program = programEntity ? this.hass?.states[programEntity] : undefined;
    const remaining = timeEntity ? this.hass?.states[timeEntity] : undefined;

    if (!program && !remaining) return nothing;

    const programLabel = program?.state;
    const remainingLabel = remaining ? `${remaining.state} ${remaining.attributes.unit_of_measurement ?? ""}`.trim() : undefined;

    return html`
      <div class="row">
        <ha-icon icon="mdi:progress-clock"></ha-icon>
        <span>${programLabel ?? "Program"}</span>
        ${remainingLabel ? html`<span class="value">${remainingLabel}</span>` : nothing}
      </div>
    `;
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
    return html`
      <div class="row">
        <ha-icon icon=${isOpen ? "mdi:door-open" : "mdi:door-closed"}></ha-icon>
        <span>Door</span>
        <span class="value">${isOpen ? "Open" : "Closed"}</span>
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
