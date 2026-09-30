---
title: Progress
title_zh: 进度条
---

进度条：基于 [reka-ui](https://reka-ui.com)（`role="progressbar"` + aria 值），外观走 token，可选高饱和纯色填充。

## Props

| 属性      | 说明                      | 类型                                            | 默认值  |
| --------- | ------------------------- | ----------------------------------------------- | ------- |
| `value`   | 当前进度；`null` 表示未知 | `number \| null`                                | `0`     |
| `max`     | 最大值                    | `number`                                        | `100`   |
| `variant` | 填充                      | `brand \| accent`                               | `brand` |
| `tone`    | 强调色，仅作用于 `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`  |

`tone` 接受 `blue | sun | cyan | coral | pink | green`，默认 `blue`（晴空蓝），只在 `accent` 下生效。旧 `aurora` 值映射到 `accent`。同一流程中的同类状态使用同一种颜色。

提供用途名称，例如 `aria-label="文件上传进度"`。有限数值会限制在 `0…max`，无效的 `max` 回退到 `100`，确保显示与 ARIA 值一致。`null`、NaN 或无限值按未知进度显示，不输出 `aria-valuenow`；减少动态效果时显示静态进度段。
