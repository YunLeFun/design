<script lang="ts" setup>
import type { YlfAccentTone } from './theme'
// 行为 / 可访问性由 reka-ui 提供（role=switch、键盘、焦点、data-state）；
// 外观全部走 --ylf token，所以视觉识别仍是「晴空蓝为主、高饱和纯色点缀」。
import { SwitchRoot, SwitchThumb } from 'reka-ui'

withDefaults(defineProps<{
  /** on 态轨道：brand 主色（默认）或 accent 纯色；aurora 是 accent 的旧别名 */
  variant?: 'brand' | 'accent' | 'aurora'
  tone?: YlfAccentTone
  size?: 'sm' | 'md'
  disabled?: boolean
}>(), {
  variant: 'brand',
  tone: 'blue',
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
    :data-ylf-tone="tone"
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
    background var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease);

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

  // 选中的强调轨道，前景与填充色成组。
  &--accent[data-state='checked'],
  &--aurora[data-state='checked'] {
    background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
  }

  &__thumb {
    display: block;
    width: calc(var(--_h) - var(--_pad) * 2);
    height: calc(var(--_h) - var(--_pad) * 2);
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transform: translateX(var(--_pad));
    transition: transform var(--ylf-duration-normal, 240ms) var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
    will-change: transform;
  }

  &[data-state='checked'] &__thumb {
    background: var(--ylf-c-text-on-accent, #fff);
    transform: translateX(calc(var(--_w) - var(--_h) + var(--_pad)));
  }
  &--accent[data-state='checked'] &__thumb,
  &--aurora[data-state='checked'] &__thumb {
    background: var(--ylf-accent-on, var(--ylf-c-text-on-accent, #fff));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-switch,
  .ylf-switch__thumb {
    transition: none;
  }
}
</style>
