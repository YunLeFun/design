<script lang="ts" setup>
import type { BottomMenuItem } from '@yunlefun/vue'

defineProps<{
  active: boolean
  item: BottomMenuItem
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :class="{
      active,
    }"
    class="ylf-bottom-menu-item cursor-pointer transition"
    flex="~ 1"
    justify="center" items="center"
    text-gray-800 dark="text-white"
    hover="text-blue-500"
    p="2"
    :to="item.to"
    @click="emit('click', item)"
  >
    <div flex="~ col" justify="center" items="center">
      <slot>
        <div text-xl :class="(active && item.activeIcon) || item.icon" />
        <span text-xs mt="1">
          {{ item.title }}
        </span>
      </slot>
    </div>
  </button>
</template>

<style lang="scss">
.ylf-bottom-menu-item {
  color: var(--ylf-c-text, black);

  &.active {
    color: var(--ylf-c-primary, dodgerblue);
  }
}
</style>
