---
title: Card
---

Neutral content surfaces can use cloud glass, a solid accent edge or a tinted surface. Disable `hoverable` explicitly for static content so lifting does not imply an action.

## Props

| Prop        | Description                      | Type                                            | Default  |
| ----------- | -------------------------------- | ----------------------------------------------- | -------- |
| `variant`   | Surface variant                  | `soft \| glass \| accent \| tinted`             | `soft`   |
| `tone`      | Accent hue for `accent / tinted` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`   |
| `hoverable` | Gently lift on hover             | `boolean`                                       | `true`   |
| `padding`   | Padding, any CSS value           | `string`                                        | `'22px'` |

## Slots

| Name      | Description  |
| --------- | ------------ |
| `default` | Card content |

Tone defaults to blue and applies to accent/tinted. Legacy gradient aliases the solid accent top edge rather than a gradient border.
