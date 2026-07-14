<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（role=checkbox、键盘、三态 indeterminate）；皮肤走 token。
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

withDefaults(defineProps<{
  disabled?: boolean
  /** 表单提交值 */
  value?: string
}>(), {
  disabled: false,
})

const checked = defineModel<boolean | 'indeterminate'>({ default: false })
</script>

<template>
  <CheckboxRoot
    v-model="checked"
    :disabled="disabled"
    :value="value"
    class="ylf-checkbox"
  >
    <CheckboxIndicator class="ylf-checkbox__indicator">
      <svg v-if="checked === 'indeterminate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M5 12h14" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<style lang="scss">
.ylf-checkbox {
  --_size: 20px;

  flex: none;
  width: var(--_size);
  height: var(--_size);
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 2px solid var(--ylf-c-border-strong, #d3d9ea);
  border-radius: 7px;
  background: var(--ylf-c-surface, #fff);
  color: #fff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &:hover:not([data-disabled]) {
    border-color: var(--ylf-c-brand, #6d5cff);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #ece9ff);
  }

  &[data-state='checked'],
  &[data-state='indeterminate'] {
    background: var(--ylf-c-brand, #6d5cff);
    border-color: var(--ylf-c-brand, #6d5cff);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__indicator {
    display: inline-flex;
  }

  &__indicator svg {
    width: 14px;
    height: 14px;
  }
}
</style>
