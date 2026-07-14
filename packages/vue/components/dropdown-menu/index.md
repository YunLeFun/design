---
title: Dropdown Menu
title_zh: 下拉菜单
---

下拉菜单：定位、键盘导航（方向键 / Home / End / 首字母）、焦点管理基于 [reka-ui](https://reka-ui.com)，外观走 token。

## Props

| 属性    | 说明   | 类型         | 默认值 |
| ------- | ------ | ------------ | ------ |
| `items` | 菜单项 | `MenuItem[]` | —      |

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
