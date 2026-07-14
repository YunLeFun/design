---
title: Tooltip
title_zh: 文字提示
---

文字提示：定位与可访问性基于 [reka-ui](https://reka-ui.com)（floating 定位、延迟、`aria-describedby`），外观走 token。

## Props

| 属性      | 说明       | 类型                             | 默认值 |
| --------- | ---------- | -------------------------------- | ------ |
| `content` | 提示文字   | `string`                         | —      |
| `side`    | 方向       | `top \| right \| bottom \| left` | `top`  |
| `delay`   | 延迟（ms） | `number`                         | `300`  |

## Slots

| 名称      | 说明                   |
| --------- | ---------------------- |
| `default` | 触发元素（`as-child`） |
| `content` | 自定义提示内容         |
