<script lang="ts" setup>
import { SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(defineProps<{
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: '请选择',
  disabled: false,
})

const model = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger class="ylf-select__trigger" :aria-label="placeholder">
      <SelectValue :placeholder="placeholder" />
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
            <SelectItemText>{{ o.label }}</SelectItemText>
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
  padding: 10px 14px;
  font-family: inherit;
  font-size: 15px;
  color: var(--ylf-c-text, #1b2238);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border-strong, #d3d9ea);
  border-radius: var(--ylf-radius, 14px);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &[data-placeholder] {
    color: var(--ylf-c-text-3, #9098ad);
  }

  &:hover:not([data-disabled]) {
    border-color: var(--ylf-c-brand, #6d5cff);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--ylf-c-brand, #6d5cff);
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #ece9ff);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ylf-select__icon {
  display: inline-flex;
  color: var(--ylf-c-text-3, #9098ad);

  svg {
    width: 18px;
    height: 18px;
  }
}

.ylf-select__content {
  z-index: 105;
  min-width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
  padding: 6px;
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e5e9f3);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-lg, 0 22px 56px -14px rgba(109, 92, 255, 0.3));

  &[data-state='open'] {
    animation: ylf-pop-in 0.16s ease;
  }
}

.ylf-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--ylf-c-text, #1b2238);
  border-radius: var(--ylf-radius-sm, 10px);
  cursor: pointer;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background: var(--ylf-c-brand-soft, #ece9ff);
    color: var(--ylf-c-brand, #6d5cff);
  }

  &[data-disabled] {
    opacity: 0.45;
    pointer-events: none;
  }
}

.ylf-select__check {
  display: inline-flex;
  color: var(--ylf-c-brand, #6d5cff);

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
