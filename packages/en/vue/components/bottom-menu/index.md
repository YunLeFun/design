---
title: Bottom Menu
---

A translucent, blurred bottom navigation with sky blue active items, suited to mobile Web and subapplication navigation.

## YlfBottomMenu Props

| Prop     | Description     | Type      | Default |
| -------- | --------------- | --------- | ------- |
| `shadow` | Elevated shadow | `boolean` | `false` |

## YlfBottomMenuItem Props

| Prop     | Description    | Type             |
| -------- | -------------- | ---------------- |
| `item`   | Menu item data | `BottomMenuItem` |
| `active` | Active state   | `boolean`        |

## BottomMenuItem

| Field        | Description       | Type                       |
| ------------ | ----------------- | -------------------------- |
| `title`      | Title             | `string`                   |
| `icon`       | Icon class        | `string`                   |
| `activeIcon` | Active icon class | `string?`                  |
| `to`         | Route destination | `string?`                  |
| `onClick`    | Click callback    | `(...args: any[]) => void` |
