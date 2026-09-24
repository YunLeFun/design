<script lang="ts" setup>
import { Separator } from 'reka-ui'

withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  /** 仅装饰（不被屏幕阅读器作为分节朗读） */
  decorative?: boolean
}>(), {
  orientation: 'horizontal',
  decorative: true,
})
</script>

<template>
  <Separator
    class="ylf-separator"
    :class="`ylf-separator--${orientation}`"
    :orientation="orientation"
    :decorative="decorative"
  />
</template>

<style lang="scss">
.ylf-separator {
  flex: none;
  background: var(--ylf-c-border, #e2e8f0);

  &--horizontal {
    width: 100%;
    height: 1px;
  }

  &--vertical {
    width: 1px;
    height: 100%;
    align-self: stretch;
  }
}
</style>
