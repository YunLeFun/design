<script lang="ts" setup>
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  portalTo?: string | HTMLElement
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
    <PopoverPortal :to="portalTo">
      <PopoverContent v-bind="$attrs" :side="side" :align="align" :side-offset="8" :collision-padding="16" class="ylf-popover">
        <div class="ylf-popover__body">
          <slot />
        </div>
        <PopoverArrow class="ylf-popover__arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style lang="scss">
.ylf-popover {
  z-index: 105;
  box-sizing: border-box;
  min-width: min(180px, var(--reka-popover-content-available-width, 100vw));
  max-width: min(320px, var(--reka-popover-content-available-width, calc(100vw - 32px)));
  max-height: var(--reka-popover-content-available-height, calc(100dvh - 32px));
  overflow-wrap: anywhere;
  overscroll-behavior: contain;
  padding: 16px;
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-panel, var(--ylf-c-surface, #fff));
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-panel, 0 22px 56px -14px rgba(15, 23, 42, 0.22));
  backdrop-filter: var(--ylf-glass-blur, blur(16px));
  transform-origin: var(--reka-popover-content-transform-origin);

  &[data-state='open'] {
    animation: ylf-popover-in var(--ylf-duration-enter, 240ms) var(--ylf-ease-standard, ease);
  }

  &[data-state='closed'] {
    animation: ylf-popover-out var(--ylf-duration-exit, 160ms) var(--ylf-ease-standard, ease);
  }

  &[data-side='bottom'] {
    --_enter-y: -4px;
  }
  &[data-side='top'] {
    --_enter-y: 4px;
  }
  &[data-side='left'] {
    --_enter-x: 4px;
  }
  &[data-side='right'] {
    --_enter-x: -4px;
  }

  &__body {
    max-height: calc(var(--reka-popover-content-available-height, calc(100dvh - 32px)) - 34px);
    overflow: auto;
    overscroll-behavior: contain;
  }

  &__arrow {
    fill: var(--ylf-c-surface, #fff);
    stroke: var(--ylf-c-border, #e2e8f0);
  }
}

@keyframes ylf-popover-in {
  from {
    opacity: 0;
    transform: translate(var(--_enter-x, 0), var(--_enter-y, 0)) scale(0.96);
  }
}

@keyframes ylf-popover-out {
  to {
    opacity: 0;
    transform: scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-popover[data-state] {
    animation: none;
  }
}
</style>
