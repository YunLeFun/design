---
title: Button
---

Primary actions default to solid sky blue. Use `accent` with `tone` for brand emphasis; outline, soft and ghost styles support secondary actions. Success, warning and danger carry their semantic meanings.

Buttons and badges share green success, sun yellow warning and coral danger, with paired darker foreground tokens.

## Registry

Copy Button and shared tokens into an application by URL through [Registry distribution](/en/guide/registry). Prefer `@yunlefun/vue` for centrally maintained foundations.

## Emphasis {#强调程度}

Accent/status variants accept `appearance="solid"`, `soft` or `outline`, including the legacy aurora alias. Other variants retain their appearance. `variant="soft"` is brand blue; colored soft buttons use `variant="accent" appearance="soft"`.

## Props

| Prop         | Description                             | Type                                                                              | Default    |
| ------------ | --------------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| `variant`    | Variant                                 | `primary \| accent \| secondary \| soft \| ghost \| success \| warning \| danger` | `primary`  |
| `tone`       | Accent hue, only for `accent`           | `blue \| sun \| cyan \| coral \| pink \| green`                                   | `blue`     |
| `appearance` | Emphasis for accent and status variants | `solid \| soft \| outline`                                                        | `solid`    |
| `size`       | Size                                    | `sm \| md \| lg`                                                                  | `md`       |
| `round`      | Pill radius                             | `boolean`                                                                         | `true`     |
| `block`      | Full width                              | `boolean`                                                                         | `false`    |
| `loading`    | Loading state                           | `boolean`                                                                         | `false`    |
| `disabled`   | Disabled                                | `boolean`                                                                         | `false`    |
| `tag`        | Rendered tag, such as `'a'`             | `string`                                                                          | `'button'` |

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
