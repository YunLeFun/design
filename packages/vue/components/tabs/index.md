---
title: Tabs
title_zh: 标签页
---

标签页：键盘导航（方向键 / Home / End）、roving focus 基于 [reka-ui](https://reka-ui.com)，滑动指示条与外观走 token。

## Props

| 属性          | 说明                                 | 类型                     | 默认值       |
| ------------- | ------------------------------------ | ------------------------ | ------------ |
| `v-model`     | 当前标签                             | `string`                 | —            |
| `items`       | 标签项 `{ label, value, disabled? }` | `TabItem[]`              | —            |
| `orientation` | 方向                                 | `horizontal \| vertical` | `horizontal` |

## Slots

每个标签的内容用 `value` 同名插槽提供，如 `#cloud`、`#fun`。
