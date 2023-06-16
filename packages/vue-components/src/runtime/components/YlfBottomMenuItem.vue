<script lang="ts" setup>
import type { BottomMenuItem } from '@yunlefun/vue-components'

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
    class="ylf-bottom-menu-item hover:text-gray-900 cursor-pointer transition"
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
  background-color: var(--ylf-bottom-menu-c-bg, #fff);

  &.active {
    color: var(--ylf-c-primary, dodgerblue);
  }
}

.dark {
  .ylf-bottom-menu-item {
    --ylf-bottom-menu-c-bg: #222;
  }
}
</style>
