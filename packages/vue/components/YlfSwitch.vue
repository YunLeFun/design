<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（role=switch、键盘、焦点、data-state）；
// 外观全部走 --ylf token，所以视觉识别仍是「晴空蓝为主、极光点缀」。
import { SwitchRoot, SwitchThumb } from 'reka-ui'

withDefaults(defineProps<{
  /** on 态轨道：brand 实色（默认）或 aurora 极光渐变 */
  variant?: 'brand' | 'aurora'
  size?: 'sm' | 'md'
  disabled?: boolean
}>(), {
  variant: 'brand',
  size: 'md',
  disabled: false,
})

const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <SwitchRoot
    v-model="checked"
    :disabled="disabled"
    class="ylf-switch"
    :class="[`ylf-switch--${variant}`, `ylf-switch--${size}`]"
  >
    <SwitchThumb class="ylf-switch__thumb" />
  </SwitchRoot>
</template>

<style lang="scss">
.ylf-switch {
  --_w: 52px;
  --_h: 30px;
  --_pad: 3px;

  position: relative;
  flex: none;
  width: var(--_w);
  height: var(--_h);
  padding: 0;
  border: none;
  border-radius: var(--ylf-radius-pill, 999px);
  background: var(--ylf-c-bg-mute, #e2e8f0);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.25s ease,
    box-shadow 0.2s ease;

  &--sm {
    --_w: 40px;
    --_h: 24px;
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px var(--ylf-c-brand-soft, #eff6ff),
      0 0 0 5px var(--ylf-c-brand, #2563eb);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // on 态：晴空蓝主色
  &[data-state='checked'] {
    background: var(--ylf-c-brand, #2563eb);
  }

  // on 态：aurora 极光渐变（opt-in）
  &--aurora[data-state='checked'] {
    background-image: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff4d8d, #ffc233, #19d08b, #2fb4ff, #9a5cff));
  }

  &__thumb {
    display: block;
    width: calc(var(--_h) - var(--_pad) * 2);
    height: calc(var(--_h) - var(--_pad) * 2);
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transform: translateX(var(--_pad));
    transition: transform 0.25s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
    will-change: transform;
  }

  &[data-state='checked'] &__thumb {
    background: var(--ylf-c-text-on-accent, #fff);
    transform: translateX(calc(var(--_w) - var(--_h) + var(--_pad)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-switch,
  .ylf-switch__thumb {
    transition: none;
  }
}
</style>
