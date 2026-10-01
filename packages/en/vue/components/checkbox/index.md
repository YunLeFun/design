---
title: Checkbox
---

Checkbox uses [Reka UI](https://reka-ui.com) for role, keyboard and indeterminate state, and shared tokens for appearance.

## Props

| Prop       | Description          | Type                         | Default |
| ---------- | -------------------- | ---------------------------- | ------- |
| `v-model`  | Checked state        | `boolean \| 'indeterminate'` | `false` |
| `value`    | Submitted form value | `string`                     | —       |
| `disabled` | Disabled             | `boolean`                    | `false` |

Each checkbox needs a name: set `aria-label="Agree to the terms"` or associate `id` with `<label for>`. An adjacent span is not an automatic label. Name/required forward to Reka UI. Checked values appear in native FormData; disabled values are omitted.
