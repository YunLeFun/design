---
title: Slider
title_zh: 滑块
---

滑块：拖拽、键盘步进、多滑块区间基于 [reka-ui](https://reka-ui.com)，外观走 token。`v-model` 为数组，单值传 `[n]`、区间传 `[a, b]`。

## Props

| 属性       | 说明   | 类型       | 默认值  |
| ---------- | ------ | ---------- | ------- |
| `v-model`  | 当前值 | `number[]` | `[50]`  |
| `min`      | 最小值 | `number`   | `0`     |
| `max`      | 最大值 | `number`   | `100`   |
| `step`     | 步长   | `number`   | `1`     |
| `disabled` | 禁用   | `boolean`  | `false` |
