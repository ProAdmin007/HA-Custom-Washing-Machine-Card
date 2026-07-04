# Washing Machine Card

A simple, easily customizable [Home Assistant](https://www.home-assistant.io/) Lovelace card for a washing machine (or dryer, dishwasher, etc.). Unlike most washing-machine cards on HACS, this one doesn't assume a specific integration or vendor — you pick whichever entities your setup exposes (Home Connect, Miele, LG ThinQ, SmartThings, a smart plug, ...) via a visual editor.

## Features

- Header with a colored status icon badge, name, status label, and a right-aligned "Time left" stat
- A progress bar directly under the header showing how much longer the wash needs — works even without a dedicated progress-percentage entity, by tracking the highest remaining-time reading seen since the cycle started as its 100% baseline
- Program + current program phase/step, power consumption, and door open/closed shown as a row of compact chips below the bar (e.g. "Cotton 40 · Rinsing", "180 W", "Closed") — chips for entities you don't configure are simply omitted, no errors or empty placeholders
- Door chip color is separately configurable for open vs. closed
- Status label/icon/color mapping works across vendors out of the box, with an optional `state_map` override for vendor-specific state strings
- Three display modes: full (default), compact (a single status-badge row), or expandable (compact, tap to reveal the full card)
- Optional `tap_action`/`hold_action` (more-info, toggle, navigate, ...), using Home Assistant's standard action vocabulary
- Optional 24-hour/AM-PM toggle for all displayed times
- Visual (GUI) editor, plus full YAML config

The layout takes inspiration from two community cards: the header/chip/progress-bar composition from a Dutch multi-entity-row dashboard style, and the icon-badge + "time left" idea from [air-quality-card](https://github.com/KadenThomp36/air-quality-card)'s compact mode (which also inspired the compact/expandable display modes and the `tap_action`/`hold_action` handling, both described below).

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
display: full                                        # optional: full (default) | compact | expandable
tap_action:                                          # optional, HA action config
  action: more-info
hold_action:                                         # optional, HA action config
  action: toggle
time_format_24h: true                                # optional: true = 24h, false = AM/PM, unset = browser locale default
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
| `progress_entity` | No | Entity holding progress as a 0-100 number; drives the progress bar directly. Without it, the bar is derived from `remaining_time_entity`/`finish_time_entity` instead (see below). |
| `power_entity` | No | Entity holding current power draw (W) or energy. |
| `door_entity` | No | Sensor for the door. Works with a `binary_sensor` (`on` = open) or a plain `sensor` with a text state containing "open"/"ajar"; anything else is treated as closed. |
| `door_open_color` | No | CSS color (name, hex, or `var(--...)`) used for the door row when open. Defaults to a warning color. |
| `door_closed_color` | No | CSS color used for the door row when closed. Defaults to the theme's secondary text color. |
| `name` | No | Overrides the displayed name. |
| `icon` | No | Overrides the status-based icon. |
| `display` | No | `full` (default, everything visible), `compact` (a single status-badge row), or `expandable` (starts compact, tap to reveal the full card). |
| `tap_action` / `hold_action` | No | Standard [HA action config](https://www.home-assistant.io/dashboards/actions/) (`more-info`, `toggle`, `navigate`, `perform-action`, `url`, `none`). Ignored in `expandable` mode, where the tap is reserved for expanding/collapsing. |
| `time_format_24h` | No | `true` forces 24-hour time, `false` forces 12-hour AM/PM, unset uses the browser's locale default. |
| `state_map` | No | Extends/overrides the default status → `{label, icon, color}` mapping. Matched case-insensitively; unmapped states fall back to a title-cased display of the raw state. |

### The progress bar without a dedicated progress entity

If you don't have a percentage sensor, the bar is derived from `remaining_time_entity` (or `finish_time_entity`): the card remembers the highest remaining-time reading it has seen since the machine started running as the 100% baseline, then fills the bar as `1 - current/baseline`. The baseline resets whenever the status returns to a resting state (idle/off/ready/finished/...), so the next wash cycle starts from a fresh 0%.

### Real-world example: AEG (Home Connect-style integration)

An AEG washing machine integrated via a Home Connect-style integration (entities named `sensor.aeg_wasmachine_*` / `select.aeg_wasmachine_*`), plus a separate smart plug for power:

```yaml
type: custom:washing-machine-card
status_entity: sensor.aeg_wasmachine_appliancestate
program_entity: select.aeg_wasmachine_userselections_programuid
program_phase_entity: sensor.aeg_wasmachine_cyclephase
remaining_time_entity: sensor.aeg_wasmachine_timetoend
power_entity: sensor.wasmachine_vermogen
door_entity: binary_sensor.aeg_wasmachine_doorstate
```

A few things this example illustrates:

- `program_entity` doesn't have to be a `sensor` — a `select` entity holding the currently active program (as many integrations expose it) works just as well.
- Prefer a `sensor` with `device_class: duration` (here `sensor.aeg_wasmachine_timetoend`) for `remaining_time_entity` over a vaguely-named "finish in" sensor without a unit — check each candidate's attributes in **Developer Tools → States** before picking one.
- No dedicated `progress_entity` or `finish_time_entity` was available here, so the progress bar and finish-time estimate are both derived automatically from `remaining_time_entity` (see above).
- `power_entity` can point at any external power sensor (e.g. a smart plug) — it doesn't need to come from the same integration as the rest.

## Development

Plain JavaScript, no build step: edit `washing-machine-card.js` directly, copy/symlink it into `config/www/`, and reload the dashboard in your browser (bump the resource URL's `?v=` query string, or hard-refresh, if HA has it cached).

The visual editor uses Home Assistant's own `<ha-form>`, borrowing the frontend's already-loaded `LitElement` at runtime rather than bundling Lit as a dependency — so it only registers itself inside a real Home Assistant frontend, not in a standalone test page. YAML configuration works everywhere.

## License

MIT
