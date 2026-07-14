<script lang="ts" setup>
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

interface AccordionItemData {
  value: string
  title: string
  content?: string
  disabled?: boolean
}

withDefaults(defineProps<{
  items: AccordionItemData[]
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

<style lang="scss">
.ylf-accordion {
  border: 1px solid var(--ylf-c-border, #e5e9f3);
  border-radius: var(--ylf-radius, 14px);
  overflow: hidden;
  background: var(--ylf-c-surface, #fff);
}

.ylf-accordion__item + .ylf-accordion__item {
  border-top: 1px solid var(--ylf-c-border, #e5e9f3);
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
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  color: var(--ylf-c-text, #1b2238);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover {
    background: var(--ylf-c-bg-soft, #f2f5fc);
  }

  &[data-disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--ylf-c-brand, #6d5cff);
  }
}

.ylf-accordion__chevron {
  flex: none;
  width: 18px;
  height: 18px;
  color: var(--ylf-c-text-3, #9098ad);
  transition: transform 0.25s ease;
}

.ylf-accordion__trigger[data-state='open'] .ylf-accordion__chevron {
  transform: rotate(180deg);
}

.ylf-accordion__content {
  overflow: hidden;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ylf-c-text-2, #5a6178);

  &[data-state='open'] {
    animation: ylf-acc-down 0.25s ease;
  }

  &[data-state='closed'] {
    animation: ylf-acc-up 0.2s ease;
  }
}

.ylf-accordion__body {
  padding: 0 16px 16px;
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

  .ylf-accordion__chevron {
    transition: none;
  }
}
</style>
