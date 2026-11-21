<script lang="ts" setup generic="T extends string = string">
import { SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'
import { computed, useTemplateRef } from 'vue'
import YlfScrollFade from './YlfScrollFade.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** color 可使用 CSS 色值或公共 token，例如 var(--ylf-accent-blue) */
  options: readonly { label: string, value: T, disabled?: boolean, color?: string }[]
  /** Compact workbench or comfortable form density. */
  size?: 'sm' | 'md'
  placeholder?: string
  disabled?: boolean
  /** Native form field name and validation. */
  name?: string
  required?: boolean
  /** Existing container in the same theme boundary. */
  portalTo?: string | HTMLElement
}>(), {
  size: 'md',
  placeholder: '请选择',
  disabled: false,
  required: false,
})

const model = defineModel<T>()
const selectedOption = computed(() => props.options.find(option => option.value === model.value))
const viewport = useTemplateRef<HTMLElement>('viewport')
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled" :name="name" :required="required">
    <SelectTrigger class="ylf-select__trigger" :data-size="size" :aria-label="$attrs.id || $attrs['aria-labelledby'] ? undefined : placeholder" v-bind="$attrs">
      <SelectValue :placeholder="placeholder" class="ylf-select__label">
        <span v-if="selectedOption?.color" class="ylf-select__swatch" :style="{ backgroundColor: selectedOption.color }" aria-hidden="true" />
        <span>{{ selectedOption?.label ?? placeholder }}</span>
      </SelectValue>
      <SelectIcon class="ylf-select__icon">
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </slot>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal :to="portalTo">
      <SelectContent class="ylf-select__content" :data-size="size" position="popper" :side-offset="6" :collision-padding="16">
        <YlfScrollFade :viewport="viewport" surface="var(--ylf-c-panel, var(--ylf-c-surface, #fff))">
          <SelectViewport as-child>
            <div ref="viewport" class="ylf-select__viewport">
              <SelectItem
                v-for="o in options"
                :key="o.value"
                :value="o.value"
                :disabled="o.disabled"
                class="ylf-select__item"
              >
                <SelectItemText class="ylf-select__label">
                  <span v-if="o.color" class="ylf-select__swatch" :style="{ backgroundColor: o.color }" aria-hidden="true" />
                  <span>{{ o.label }}</span>
                </SelectItemText>
                <SelectItemIndicator class="ylf-select__check">
                  <slot name="indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </slot>
                </SelectItemIndicator>
              </SelectItem>
            </div>
          </SelectViewport>
        </YlfScrollFade>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
