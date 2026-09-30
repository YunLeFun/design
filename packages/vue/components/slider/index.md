---
title: Slider
title_zh: 滑块
---

滑块：拖拽、键盘步进、多滑块区间基于 [reka-ui](https://reka-ui.com)，外观走 token。`v-model` 为数组，单值传 `[n]`、区间传 `[a, b]`。

## Props

| 属性          | 说明                     | 类型                | 默认值  |
| ------------- | ------------------------ | ------------------- | ------- |
| `v-model`     | 当前值                   | `number[]`          | `[50]`  |
| `min`         | 最小值                   | `number`            | `0`     |
| `max`         | 最大值                   | `number`            | `100`   |
| `step`        | 步长                     | `number`            | `1`     |
| `disabled`    | 禁用                     | `boolean`           | `false` |
| `label`       | 单值或整组用途名称       | `string`            | `数值`  |
| `thumbLabels` | 按顺序指定每个滑块的名称 | `readonly string[]` | —       |

单值使用 `label="音量"`；区间使用 `:thumb-labels="['最低价格', '最高价格']"`。未指定端点名称时，使用 `label` 和顺序编号。方向键按 `step` 调整，Home / End 到达边界；禁用时滑块不进入键盘焦点顺序。触摸设备提供至少 44px 的操作区域，减少动态效果时关闭过渡。

## Events

`valueCommit` 在一次拖动或键盘调整完成时回传 `number[]`。需要在交互完成后保存数据时，使用 `@value-commit`；界面状态继续使用 `v-model`。
