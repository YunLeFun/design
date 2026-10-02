<script setup lang="ts">
import type { YunlefunThemeConfig } from 'vitepress-theme-yunlefun/config'
import { useData } from 'vitepress'
import { provideAppearanceTransition } from 'vitepress-theme-yunlefun/appearance'
import DefaultTheme from 'vitepress/theme-without-fonts'
import YunlefunLogo from './YunlefunLogo.vue'

const { theme, frontmatter } = useData<YunlefunThemeConfig>()
provideAppearanceTransition()
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-before="slotProps">
      <slot name="nav-bar-title-before" v-bind="slotProps || {}">
        <YunlefunLogo v-if="theme.brand" :name="theme.brand.icon" class="ylf-nav-logo" />
      </slot>
    </template>
    <template v-if="$slots['home-hero-image'] || theme.brand?.hero" #home-hero-image="slotProps">
      <slot name="home-hero-image" v-bind="slotProps || {}">
        <YunlefunLogo :name="theme.brand?.icon" :label="frontmatter.hero?.name" class="ylf-hero-logo" />
      </slot>
    </template>
    <template v-for="name in Object.keys($slots).filter(name => name !== 'nav-bar-title-before' && name !== 'home-hero-image')" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.ylf-nav-logo {
  margin-right: 10px;
}
.ylf-hero-logo {
  width: min(280px, 80%);
  height: auto;
}
</style>