.ylf-select__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  max-width: 100%;
  min-width: min(180px, 100%);
  min-height: var(--ylf-control-h, 44px);
  padding: 4px 14px;
  font-family: inherit;
  font-size: var(--ylf-control-font-size, 0.9375rem);
  line-height: 1.5;
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border-strong, #cbd5e1);
  border-radius: var(--ylf-control-radius, var(--ylf-radius, 14px));
  box-shadow: var(--ylf-shadow-control);
  cursor: pointer;
  transition:
    border-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)),
    box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-select__trigger[data-placeholder] {
  color: var(--ylf-c-placeholder, var(--ylf-c-text-3, #5a697e));
}

@media (hover: hover) and (pointer: fine) {
  .ylf-select__trigger:hover:not([data-disabled]) {
    border-color: var(--ylf-c-brand, #2563eb);
  }
}

.ylf-select__trigger[data-state='open'] {
  border-color: var(--ylf-c-brand, #2563eb);
  box-shadow:
    var(--ylf-shadow-control),
    0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
}

.ylf-select__trigger:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: 2px;
  border-color: var(--ylf-c-brand, #2563eb);
  box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
}

.ylf-select__trigger[data-disabled] {
  opacity: var(--ylf-disabled-opacity, 0.48);
  cursor: not-allowed;
}

.ylf-select__label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.ylf-select__swatch {
  flex: none;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border: 1px solid color-mix(in srgb, var(--ylf-c-text, #0f172a) 15%, transparent);
  border-radius: 50%;
}

.ylf-select__icon {
  flex: none;
  display: inline-flex;
  color: var(--ylf-c-text-3, #5a697e);
  transition: transform var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-select__icon :where(svg, i, span) {
  width: 18px;
  height: 18px;
}

.ylf-select__trigger[data-state='open'] .ylf-select__icon {
  transform: rotate(180deg);
}

.ylf-select__content {
  z-index: var(--ylf-z-popover, 105);
  box-sizing: border-box;
  min-width: var(--reka-select-trigger-width);
  max-width: var(--reka-select-content-available-width);
  max-height: var(--reka-select-content-available-height);
  padding: 6px;
  background: var(--ylf-c-panel, var(--ylf-c-surface, #fff));
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-panel, var(--ylf-shadow-lg, 0 22px 56px -14px rgba(15, 23, 42, 0.22)));
  backdrop-filter: var(--ylf-glass-blur, saturate(160%) blur(16px));
  transform-origin: var(--reka-select-content-transform-origin);
}

.ylf-select__content[data-state='open'] {
  animation: ylf-select-in var(--ylf-duration-enter, 240ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-select__content[data-state='closed'] {
  animation: ylf-select-out var(--ylf-duration-exit, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-select__content[data-side='bottom'] {
  --_enter-y: -4px;
}

.ylf-select__content[data-side='top'] {
  --_enter-y: 4px;
}

.ylf-select__content[data-side='left'] {
  --_enter-x: 4px;
}

.ylf-select__content[data-side='right'] {
  --_enter-x: -4px;
}

.ylf-select__viewport {
  max-height: calc(var(--reka-select-content-available-height) - 14px);
  scroll-padding-block: 24px;
}

.ylf-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  font-size: var(--ylf-text-sm, 0.875rem);
  color: var(--ylf-c-text, #0f172a);
  border-radius: var(--ylf-control-radius-sm, var(--ylf-radius-sm, 10px));
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: background var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-select__item[data-highlighted] {
  background: var(--ylf-c-brand-soft, #eff6ff);
  color: var(--ylf-c-brand, #2563eb);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ylf-c-brand, #2563eb) 12%, transparent);
}

.ylf-select__item[data-disabled] {
  opacity: var(--ylf-disabled-opacity, 0.48);
  pointer-events: none;
}

.ylf-select__check {
  display: inline-flex;
  color: var(--ylf-c-brand, #2563eb);
}

.ylf-select__check :where(svg, i, span) {
  width: 15px;
  height: 15px;
}

.ylf-select__trigger[data-size='sm'] {
  min-width: 0;
  min-height: var(--ylf-control-h-sm, 34px);
  padding: 2px 10px;
  font-size: var(--ylf-control-font-size-sm, 0.8125rem);
  border-radius: var(--ylf-control-radius-sm, var(--ylf-radius-sm, 10px));
}

.ylf-select__content[data-size='sm'] .ylf-select__item {
  min-height: 30px;
  padding: 5px 8px;
  font-size: var(--ylf-text-xs, 0.75rem);
}

@media (pointer: coarse) {
  .ylf-select__trigger[data-size],
  .ylf-select__content[data-size] .ylf-select__item {
    box-sizing: border-box;
    min-height: var(--ylf-touch-target, 44px);
  }
}

@keyframes ylf-select-in {
  from {
    opacity: 0;
    transform: translate(var(--_enter-x, 0), var(--_enter-y, 0)) scale(0.96);
  }
}

@keyframes ylf-select-out {
  to {
    opacity: 0;
    transform: scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-select__content[data-state] {
    animation: none;
  }

  .ylf-select__trigger,
  .ylf-select__icon,
  .ylf-select__item {
    transition: none;
  }
}
</style>
