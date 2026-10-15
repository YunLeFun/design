---
title: Agent Status
---

Show agent connection and task states with semantic colors, shapes and explicit text. The application supplies the state; this component does not infer connectivity or run continuous animations.

`state` is a presentation role: `offline`, `connecting`, `ready` (ready or successful), `working`, `waiting` (human action required), `error`, or `unknown` (unverified). Always supply a localized `label`. A listening HTTP callback can use `waiting` and “Callback listening”; do not claim that it is connected.

## Props

| Property | Description                        | Type            | Default  |
| -------- | ---------------------------------- | --------------- | -------- |
| `state`  | Presentation state                 | `YlfAgentState` | Required |
| `label`  | Localized, truthful status text    | `string`        | Required |
| `live`   | Politely announce a single summary | `boolean`       | `false`  |

Live announcements are disabled by default to avoid repeated announcements in polled lists. Enable `live` on a single summary only.

Source and Registry changes are pending publication. See [agent components](/en/guide/agent-ui).
