<script lang="ts" setup>
// 行为 / 可访问性由 reka-ui 提供（遮罩、焦点陷阱、ESC / 点击外部关闭、滚动锁、aria）；皮肤走 token。
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  /** 没有可见标题时供屏幕阅读器使用 */
  accessibleTitle?: string
}>(), {
  accessibleTitle: '对话框',
})

const open = defineModel<boolean>('open', { default: false })
const slots = useSlots()
const hasVisibleTitle = computed(() => Boolean(props.title || slots.title))
const hasDescription = computed(() => Boolean(props.description || slots.description))
const descriptionProps = computed(() => hasDescription.value
  ? {}
  : { 'aria-describedby': undefined })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="ylf-dialog__overlay" />
      <DialogContent class="ylf-dialog__content" v-bind="descriptionProps">
        <DialogTitle v-if="hasVisibleTitle" class="ylf-dialog__title">
          <slot name="title">
            {{ title }}
          </slot>
        </DialogTitle>
        <VisuallyHidden v-else as-child>
          <DialogTitle>{{ accessibleTitle }}</DialogTitle>
        </VisuallyHidden>

        <DialogDescription v-if="hasDescription" class="ylf-dialog__desc">
          <slot name="description">
            {{ description }}
          </slot>
        </DialogDescription>

        <div class="ylf-dialog__body">
          <slot />
        </div>

        <DialogClose class="ylf-dialog__close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.ylf-dialog__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--ylf-c-overlay, rgba(13, 17, 32, 0.45));
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  &[data-state='open'] {
    animation: ylf-dialog-overlay-in 0.2s ease;
  }
}

.ylf-dialog__content {
  position: fixed;
  z-index: 101;
  top: 50%;
  left: 50%;
  width: calc(100vw - 32px);
  max-width: 460px;
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 24px;
  transform: translate(-50%, -50%);
  border-radius: var(--ylf-radius-lg, 20px);
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e5e9f3);
  box-shadow: var(--ylf-shadow-lg, 0 22px 56px -14px rgba(109, 92, 255, 0.3));

  &[data-state='open'] {
    animation: ylf-dialog-in 0.22s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
  }

  &:focus-visible {
    outline: none;
  }
}

.ylf-dialog__title {
  margin: 0 0 6px;
  font-family: var(--ylf-font-display, inherit);
  font-size: 19px;
  font-weight: 700;
  color: var(--ylf-c-text, #1b2238);
}

.ylf-dialog__desc {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ylf-c-text-2, #5a6178);
}

.ylf-dialog__close {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--ylf-radius-sm, 10px);
  background: transparent;
  color: var(--ylf-c-text-3, #9098ad);
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    background: var(--ylf-c-bg-mute, #e8ecf7);
    color: var(--ylf-c-text, #1b2238);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

@keyframes ylf-dialog-overlay-in {
  from {
    opacity: 0;
  }
}

@keyframes ylf-dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -46%) scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-dialog__overlay[data-state='open'],
  .ylf-dialog__content[data-state='open'] {
    animation: none;
  }
}
</style>
