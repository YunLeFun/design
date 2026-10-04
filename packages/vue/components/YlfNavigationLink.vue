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

<style lang="scss" scoped>
@use './navigation' as navigation;

.ylf-navigation-link {
  @include navigation.control;

  position: relative;
  justify-content: var(--_ylf-nav-justify, center);
  min-width: 60px;
  padding: var(--ylf-space-2, 8px) var(--ylf-space-4, 16px);

  &[data-active] {
    background: var(--_ylf-nav-active-bg, transparent);
    color: var(--ylf-c-brand, #2563eb);

    &::after {
      position: absolute;
      display: var(--_ylf-nav-indicator, block);
      bottom: 3px;
      inset-inline-start: calc(50% - 8px);
      width: 16px;
      height: 2px;
      border-radius: var(--ylf-radius-pill, 999px);
      background: currentColor;
      content: '';
    }

    &:hover {
      background: var(--ylf-c-bg-soft, #f1f5f9);
      color: var(--ylf-c-brand, #2563eb);
    }
  }
}
</style>
