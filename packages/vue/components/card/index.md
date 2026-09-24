---
title: Card
title_zh: 卡片
---

以中性表面承载内容，可选云玻璃、顶部纯色强调或 `tinted` 柔色表面。静态内容显式关闭 `hoverable`，避免上浮暗示可点击。

## Props

| 属性        | 说明                           | 类型                                            | 默认值   |
| ----------- | ------------------------------ | ----------------------------------------------- | -------- |
| `variant`   | 表面风格                       | `soft \| glass \| accent \| tinted`             | `soft`   |
| `tone`      | 强调色，用于 `accent / tinted` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`   |
| `hoverable` | 悬停时轻轻抬升                 | `boolean`                                       | `true`   |
| `padding`   | 内边距（任意 CSS 值）          | `string`                                        | `'22px'` |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 卡片内容 |

`tone` 接受 `blue | sun | cyan | coral | pink | green`，默认 `blue`（晴空蓝），在 `accent` 和 `tinted` 下生效。旧 `gradient` 值映射到 `accent` 的纯色顶边，不再绘制渐变边框。
