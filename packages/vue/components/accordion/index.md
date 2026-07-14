---
title: Accordion
title_zh: 手风琴
---

手风琴：展开/收起、键盘导航、单开/多开基于 [reka-ui](https://reka-ui.com)，高度过渡与外观走 token。

## Props

| 属性          | 说明                                         | 类型                  | 默认值   |
| ------------- | -------------------------------------------- | --------------------- | -------- |
| `v-model`     | 展开项                                       | `string \| string[]`  | —        |
| `items`       | 列表 `{ value, title, content?, disabled? }` | `AccordionItemData[]` | —        |
| `type`        | 单开 / 多开                                  | `single \| multiple`  | `single` |
| `collapsible` | 单开模式允许全部收起                         | `boolean`             | `true`   |

## Slots

每项内容可用 `value` 同名插槽覆盖 `content`。
