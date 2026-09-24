---
title: Switch
title_zh: 开关
---

开关：行为与可访问性基于 [reka-ui](https://reka-ui.com)（`role="switch"`、键盘 Space / Enter、焦点管理），外观使用共享主题 token —— reka 管行为，我们管皮肤。

## Props

| 属性       | 说明                      | 类型                                            | 默认值  |
| ---------- | ------------------------- | ----------------------------------------------- | ------- |
| `v-model`  | 开关状态                  | `boolean`                                       | `false` |
| `variant`  | on 态轨道                 | `brand \| accent`                               | `brand` |
| `tone`     | 强调色，仅作用于 `accent` | `blue \| sun \| cyan \| coral \| pink \| green` | `blue`  |
| `size`     | 尺寸                      | `sm \| md`                                      | `md`    |
| `disabled` | 禁用                      | `boolean`                                       | `false` |

`tone` 接受 `blue | sun | cyan | coral | pink | green`，默认 `blue`（晴空蓝），只在 `accent` 下生效。旧 `aurora` 值映射到 `accent`。同一流程中的同类状态使用同一种颜色。
