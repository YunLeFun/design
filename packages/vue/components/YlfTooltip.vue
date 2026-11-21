<script lang="ts" setup>
// 行为 / 定位 / a11y 由 reka-ui 提供；皮肤走 token。
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  disabled?: boolean
  portalTo?: string | HTMLElement
}>(), {
  side: 'top',
  delay: 300,
  disabled: false,
})
</script>

<template>
  <TooltipProvider :delay-duration="delay">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child v-bind="$attrs">
        <slot />
      </TooltipTrigger>
      <TooltipPortal :to="portalTo">
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

<style>
.ylf-tooltip {
  z-index: var(--ylf-z-tooltip, 110);
  max-width: 240px;
  padding: 8px 12px;
  font-size: var(--ylf-control-font-size-sm, 0.8125rem);
  line-height: 1.5;
  color: var(--ylf-c-bg, #f8fafc);
  background: var(--ylf-c-text, #0f172a);
  border-radius: var(--ylf-radius-sm, 10px);
  border: 1px solid color-mix(in srgb, var(--ylf-c-bg, #f8fafc) 15%, transparent);
  box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(15, 23, 42, 0.16));
  transform-origin: var(--reka-tooltip-content-transform-origin);
}

.ylf-tooltip[data-state='delayed-open'],
.ylf-tooltip[data-state='instant-open'] {
  animation: ylf-tooltip-in var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-tooltip[data-state='closed'] {
  animation: ylf-tooltip-out var(--ylf-duration-exit, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-tooltip[data-side='bottom'] {
  --_enter-y: -4px;
}

.ylf-tooltip[data-side='top'] {
  --_enter-y: 4px;
}

.ylf-tooltip[data-side='left'] {
  --_enter-x: 4px;
}

.ylf-tooltip[data-side='right'] {
  --_enter-x: -4px;
}

.ylf-tooltip__arrow {
  fill: var(--ylf-c-text, #0f172a);
}

@keyframes ylf-tooltip-in {
  from {
    opacity: 0;
    transform: translate(var(--_enter-x, 0), var(--_enter-y, 0)) scale(0.94);
  }
}

@keyframes ylf-tooltip-out {
  to {
    opacity: 0;
    transform: scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-tooltip[data-state] {
    animation: none;
  }
}
</style>
