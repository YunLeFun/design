<script setup lang="ts">
import type { PlaygroundScene } from './playground-types'
import { computed, shallowRef } from 'vue'

const props = defineProps<{ scenes: PlaygroundScene[], selected: string, english: boolean, story: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
const query = shallowRef('')
const visibleScenes = computed(() => props.scenes.filter(scene => `${scene.name} ${scene.title}`.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())))
</script>

<template>
  <aside class="editor-outline" :aria-label="english ? 'Project outline' : '项目目录'">
    <div class="outline-heading">
      <span class="i-ri-folder-open-line" aria-hidden="true" />
      <strong>{{ english ? 'Project' : '项目' }}</strong>
      <span class="outline-count">{{ scenes.length }}</span>
    </div>
    <label class="outline-search">
      <span class="i-ri-search-line" aria-hidden="true" />
      <input v-model="query" :aria-label="english ? 'Find a section' : '查找片段'" :placeholder="english ? 'Find a section…' : '查找片段…'" type="search">
    </label>
    <div class="outline-group">
      <span class="i-ri-arrow-down-s-line" aria-hidden="true" />
      {{ story ? (english ? 'Chapter one' : '第一章') : (english ? 'Video script' : '视频脚本') }}
    </div>
    <div class="outline-items">
      <button v-for="scene in visibleScenes" :key="scene.id" type="button" class="outline-item" :aria-current="selected === scene.id ? 'true' : undefined" :title="scene.title" @click="emit('select', scene.id)">
        <span class="i-ri-file-text-line" aria-hidden="true" />
        <span class="outline-name">{{ scene.name }}</span>
        <span v-if="scene.status === 'ready'" class="i-ri-check-line" :aria-label="english ? 'Ready' : '已就绪'" />
      </button>
      <p v-if="!visibleScenes.length" class="outline-empty">
        {{ english ? 'No matching sections. Try another name.' : '没有匹配的片段，试试其他名称。' }}
      </p>
    </div>
    <div class="outline-summary">
      <span class="i-ri-information-line" aria-hidden="true" />
      <p>{{ english ? 'Select a section to edit its text and properties.' : '选择一个片段，编辑正文与属性。' }}</p>
    </div>
  </aside>
</template>

<style scoped>
.editor-outline {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid var(--ylf-editor-border);
  background: var(--ylf-editor-panel);
}
.outline-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--ylf-editor-header);
  padding: 12px 16px;
}
.outline-heading strong {
  font-weight: 600;
}
.outline-count {
  margin-left: auto;
  color: var(--ylf-editor-muted);
  font-variant-numeric: tabular-nums;
}
.outline-search {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 12px 18px;
  padding: 0 8px;
  min-height: var(--ylf-editor-control);
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-radius);
  background: var(--ylf-editor-field);
  color: var(--ylf-editor-muted);
}
.outline-search:focus-within {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
}
.outline-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ylf-editor-fg);
  font: inherit;
  outline: none;
}
.outline-search input::placeholder {
  color: var(--ylf-editor-muted);
}
.outline-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 12px 6px;
  color: var(--ylf-editor-muted);
}
.outline-items {
  padding: 0 8px;
}
.outline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: var(--ylf-editor-row);
  margin-bottom: 3px;
  padding: 4px 12px;
  border-left: 2px solid transparent;
  border-radius: var(--ylf-editor-radius);
  color: var(--ylf-editor-fg);
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.outline-item:hover {
  background: var(--ylf-editor-chrome);
}
.outline-item[aria-current] {
  border-left-color: var(--ylf-editor-accent);
  background: var(--ylf-editor-selection);
}
.outline-item[aria-current] > :first-child {
  color: var(--ylf-editor-accent);
}
.outline-item:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: -2px;
}
.outline-name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.outline-empty {
  margin: 12px;
  line-height: 1.7;
  color: var(--ylf-editor-muted);
}
.outline-summary {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: auto;
  padding: 20px 16px;
  color: var(--ylf-editor-muted);
  font-size: var(--ylf-editor-caption);
}
.outline-summary > span {
  flex: none;
  margin-top: 2px;
}
.outline-summary p {
  margin: 0;
  line-height: 1.7;
}
@media (max-width: 700px) {
  .editor-outline {
    border-right: 0;
    border-bottom: 1px solid var(--ylf-editor-border);
  }
  .outline-heading {
    padding-block: 10px;
  }
  .outline-search {
    margin-bottom: 12px;
  }
  .outline-group,
  .outline-summary {
    display: none;
  }
  .outline-items {
    display: flex;
    gap: 4px;
    padding-bottom: 8px;
    overflow-x: auto;
  }
  .outline-item {
    flex: 0 0 auto;
    width: auto;
  }
}
</style>
