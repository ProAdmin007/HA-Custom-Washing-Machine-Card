import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, WashingMachineCardConfig } from "./types";

const EDITOR_TAG = "washing-machine-card-editor";

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
] as const;

const LABELS: Record<string, string> = {
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
};

@customElement(EDITOR_TAG)
export class WashingMachineCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WashingMachineCardConfig;

  public setConfig(config: WashingMachineCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  private _valueChanged(ev: CustomEvent<{ value: WashingMachineCardConfig }>): void {
    ev.stopPropagation();
    const newConfig = ev.detail.value;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

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
