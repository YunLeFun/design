<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

withDefaults(defineProps<{
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

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
  >
    <SliderTrack class="ylf-slider__track">
      <SliderRange class="ylf-slider__range" />
    </SliderTrack>
    <SliderThumb v-for="(_, i) in model" :key="i" class="ylf-slider__thumb" />
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
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--ylf-c-brand, #2563eb);
    box-shadow: var(--ylf-shadow-sm, 0 2px 8px -2px rgba(15, 23, 42, 0.12));
    cursor: grab;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 0 0 6px var(--ylf-c-brand-soft, #eff6ff);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px var(--ylf-c-brand-soft, #eff6ff);
    }

    &:active {
      cursor: grabbing;
    }
  }
}
</style>
