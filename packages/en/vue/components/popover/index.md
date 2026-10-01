---
title: Popover
---

Popover uses [Reka UI](https://reka-ui.com) for positioning, outside dismissal and focus; appearance reads tokens.

## Props

| Prop           | Description                                 | Type                             | Default                 |
| -------------- | ------------------------------------------- | -------------------------------- | ----------------------- |
| `v-model:open` | Open state                                  | `boolean`                        | `false`                 |
| `side`         | Side / orientation                          | `top \| right \| bottom \| left` | `bottom`                |
| `align`        | Alignment                                   | `start \| center \| end`         | `center`                |
| `portalTo`     | Existing overlay container within the theme | `string \| HTMLElement`          | ConfigProvider / `body` |

Class, data/ARIA attributes and events forward to content. Reka manages association IDs. The default name associates with the trigger; use purpose describing trigger text. Place local portals inside the same theme boundary.

## Slots

| Name      | Description                |
| --------- | -------------------------- |
| `trigger` | Trigger element (as-child) |
| `default` | Popover content            |
