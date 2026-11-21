<script setup lang="ts">
import { toRef } from 'vue'
import { useScrollFade } from './scroll-fade'

const props = withDefaults(defineProps<{
  /** The element inside the frame that owns vertical scrolling. */
  viewport?: HTMLElement | null
  /** CSS color of the surface behind the content. */
  surface?: string
  /** CSS length of the fade at each scroll edge. */
  size?: string
}>(), {
  surface: 'var(--ylf-c-surface, #fff)',
  size: '24px',
})

const fadeStyle = useScrollFade(toRef(() => props.viewport))
</script>

<template>
  <div
    class="ylf-scroll-fade"
    :style="[fadeStyle, { '--ylf-scroll-fade-surface': surface, '--ylf-scroll-fade-size': size }]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ylf-scroll-fade {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.ylf-scroll-fade::before,
.ylf-scroll-fade::after {
  position: absolute;
  z-index: var(--ylf-z-base, 1);
  inset-inline: 0;
  height: min(var(--ylf-scroll-fade-size), 50%);
  pointer-events: none;
  content: '';
}

.ylf-scroll-fade::before {
  top: 0;
  opacity: var(--scroll-fade-top);
  background: linear-gradient(to bottom, var(--ylf-scroll-fade-surface), transparent);
}

.ylf-scroll-fade::after {
  bottom: 0;
  opacity: var(--scroll-fade-bottom);
  background: linear-gradient(to top, var(--ylf-scroll-fade-surface), transparent);
}

@media (prefers-reduced-transparency: reduce), (forced-colors: active) {
  .ylf-scroll-fade::before,
  .ylf-scroll-fade::after {
    display: none;
  }
}
</style>
