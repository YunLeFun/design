---
title: Select
title_zh: 选择器
---

选择器：定位、键盘导航、首字母检索、滚动基于 [reka-ui](https://reka-ui.com)，外观走 token。

## Props

| 属性          | 说明                                       | 类型             | 默认值   |
| ------------- | ------------------------------------------ | ---------------- | -------- |
| `v-model`     | 选中值                                     | `string`         | —        |
| `options`     | 选项 `{ label, value, disabled?, color? }` | `SelectOption[]` | —        |
| `placeholder` | 占位文案                                   | `string`         | `请选择` |
| `disabled`    | 禁用                                       | `boolean`        | `false`  |

`id`、`class`、`style`、`aria-label` 和 `aria-labelledby` 等属性会传给触发按钮。使用可见标签时，通过 `<label for="…">` 与组件的 `id` 关联；没有标签时可传入 `aria-label`，否则使用占位文案。`v-model` 和选项值支持字符串联合类型。

下拉面板默认挂载到页面根部。局部明暗主题可通过 Reka UI 的 `ConfigProvider` 将 `teleport-to` 指向主题容器中的元素，确保面板继承同一套 token；容器应允许浮层溢出。首页的颜色与强调样式选择器使用的就是本组件。

## 色点预览

选项的 `color` 是可选 CSS 色值，支持 `var(--ylf-*)`。设置后，下拉列表和当前选中值会显示同色圆点；不设置时保持普通文本选择器。色点仅作视觉辅助，颜色名称和选中勾选仍保留。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tone = ref('blue')
const options = [
  { value: 'blue', label: '晴空蓝', color: 'var(--ylf-accent-blue)' },
  { value: 'sun', label: '明黄', color: 'var(--ylf-accent-sun)' },
]
</script>

<template>
  <YlfSelect v-model="tone" :options="options" aria-label="强调色" />
</template>
```

使用 token 时，色点会随所在主题更新；页面和浮层需处于同一主题范围。
