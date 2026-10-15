---
title: Input
description: A shared native text field with comfortable and compact density.
---

`YlfInput` keeps native input behavior and shares the Select control geometry. Use a visible label; describe invalid values with text connected by `aria-describedby`.

## Props

| Prop         | Description             | Type       | Default |
| ------------ | ----------------------- | ---------- | ------- |
| `modelValue` | Text value (`v-model`)  | `string`   | `''`    |
| `size`       | Control density         | `sm \| md` | `md`    |
| `invalid`    | Expose an invalid value | `boolean`  | `false` |

Native attributes and events such as `id`, `name`, `type`, `required`, `disabled`, `readonly`, `placeholder`, `autocomplete`, `input` and `blur` are forwarded to the input. Native composition events retain IME input behavior. This component is for text values; use a dedicated numeric control for numeric parsing.

The default target is at least 44px tall. Compact controls are 34px and grow to 44px for coarse pointers. The error state does not replace a visible error message.
