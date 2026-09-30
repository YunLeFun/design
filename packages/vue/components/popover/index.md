---
title: Popover
title_zh: 浮层
---

浮层：定位、点击外部关闭、焦点管理基于 [reka-ui](https://reka-ui.com)，外观走 token。

## Props

| 属性           | 说明                   | 类型                             | 默认值                  |
| -------------- | ---------------------- | -------------------------------- | ----------------------- |
| `v-model:open` | 显隐状态               | `boolean`                        | `false`                 |
| `side`         | 方向                   | `top \| right \| bottom \| left` | `bottom`                |
| `align`        | 对齐                   | `start \| center \| end`         | `center`                |
| `portalTo`     | 已存在的主题内浮层容器 | `string \| HTMLElement`          | ConfigProvider / `body` |

`class`、`data-*`、ARIA 属性和事件传给浮层内容，内部关联 ID 由 Reka UI 管理。默认可访问名称与触发器关联；触发器应使用说明用途的文字。局部主题的 `portal-to` 容器应处于相同主题边界。

## Slots

| 名称      | 说明                   |
| --------- | ---------------------- |
| `trigger` | 触发元素（`as-child`） |
| `default` | 浮层内容               |
