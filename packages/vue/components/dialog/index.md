---
title: Dialog
title_zh: 对话框
---

对话框：行为与可访问性全部基于 [reka-ui](https://reka-ui.com)（遮罩、焦点陷阱、`Esc` / 点击外部关闭、滚动锁、`aria-labelledby` / `aria-describedby`），外观使用共享主题 token。

## Props

| 属性              | 说明                               | 类型                    | 默认值                  |
| ----------------- | ---------------------------------- | ----------------------- | ----------------------- |
| `v-model:open`    | 显隐状态                           | `boolean`               | `false`                 |
| `title`           | 可见标题                           | `string`                | —                       |
| `description`     | 描述                               | `string`                | —                       |
| `accessibleTitle` | 无可见标题时供辅助技术读取的标题   | `string`                | `'对话框'`              |
| `closeLabel`      | 关闭按钮的无障碍名称，可随正文翻译 | `string`                | `'关闭'`                |
| `portalTo`        | 已存在的主题内浮层容器             | `string \| HTMLElement` | ConfigProvider / `body` |

英文界面可设置 `close-label="Close"`，让关闭按钮与正文语言一致。

建议始终提供 `title`。只有视觉设计明确隐藏标题时，才改用描述场景的 `accessible-title`。

`class`、`id`、`data-*` 和事件传给对话框内容；显式的 `aria-describedby` 可关联调用方的说明。焦点陷阱、Escape 关闭和关闭后回到触发器仍由 Reka UI 管理。局部主题中把 `portal-to` 指向同一主题边界内的容器。长标题会换行并为关闭按钮保留空间。

## Registry

Dialog 可通过 [Registry 分发](/guide/registry)复制源码；安装时会自动带入 `reka-ui`、Sass 与共享 token。

## Slots

| 名称          | 说明                                       |
| ------------- | ------------------------------------------ |
| `trigger`     | 触发器（`as-child`，把行为透传给你的按钮） |
| `title`       | 自定义标题                                 |
| `description` | 自定义描述                                 |
| `default`     | 正文内容                                   |
