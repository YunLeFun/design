<script lang="ts" setup generic="T extends string = string">
import { SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** color 可使用 CSS 色值或公共 token，例如 var(--ylf-accent-blue) */
  options: { label: string, value: T, disabled?: boolean, color?: string }[]
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: '请选择',
  disabled: false,
})

const model = defineModel<T>()
const selectedOption = computed(() => props.options.find(option => option.value === model.value))
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger class="ylf-select__trigger" :aria-label="$attrs.id || $attrs['aria-labelledby'] ? undefined : placeholder" v-bind="$attrs">
      <SelectValue :placeholder="placeholder" class="ylf-select__label">
        <span v-if="selectedOption?.color" class="ylf-select__swatch" :style="{ backgroundColor: selectedOption.color }" aria-hidden="true" />
        <span>{{ selectedOption?.label ?? placeholder }}</span>
      </SelectValue>
      <SelectIcon class="ylf-select__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="ylf-select__content" position="popper" :side-offset="6">
        <SelectViewport class="ylf-select__viewport">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style lang="scss">
.ylf-select__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 180px;
  min-height: 44px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border-strong, #cbd5e1);
  border-radius: var(--ylf-radius, 14px);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &[data-placeholder] {
    color: var(--ylf-c-text-3, #64748b);
  }

  &:hover:not([data-disabled]) {
    border-color: var(--ylf-c-brand, #2563eb);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--ylf-c-brand, #2563eb);
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ylf-select__label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
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
  color: var(--ylf-c-text-3, #64748b);

  svg {
    width: 18px;
    height: 18px;
  }
}

.ylf-select__content {
  z-index: 105;
  box-sizing: border-box;
  min-width: var(--reka-select-trigger-width);
  max-width: var(--reka-select-content-available-width);
  max-height: var(--reka-select-content-available-height);
  padding: 6px;
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-lg, 0 22px 56px -14px rgba(15, 23, 42, 0.22));

  &[data-state='open'] {
    animation: ylf-pop-in 0.16s ease;
  }
}

.ylf-select__viewport {
  max-height: calc(var(--reka-select-content-available-height) - 14px);
}

.ylf-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--ylf-c-text, #0f172a);
  border-radius: var(--ylf-radius-sm, 10px);
  cursor: pointer;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background: var(--ylf-c-brand-soft, #eff6ff);
    color: var(--ylf-c-brand, #2563eb);
  }

  &[data-disabled] {
    opacity: 0.45;
    pointer-events: none;
  }
}

.ylf-select__check {
  display: inline-flex;
  color: var(--ylf-c-brand, #2563eb);

  svg {
    width: 15px;
    height: 15px;
  }
}

@keyframes ylf-pop-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-select__content[data-state='open'] {
    animation: none;
  }
}
</style>
