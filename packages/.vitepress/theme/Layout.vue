<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import YlfLogo from '../../vue/components/YlfLogo.vue'
import { provideAppearanceTransition } from './composables/useAppearanceTransition'

provideAppearanceTransition()
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-before>
      <YlfLogo size="sm" :wordmark="false" class="ylf-docs-mark" />
    </template>
  </DefaultTheme.Layout>
</template>
