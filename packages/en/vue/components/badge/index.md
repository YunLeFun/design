---
title: Badge
---

Light sky blue labels mark everyday content; a sun star marks featured content. Categories and states use vivid fills with contrast checked foregrounds.

## Choosing a badge {#选择徽标}

- `brand`: everyday brand markers such as new content or versions.
- `featured`: recommendations, with a yellow star, pale background and neutral text.
- `accent`: vivid solids, default sky blue; choose sun, cyan, coral, pink or green through `tone`.
- `neutral`: ordinary information such as archived content or drafts.
- `success` / `warning` / `danger` / `info`: green, sun yellow, coral and cyan, with status symbols and text.

Badges use the body font at 12px/500 by default, without shadows or continuous animation. Foreground, fill and border tokens adapt together across themes. Use short, explicit labels; color supplements meaning.

Sky blue pairs white text in light mode with dark blue in dark mode. Other solid badges pair darker same-hue text. See [Shared status colors](/en/guide/colors#状态也来自同一套色板).

Badges display information. Use an interactive component for filtering or actions.

## Emphasis {#强调程度}

Choose `appearance="solid"`, `soft` or `outline` for accent/status variants. Other variants retain their own appearance.

## Props

| Prop         | Description                             | Type                                                                             | Default |
| ------------ | --------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| `variant`    | Semantic or brand role                  | `featured \| accent \| brand \| neutral \| success \| warning \| danger \| info` | `brand` |
| `tone`       | Accent hue, only for `accent`           | `blue \| sun \| cyan \| coral \| pink \| green`                                  | `blue`  |
| `appearance` | Emphasis for accent and status variants | `solid \| soft \| outline`                                                       | `solid` |
| `round`      | Pill radius; small radius when false    | `boolean`                                                                        | `true`  |

Tone defaults to blue and affects accent only. Featured always uses feature tokens. Legacy `aurora` aliases featured.

## Slots

| Name      | Description   |
| --------- | ------------- |
| `default` | Badge content |
