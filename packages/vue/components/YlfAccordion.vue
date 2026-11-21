<script lang="ts" setup>
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

interface AccordionItemData {
  value: string
  title: string
  content?: string
  disabled?: boolean
}

withDefaults(defineProps<{
  items: readonly AccordionItemData[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
}>(), {
  type: 'single',
  collapsible: true,
})

const model = defineModel<string | string[]>()
</script>

<template>
  <AccordionRoot
    v-model="model"
    :type="type"
    :collapsible="collapsible"
    class="ylf-accordion"
  >
    <AccordionItem
      v-for="it in items"
      :key="it.value"
      :value="it.value"
      :disabled="it.disabled"
      class="ylf-accordion__item"
    >
      <AccordionHeader class="ylf-accordion__header">
        <AccordionTrigger class="ylf-accordion__trigger">
          <span>{{ it.title }}</span>
          <svg class="ylf-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="ylf-accordion__content">
        <div class="ylf-accordion__body">
          <slot :name="it.value">
            {{ it.content }}
          </slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style>
.ylf-accordion {
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius, 14px);
  overflow: hidden;
  background: var(--ylf-c-surface, #fff);
  box-shadow: var(--ylf-shadow-control);
}

.ylf-accordion__item + .ylf-accordion__item {
  border-top: 1px solid var(--ylf-c-border, #e2e8f0);
}

.ylf-accordion__header {
  margin: 0;
}

.ylf-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 16px;
  font-family: inherit;
  font-size: var(--ylf-control-font-size, 0.9375rem);
  font-weight: 500;
  text-align: left;
  color: var(--ylf-c-text, #0f172a);
  background: transparent;
  border: none;
  cursor: pointer;
  min-height: var(--ylf-control-h, var(--ylf-touch-target, 44px));
  overflow-wrap: anywhere;
  transition: background var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

@media (hover: hover) and (pointer: fine) {
  .ylf-accordion__trigger:hover {
    background: var(--ylf-c-bg-soft, #f1f5f9);
  }
}

.ylf-accordion__trigger[data-state='open'] {
  color: var(--ylf-c-brand, #2563eb);
  background: color-mix(in srgb, var(--ylf-c-brand-soft, #eff6ff) 60%, transparent);
}

.ylf-accordion__trigger[data-disabled] {
  opacity: var(--ylf-disabled-opacity, 0.48);
  cursor: not-allowed;
}

.ylf-accordion__trigger:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid transparent;
  outline-offset: -2px;
  box-shadow: inset 0 0 0 var(--ylf-ring-width, 2px) var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
}

.ylf-accordion__chevron {
  flex: none;
  width: 18px;
  height: 18px;
  color: var(--ylf-c-text-3, #5a697e);
  transition: transform var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-accordion__trigger[data-state='open'] .ylf-accordion__chevron {
  transform: rotate(180deg);
}

.ylf-accordion__content {
  overflow: hidden;
  font-size: var(--ylf-text-sm, 0.875rem);
  line-height: 1.6;
  color: var(--ylf-c-text-2, #475569);
}

.ylf-accordion__content[data-state='open'] {
  animation: ylf-acc-down var(--ylf-duration-enter, 240ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-accordion__content[data-state='closed'] {
  animation: ylf-acc-up var(--ylf-duration-exit, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-accordion__body {
  padding: 12px 16px 16px;
}

@keyframes ylf-acc-down {
  from {
    height: 0;
  }

  to {
    height: var(--reka-accordion-content-height);
  }
}

@keyframes ylf-acc-up {
  from {
    height: var(--reka-accordion-content-height);
  }

  to {
    height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-accordion__content[data-state='open'],
  .ylf-accordion__content[data-state='closed'] {
    animation: none;
  }

  .ylf-accordion__trigger,
  .ylf-accordion__chevron {
    transition: none;
  }
}
</style>
