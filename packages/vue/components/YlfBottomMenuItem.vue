<script lang="ts" setup>
import type { BottomMenuItem } from './bottom-menu'

defineProps<{
  active: boolean
  item: BottomMenuItem
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <button
    class="ylf-bottom-menu-item"
    :class="{ active }"
    type="button"
    @click="emit('click', item)"
  >
    <slot>
      <div class="ylf-bottom-menu-item__icon" :class="(active && item.activeIcon) || item.icon" />
      <span class="ylf-bottom-menu-item__label">{{ item.title }}</span>
    </slot>
  </button>
</template>

<style>
.ylf-bottom-menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--ylf-c-text-3, #5a697e);
  transition:
    color 0.2s var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)),
    transform 0.2s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
}

.ylf-bottom-menu-item__icon {
  font-size: 22px;
}

.ylf-bottom-menu-item__label {
  font-size: var(--ylf-text-xs, 0.75rem);
}

.ylf-bottom-menu-item:active {
  transform: scale(0.92);
}

.ylf-bottom-menu-item.active {
  color: var(--ylf-c-brand, #2563eb);
}

@media (prefers-reduced-motion: reduce) {
  .ylf-bottom-menu-item {
    transition: none;
  }
}
</style>
