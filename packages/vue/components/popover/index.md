---
title: Popover
title_zh: 浮层
---

浮层：定位、点击外部关闭、焦点管理基于 [reka-ui](https://reka-ui.com)，外观走 token。

## Props

| 属性           | 说明     | 类型                             | 默认值   |
| -------------- | -------- | -------------------------------- | -------- |
| `v-model:open` | 显隐状态 | `boolean`                        | `false`  |
| `side`         | 方向     | `top \| right \| bottom \| left` | `bottom` |
| `align`        | 对齐     | `start \| center \| end`         | `center` |

## Slots

| 名称      | 说明                   |
| --------- | ---------------------- |
| `trigger` | 触发元素（`as-child`） |
| `default` | 浮层内容               |
