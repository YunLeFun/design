<script lang="ts" setup>
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

interface TabItem {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(defineProps<{
  items: TabItem[]
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal',
})

const model = defineModel<string>()
</script>

<template>
  <TabsRoot
    v-model="model"
    :orientation="orientation"
    class="ylf-tabs"
    :class="`ylf-tabs--${orientation}`"
  >
    <TabsList class="ylf-tabs__list">
      <TabsIndicator class="ylf-tabs__indicator" />
      <TabsTrigger
        v-for="t in items"
        :key="t.value"
        :value="t.value"
        :disabled="t.disabled"
        class="ylf-tabs__trigger"
      >
        {{ t.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="t in items"
      :key="t.value"
      :value="t.value"
      class="ylf-tabs__content"
    >
      <slot :name="t.value" />
    </TabsContent>
  </TabsRoot>
</template>

<style lang="scss">
.ylf-tabs__list {
  position: relative;
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--ylf-c-border, #e2e8f0);
}

.ylf-tabs__trigger {
  position: relative;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: var(--ylf-c-text-2, #475569);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover:not([data-disabled]) {
    color: var(--ylf-c-text, #0f172a);
  }

  &[data-state='active'] {
    color: var(--ylf-c-brand, #2563eb);
  }

  &[data-disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--ylf-radius-sm, 10px);
    box-shadow: 0 0 0 3px var(--ylf-c-brand-soft, #eff6ff);
  }
}

.ylf-tabs__indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: var(--reka-tabs-indicator-size);
  height: 2.5px;
  border-radius: 999px;
  background: var(--ylf-c-brand, #2563eb);
  transform: translateX(var(--reka-tabs-indicator-position));
  transition:
    transform 0.25s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
    width 0.25s ease;
}

.ylf-tabs__content {
  padding-top: 16px;

  &:focus-visible {
    outline: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-tabs__indicator {
    transition: none;
  }
}
</style>
