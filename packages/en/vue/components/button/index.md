---
title: Button
---

Primary actions default to solid sky blue. Use `accent` with `tone` for brand emphasis; outline, soft and ghost styles support secondary actions. Success, warning and danger carry their semantic meanings.

Buttons and badges share green success, sun yellow warning and coral danger, with paired darker foreground tokens.

## Brand entrance

Use `variant="hero" size="xl"` for a homepage or campaign's main entrance. It pairs a deep blue-to-cyan gradient with white text, a soft shadow and a 56px touch target. Both themes retain the deep ramp and white foreground; never substitute the brighter decorative sky gradient. Hover deepens the colors, focus adds a two-color ring, and reduced motion disables the lift.

Keep one hero action per section. Everyday save, confirm and navigation controls use `primary` or secondary variants. `tone` and `appearance` do not change the hero palette. The shared `--ylf-hero-*` tokens define its colors and shadows; applications may adapt their router behavior while reusing these tokens.

## Registry

Copy Button and shared tokens into an application by URL through [Registry distribution](/en/guide/registry). Prefer `@yunlefun/vue` for centrally maintained foundations.

## Emphasis {#强调程度}

Accent/status variants accept `appearance="solid"`, `soft` or `outline`, including the legacy aurora alias. Other variants retain their appearance. `variant="soft"` is brand blue; colored soft buttons use `variant="accent" appearance="soft"`.

## Props

| Prop         | Description                             | Type                                                                                      | Default    |
| ------------ | --------------------------------------- | ----------------------------------------------------------------------------------------- | ---------- |
| `variant`    | Variant                                 | `primary \| hero \| accent \| secondary \| soft \| ghost \| success \| warning \| danger` | `primary`  |
| `tone`       | Accent hue, only for `accent`           | `blue \| sun \| cyan \| coral \| pink \| green`                                           | `blue`     |
| `appearance` | Emphasis for accent and status variants | `solid \| soft \| outline`                                                                | `solid`    |
| `size`       | Size                                    | `sm \| md \| lg \| xl`                                                                    | `md`       |
| `round`      | Pill radius                             | `boolean`                                                                                 | `true`     |
| `block`      | Full width                              | `boolean`                                                                                 | `false`    |
| `loading`    | Loading state                           | `boolean`                                                                                 | `false`    |
| `disabled`   | Disabled                                | `boolean`                                                                                 | `false`    |
| `tag`        | Rendered tag, such as `'a'`             | `string`                                                                                  | `'button'` |

Accent tone defaults to blue. Other variants keep brand/status meanings. Legacy aurora aliases accent.

## Slots

| Name      | Description  |
| --------- | ------------ |
| `default` | Button text  |
| `icon`    | Leading icon |

## Events

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| `click` | Click event, suppressed when disabled or loading |
