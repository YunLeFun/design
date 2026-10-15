---
title: Input
title_zh: 输入框
description: 复用原生输入行为，统一表单与紧凑工作台的输入框。
---

`YlfInput` 保留原生输入行为，与 Select 共用一致的表面、圆角和密度。使用可见标签；错误信息通过 `aria-describedby` 关联到输入框。

## Props

| 属性         | 说明                | 类型       | 默认值  |
| ------------ | ------------------- | ---------- | ------- |
| `modelValue` | 文本值（`v-model`） | `string`   | `''`    |
| `size`       | 控件密度            | `sm \| md` | `md`    |
| `invalid`    | 标记输入值无效      | `boolean`  | `false` |

`id`、`name`、`type`、`required`、`disabled`、`readonly`、`placeholder`、`autocomplete` 等原生属性和 `input`、`blur` 等事件直接透传。保留输入法组合事件行为。组件面向文本值；需要数字解析时使用专用数值控件。

默认点击高度至少 44px，紧凑模式 34px，粗指针下增大至 44px。错误状态仍需提供可读的错误说明。
