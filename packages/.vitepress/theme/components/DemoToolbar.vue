<script setup lang="ts">
import type { DemoPreviewScheme, DemoPreviewViewport } from '../composables/useDemoPreview'
import { computed } from 'vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfSegmentedControl from '../../../vue/components/YlfSegmentedControl.vue'
import YlfTooltip from '../../../vue/components/YlfTooltip.vue'
import { useDocsLocale } from '../composables/useDocsLocale'

defineProps<{ name: string, source: string, sourceId: string }>()
const viewport = defineModel<DemoPreviewViewport>('viewport', { required: true })
const scheme = defineModel<DemoPreviewScheme>('scheme', { required: true })
const sourceVisible = defineModel<boolean>('sourceVisible', { required: true })
const { text } = useDocsLocale()
const viewports = computed(() => [
  { value: 'responsive', label: text('自适应宽度', 'Responsive width') },
  { value: 'tablet', label: text('平板宽度 768px', 'Tablet width 768px') },
  { value: 'mobile', label: text('手机宽度 390px', 'Mobile width 390px') },
] as const)
const schemes = computed(() => [
  { value: 'light', label: text('浅色预览', 'Light preview') },
  { value: 'dark', label: text('深色预览', 'Dark preview') },
] as const)
const viewportIcons = { responsive: 'i-ri-computer-line', tablet: 'i-ri-tablet-line', mobile: 'i-ri-smartphone-line' }
const schemeIcons = { light: 'i-ri-sun-line', dark: 'i-ri-moon-line' }
</script>

<template>
  <header class="demo-toolbar">
    <div class="demo-toolbar__file" :title="source">
      <span class="i-logos-vue" aria-hidden="true" />
      <code>{{ `${name}/demo.vue` }}</code>
    </div>
    <div class="demo-toolbar__controls">
      <YlfSegmentedControl v-model="viewport" :options="viewports" :label="text('预览宽度', 'Preview width')" icon-only>
        <template #icon="{ option }">
          <span :class="viewportIcons[option.value]" />
        </template>
      </YlfSegmentedControl>
      <YlfSegmentedControl v-model="scheme" :options="schemes" :label="text('预览主题', 'Preview theme')" icon-only>
        <template #icon="{ option }">
          <span :class="schemeIcons[option.value]" />
        </template>
      </YlfSegmentedControl>
      <div class="demo-toolbar__actions">
        <YlfTooltip :content="text('在 GitHub 查看 Demo', 'View demo on GitHub')">
          <YlfButton tag="a" icon-only :round="false" variant="ghost" :href="source" target="_blank" rel="noreferrer" :aria-label="text('在 GitHub 查看 Demo', 'View demo on GitHub')">
            <span class="i-ri-github-line" aria-hidden="true" />
          </YlfButton>
        </YlfTooltip>
        <YlfTooltip :content="text('查看源码', 'View source')">
          <YlfButton icon-only :round="false" variant="ghost" :aria-label="text('查看源码', 'View source')" :aria-expanded="sourceVisible" :aria-pressed="sourceVisible" :aria-controls="sourceId" @click="sourceVisible = !sourceVisible">
            <span class="i-ri-code-s-slash-line" aria-hidden="true" />
          </YlfButton>
        </YlfTooltip>
      </div>
    </div>
  </header>
</template>

<style scoped>
.demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--ylf-space-3);
  padding: var(--ylf-space-3) var(--ylf-space-4);
  border-bottom: 1px solid var(--ylf-c-border);
  background: var(--ylf-c-surface);
}
.demo-toolbar__file {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--ylf-space-2);
  color: var(--ylf-c-text-2);
}
.demo-toolbar__file > span {
  flex: none;
  width: 16px;
  height: 16px;
}
.demo-toolbar__file code {
  overflow: hidden;
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: var(--ylf-text-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.demo-toolbar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ylf-space-2);
  margin-left: auto;
}
.demo-toolbar__actions {
  display: flex;
  align-items: center;
  gap: var(--ylf-space-1);
  padding-left: var(--ylf-space-2);
  border-left: 1px solid var(--ylf-c-border);
}
@media (max-width: 640px) {
  .demo-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .demo-toolbar__file {
    grid-area: 1 / 1;
  }
  .demo-toolbar__controls {
    display: contents;
  }
  .demo-toolbar__controls :deep(.ylf-segmented) {
    grid-row: 2;
    justify-self: start;
  }
  .demo-toolbar__actions {
    grid-area: 1 / 2;
    padding-left: 0;
    border-left: 0;
  }
}
</style>
