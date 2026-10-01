---
title: Slider
---

Slider uses [Reka UI](https://reka-ui.com) for dragging, keyboard steps and multiple thumbs. Tokens define appearance. The model is an array: `[n]` for one value, `[a, b]` for a range.

## Props

| Prop          | Description                             | Type                | Default |
| ------------- | --------------------------------------- | ------------------- | ------- |
| `v-model`     | Current values                          | `number[]`          | `[50]`  |
| `min`         | Minimum                                 | `number`            | `0`     |
| `max`         | Maximum                                 | `number`            | `100`   |
| `step`        | Step                                    | `number`            | `1`     |
| `disabled`    | Disabled                                | `boolean`           | `false` |
| `label`       | Accessible name for the value or group  | `string`            | `数值`  |
| `thumbLabels` | Ordered accessible names for each thumb | `readonly string[]` | —       |

Use `label="Volume"` for a value or `:thumb-labels="['Minimum price', 'Maximum price']"` for a range. Missing endpoint names fall back to the label plus ordinal. Arrows follow step; Home/End reach bounds. Disabled thumbs leave the focus order. Touch targets are at least 44px; reduced motion disables transitions.

## Events

ValueCommit emits number[] when a drag or keyboard adjustment completes. Use `@value-commit` to persist completed interactions while v-model maintains the interface state.
