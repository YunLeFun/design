---
title: Dropdown Menu
---

Dropdown Menu uses [Reka UI](https://reka-ui.com) for positioning, arrow/Home/End/typeahead navigation and focus. Tokens define visuals.

## Props

| Prop           | Description                                 | Type                    | Default                 |
| -------------- | ------------------------------------------- | ----------------------- | ----------------------- |
| `items`        | Menu items                                  | `readonly MenuItem[]`   | —                       |
| `v-model:open` | Open state                                  | `boolean`               | `false`                 |
| `portalTo`     | Existing overlay container within the theme | `string \| HTMLElement` | ConfigProvider / `body` |

Class, data/ARIA attributes and events forward to menu content. `portal-to` targets an existing local theme container; otherwise ConfigProvider/body is retained. Arrows, Home/End, Enter and Escape navigate, select and close; disabled items are skipped.

### MenuItem

| Field       | Description        | Type       |
| ----------- | ------------------ | ---------- |
| `label`     | Label              | `string`   |
| `value`     | Selected value     | `string`   |
| `disabled`  | Disabled           | `boolean?` |
| `separator` | Render a separator | `boolean?` |

## Events

| Name     | Description              |
| -------- | ------------------------ |
| `select` | Emits the selected value |

An empty string value can mean “All” or “Clear filter” and still emits select. Items without a value emit no selection.
