<script setup lang="ts" generic="T extends string = string">
import type { YlfSegmentedOption } from './segmented-control'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import YlfTooltip from './YlfTooltip.vue'

const props = withDefaults(defineProps<{
  options: readonly YlfSegmentedOption<T>[]
  /** Accessible name of the group, including for icon-only controls. */
  label: string
  size?: 'sm' | 'md'
  iconOnly?: boolean
  disabled?: boolean
}>(), {
  size: 'md',
  iconOnly: false,
  disabled: false,
})

defineSlots<{
  icon?: (props: { option: YlfSegmentedOption<T>, selected: boolean }) => unknown
}>()
const model = defineModel<T>({ required: true })
function updateValue(value: unknown): void {
  const option = props.options.find(option => option.value === value)
  // A view or filter always has one active choice, even when clicked again.
  if (!props.disabled && option && !option.disabled)
    model.value = option.value
}
</script>

<template>
  <ToggleGroupRoot
    class="ylf-segmented"
    :data-size="size"
    :data-icon-only="iconOnly || undefined"
    type="single"
    orientation="horizontal"
    :aria-label="label"
    :disabled="disabled"
    :model-value="model"
    @update:model-value="updateValue"
  >
    <YlfTooltip v-for="option in options" :key="option.value" :content="option.label" :disabled="!iconOnly || disabled || option.disabled">
      <ToggleGroupItem
        class="ylf-segmented__item"
        :value="option.value"
        :disabled="option.disabled"
        :aria-label="option.ariaLabel ?? option.label"
      >
        <span v-if="$slots.icon" class="ylf-segmented__icon" aria-hidden="true">
          <slot name="icon" :option="option" :selected="model === option.value" />
        </span>
        <span v-if="!iconOnly || !$slots.icon" class="ylf-segmented__label">{{ option.label }}</span>
        <span v-if="option.count !== undefined && !iconOnly" class="ylf-segmented__count">{{ option.count }}</span>
      </ToggleGroupItem>
    </YlfTooltip>
  </ToggleGroupRoot>
</template>

<style>
.ylf-segmented {
  --ylf-segmented-item-size: 36px;
  display: inline-flex;
  align-items: center;
  flex: none;
  box-sizing: border-box;
  max-width: 100%;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius-sm, 10px);
  background: var(--ylf-c-bg-soft, #f1f5f9);
  font-family: var(--ylf-font-body, inherit);
}

.ylf-segmented[data-size='sm'] {
  --ylf-segmented-item-size: 26px;
}

.ylf-segmented__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-sizing: border-box;
  min-width: var(--ylf-segmented-item-size);
  height: var(--ylf-segmented-item-size);
  gap: 6px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: calc(var(--ylf-radius-sm, 10px) - 4px);
  background: transparent;
  color: var(--ylf-c-text-2, #475569);
  font: inherit;
  font-size: var(--ylf-text-sm, 14px);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--ylf-duration-fast, 160ms),
    color var(--ylf-duration-fast, 160ms),
    box-shadow var(--ylf-duration-fast, 160ms);
}

.ylf-segmented[data-size='sm'] .ylf-segmented__item {
  padding-inline: 8px;
  font-size: 12px;
}

.ylf-segmented[data-icon-only] .ylf-segmented__item {
  width: calc(var(--ylf-segmented-item-size) + 4px);
  padding: 0;
}

.ylf-segmented__item:hover:not([data-disabled], [aria-pressed='true']) {
  color: var(--ylf-c-text, #0f172a);
  background: color-mix(in srgb, var(--ylf-c-surface, #fff) 60%, transparent);
}

.ylf-segmented__item[aria-pressed='true'] {
  color: var(--ylf-c-brand, #2563eb);
  background: var(--ylf-c-surface, #fff);
  border-color: var(--ylf-c-border, #e2e8f0);
  box-shadow: var(--ylf-shadow-sm);
}

.ylf-segmented__item:focus-visible {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--ylf-c-brand, #2563eb);
  outline-offset: 2px;
}

.ylf-segmented__item[data-disabled] {
  cursor: not-allowed;
  opacity: 0.45;
}

.ylf-segmented__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 1;
}

.ylf-segmented__icon > :where(svg, i, span) {
  width: 100%;
  height: 100%;
}

.ylf-segmented__count {
  min-width: 16px;
  color: var(--ylf-c-text-3, #64748b);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.ylf-segmented__item[aria-pressed='true'] .ylf-segmented__count {
  color: inherit;
}

@media (pointer: coarse) {
  .ylf-segmented .ylf-segmented__item {
    min-width: 44px;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-segmented__item {
    transition: none;
  }
}
</style>
