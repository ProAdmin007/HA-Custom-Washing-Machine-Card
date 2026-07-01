import type { StateMap, StateMapEntry } from "./types";

// Ordered from most specific to most generic; matched by substring against
// the raw entity state (case-insensitive), so it works across vendors/integrations
// (e.g. Home Connect's "Run"/"Finished"/"DelayedStart", or a plain "on"/"off").
export const DEFAULT_STATE_MAP: StateMap = {
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

function titleCase(text: string): string {
  return text
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function resolveState(rawState: string, overrides?: StateMap): StateMapEntry {
  const merged: StateMap = { ...DEFAULT_STATE_MAP, ...overrides };
  const normalized = rawState.toLowerCase();

  // Exact key match first, then longest-key substring match, so overrides
  // for full vendor strings (e.g. "delayedstart") win over generic ones.
  if (merged[normalized]) {
    return merged[normalized];
  }

  const matches = Object.keys(merged)
    .filter((key) => normalized.includes(key))
    .sort((a, b) => b.length - a.length);

  if (matches.length > 0) {
    return merged[matches[0]];
  }

  return {
    label: titleCase(rawState),
    icon: "mdi:washing-machine",
    color: "var(--primary-text-color)",
  };
}
