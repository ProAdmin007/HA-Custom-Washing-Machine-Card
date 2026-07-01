export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  formatEntityState?: (stateObj: HassEntity) => string;
  localize?: (key: string, ...args: unknown[]) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface StateMapEntry {
  label: string;
  icon: string;
  color: string;
}

export type StateMap = Record<string, StateMapEntry>;

export interface WashingMachineCardConfig {
  type: string;
  status_entity: string;
  program_entity?: string;
  program_phase_entity?: string;
  remaining_time_entity?: string;
  finish_time_entity?: string;
  progress_entity?: string;
  power_entity?: string;
  door_entity?: string;
  door_open_color?: string;
  door_closed_color?: string;
  name?: string;
  icon?: string;
  state_map?: StateMap;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: WashingMachineCardConfig): void;
}
