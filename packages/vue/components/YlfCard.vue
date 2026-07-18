<script lang="ts" setup>
type CardVariant
  = | 'soft' // 柔影：默认表面 + 色染柔影
    | 'glass' // 云玻璃：背景模糊通透
    | 'gradient' // 流光描边：极光做边

withDefaults(defineProps<{
  variant?: CardVariant
  /** 悬停时轻轻抬升 */
  hoverable?: boolean
  /** 内边距，接受任意 CSS 值 */
  padding?: string
}>(), {
  variant: 'soft',
  hoverable: true,
  padding: '22px',
})
</script>

<template>
  <div
    class="ylf-card"
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
  color: var(--ylf-c-text, #1b2238);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e5e9f3);
  box-shadow: var(--ylf-shadow-sm, 0 2px 8px -2px rgba(110, 123, 255, 0.16));
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  &.is-hoverable:hover {
    transform: translateY(-4px);
    box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(110, 123, 255, 0.22));
  }

  // 云玻璃
  &--glass {
    background: var(--ylf-glass-bg, rgba(255, 255, 255, 0.62));
    border-color: var(--ylf-glass-border, rgba(255, 255, 255, 0.7));
    -webkit-backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
    backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
  }

  // 流光描边：极光渐变做 1.5px 边
  &--gradient::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.5px;
    background: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-card {
    transition: none;
  }
}
</style>
