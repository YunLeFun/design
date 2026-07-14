---
title: Bottom Menu
title_zh: 底部菜单
---

云玻璃底部导航：背景模糊通透，激活项以极光渐变点亮文字。适合 H5 / 子应用的主导航。

## YlfBottomMenu Props

| 属性     | 说明     | 类型      | 默认值  |
| -------- | -------- | --------- | ------- |
| `shadow` | 浮起阴影 | `boolean` | `false` |

## YlfBottomMenuItem Props

| 属性     | 说明       | 类型             |
| -------- | ---------- | ---------------- |
| `item`   | 菜单项数据 | `BottomMenuItem` |
| `active` | 是否激活   | `boolean`        |

## BottomMenuItem

| 字段         | 说明             | 类型                       |
| ------------ | ---------------- | -------------------------- |
| `title`      | 标题             | `string`                   |
| `icon`       | 图标 class       | `string`                   |
| `activeIcon` | 激活态图标 class | `string?`                  |
| `to`         | 路由目标         | `string?`                  |
| `onClick`    | 点击回调         | `(...args: any[]) => void` |
