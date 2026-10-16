<script setup lang="ts">
import type { YunlefunBrandIcon, YunlefunBrandImage, YunlefunBrandMark } from 'vitepress-theme-yunlefun/config'
import type { PropType } from 'vue'
import { icons } from '@yunlefun/icons'
import { withBase } from 'vitepress'
import { computed } from 'vue'

const props = defineProps({
  /** Canonical mark; kept for 0.3 call sites. */
  name: { type: String as PropType<YunlefunBrandMark>, default: 'brand-mark' },
  /** Canonical mark, Iconify data or image; takes precedence over `name`. */
  icon: { type: [String, Object] as PropType<YunlefunBrandMark | YunlefunBrandIcon | YunlefunBrandImage>, default: undefined },
  label: { type: String, default: undefined },
})

const source = computed(() => props.icon || props.name)
const image = computed(() => typeof source.value === 'object' && 'src' in source.value ? source.value : undefined)
const svg = computed(() => {
  if (typeof source.value === 'string')
    return { id: `ylf:${source.value}`, ...icons.icons[source.value] }
  return 'body' in source.value ? { id: 'site', ...source.value } : undefined
})
const viewBox = computed(() => `0 0 ${svg.value?.width || icons.width || 16} ${svg.value?.height || icons.height || 16}`)
</script>

<template>
  <img
    v-if="image"
    class="ylf-brand-logo"
    data-icon="site"
    :src="withBase(image.src)"
    :alt="label || ''"
  >
  <!-- Iconify data comes from @yunlefun/icons or the site's own build-time config, never from visitors. -->
  <!-- eslint-disable vue/no-v-html -->
  <svg
    v-else-if="svg"
    class="ylf-brand-logo"
    :data-icon="svg.id"
    :viewBox="viewBox"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
    focusable="false"
    v-html="svg.body"
  />
</template>

<style scoped>
.ylf-brand-logo {
  display: block;
  flex: none;
  width: auto;
  height: 28px;
  color: var(--ylf-c-brand);
}
</style>
