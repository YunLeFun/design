---
title: Tooltip
title_zh: 文字提示
---

文字提示：定位与可访问性基于 [reka-ui](https://reka-ui.com)（floating 定位、延迟、`aria-describedby`），外观走 token。

## Props

| 属性       | 说明                   | 类型                             | 默认值                  |
| ---------- | ---------------------- | -------------------------------- | ----------------------- |
| `content`  | 提示文字               | `string`                         | —                       |
| `side`     | 方向                   | `top \| right \| bottom \| left` | `top`                   |
| `delay`    | 延迟（ms）             | `number`                         | `300`                   |
| `disabled` | 关闭提示               | `boolean`                        | `false`                 |
| `portalTo` | 已存在的主题内浮层容器 | `string \| HTMLElement`          | ConfigProvider / `body` |

`id`、`class`、`aria-label`、`data-*` 和事件传给触发元素。仅图标按钮仍需可访问名称，不能只依赖 Tooltip 内容。局部主题中使用 `portal-to` 保持提示与触发器处于同一主题。

## Slots

| 名称      | 说明                   |
| --------- | ---------------------- |
| `default` | 触发元素（`as-child`） |
| `content` | 自定义提示内容         |

`disabled` 可关闭 Tooltip；例如分段选择器显示文字时不重复提示，仅图标模式下再启用。
