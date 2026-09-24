---
title: Badge
title_zh: 徽标
---

默认以轻浅晴空蓝标记内容，明黄星芒点缀精选；分类和状态使用同一套高饱和实色，搭配经过对比度校验的前景文字。

## 选择徽标

- `brand`：新内容、版本等日常品牌标记。
- `featured`：精选、推荐等品牌标记，明黄星芒、浅黄底和中性文字。
- `accent`：高饱和实色，默认晴空蓝，使用 `tone` 选择明黄、青、珊瑚橙、桃粉或鲜绿。
- `neutral`：已归档、草稿等普通信息，无需暗示成功或错误。
- `success` / `warning` / `danger` / `info`：分别使用鲜绿、明黄、珊瑚橙与青色实底，配套状态图形和文字。

徽标使用系统正文字体，默认 12px、500 字重，无阴影、发光或持续动画。前景、底色和描边使用配套 token，随明暗主题调整。使用简短明确的文字描述状态，颜色辅助识别。

晴空蓝实底在浅色主题使用白字、深色主题使用深蓝字；其余纯色标签使用同色相深色文字，保证各组填充与前景的对比度。状态与强调色共享 token，详见[色彩与组件](/guide/colors#状态也来自同一套色板)。

徽标用于展示信息；需要点击筛选或执行操作时，使用按钮等交互组件。

## 强调程度

同一个色彩角色可以选择 `appearance="solid"`（实色重点）、`soft`（柔色分类）或 `outline`（描边次级）。该属性只作用于 `accent` 与状态变体，其余变体沿用自身外观。

## Props

| 属性         | 说明                          | 类型                                                                             | 默认值  |
| ------------ | ----------------------------- | -------------------------------------------------------------------------------- | ------- |
| `variant`    | 语义与品牌用途                | `featured \| accent \| brand \| neutral \| success \| warning \| danger \| info` | `brand` |
| `tone`       | 强调色，仅作用于 `accent`     | `blue \| sun \| cyan \| coral \| pink \| green`                                  | `blue`  |
| `appearance` | `accent` 与状态变体的强调程度 | `solid \| soft \| outline`                                                       | `solid` |
| `round`      | 胶囊圆角；关闭后使用小圆角    | `boolean`                                                                        | `true`  |

`tone` 可选 `blue | sun | cyan | coral | pink | green`，默认 `blue`（晴空蓝），仅作用于 `accent`。`featured` 始终使用精选 token，不随 `tone` 改变。旧 `aurora` 值映射到 `featured`。

## Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 徽标内容 |
