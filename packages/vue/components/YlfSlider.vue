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
const model = defineModel<number[]>({ default: () => [50] })
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

<style lang="scss">
.ylf-slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  touch-action: none;
  user-select: none;

  &[data-disabled] {
    opacity: 0.5;
  }

  &__track {
    position: relative;
    flex-grow: 1;
    height: 6px;
    border-radius: 999px;
    background: var(--ylf-c-bg-mute, #e2e8f0);
  }

  &__range {
    position: absolute;
    height: 100%;
    border-radius: 999px;
    background: var(--ylf-c-brand, #2563eb);
  }

  &__thumb {
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
      box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease),
      scale var(--ylf-duration-slow, 480ms) var(--ylf-ease-spring, var(--ylf-ease-standard, ease));

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        box-shadow: 0 0 0 6px var(--ylf-c-brand-soft, #eff6ff);
      }
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px var(--ylf-c-brand-soft, #eff6ff);
    }

    &:active {
      cursor: grabbing;
      scale: 1.2;
      box-shadow: 0 0 0 6px var(--ylf-c-brand-soft, #eff6ff);
    }
  }
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
