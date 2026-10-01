---
title: Switch
---

Switch uses [Reka UI](https://reka-ui.com) for switch role, Space/Enter and focus. Shared tokens define its appearance.

## Props

| Prop       | Description                   | Type                                            | Default |
| ---------- | ----------------------------- | ----------------------------------------------- | ------- |
| `v-model`  | On/off state                  | `boolean`                                       | `false` |
| `variant`  | On-state track                | `brand \| accent`                               | `brand` |
| `tone`     | Accent hue, only for `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`  |
| `size`     | Size                          | `sm \| md`                                      | `md`    |
| `disabled` | Disabled                      | `boolean`                                       | `false` |

Tone defaults to blue and affects accent only. Legacy aurora aliases accent. Use consistent colors for equivalent states in a workflow.

Name the purpose through aria-label or an associated label. Space/Enter toggle; disabled controls do not respond. Name, value and required forward to Reka for native form submission.
