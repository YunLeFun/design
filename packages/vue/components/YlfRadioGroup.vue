<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（role=radiogroup、方向键 roving focus）；皮肤走 token。
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(defineProps<{
  options: RadioOption[]
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
}>(), {
  disabled: false,
  orientation: 'vertical',
})

const model = defineModel<string>()
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :orientation="orientation"
    class="ylf-radio-group"
    :class="`ylf-radio-group--${orientation}`"
  >
    <RadioGroupItem
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
      class="ylf-radio"
    >
      <span class="ylf-radio__control">
        <RadioGroupIndicator class="ylf-radio__dot" />
      </span>
      <span class="ylf-radio__label">{{ opt.label }}</span>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<style lang="scss">
.ylf-radio-group {
  display: flex;
  gap: 14px;

  &--vertical {
    flex-direction: column;
  }

  &--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.ylf-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ylf-c-text, #1b2238);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &__control {
    flex: none;
    width: 20px;
    height: 20px;
    display: inline-grid;
    place-items: center;
    border: 2px solid var(--ylf-c-border-strong, #d3d9ea);
    border-radius: 50%;
    background: var(--ylf-c-surface, #fff);
    transition:
      border-color 0.18s ease,
      box-shadow 0.2s ease;
  }

  &:hover:not([data-disabled]) .ylf-radio__control {
    border-color: var(--ylf-c-brand, #6d5cff);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .ylf-radio__control {
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #ece9ff);
  }

  &[data-state='checked'] .ylf-radio__control {
    border-color: var(--ylf-c-brand, #6d5cff);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__dot {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--ylf-c-brand, #6d5cff);
  }

  &__label {
    font-size: 15px;
  }
}
</style>
