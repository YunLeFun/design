<script lang="ts" setup>
import type { YlfAccentTone } from './theme'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** null means that progress is unknown. */
  value?: number | null
  max?: number
  /** 进度条填充：brand 主色或 accent 纯色；aurora 是 accent 的旧别名 */
  variant?: 'brand' | 'accent' | 'aurora'
  tone?: YlfAccentTone
}>(), {
  value: 0,
  max: 100,
  variant: 'brand',
  tone: 'blue',
})

const safeMax = computed(() => Number.isFinite(props.max) && props.max > 0 ? props.max : 100)
const safeValue = computed(() => props.value === null || !Number.isFinite(props.value)
  ? null
  : Math.max(0, Math.min(safeMax.value, props.value)))
const percent = computed(() => safeValue.value === null ? null : safeValue.value / safeMax.value * 100)
</script>

<template>
  <ProgressRoot
    :model-value="safeValue"
    :max="safeMax"
    class="ylf-progress"
    :data-ylf-tone="tone"
    :class="`ylf-progress--${variant}`"
  >
    <ProgressIndicator
      class="ylf-progress__indicator"
      :style="{ transform: percent === null ? undefined : `translateX(-${100 - percent}%)` }"
    />
  </ProgressRoot>
</template>

<style lang="scss">
.ylf-progress {
  position: relative;
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--ylf-c-bg-mute, #e2e8f0);
}

.ylf-progress__indicator {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--ylf-c-brand, #2563eb);
  transition: transform 0.4s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
}

.ylf-progress[data-state='indeterminate'] .ylf-progress__indicator {
  width: 40%;
  animation: ylf-progress-indeterminate 1.4s ease-in-out infinite;
}

@keyframes ylf-progress-indeterminate {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

.ylf-progress--accent .ylf-progress__indicator,
.ylf-progress--aurora .ylf-progress__indicator {
  background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
}

@media (prefers-reduced-motion: reduce) {
  .ylf-progress__indicator {
    transition: none;
  }

  .ylf-progress[data-state='indeterminate'] .ylf-progress__indicator {
    animation: none;
    transform: translateX(75%);
  }
}
</style>
