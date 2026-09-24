---
title: Progress
title_zh: 进度条
---

进度条：基于 [reka-ui](https://reka-ui.com)（`role="progressbar"` + aria 值），外观走 token，可选高饱和纯色填充。

## Props

| 属性      | 说明                      | 类型                                            | 默认值  |
| --------- | ------------------------- | ----------------------------------------------- | ------- |
| `value`   | 当前进度                  | `number`                                        | `0`     |
| `max`     | 最大值                    | `number`                                        | `100`   |
| `variant` | 填充                      | `brand \| accent`                               | `brand` |
| `tone`    | 强调色，仅作用于 `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`  |

`tone` 接受 `blue | sun | cyan | coral | pink | green`，默认 `blue`（晴空蓝），只在 `accent` 下生效。旧 `aurora` 值映射到 `accent`。同一流程中的同类状态使用同一种颜色。
