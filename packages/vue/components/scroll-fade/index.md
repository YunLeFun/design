---
title: Scroll Fade
title_zh: 滚动渐变
---

滚动区域默认使用 `YlfScrollFade` 提示边缘外还有内容。列表全部可见时不显示渐变，滚到边界时自动移除对应一侧的渐变。组件尊重系统的减少透明度和强制颜色偏好。

用组件包裹实际滚动的元素，通过 `viewport` 传入模板引用。滚动元素继续负责高度、`overflow`、键盘焦点和语义。自定义背景时，将同一个颜色或主题变量传给 `surface`。可用 `size` 调整渐变高度，默认 24px。

```vue
<script setup lang="ts">
import YlfScrollFade from '@yunlefun/vue/components/YlfScrollFade.vue'
import { useTemplateRef } from 'vue'

const list = useTemplateRef<HTMLUListElement>('list')
</script>

<template>
  <YlfScrollFade :viewport="list" class="panel">
    <ul ref="list" aria-label="最近打开" tabindex="0" class="viewport">
      <li v-for="entry in 12" :key="entry">
        项目 {{ entry }}
      </li>
    </ul>
  </YlfScrollFade>
</template>

<style scoped>
.panel {
  background: var(--ylf-c-surface, #fff);
}
.viewport {
  max-height: 8rem;
  overflow-y: auto;
  scroll-padding-block: 24px;
}
</style>
```

`YlfSelect` 已内置滚动渐变。带固定表头等特殊结构可以从 `@yunlefun/vue/components/scroll-fade` 导入 `useScrollFade`，获取两侧的透明度变量，按布局放置渐变。
