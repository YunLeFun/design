<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（role=radiogroup、方向键 roving focus）；皮肤走 token。
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { nextTick } from 'vue'

interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  options: readonly RadioOption[]
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
}>(), {
  disabled: false,
  orientation: 'vertical',
})

const model = defineModel<string>()

function selectFocusedRadio(event: KeyboardEvent) {
  if (props.disabled || !event.defaultPrevented || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
    return
  const group = event.currentTarget as HTMLElement
  // Reka 2.10.x defers selection until after focus; a fast keyup can clear its flag.
  // Let Reka move focus and skip disabled items, then synchronize that choice.
  nextTick(() => {
    const focused = document.activeElement
    if (!(focused instanceof HTMLElement) || !group.contains(focused) || focused.getAttribute('role') !== 'radio')
      return
    const option = props.options.find(option => option.value === focused.getAttribute('value'))
    if (option && !option.disabled && model.value !== option.value)
      model.value = option.value
  })
}
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :orientation="orientation"
    class="ylf-radio-group"
    :class="`ylf-radio-group--${orientation}`"
    @keydown="selectFocusedRadio"
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
  color: var(--ylf-c-text, #0f172a);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &__control {
    flex: none;
    width: 20px;
    height: 20px;
    display: inline-grid;
    place-items: center;
    border: 2px solid var(--ylf-c-border-strong, #cbd5e1);
    border-radius: 50%;
    background: var(--ylf-c-surface, #fff);
    box-shadow: var(--ylf-shadow-control);
    transition:
      border-color 0.18s ease,
      box-shadow 0.2s ease;
  }

  &:hover:not([data-disabled]) .ylf-radio__control {
    border-color: var(--ylf-c-brand, #2563eb);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .ylf-radio__control {
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
    outline: 2px solid var(--ylf-c-brand, #2563eb);
    outline-offset: 3px;
  }

  &[data-state='checked'] .ylf-radio__control {
    border-color: var(--ylf-c-brand, #2563eb);
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
    background: var(--ylf-c-brand, #2563eb);
  }

  &__label {
    font-size: 15px;
  }
}
</style>
