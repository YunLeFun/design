---
title: Dialog
title_zh: 对话框
---

对话框：行为与可访问性全部基于 [reka-ui](https://reka-ui.com)（遮罩、焦点陷阱、`Esc` / 点击外部关闭、滚动锁、`aria-labelledby` / `aria-describedby`），外观使用共享主题 token。

## Props

| 属性              | 说明                             | 类型      | 默认值     |
| ----------------- | -------------------------------- | --------- | ---------- |
| `v-model:open`    | 显隐状态                         | `boolean` | `false`    |
| `title`           | 可见标题                         | `string`  | —          |
| `description`     | 描述                             | `string`  | —          |
| `accessibleTitle` | 无可见标题时供辅助技术读取的标题 | `string`  | `'对话框'` |

建议始终提供 `title`。只有视觉设计明确隐藏标题时，才改用描述场景的 `accessible-title`。

## Registry

Dialog 可通过 [Registry 分发](/guide/registry)复制源码；安装时会自动带入 `reka-ui`、Sass 与共享 token。

## Slots

| 名称          | 说明                                       |
| ------------- | ------------------------------------------ |
| `trigger`     | 触发器（`as-child`，把行为透传给你的按钮） |
| `title`       | 自定义标题                                 |
| `description` | 自定义描述                                 |
| `default`     | 正文内容                                   |
