# Vue components

`@yunlefun/vue` implements YunLeFun Design in Vue. Components own presentation and interaction; applications own data, authentication, permissions and payments.

## Install and load shared styles

```bash
pnpm add @yunlefun/ui @yunlefun/vue
```

Component styles use native CSS variables directly and do not require `sass`. Load shared tokens once in your application entry:

```ts
import '@yunlefun/ui/css'
```

If your project prefers SCSS, you may still optionally install `sass` and `@use '@yunlefun/ui/styles';`. Brand fonts are optional; see [Typography](/en/guide/typography).

## Vue / Vite: explicit imports

```vue
<script setup lang="ts">
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
</script>

<template>
  <YlfButton>Save profile</YlfButton>
</template>
```

The `@yunlefun/vue` root entry is browser-safe (types only, no `node:path` / `node:url`); do not use `import { YlfButton } from '@yunlefun/vue'`. Node path helpers such as `componentsDir` live in `@yunlefun/vue/node`. There is no public `YlfResolver` auto import resolver.

## Nuxt: register the module

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/css'],
})
```

The module auto imports `Ylf*` components; CSS explicitly loads tokens. UnoCSS, Pinia and VueUse modules are not required.

## Components and themes

Everyday actions use sky blue. Accent also defaults to sky blue; choose `tone="sun"` explicitly for featured content. Decorative colors do not replace semantic success/warning/error. See [Colors and components](/en/guide/colors).

Find APIs, states and demos in the sidebar. For editable source see [Registry distribution](/en/guide/registry). Full boundaries are in [Package responsibilities](/en/guide/packages).

## Agent interaction examples

[AG-UI integration and demos](/en/guide/ag-ui) cover streaming chat, shared state, tool approval, interrupt/resume, stopping and error retry. The optional `@yunlefun/vue/ag-ui` entry uses the official `@ag-ui/client`; install it when needed. Basic components do not require it.
