---
title: Avatar
title_zh: 头像
---

头像：图片加载状态管理与回退基于 [reka-ui](https://reka-ui.com)，加载失败时优雅回退到首字。

## Props

| 属性       | 说明                   | 类型             | 默认值 |
| ---------- | ---------------------- | ---------------- | ------ |
| `src`      | 图片地址               | `string`         | —      |
| `alt`      | 替代文字               | `string`         | —      |
| `fallback` | 回退文字（如姓名首字） | `string`         | —      |
| `size`     | 尺寸                   | `sm \| md \| lg` | `md`   |
