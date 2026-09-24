<script lang="ts" setup>
import type { YlfAccentTone } from './theme'

type CardVariant
  = | 'soft' // 柔影：默认表面 + 色染柔影
    | 'glass' // 云玻璃：背景模糊通透
    | 'accent' // 纯色顶部强调
    | 'tinted' // 柔色表面，用于内容分组
    | 'gradient' // @deprecated 使用 accent

withDefaults(defineProps<{
  variant?: CardVariant
  tone?: YlfAccentTone
  /** 悬停时轻轻抬升 */
  hoverable?: boolean
  /** 内边距，接受任意 CSS 值 */
  padding?: string
}>(), {
  variant: 'soft',
  tone: 'blue',
  hoverable: true,
  padding: '22px',
})
</script>

<template>
  <div
    class="ylf-card"
    :data-ylf-tone="tone"
    :class="[`ylf-card--${variant}`, { 'is-hoverable': hoverable }]"
    :style="{ padding }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.ylf-card {
  position: relative;
  border-radius: var(--ylf-radius-lg, 20px);
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  box-shadow: var(--ylf-shadow-sm, 0 2px 8px -2px rgba(15, 23, 42, 0.12));
  transition:
    transform var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    box-shadow var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    background var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease);

  &.is-hoverable:hover {
    transform: translateY(-4px);
    box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(15, 23, 42, 0.16));
  }

  // 云玻璃
  &--glass {
    background: var(--ylf-glass-bg, rgba(255, 255, 255, 0.62));
    border-color: var(--ylf-glass-border, rgba(255, 255, 255, 0.7));
    -webkit-backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
    backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
  }

  &--accent,
  &--gradient {
    border-top: 3px solid var(--ylf-accent, var(--ylf-c-brand, #2563eb));
  }

  &--tinted {
    background: var(--ylf-accent-soft, var(--ylf-c-brand-soft, #eff6ff));
    border-color: color-mix(in srgb, var(--ylf-accent, var(--ylf-c-brand, #2563eb)) 35%, var(--ylf-c-surface, #fff));
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-card {
    transition: none;
  }
}
</style>
