<script lang="ts" setup>
withDefaults(defineProps<{
  /** 浮起阴影 */
  shadow?: boolean
}>(), {
  shadow: false,
})
</script>

<template>
  <nav class="ylf-bottom-menu" :class="{ 'is-shadow': shadow }">
    <slot />
  </nav>
</template>

<style lang="scss">
.ylf-bottom-menu {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  gap: 4px;
  padding: 8px 6px;
  background: var(--ylf-bottom-menu-c-bg, var(--ylf-glass-bg, rgba(255, 255, 255, 0.62)));
  -webkit-backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
  backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
  border-top: 1px solid var(--ylf-c-border, #e5e9f3);

  &.is-shadow {
    box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(110, 123, 255, 0.22));
  }
}
</style>
