# @yunlefun/vue

YunLeFun Design 的 Vue 组件实现，提供 `Ylf*` 组件与 Nuxt 集成。

## 安装

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用 SCSS 入口加载共享主题：

```scss
@use '@yunlefun/ui/styles';
```

## Vue / Vite

```vue
<script setup lang="ts">
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
</script>

<template>
  <YlfButton>保存资料</YlfButton>
</template>
```

## Nuxt

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/styles'],
})
```

根入口目前提供类型和组件目录信息，组件通过 `components/*.vue` 子路径或 Nuxt 模块使用；没有公开的 `YlfResolver`。

更多内容见 [Vue 接入](./index.md)、[子包职责](../guide/packages.md)与[设计体系](../guide/design-system.md)。
