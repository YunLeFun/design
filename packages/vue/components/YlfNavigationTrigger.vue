<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})
</script>

<template>
  <button type="button" class="ylf-navigation-trigger" :disabled="disabled">
    <slot />
    <svg class="ylf-navigation-trigger__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
@use './navigation' as navigation;

.ylf-navigation-trigger {
  @include navigation.control;

  justify-content: center;
  padding: var(--ylf-space-2, 8px) var(--ylf-space-3, 12px);

  &[aria-expanded='true'] {
    background: var(--ylf-c-bg-soft, #f1f5f9);
    color: var(--ylf-c-text, #0f172a);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__chevron {
    flex: none;
    color: var(--ylf-c-text-3, #5c6b80);
    transition: transform var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease);
  }

  &[aria-expanded='true'] &__chevron {
    transform: rotate(180deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-navigation-trigger__chevron {
    transition: none;
  }
}
</style>
