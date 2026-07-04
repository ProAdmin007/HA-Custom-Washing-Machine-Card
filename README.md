# Washing Machine Card

A simple, easily customizable [Home Assistant](https://www.home-assistant.io/) Lovelace card for a washing machine (or dryer, dishwasher, etc.). Unlike most washing-machine cards on HACS, this one doesn't assume a specific integration or vendor — you pick whichever entities your setup exposes (Home Connect, Miele, LG ThinQ, SmartThings, a smart plug, ...) via a visual editor.

## Features

- Status header with icon and label (running / paused / finished / error / ...)
- Optional program + current program phase/step row (e.g. "Cotton 40 · Rinsing")
- Optional remaining time, finish time and progress bar — finish time is computed from the remaining time if you don't have a dedicated finish-time entity
- Optional power consumption row
- Optional door open/closed row, with separately configurable colors for each state
- Rows for entities you don't configure are simply omitted — no errors, no empty placeholders
- Status label/icon/color mapping works across vendors out of the box, with an optional `state_map` override for vendor-specific state strings
- Visual (GUI) editor, plus full YAML config

## Installation

### Via HACS (custom repository)

1. HACS → the three-dot menu (top right) → **Custom repositories**.
2. Add `https://github.com/ProAdmin007/HA-Custom-Washing-Machine-Card`, category **Dashboard**.
3. Install "Washing Machine Card", then add the resource if HACS doesn't do it automatically (Settings → Dashboards → Resources).

### Manual

1. Copy `washing-machine-card.js` to `config/www/washing-machine-card.js`.
2. Settings → Dashboards → Resources → add `/local/washing-machine-card.js` as a JavaScript module.

## Configuration

Add the card via the dashboard UI ("Add card" → "Washing Machine Card") and fill in the entities, or use YAML:

```yaml
type: custom:washing-machine-card
status_entity: sensor.wasmachine_operation_state   # required
program_entity: sensor.wasmachine_program            # optional
program_phase_entity: sensor.wasmachine_phase        # optional, e.g. "Rinsing"/"Spinning"
remaining_time_entity: sensor.wasmachine_remaining_time  # optional
finish_time_entity: sensor.wasmachine_finish_time    # optional, absolute datetime
progress_entity: sensor.wasmachine_progress          # optional, 0-100
power_entity: sensor.wasmachine_power                # optional
door_entity: binary_sensor.wasmachine_deur           # optional
door_open_color: "red"                               # optional, defaults to a warning color
door_closed_color: "green"                            # optional, defaults to the theme's secondary text color
name: "Wasmachine"                                   # optional, defaults to the status entity's friendly name
icon: mdi:washing-machine                            # optional, overrides the status-based icon
state_map:                                           # optional, extend/override the default status mapping
  delayedstart:
    label: "Delayed start"
    icon: mdi:clock-outline
    color: "var(--secondary-text-color)"
```

| Option | Required | Description |
|---|---|---|
| `status_entity` | Yes | Entity whose state represents the machine's operation status (e.g. Run/Finished/Ready). |
| `program_entity` | No | Entity holding the active program name. |
| `program_phase_entity` | No | Entity holding the current step/phase within the program (e.g. Wash/Rinse/Spin). Shown alongside the program name. |
| `remaining_time_entity` | No | Entity holding the remaining time (state + optional `unit_of_measurement`, minutes/hours/seconds). |
| `finish_time_entity` | No | Entity holding an absolute finish datetime. If omitted but `remaining_time_entity` is set, the finish time is estimated as now + remaining time. |
| `progress_entity` | No | Entity holding progress as a 0-100 number; drives the progress bar. Without this entity, no progress bar is shown — there's no reliable way to derive a percentage from remaining time alone. |
| `power_entity` | No | Entity holding current power draw (W) or energy. |
| `door_entity` | No | Binary sensor for the door; `on` is treated as open. |
| `door_open_color` | No | CSS color (name, hex, or `var(--...)`) used for the door row when open. Defaults to a warning color. |
| `door_closed_color` | No | CSS color used for the door row when closed. Defaults to the theme's secondary text color. |
| `name` | No | Overrides the displayed name. |
| `icon` | No | Overrides the status-based icon. |
| `state_map` | No | Extends/overrides the default status → `{label, icon, color}` mapping. Matched case-insensitively; unmapped states fall back to a title-cased display of the raw state. |

## Development

Plain JavaScript, no build step: edit `washing-machine-card.js` directly, copy/symlink it into `config/www/`, and reload the dashboard in your browser (bump the resource URL's `?v=` query string, or hard-refresh, if HA has it cached).

The visual editor uses Home Assistant's own `<ha-form>`, borrowing the frontend's already-loaded `LitElement` at runtime rather than bundling Lit as a dependency — so it only registers itself inside a real Home Assistant frontend, not in a standalone test page. YAML configuration works everywhere.

## License

MIT
