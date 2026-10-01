---
title: Progress
---

Progress uses [Reka UI](https://reka-ui.com) for progressbar role and ARIA values, with token visuals and optional vivid accent fill.

## Props

| Prop      | Description                                | Type                                            | Default |
| --------- | ------------------------------------------ | ----------------------------------------------- | ------- |
| `value`   | Current progress; null means indeterminate | `number \| null`                                | `0`     |
| `max`     | Maximum                                    | `number`                                        | `100`   |
| `variant` | Fill                                       | `brand \| accent`                               | `brand` |
| `tone`    | Accent hue, only for `accent`              | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`  |

Tone defaults to blue and affects accent only. Legacy aurora aliases accent. Keep colors consistent for equivalent states within a workflow.

Provide a purpose name, such as `aria-label="Upload progress"`. Finite values clamp to 0…max; invalid max falls back to 100 so visuals and ARIA agree. Null, NaN and infinite values are indeterminate and omit aria-valuenow. Reduced motion uses a static progress segment.
