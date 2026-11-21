<script setup lang="ts">
import { Primitive } from 'reka-ui'

withDefaults(defineProps<{
  active?: boolean
  /** Merge attributes onto one child anchor, e.g. NuxtLink or RouterLink. */
  asChild?: boolean
}>(), {
  active: false,
  asChild: false,
})
</script>

<template>
  <Primitive
    as="a"
    :as-child="asChild"
    class="ylf-navigation-link"
    :aria-current="active ? 'page' : undefined"
    :data-active="active ? '' : undefined"
  >
    <slot />
  </Primitive>
</template>

<style scoped>
.ylf-navigation-link {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: var(--_ylf-nav-justify, center);
  min-width: 60px;
  min-height: var(--ylf-touch-target, 44px);
  gap: var(--ylf-space-2, 8px);
  padding: var(--ylf-space-2, 8px) var(--ylf-space-4, 16px);
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

.ylf-navigation-link:hover:not(:disabled) {
  background: var(--ylf-c-bg-soft, #f1f5f9);
  color: var(--ylf-c-text, #0f172a);
}

/* Focus stays inside the target so it cannot overlap a neighboring state. */
.ylf-navigation-link:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: -2px;
  box-shadow: none;
}

.ylf-navigation-link[data-active] {
  background: var(--_ylf-nav-active-bg, transparent);
  color: var(--ylf-c-brand, #2563eb);
}

.ylf-navigation-link[data-active]::after {
  position: absolute;
  display: var(--_ylf-nav-indicator, block);
  bottom: 4px;
  inset-inline-start: calc(50% - 8px);
  width: 16px;
  height: 2px;
  border-radius: var(--ylf-radius-pill, 999px);
  background: currentColor;
  content: '';
}

.ylf-navigation-link[data-active]:hover {
  background: var(--ylf-c-bg-soft, #f1f5f9);
  color: var(--ylf-c-brand, #2563eb);
}

@media (prefers-reduced-motion: reduce) {
  .ylf-navigation-link {
    transition: none;
  }
}
</style>
