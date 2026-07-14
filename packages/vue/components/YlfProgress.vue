<script lang="ts" setup>
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: number
  max?: number
  /** 进度条填充：brand 实色或 aurora 渐变 */
  variant?: 'brand' | 'aurora'
}>(), {
  value: 0,
  max: 100,
  variant: 'brand',
})

const percent = computed(() => Math.max(0, Math.min(100, (props.value / props.max) * 100)))
</script>

<template>
  <ProgressRoot
    :model-value="value"
    :max="max"
    class="ylf-progress"
    :class="`ylf-progress--${variant}`"
  >
    <ProgressIndicator
      class="ylf-progress__indicator"
      :style="{ transform: `translateX(-${100 - percent}%)` }"
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
  background: var(--ylf-c-bg-mute, #e8ecf7);
}

.ylf-progress__indicator {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--ylf-c-brand, #6d5cff);
  transition: transform 0.4s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
}

.ylf-progress--aurora .ylf-progress__indicator {
  background-image: var(--ylf-gradient-aurora, linear-gradient(115deg, #5ba3ff, #7b61ff, #e879c6));
}

@media (prefers-reduced-motion: reduce) {
  .ylf-progress__indicator {
    transition: none;
  }
}
</style>
