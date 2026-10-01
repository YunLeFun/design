---
title: Avatar
---

Avatar uses [Reka UI](https://reka-ui.com) for image loading and fallback text.

## Props

| Prop       | Description                       | Type             | Default |
| ---------- | --------------------------------- | ---------------- | ------- |
| `src`      | Image URL                         | `string`         | —       |
| `alt`      | Alternative text                  | `string`         | `''`    |
| `fallback` | Fallback text, such as an initial | `string`         | —       |
| `size`     | Size                              | `sm \| md \| lg` | `md`    |

Give meaningful avatars a complete `alt`, such as a person's name; the fallback retains it when the image fails. Without alt, fallback text becomes the name. Decorative images may keep empty alt. `fallback` defines displayed text; names are not inferred from image URLs.
