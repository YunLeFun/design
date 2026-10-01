---
title: Separator
---

Separator uses [Reka UI](https://reka-ui.com) for horizontal/vertical and semantic/decorative behavior. Decorative controls screen reader visibility.

Neutral thin lines organize body content. Brand uses sky blue; accent/tone identifies content; spectrum joins six solid bands for headers, brand sections and events. Keep bands clear of prose and preserve status words.

Vertical separators need a height from their layout or consumer, such as `style="height: 24px"`.

## Props

| Prop          | Description                   | Type                                            | Default      |
| ------------- | ----------------------------- | ----------------------------------------------- | ------------ |
| `orientation` | Side / orientation            | `horizontal \| vertical`                        | `horizontal` |
| `decorative`  | Decorative only               | `boolean`                                       | `true`       |
| `variant`     | Visual role                   | `neutral \| brand \| accent \| spectrum`        | `neutral`    |
| `tone`        | Accent hue, only for `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`       |
