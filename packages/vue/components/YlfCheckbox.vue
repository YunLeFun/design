<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（role=checkbox、键盘、三态 indeterminate）；皮肤走 token。
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { shallowRef, watch } from 'vue'

withDefaults(defineProps<{
  disabled?: boolean
  /** 表单提交值 */
  value?: string
}>(), {
  disabled: false,
})

const checked = defineModel<boolean | 'indeterminate'>({ default: false })
// 只在状态真正变化后播放勾选动效，首屏已选中的项保持静止。
const animated = shallowRef(false)
watch(checked, () => {
  animated.value = true
})
</script>

<template>
  <CheckboxRoot
    v-model="checked"
    :disabled="disabled"
    :value="value"
    class="ylf-checkbox"
    :class="{ 'is-animated': animated }"
  >
    <CheckboxIndicator class="ylf-checkbox__indicator">
      <svg v-if="checked === 'indeterminate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M5 12h14" pathLength="1" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7" pathLength="1" />
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
  border: 2px solid var(--ylf-c-border-strong, #cbd5e1);
  border-radius: 7px;
  background: var(--ylf-c-surface, #fff);
  box-shadow: var(--ylf-shadow-control);
  color: var(--ylf-c-text-on-accent, #fff);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease),
    border-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease),
    box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease),
    transform var(--ylf-duration-slow, 480ms) var(--ylf-ease-spring, var(--ylf-ease-standard, ease));

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([data-disabled]) {
      border-color: var(--ylf-c-brand, #2563eb);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--ylf-c-brand, #2563eb);
    outline-offset: 3px;
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
  }

  &:active:not([data-disabled]) {
    transform: scale(0.9);
    transition-duration: var(--ylf-duration-press, 100ms);
  }

  &.is-animated[data-state='checked'],
  &.is-animated[data-state='indeterminate'] {
    animation: ylf-checkbox-pop var(--ylf-duration-slow, 480ms) var(--ylf-ease-spring, var(--ylf-ease-standard, ease));
  }

  &[data-state='checked'],
  &[data-state='indeterminate'] {
    background: var(--ylf-c-brand, #2563eb);
    border-color: var(--ylf-c-brand, #2563eb);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
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

  // 对勾按笔画顺序画出。
  &.is-animated &__indicator path {
    stroke-dasharray: 1;
    animation: ylf-checkbox-draw var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease) 60ms backwards;
  }
}
@media (pointer: coarse) {
  .ylf-checkbox {
    position: relative;
    box-sizing: border-box;
    margin-block: max(0px, calc((var(--ylf-touch-target, 44px) - var(--_size)) / 2));
    margin-inline: max(0px, calc((var(--ylf-touch-target, 44px) - var(--_size)) / 2));
    touch-action: manipulation;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: max(100%, var(--ylf-touch-target, 44px));
      height: max(100%, var(--ylf-touch-target, 44px));
      transform: translate(-50%, -50%);
      content: '';
    }
  }
}
@keyframes ylf-checkbox-pop {
  from {
    transform: scale(0.82);
  }
}
@keyframes ylf-checkbox-draw {
  from {
    stroke-dashoffset: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ylf-checkbox,
  .ylf-checkbox.is-animated[data-state],
  .ylf-checkbox.is-animated .ylf-checkbox__indicator path {
    transition: none;
    animation: none;
  }
}
</style>
