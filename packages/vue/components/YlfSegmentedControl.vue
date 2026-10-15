<script setup lang="ts" generic="T extends string = string">
import type { YlfSegmentedOption } from './segmented-control'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
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

// 选中胶囊在选项间滑动；首次定位不带过渡，之后的切换才用弹簧。
const root = useTemplateRef<{ $el: HTMLElement }>('root')
const pill = shallowRef<{ x: number, y: number, width: number, height: number } | null>(null)
const pillAnimated = shallowRef(false)
let resizeObserver: ResizeObserver | undefined

function measurePill() {
  const item = root.value?.$el?.querySelector<HTMLElement>('.ylf-segmented__item[aria-pressed="true"]')
  pill.value = item?.offsetWidth
    ? { x: item.offsetLeft, y: item.offsetTop, width: item.offsetWidth, height: item.offsetHeight }
    : null
}

watch(model, async () => {
  await nextTick()
  measurePill()
})
onMounted(() => {
  measurePill()
  requestAnimationFrame(() => {
    pillAnimated.value = true
  })
  if (typeof ResizeObserver !== 'undefined' && root.value?.$el) {
    resizeObserver = new ResizeObserver(measurePill)
    resizeObserver.observe(root.value.$el)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <ToggleGroupRoot
    ref="root"
    class="ylf-segmented"
    :class="{ 'has-pill': pill, 'is-pill-animated': pillAnimated }"
    :data-size="size"
    :data-icon-only="iconOnly || undefined"
    type="single"
    orientation="horizontal"
    :aria-label="label"
    :disabled="disabled"
    :model-value="model"
    @update:model-value="updateValue"
  >
    <span
      v-if="pill"
      class="ylf-segmented__pill"
      aria-hidden="true"
      :style="{ width: `${pill.width}px`, height: `${pill.height}px`, transform: `translate(${pill.x}px, ${pill.y}px)` }"
    />
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
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  flex: none;
  box-sizing: border-box;
  max-width: 100%;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius-sm, 10px);
  background: var(--ylf-c-surface-inset, var(--ylf-c-bg-soft, #f1f5f9));
  box-shadow: var(--ylf-shadow-inset);
  font-family: var(--ylf-font-body, inherit);
}

.ylf-segmented[data-size='sm'] {
  --ylf-segmented-item-size: 26px;
}

.ylf-segmented__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  box-sizing: border-box;
  min-width: var(--ylf-segmented-item-size);
  min-height: var(--ylf-segmented-item-size);
  gap: 6px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: calc(var(--ylf-radius-sm, 10px) - 4px);
  background: transparent;
  color: var(--ylf-c-text-2, #475569);
  font: inherit;
  font-size: var(--ylf-text-sm, 14px);
  font-weight: 500;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: anywhere;
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

@media (hover: hover) and (pointer: fine) {
  .ylf-segmented__item:hover:not([data-disabled], [aria-pressed='true']) {
    color: var(--ylf-c-text, #0f172a);
    background: color-mix(in srgb, var(--ylf-c-surface, #fff) 60%, transparent);
  }
}

.ylf-segmented__item[aria-pressed='true'] {
  color: var(--ylf-c-brand, #2563eb);
  background: var(--ylf-c-surface, #fff);
  border-color: var(--ylf-c-border, #e2e8f0);
  box-shadow: var(--ylf-shadow-control, var(--ylf-shadow-sm));
}

.ylf-segmented__pill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  box-sizing: border-box;
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: calc(var(--ylf-radius-sm, 10px) - 4px);
  background: var(--ylf-c-surface, #fff);
  box-shadow: var(--ylf-shadow-control, var(--ylf-shadow-sm));
  pointer-events: none;
}

.ylf-segmented.is-pill-animated .ylf-segmented__pill {
  transition:
    transform var(--ylf-duration-slow, 480ms) var(--ylf-ease-spring, var(--ylf-ease-standard, ease)),
    width var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    height var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease);
}

.ylf-segmented.has-pill .ylf-segmented__item[aria-pressed='true'] {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
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
  color: var(--ylf-c-text-2, #475569);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.ylf-segmented__item[aria-pressed='true'] .ylf-segmented__count {
  color: inherit;
}

@media (pointer: coarse) {
  .ylf-segmented .ylf-segmented__item {
    min-width: var(--ylf-touch-target, 44px);
    min-height: var(--ylf-touch-target, 44px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-segmented__item,
  .ylf-segmented.is-pill-animated .ylf-segmented__pill {
    transition: none;
  }
}
</style>
