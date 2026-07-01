# Washing Machine Card

A simple, easily customizable [Home Assistant](https://www.home-assistant.io/) Lovelace card for a washing machine (or dryer, dishwasher, etc.). Unlike most washing-machine cards on HACS, this one doesn't assume a specific integration or vendor — you pick whichever entities your setup exposes (Home Connect, Miele, LG ThinQ, SmartThings, a smart plug, ...) via a visual editor.

## Features

- Status header with icon and label (running / paused / finished / error / ...)
- Optional program + remaining time row
- Optional power consumption row
- Optional door open/closed row
- Rows for entities you don't configure are simply omitted — no errors, no empty placeholders
- Status label/icon/color mapping works across vendors out of the box, with an optional `state_map` override for vendor-specific state strings
- Visual (GUI) editor, plus full YAML config

## Installation

### Via HACS (custom repository)

1. HACS → the three-dot menu (top right) → **Custom repositories**.
2. Add `https://github.com/ProAdmin007/HA-Custom-Washing-Machine-Card`, category **Dashboard**.
3. Install "Washing Machine Card", then add the resource if HACS doesn't do it automatically (Settings → Dashboards → Resources).

### Manual

1. Copy `dist/washing-machine-card.js` to `config/www/washing-machine-card.js`.
2. Settings → Dashboards → Resources → add `/local/washing-machine-card.js` as a JavaScript module.

## Configuration

Add the card via the dashboard UI ("Add card" → "Washing Machine Card") and fill in the entities, or use YAML:

```yaml
type: custom:washing-machine-card
status_entity: sensor.wasmachine_operation_state   # required
program_entity: sensor.wasmachine_program            # optional
remaining_time_entity: sensor.wasmachine_remaining_time  # optional
power_entity: sensor.wasmachine_power                # optional
door_entity: binary_sensor.wasmachine_deur           # optional
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
| `remaining_time_entity` | No | Entity holding the remaining time (state + optional `unit_of_measurement`). |
| `power_entity` | No | Entity holding current power draw (W) or energy. |
| `door_entity` | No | Binary sensor for the door; `on` is treated as open. |
| `name` | No | Overrides the displayed name. |
| `icon` | No | Overrides the status-based icon. |
| `state_map` | No | Extends/overrides the default status → `{label, icon, color}` mapping. Matched case-insensitively; unmapped states fall back to a title-cased display of the raw state. |

## Development

```bash
npm install
npm run build     # outputs dist/washing-machine-card.js
npm run watch      # rebuild on save
npm run typecheck
```

## License

MIT
