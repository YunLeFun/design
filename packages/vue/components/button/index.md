---
title: Button
title_zh: 按钮
---

主操作默认使用晴空蓝实色；品牌展示可选择 `accent` 纯色变体，配合 `tone` 指定强调色。描边、柔色和透明按钮用于次级操作，成功、提醒与危险变体表达对应的状态语义。

状态按钮与徽标使用同一套多巴胺色板：成功为鲜绿、提醒为明黄、危险为珊瑚橙，文字使用配套的同色相深色 token。

## 品牌入口

首页或活动区的主入口使用 `variant="hero" size="xl"`：深蓝到青蓝渐变、白色文案、柔光投影，以及 56px 点击高度。明暗主题均保留深色渐变和白字，不使用偏亮的天空装饰渐变作为按钮底色。悬停时加深颜色，键盘聚焦使用双色外圈，减少动态效果时关闭位移。

每个区块保留一个 hero 主入口。日常保存、确认和导航使用 `primary` 或次级变体。`tone` 和 `appearance` 不改变 hero 的专用配色；颜色与阴影统一由 `--ylf-hero-*` 提供，业务可保留自己的路由行为封装。

## Registry

Button 可以通过 URL 将组件源码和共享品牌 token 复制进业务项目；命令、边界和发布验收见 [Registry 分发](/guide/registry)。稳定基础组件仍优先通过 `@yunlefun/vue` 使用。

## 强调程度

同一个色彩角色可以选择 `appearance="solid"`（实色重点）、`soft`（柔色分类）或 `outline`（描边次级）。该属性只作用于 `accent` 与状态变体，旧 `aurora` 别名也支持它；其余变体沿用自身外观。`variant="soft"` 仍表示品牌蓝柔色按钮，彩色柔色按钮请使用 `variant="accent" appearance="soft"`。

## Props

| 属性         | 说明                          | 类型                                                                                      | 默认值     |
| ------------ | ----------------------------- | ----------------------------------------------------------------------------------------- | ---------- |
| `variant`    | 风格                          | `primary \| hero \| accent \| secondary \| soft \| ghost \| success \| warning \| danger` | `primary`  |
| `tone`       | 强调色，仅作用于 `accent`     | `blue \| sun \| cyan \| coral \| pink \| green`                                           | `blue`     |
| `appearance` | `accent` 与状态变体的强调程度 | `solid \| soft \| outline`                                                                | `solid`    |
| `size`       | 尺寸                          | `sm \| md \| lg \| xl`                                                                    | `md`       |
| `round`      | 胶囊圆角（云是软的）          | `boolean`                                                                                 | `true`     |
| `block`      | 占满整行宽度                  | `boolean`                                                                                 | `false`    |
| `loading`    | 加载态                        | `boolean`                                                                                 | `false`    |
| `disabled`   | 禁用                          | `boolean`                                                                                 | `false`    |
| `tag`        | 渲染标签，如 `'a'`            | `string`                                                                                  | `'button'` |

`accent` 的 `tone` 可选 `blue | sun | cyan | coral | pink | green`，默认为 `blue`（晴空蓝）。其他变体保持自己的品牌或状态语义，不受 `tone` 影响。旧 `aurora` 值仍可接收，效果映射到 `accent`。

## Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 按钮文字 |
| `icon`    | 左侧图标 |

## Events

| 名称    | 说明                                          |
| ------- | --------------------------------------------- |
| `click` | 点击时触发（`disabled` / `loading` 下不触发） |
