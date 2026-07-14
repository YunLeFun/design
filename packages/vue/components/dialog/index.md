---
title: Dialog
title_zh: 对话框
---

对话框：行为与可访问性全部基于 [reka-ui](https://reka-ui.com)（遮罩、焦点陷阱、`Esc` / 点击外部关闭、滚动锁、`aria-labelledby` / `aria-describedby`），外观走「极光 / 多巴胺」token。

## Props

| 属性           | 说明     | 类型      | 默认值  |
| -------------- | -------- | --------- | ------- |
| `v-model:open` | 显隐状态 | `boolean` | `false` |
| `title`        | 标题     | `string`  | —       |
| `description`  | 描述     | `string`  | —       |

## Slots

| 名称          | 说明                                       |
| ------------- | ------------------------------------------ |
| `trigger`     | 触发器（`as-child`，把行为透传给你的按钮） |
| `title`       | 自定义标题                                 |
| `description` | 自定义描述                                 |
| `default`     | 正文内容                                   |
