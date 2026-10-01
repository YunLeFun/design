---
title: Radio
---

Radio groups use [Reka UI](https://reka-ui.com) for radiogroup semantics and arrow key roving focus; appearance reads shared tokens.

## Props

| Prop          | Description       | Type                     | Default    |
| ------------- | ----------------- | ------------------------ | ---------- |
| `v-model`     | Selected value    | `string`                 | —          |
| `options`     | Options           | `RadioOption[]`          | —          |
| `orientation` | Orientation       | `vertical \| horizontal` | `vertical` |
| `disabled`    | Disable the group | `boolean`                | `false`    |

### RadioOption

| Field      | Description       | Type       |
| ---------- | ----------------- | ---------- |
| `label`    | Label             | `string`   |
| `value`    | Value             | `string`   |
| `disabled` | Disable this item | `boolean?` |

Readonly options are supported. Name the group with aria-label or aria-labelledby; options use their labels. Arrows skip disabled items. Name/required forward to Reka for native forms.
