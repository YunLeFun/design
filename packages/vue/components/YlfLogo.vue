<script lang="ts" setup>
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  layout?: 'vertical' | 'horizontal'
  /** 是否显示「云乐坊」文字 */
  wordmark?: boolean
}>(), {
  size: 'md',
  layout: 'vertical',
  wordmark: true,
})
</script>

<template>
  <div class="ylf-logo" :class="[`ylf-logo--${size}`, `ylf-logo--${layout}`]">
    <span class="ylf-logo__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.5 19a4.5 4.5 0 1 0 0-9 6 6 0 0 0-11.5 1.5A4 4 0 0 0 6.5 19h11Z" />
      </svg>
    </span>
    <span v-if="wordmark" class="ylf-logo__name">云乐坊</span>
  </div>
</template>

<style lang="scss">
.ylf-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: default;
  line-height: 1;

  &--vertical {
    flex-direction: column;
    gap: 8px;
  }

  &__mark {
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 28%;
    color: #fff;
    background: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
    box-shadow: var(--ylf-glow-aurora, 0 10px 30px -6px rgba(157, 139, 255, 0.5));

    svg {
      width: 58%;
      height: 58%;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18));
    }
  }

  &__name {
    font-family: var(--ylf-font-wordmark, var(--ylf-font-display, sans-serif));
    font-weight: 700;
    background: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ylf-logo-hue 9s linear infinite;
  }

  // sizes
  &--sm &__mark {
    width: 30px;
    height: 30px;
  }

  &--sm &__name {
    font-size: 18px;
  }

  &--md &__mark {
    width: 42px;
    height: 42px;
  }

  &--md &__name {
    font-size: 24px;
  }

  &--lg &__mark {
    width: 64px;
    height: 64px;
  }

  &--lg &__name {
    font-size: 34px;
  }
}

@keyframes ylf-logo-hue {
  to {
    background-position: 200% center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-logo__name {
    animation: none;
  }
}
</style>
