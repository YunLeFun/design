---
title: Tabs
---

Tabs use [Reka UI](https://reka-ui.com) for arrow/Home/End keyboard navigation and roving focus. Tokens define the indicator and appearance.

## Props

| Prop          | Description                        | Type                     | Default      |
| ------------- | ---------------------------------- | ------------------------ | ------------ |
| `v-model`     | Current tab                        | `string`                 | —            |
| `items`       | Tabs `{ label, value, disabled? }` | `TabItem[]`              | —            |
| `orientation` | Side / orientation                 | `horizontal \| vertical` | `horizontal` |

## Slots

Provide each panel with a slot named after its value, such as cloud or fun.

Readonly items are supported. Reka manages tab/panel ARIA associations. Arrows and Home/End move focus and select automatically, skipping disabled items. Use Segmented Control for filters without associated panels.
