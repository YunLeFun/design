<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

withDefaults(defineProps<{
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Accessible name for a single value or the range as a whole. */
  label?: string
  /** Per-thumb accessible names, such as minimum and maximum price. */
  thumbLabels?: readonly string[]
}>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  label: '数值',
})

const emit = defineEmits<{ valueCommit: [value: number[]] }>()
const model = defineModel<number[]>({
  default: () => [50],
})
</script>

<template>
  <SliderRoot
    v-model="model"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    class="ylf-slider"
    @value-commit="emit('valueCommit', $event)"
  >
    <SliderTrack class="ylf-slider__track">
      <SliderRange class="ylf-slider__range" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in model"
      :key="i"
      class="ylf-slider__thumb"
      :aria-label="thumbLabels?.[i] || (model.length === 1 ? label : `${label} ${i + 1}`)"
    />
  </SliderRoot>
</template>

<style>
.ylf-slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  touch-action: none;
  user-select: none;
}

.ylf-slider[data-disabled] {
  opacity: var(--ylf-disabled-opacity, 0.48);
}

.ylf-slider__track {
  position: relative;
  flex-grow: 1;
  height: 6px;
  border-radius: var(--ylf-radius-pill, 999px);
  background: var(--ylf-c-bg-mute, #e2e8f0);
}

.ylf-slider__range {
  position: absolute;
  height: 100%;
  border-radius: var(--ylf-radius-pill, 999px);
  background: var(--ylf-c-brand, #2563eb);
}

.ylf-slider__thumb {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ylf-c-surface, #fff);
  border: 2px solid var(--ylf-c-brand, #2563eb);
  box-shadow: var(--ylf-shadow-sm, 0 2px 8px -2px rgba(15, 23, 42, 0.12));
  cursor: grab;
  transition:
    box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)),
    scale var(--ylf-duration-slow, 480ms) var(--ylf-ease-spring, var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)));
}

@media (hover: hover) and (pointer: fine) {
  .ylf-slider__thumb:hover {
    box-shadow: 0 0 0 6px var(--ylf-c-brand-soft, #eff6ff);
  }
}

.ylf-slider__thumb:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--ylf-c-brand-soft, #eff6ff);
}

.ylf-slider__thumb:active {
  cursor: grabbing;
  scale: 1.2;
  box-shadow: 0 0 0 6px var(--ylf-c-brand-soft, #eff6ff);
}

@media (pointer: coarse) {
  .ylf-slider {
    height: var(--ylf-touch-target, 44px);
  }

  .ylf-slider__thumb::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100%, var(--ylf-touch-target, 44px));
    height: max(100%, var(--ylf-touch-target, 44px));
    transform: translate(-50%, -50%);
    content: '';
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-slider__thumb {
    transition: none;
  }
}
</style>
