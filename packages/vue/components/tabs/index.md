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

`items` 支持只读数组。标签和内容面板的 ARIA 关联由 Reka UI 管理；方向键、Home / End 改变焦点并自动选中，跳过禁用项。切换普通筛选条件而不展示关联面板时使用 Segmented Control。
