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

<style scoped>
.ylf-navigation-trigger {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--ylf-touch-target, 44px);
  gap: var(--ylf-space-2, 8px);
  padding: var(--ylf-space-2, 8px) var(--ylf-space-3, 12px);
  border: 1px solid transparent;
  border-radius: var(--ylf-radius-sm, 10px);
  background: transparent;
  color: var(--ylf-c-text-2, #475569);
  font-family: var(--ylf-font-body, inherit);
  font-size: var(--ylf-text-sm, 0.875rem);
  font-weight: 500;
  line-height: 1.25rem;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)),
    color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-navigation-trigger:hover:not(:disabled) {
  background: var(--ylf-c-bg-soft, #f1f5f9);
  color: var(--ylf-c-text, #0f172a);
}

/* Focus stays inside the target so it cannot overlap a neighboring state. */
.ylf-navigation-trigger:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: -2px;
  box-shadow: none;
}

.ylf-navigation-trigger[aria-expanded='true'] {
  background: var(--ylf-c-bg-soft, #f1f5f9);
  color: var(--ylf-c-text, #0f172a);
}

.ylf-navigation-trigger:disabled {
  opacity: var(--ylf-disabled-opacity, 0.48);
  cursor: not-allowed;
}

.ylf-navigation-trigger__chevron {
  flex: none;
  color: var(--ylf-c-text-3, #5a697e);
  transition: transform var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-navigation-trigger[aria-expanded='true'] .ylf-navigation-trigger__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .ylf-navigation-trigger,
  .ylf-navigation-trigger__chevron {
    transition: none;
  }
}
</style>
