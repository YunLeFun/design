---
title: Separator
title_zh: 分隔线
---

分隔线：基于 [reka-ui](https://reka-ui.com)，支持水平 / 垂直与语义化（`decorative` 控制是否对屏幕阅读器可见）。

正文默认使用中性细线。`brand` 使用晴空蓝；`accent` 配合 `tone` 区分内容；`spectrum` 用六段纯色拼接，适合页头、品牌区或活动入口。彩色拼接不铺在正文下方，也不作为唯一的状态提示。

垂直分隔线需要父布局或调用方提供高度，例如 `style="height: 24px"`。

## Props

| 属性          | 说明                    | 类型                                            | 默认值       |
| ------------- | ----------------------- | ----------------------------------------------- | ------------ |
| `orientation` | 方向                    | `horizontal \| vertical`                        | `horizontal` |
| `decorative`  | 仅装饰                  | `boolean`                                       | `true`       |
| `variant`     | 视觉角色                | `neutral \| brand \| accent \| spectrum`        | `neutral`    |
| `tone`        | 强调色，仅用于 `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`       |
