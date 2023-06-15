<script lang="ts" setup>
import type { BottomMenuItem } from '.'

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
    class="ylf-bottom-menu-item text-gray-800 hover:text-gray-900 cursor-pointer transition"
    flex="~ 1"
    justify="center" items="center"
    hover="text-blue-500"
    active="text-blue-600"
    p="2"
    :to="item.to"
    @click="emit('click', item)"
  >
    <div flex="~ col" justify="center" items="center">
      <slot>
        <div text-xl :class="item.icon" />
        <span text-xs mt="1">
          {{ item.title }}
        </span>
      </slot>
    </div>
  </button>
</template>

<style lang="scss">
.ylf-bottom-menu-item {
  color: var(--ylf-c-text);
  background-color: var(--ylf-c-bg);

  &.active {
    color: var(--ylf-c-primary);
  }
}

.dark {
  .ylf-bottom-menu-item {

  }
}
</style>
