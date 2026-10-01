---
title: Tooltip
---

Tooltip uses [Reka UI](https://reka-ui.com) for floating positioning, delay and aria-describedby. Appearance reads tokens.

## Props

| Prop       | Description                                 | Type                             | Default                 |
| ---------- | ------------------------------------------- | -------------------------------- | ----------------------- |
| `content`  | Tooltip text                                | `string`                         | —                       |
| `side`     | Side / orientation                          | `top \| right \| bottom \| left` | `top`                   |
| `delay`    | Delay (ms)                                  | `number`                         | `300`                   |
| `disabled` | Disable the tooltip                         | `boolean`                        | `false`                 |
| `portalTo` | Existing overlay container within the theme | `string \| HTMLElement`          | ConfigProvider / `body` |

Id, class, aria-label, data attributes and events forward to the trigger. Icon buttons still need names independent of tooltip content. Use portal-to to keep local theme tooltips beside their trigger's theme.

## Slots

| Name      | Description                |
| --------- | -------------------------- |
| `default` | Trigger element (as-child) |
| `content` | Custom tooltip content     |

Disable tooltips when redundant, for example text segmented controls; enable them in icon only mode.
