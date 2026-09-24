<script lang="ts" setup>
// 行为 / 定位 / a11y 由 reka-ui 提供；皮肤走 token。
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

withDefaults(defineProps<{
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}>(), {
  side: 'top',
  delay: 300,
})
</script>

<template>
  <TooltipProvider :delay-duration="delay">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent :side="side" :side-offset="6" class="ylf-tooltip">
          <slot name="content">
            {{ content }}
          </slot>
          <TooltipArrow class="ylf-tooltip__arrow" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style lang="scss">
.ylf-tooltip {
  z-index: 110;
  max-width: 240px;
  padding: 7px 11px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ylf-c-bg, #fbfcff);
  background: var(--ylf-c-text, #0f172a);
  border-radius: var(--ylf-radius-sm, 10px);
  box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(15, 23, 42, 0.16));
  transform-origin: var(--reka-tooltip-content-transform-origin);

  &[data-state='delayed-open'] {
    animation: ylf-pop-in 0.16s ease;
  }

  &__arrow {
    fill: var(--ylf-c-text, #0f172a);
  }
}

@keyframes ylf-pop-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-tooltip[data-state='delayed-open'] {
    animation: none;
  }
}
</style>
