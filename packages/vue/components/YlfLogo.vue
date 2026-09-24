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
      <svg viewBox="0 0 100 70" fill="currentColor">
        <path d="M44 35L27.5 44.5263V25.4737L44 35Z" />
        <circle cx="65" cy="35" r="9" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M85 0H15V15H0V55H15V70H85V55H100V15H85V0ZM85 15H15V55H85V15Z" />
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
    color: var(--ylf-c-brand, #2563eb);

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__name {
    font-family: var(--ylf-font-wordmark, var(--ylf-font-display, sans-serif));
    font-weight: 700;
    color: var(--ylf-c-text, #0f172a);
  }

  // sizes
  &--sm &__mark {
    width: 36px;
    height: 25.2px;
  }

  &--sm &__name {
    font-size: 18px;
  }

  &--md &__mark {
    width: 48px;
    height: 33.6px;
  }

  &--md &__name {
    font-size: 24px;
  }

  &--lg &__mark {
    width: 72px;
    height: 50.4px;
  }

  &--lg &__name {
    font-size: 34px;
  }
}
</style>
