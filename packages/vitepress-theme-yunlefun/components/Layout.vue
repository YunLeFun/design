<script setup lang="ts">
import { provideAppearanceTransition } from 'vitepress-theme-yunlefun/appearance'
import DefaultTheme from 'vitepress/theme-without-fonts'

provideAppearanceTransition()
</script>

<template>
  <DefaultTheme.Layout>
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </DefaultTheme.Layout>
</template>
