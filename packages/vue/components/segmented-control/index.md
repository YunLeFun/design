---
title: Segmented Control
title_zh: 分段选择器
---

单选视图与筛选控件，基于 [Reka UI ToggleGroup](https://reka-ui.com/docs/components/toggle-group)。保留方向键、Home / End 和禁用项处理，再次点击当前项不会清空选择。切换独立内容面板请使用 Tabs。

| 属性        | 说明                                                              | 默认值  |
| ----------- | ----------------------------------------------------------------- | ------- |
| `v-model`   | 当前选项，支持字符串联合类型                                      | 必填    |
| `options`   | `{ value, label, disabled?, count?, ariaLabel? }[]`，支持只读数组 | 必填    |
| `label`     | 组合控件的无障碍名称                                              | 必填    |
| `size`      | `sm`：34px 工作台；`md`：44px 常规界面                            | `md`    |
| `icon-only` | 仅显示图标，并提供文字 Tooltip                                    | `false` |
| `disabled`  | 禁用全部选项                                                      | `false` |

`#icon="{ option, selected }"` 插槽接收当前项及选中状态。应用通过完整的 UnoCSS / Iconify 类名映射渲染图标，公共组件不依赖应用的图标构建方式。没有图标插槽时仍显示标签。

```vue
<script setup lang="ts">
import YlfSegmentedControl from '@yunlefun/vue/components/YlfSegmentedControl.vue'
import { shallowRef } from 'vue'

const view = shallowRef<'grid' | 'list'>('grid')
const options = [
  { value: 'grid', label: '网格视图' },
  { value: 'list', label: '列表视图' },
] as const
const icons = { grid: 'i-ri-grid-line', list: 'i-ri-list-check' }
</script>

<template>
  <YlfSegmentedControl v-model="view" :options="options" label="资源视图" size="sm" icon-only>
    <template #icon="{ option }">
      <i :class="icons[option.value]" />
    </template>
  </YlfSegmentedControl>
</template>
```

样式统一来自 `--ylf-*`：轻灰底座、表面色选中项、品牌色文字、细边框与焦点环。`sm` 与 `YlfSelect size="sm"` 对齐。触摸设备中选项至少 44px；减少动态效果时禁用过渡。不需要在业务页面覆盖选中态或圆角。
