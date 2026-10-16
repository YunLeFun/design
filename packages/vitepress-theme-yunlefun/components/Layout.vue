<script setup lang="ts">
import type { YunlefunThemeConfig } from 'vitepress-theme-yunlefun/config'
import { useData, useRoute } from 'vitepress'
import { provideAppearanceTransition } from 'vitepress-theme-yunlefun/appearance'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { computed, onBeforeUnmount, watch } from 'vue'
import NavigationIndicator from './NavigationIndicator.vue'
import YunlefunLogo from './YunlefunLogo.vue'

const { theme, frontmatter } = useData<YunlefunThemeConfig>()
provideAppearanceTransition()

// 正文只在站内换页后浮入；SSR 首屏不带这个类，内容直接以完整不透明度呈现。
// 监听路由而不是占用 router.onAfterRouteChange，站点自己的钩子不会被覆盖。
const ENTER_CLASS = 'ylf-route-enter'
let fallback: ReturnType<typeof setTimeout> | undefined
function endEnter(event?: AnimationEvent) {
  if (event && event.animationName !== 'ylf-doc-enter')
    return
  clearTimeout(fallback)
  document.documentElement.classList.remove(ENTER_CLASS)
  document.removeEventListener('animationend', endEnter)
}
const route = useRoute()
watch(() => route.path, () => {
  const root = document.documentElement
  endEnter()
  // 连续换页时重新起播，而不是沿用上一页未结束的动画。
  void root.offsetWidth
  root.classList.add(ENTER_CLASS)
  document.addEventListener('animationend', endEnter)
  // 首页、减少动态效果没有 animationend；后台标签页里动画停在第一帧，也在 1 秒内恢复完整不透明度。
  fallback = setTimeout(endEnter, 1000)
}, { flush: 'post' })
onBeforeUnmount(() => endEnter())

const sky = computed(() => Boolean(theme.value.brand?.sky && frontmatter.value.layout === 'home' && frontmatter.value.hero))
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-before="slotProps">
      <NavigationIndicator />
      <slot name="nav-bar-content-before" v-bind="slotProps || {}" />
    </template>
    <template #nav-bar-title-before="slotProps">
      <slot name="nav-bar-title-before" v-bind="slotProps || {}">
        <YunlefunLogo v-if="theme.brand" :icon="theme.brand.icon" class="ylf-nav-logo" />
      </slot>
    </template>
    <template v-if="$slots['home-hero-image'] || theme.brand?.hero" #home-hero-image="slotProps">
      <slot name="home-hero-image" v-bind="slotProps || {}">
        <YunlefunLogo :icon="theme.brand?.icon" :label="frontmatter.hero?.name" class="ylf-hero-logo" />
      </slot>
    </template>
    <template v-if="$slots['home-hero-before'] || sky" #home-hero-before="slotProps">
      <!-- 纯装饰的晴空/夜空：只画在原生首页 hero 之后，不参与布局。 -->
      <div v-if="sky" class="ylf-home-sky" aria-hidden="true">
        <span class="ylf-home-sky__cloud" data-cloud="billow" />
        <span class="ylf-home-sky__cloud" data-cloud="puff" />
        <span class="ylf-home-sky__cloud" data-cloud="wisp" />
      </div>
      <slot name="home-hero-before" v-bind="slotProps || {}" />
    </template>
    <template v-for="name in Object.keys($slots).filter(name => !['nav-bar-title-before', 'home-hero-image', 'nav-bar-content-before', 'home-hero-before'].includes(name))" #[name]="slotProps">
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
