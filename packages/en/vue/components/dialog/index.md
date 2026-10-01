---
title: Dialog
---

Dialog uses [Reka UI](https://reka-ui.com) for backdrop, focus trap, Escape/outside dismissal, scroll lock and title/description associations. Shared tokens supply its appearance.

## Props

| Prop              | Description                                  | Type                    | Default                 |
| ----------------- | -------------------------------------------- | ----------------------- | ----------------------- |
| `v-model:open`    | Open state                                   | `boolean`               | `false`                 |
| `title`           | Visible title                                | `string`                | —                       |
| `description`     | Description                                  | `string`                | —                       |
| `accessibleTitle` | Assistive title when no visible title exists | `string`                | `'对话框'`              |
| `portalTo`        | Existing overlay container within the theme  | `string \| HTMLElement` | ConfigProvider / `body` |
| `closeLabel`      | Accessible close button name                 | `string`                | `'关闭'`                |

Provide a visible title whenever possible. Only use a descriptive `accessible-title` when the design explicitly hides the heading. Set `close-label="Close"` to localize the close control along with your content.

Class, id, data attributes and events forward to content. Explicit `aria-describedby` can associate consumer help text. Reka UI retains the focus trap, Escape and focus restoration. Point `portal-to` at an existing container within the same local theme. Long titles wrap with space reserved for close.

## Registry

Copy Dialog through [Registry distribution](/en/guide/registry); installation includes Reka UI, Sass and tokens.

## Slots

| Name          | Description                                                |
| ------------- | ---------------------------------------------------------- |
| `trigger`     | Trigger, using as-child to forward behavior to your button |
| `title`       | Custom title                                               |
| `description` | Custom description                                         |
| `default`     | Body content                                               |
