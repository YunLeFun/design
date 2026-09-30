---
title: Dropdown Menu
title_zh: 下拉菜单
---

下拉菜单：定位、键盘导航（方向键 / Home / End / 首字母）、焦点管理基于 [reka-ui](https://reka-ui.com)，外观走 token。

## Props

| 属性           | 说明                   | 类型                    | 默认值                  |
| -------------- | ---------------------- | ----------------------- | ----------------------- |
| `items`        | 菜单项                 | `readonly MenuItem[]`   | —                       |
| `v-model:open` | 显隐状态               | `boolean`               | `false`                 |
| `portalTo`     | 已存在的主题内浮层容器 | `string \| HTMLElement` | ConfigProvider / `body` |

`class`、`data-*`、ARIA 属性和事件传给菜单内容。`portal-to` 可把菜单放入已有的局部主题容器；未传时继续使用 ConfigProvider 或 `body`。支持方向键、Home / End、Enter 选择和 Escape 关闭；禁用项会被跳过。

### MenuItem

| 字段        | 说明         | 类型       |
| ----------- | ------------ | ---------- |
| `label`     | 文案         | `string`   |
| `value`     | 选中值       | `string`   |
| `disabled`  | 禁用         | `boolean?` |
| `separator` | 渲染为分隔线 | `boolean?` |

## Events

| 名称     | 说明                         |
| -------- | ---------------------------- |
| `select` | 选中某项时触发，回传 `value` |

`value=""` 可表示“全部”或“清除筛选”，仍会触发 `select`。没有 `value` 的项不触发选值事件。
