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

<style>
.ylf-switch {
  --_w: 52px;
  --_h: 30px;
  --_pad: 3px;
  /* 按下时拇指横向拉长，像被捏住的软糖；松开后弹回。 */
  --_stretch: 0px;

  position: relative;
  flex: none;
  width: var(--_w);
  height: var(--_h);
  padding: 0;
  border: none;
  border-radius: var(--ylf-radius-pill, 999px);
  background: var(--ylf-c-bg-mute, #e2e8f0);
  box-shadow:
    var(--ylf-shadow-inset),
    inset 0 0 0 1px var(--ylf-c-edge, rgba(30, 64, 115, 0.12));
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)),
    box-shadow var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-switch--sm {
  --_w: 40px;
  --_h: 24px;
}

.ylf-switch:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: 2px;
  box-shadow:
    0 0 0 3px var(--ylf-c-brand-soft, #eff6ff),
    0 0 0 5px var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
}

.ylf-switch[data-disabled] {
  opacity: var(--ylf-disabled-opacity, 0.48);
  cursor: not-allowed;
}

/* on 态：晴空蓝主色 */
.ylf-switch[data-state='checked'] {
  background: var(--ylf-c-brand, #2563eb);
}

/* 选中的强调轨道，前景与填充色成组。 */
.ylf-switch--accent[data-state='checked'],
.ylf-switch--aurora[data-state='checked'] {
  background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
}

.ylf-switch:active:not([data-disabled]) {
  --_stretch: 6px;
}

.ylf-switch__thumb {
  display: block;
  width: calc(var(--_h) - var(--_pad) * 2 + var(--_stretch));
  height: calc(var(--_h) - var(--_pad) * 2);
  border-radius: 50%;
  background: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 3px 5px rgba(0, 0, 0, 0.18);
  transform: translateX(var(--_pad));
  transition:
    transform var(--ylf-duration-slow, 480ms)
      var(--ylf-ease-spring, var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1))),
    width var(--ylf-duration-normal, 240ms) var(--ylf-ease-spring, var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1)));
}

.ylf-switch[data-state='checked'] .ylf-switch__thumb {
  background: var(--ylf-c-text-on-accent, #fff);
  transform: translateX(calc(var(--_w) - var(--_h) + var(--_pad) - var(--_stretch)));
}

.ylf-switch--accent[data-state='checked'] .ylf-switch__thumb,
.ylf-switch--aurora[data-state='checked'] .ylf-switch__thumb {
  background: var(--ylf-accent-on, var(--ylf-c-text-on-accent, #fff));
}

@media (prefers-reduced-motion: reduce) {
  .ylf-switch,
  .ylf-switch__thumb {
    transition: none;
  }
}

@media (pointer: coarse) {
  .ylf-switch {
    position: relative;
    box-sizing: border-box;
    margin-block: max(0px, calc((var(--ylf-touch-target, 44px) - var(--_h)) / 2));
    margin-inline: max(0px, calc((var(--ylf-touch-target, 44px) - var(--_w)) / 2));
    touch-action: manipulation;
  }

  .ylf-switch::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100%, var(--ylf-touch-target, 44px));
    height: max(100%, var(--ylf-touch-target, 44px));
    transform: translate(-50%, -50%);
    content: '';
  }
}
</style>
