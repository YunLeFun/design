<script lang="ts" setup>
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}>(), {
  side: 'bottom',
  align: 'center',
})

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent :side="side" :align="align" :side-offset="8" class="ylf-popover">
        <slot />
        <PopoverArrow class="ylf-popover__arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style lang="scss">
.ylf-popover {
  z-index: 105;
  min-width: 180px;
  max-width: 320px;
  padding: 16px;
  color: var(--ylf-c-text, #1b2238);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e5e9f3);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-lg, 0 22px 56px -14px rgba(109, 92, 255, 0.3));
  transform-origin: var(--reka-popover-content-transform-origin);

  &[data-state='open'] {
    animation: ylf-pop-in 0.18s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
  }

  &__arrow {
    fill: var(--ylf-c-surface, #fff);
    stroke: var(--ylf-c-border, #e5e9f3);
  }
}

@keyframes ylf-pop-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-popover[data-state='open'] {
    animation: none;
  }
}
</style>
