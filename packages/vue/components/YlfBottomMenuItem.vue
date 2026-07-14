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

<style lang="scss">
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
  color: var(--ylf-c-text-3, #9098ad);
  transition:
    color 0.2s ease,
    transform 0.2s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));

  &__icon {
    font-size: 22px;
  }

  &__label {
    font-size: 12px;
  }

  &:active {
    transform: scale(0.92);
  }

  &.active {
    color: var(--ylf-c-brand, #6e7bff);

    .ylf-bottom-menu-item__label {
      background: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-bottom-menu-item {
    transition: none;
  }
}
</style>
