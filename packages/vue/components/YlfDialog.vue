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

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  /** 没有可见标题时供屏幕阅读器使用 */
  accessibleTitle?: string
  /** Accessible name of the close button; localize it with the dialog content. */
  closeLabel?: string
  /** Existing container in the same theme boundary. */
  portalTo?: string | HTMLElement
}>(), {
  accessibleTitle: '对话框',
  closeLabel: '关闭',
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

    <DialogPortal :to="portalTo">
      <DialogOverlay class="ylf-dialog__overlay" />
      <DialogContent class="ylf-dialog__content" v-bind="{ ...descriptionProps, ...$attrs }">
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

        <DialogClose class="ylf-dialog__close" :aria-label="closeLabel">
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
  -webkit-backdrop-filter: var(--ylf-overlay-blur, blur(10px));
  backdrop-filter: var(--ylf-overlay-blur, blur(10px));

  &[data-state='open'] {
    animation: ylf-dialog-overlay-in var(--ylf-duration-normal, 240ms) ease;
  }
}

.ylf-dialog__content {
  position: fixed;
  z-index: 101;
  top: 50%;
  left: 50%;
  width: calc(100vw - 32px);
  max-width: 480px;
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 28px;
  transform: translate(-50%, -50%);
  border-radius: var(--ylf-radius-lg, 20px);
  background: var(--ylf-c-panel, var(--ylf-c-surface, #fff));
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  box-shadow: var(--ylf-shadow-panel, 0 22px 56px -14px rgba(15, 23, 42, 0.22));
  -webkit-backdrop-filter: var(--ylf-glass-blur, blur(16px));
  backdrop-filter: var(--ylf-glass-blur, blur(16px));

  &[data-state='open'] {
    animation: ylf-dialog-in var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease);
  }

  &:focus-visible {
    outline: none;
  }
}

.ylf-dialog__title {
  margin: 0 0 10px;
  padding-right: 32px;
  overflow-wrap: anywhere;
  font-family: var(--ylf-font-heading, inherit);
  font-size: 24px;
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--ylf-c-text, #0f172a);
}

.ylf-dialog__desc {
  margin: 0 0 24px;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.75;
  color: var(--ylf-c-text-2, #475569);
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
  background: var(--ylf-c-surface-raised, transparent);
  box-shadow: inset 0 1px 0 var(--ylf-c-highlight, transparent);
  color: var(--ylf-c-text-3, #64748b);
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    background: var(--ylf-c-bg-mute, #e2e8f0);
    color: var(--ylf-c-text, #0f172a);
  }

  &:focus-visible {
    outline: 2px solid var(--ylf-c-brand, #2563eb);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform var(--ylf-duration-fast, 160ms) ease;
  }

  &:hover svg {
    transform: rotate(90deg);
  }
}

@media (pointer: coarse) {
  .ylf-dialog__close {
    top: 10px;
    right: 10px;
    width: 44px;
    height: 44px;
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
    transform: translate(-50%, -47%) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-dialog__overlay[data-state='open'],
  .ylf-dialog__content[data-state='open'] {
    animation: none;
  }

  .ylf-dialog__close svg {
    transition: none;
  }
}
</style>
