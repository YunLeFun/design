<script setup lang="ts">
import { useTemplateRef } from 'vue'
import YlfScrollFade from '../YlfScrollFade.vue'

withDefaults(defineProps<{ label?: string, itemLabel?: string }>(), {
  label: '最近打开',
  itemLabel: '项目',
})
const list = useTemplateRef<HTMLUListElement>('list')
</script>

<template>
  <YlfScrollFade :viewport="list" class="scroll-demo">
    <ul ref="list" :aria-label="label" tabindex="0" class="scroll-demo-list">
      <li v-for="entry in 12" :key="entry">
        {{ itemLabel }} {{ entry }}
      </li>
    </ul>
  </YlfScrollFade>
</template>

<style scoped>
.scroll-demo {
  width: min(100%, 24rem);
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius, 14px);
  background: var(--ylf-c-surface, #fff);
}

.scroll-demo-list {
  max-height: 9rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  scroll-padding-block: 24px;
  list-style: none;
}

.scroll-demo-list:focus-visible {
  outline-offset: -3px;
}
.scroll-demo-list li {
  margin: 0;
  padding: 8px 14px;
}
.scroll-demo-list li + li {
  border-top: 1px solid var(--ylf-c-border);
}
</style>
