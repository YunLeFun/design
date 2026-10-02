# Vue components

`@yunlefun/vue` implements YunLeFun Design in Vue. Components own presentation and interaction; applications own data, authentication, permissions and payments.

## Install and load shared styles

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

Load once in your application's SCSS entry:

```scss
@use '@yunlefun/ui/styles';
```

Import that SCSS from the application entry. Brand fonts are optional; see [Typography](/en/guide/typography).

## Vue / Vite: explicit imports

```vue
<script setup lang="ts">
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
</script>

<template>
  <YlfButton>Save profile</YlfButton>
</template>
```

The root does not export every component. Do not use `import { YlfButton } from '@yunlefun/vue'`. There is no public `YlfResolver` auto import resolver.

## Nuxt: register the module

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/styles'],
})
```

The module auto imports `Ylf*` components; CSS explicitly loads tokens. UnoCSS, Pinia and VueUse modules are not required.

## Components and themes

Everyday actions use sky blue. Accent also defaults to sky blue; choose `tone="sun"` explicitly for featured content. Decorative colors do not replace semantic success/warning/error. See [Colors and components](/en/guide/colors).

Find APIs, states and demos in the sidebar. For editable source see [Registry distribution](/en/guide/registry). Full boundaries are in [Package responsibilities](/en/guide/packages).

## Agent interaction examples

[AG-UI integration and demos](/en/guide/ag-ui) cover streaming chat, shared state, tool approval, interrupt/resume, stopping and error retry. The optional `@yunlefun/vue/ag-ui` entry uses the official `@ag-ui/client`; install it when needed. Basic components do not require it.
