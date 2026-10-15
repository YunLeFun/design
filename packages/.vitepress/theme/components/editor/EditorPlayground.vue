<script setup lang="ts">
import type { PlaygroundMode, PlaygroundScene, PlaygroundView } from './playground-types'
import { computed, reactive, ref, shallowRef, useId } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import YlfSegmentedControl from '../../../../vue/components/YlfSegmentedControl.vue'
import EditorCanvas from './EditorCanvas.vue'
import EditorInspector from './EditorInspector.vue'
import EditorOutline from './EditorOutline.vue'
import { createPlaygroundProjects } from './playground-data'
import '../../../../ui/styles/editor.css'

const props = withDefaults(defineProps<{ english?: boolean }>(), { english: false })
const text = (zh: string, en: string) => props.english ? en : zh
const mode = shallowRef<PlaygroundMode>('studio')
const scheme = shallowRef<'light' | 'dark'>('light')
const view = shallowRef<PlaygroundView>('document')
const inspectorVisible = shallowRef(true)
const projects = ref(createPlaygroundProjects(props.english))
const selected = reactive<Record<PlaygroundMode, string>>({ studio: 'opening', story: 'platform' })
const project = computed(() => projects.value[mode.value])
const scene = computed(() => project.value.scenes.find(item => item.id === selected[mode.value]) ?? project.value.scenes[0]!)
const characters = computed(() => scene.value.body.replace(/\s/g, '').length)
const modes = computed(() => [
  { value: 'studio' as const, label: text('制作工作台', 'Production') },
  { value: 'story' as const, label: text('叙事编辑器', 'Narrative') },
])
const schemes = computed(() => [
  { value: 'light' as const, label: text('浅色', 'Light') },
  { value: 'dark' as const, label: text('深色', 'Dark') },
])
const inspectorId = useId()
const announcement = shallowRef('')

function updateScene(patch: Partial<PlaygroundScene>) {
  Object.assign(scene.value, patch)
  announcement.value = ''
}

function reset() {
  projects.value = createPlaygroundProjects(props.english)
  selected.studio = 'opening'
  selected.story = 'platform'
  announcement.value = text('两个工作区的示例内容已恢复。', 'Sample content restored in both workspaces.')
}
</script>

<template>
  <div class="editor-playground" :data-ylf-editor-theme="scheme" :style="{ colorScheme: scheme }">
    <header class="playground-controls">
      <YlfSegmentedControl v-model="mode" class="editor-segmented" :options="modes" :label="text('工作区示例', 'Workspace example')" size="sm" />
      <span class="demo-label">{{ text('交互样板', 'Interactive specimen') }}</span>
      <YlfSegmentedControl v-model="scheme" class="editor-segmented scheme-control" :options="schemes" :label="text('编辑器主题', 'Editor theme')" size="sm">
        <template #icon="{ option }">
          <span :class="option.value === 'light' ? 'i-ri-sun-line' : 'i-ri-moon-line'" />
        </template>
      </YlfSegmentedControl>
    </header>
    <div class="editor-window">
      <header class="workspace-header">
        <img src="/favicon.svg" class="workspace-brand" alt="" width="26" height="26">
        <div class="workspace-identity">
          <strong>{{ project.title }}</strong><span>{{ project.subtitle }}</span>
        </div>
        <div class="workspace-actions">
          <YlfButton class="editor-button" variant="ghost" size="sm" :round="false" @click="reset">
            <span class="i-ri-restart-line" aria-hidden="true" />{{ text('恢复示例', 'Reset') }}
          </YlfButton>
          <YlfButton class="editor-button" variant="secondary" size="sm" :round="false" :aria-pressed="inspectorVisible" :aria-expanded="inspectorVisible" :aria-controls="inspectorId" @click="inspectorVisible = !inspectorVisible">
            <span class="i-ri-side-bar-line" aria-hidden="true" />{{ text('属性', 'Inspector') }}
          </YlfButton>
          <YlfButton class="editor-button preview-button" size="sm" :round="false" :aria-pressed="view === 'preview'" @click="view = view === 'preview' ? 'document' : 'preview'">
            <span :class="view === 'preview' ? 'i-ri-edit-line' : 'i-ri-play-line'" aria-hidden="true" />{{ view === 'preview' ? text('编辑文稿', 'Edit script') : text('预览', 'Preview') }}
          </YlfButton>
        </div>
      </header>
      <div class="workspace-panels" :class="{ 'without-inspector': !inspectorVisible }">
        <EditorOutline :key="mode" :scenes="project.scenes" :selected="scene.id" :english="english" :story="mode === 'story'" @select="selected[mode] = $event" />
        <EditorCanvas v-model:view="view" :scene="scene" :scenes="project.scenes" :english="english" :story="mode === 'story'" @select="selected[mode] = $event" @update="updateScene" />
        <EditorInspector v-show="inspectorVisible" :id="inspectorId" :scene="scene" :english="english" @update="updateScene" />
      </div>
      <footer class="workspace-status">
        <span><span class="i-ri-draft-line" aria-hidden="true" />{{ text('演示草稿 · 修改仅保留在本页', 'Demo draft · edits stay on this page') }}</span>
        <span>{{ characters }} {{ text('字符', 'characters') }}<span class="status-divider">·</span>{{ scene.status === 'ready' ? text('已就绪', 'Ready') : text('草稿', 'Draft') }}</span>
      </footer>
    </div>
    <p class="playground-announcement" role="status">
      {{ announcement }}
    </p>
  </div>
</template>

<style scoped>
.editor-playground {
  /* Local adapter: reuse the shared controls without changing consumer defaults. */
  --ylf-c-brand: var(--ylf-editor-accent);
  --ylf-c-brand-soft: var(--ylf-editor-selection);
  --ylf-c-text: var(--ylf-editor-fg);
  --ylf-c-text-2: var(--ylf-editor-muted);
  --ylf-c-surface: var(--ylf-editor-field);
  --ylf-c-surface-inset: var(--ylf-editor-chrome);
  --ylf-c-border: var(--ylf-editor-border);
  --ylf-radius: var(--ylf-editor-radius);
  --ylf-radius-sm: var(--ylf-editor-radius);
  --ylf-font-body: var(--ylf-editor-font);
  color: var(--ylf-editor-fg);
  font: var(--ylf-editor-text) / 1.5 var(--ylf-editor-font);
  text-align: left;
}
.playground-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
}
.demo-label {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.scheme-control {
  margin-left: auto;
}
.editor-window {
  overflow: hidden;
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-panel-radius);
  background: var(--ylf-editor-panel);
  box-shadow: var(--ylf-editor-shadow);
}
.workspace-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 66px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ylf-editor-border);
  background: var(--ylf-editor-chrome);
}
.workspace-brand {
  flex: none;
}
.workspace-identity {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.workspace-identity strong {
  font-size: 13px;
  font-weight: 600;
}
.workspace-identity > span {
  color: var(--ylf-editor-muted);
  font-size: 11px;
}
.workspace-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
}
.workspace-panels {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) var(--ylf-editor-panel-width);
  min-height: 560px;
}
.workspace-panels.without-inspector {
  grid-template-columns: 200px minmax(0, 1fr);
}
.workspace-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  min-height: var(--ylf-editor-header);
  padding: 8px 16px;
  border-top: 1px solid var(--ylf-editor-border);
  color: var(--ylf-editor-muted);
  font-size: 11px;
}
.workspace-status > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-divider {
  margin-inline: 2px;
}
.playground-announcement {
  min-height: 20px;
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.editor-playground :deep(.editor-button .ylf-button__label) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.editor-playground :deep(.editor-button) {
  min-height: var(--ylf-editor-control);
  padding: 4px 9px;
  gap: 6px;
  border-radius: var(--ylf-editor-radius);
  font-size: 12px;
  font-weight: 500;
  box-shadow: none;
  transform: none;
  transition: background-color 120ms ease;
}
.editor-playground :deep(.editor-button:hover) {
  box-shadow: none;
  transform: none;
}
.editor-playground :deep(.editor-button:focus-visible) {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
  box-shadow: none;
}
.editor-playground :deep(.editor-button.ylf-button--ghost),
.editor-playground :deep(.editor-button.ylf-button--secondary) {
  color: var(--ylf-editor-fg);
}
.editor-playground :deep(.editor-button.ylf-button--secondary) {
  border-color: var(--ylf-editor-border);
  background: var(--ylf-editor-panel);
}
.editor-playground :deep(.editor-button.ylf-button--ghost:hover),
.editor-playground :deep(.editor-button.ylf-button--secondary:hover) {
  background: var(--ylf-editor-selection);
}
.editor-playground :deep(.preview-button) {
  background: var(--ylf-palette-blue, #2563eb);
  color: #ffffff;
  border-color: transparent;
}
.editor-playground :deep(.preview-button:hover) {
  background: var(--ylf-c-brand-hover, #1d4ed8);
}
.editor-playground :deep(.editor-segmented) {
  padding: 2px;
  gap: 2px;
  box-shadow: none;
}
.editor-playground :deep(.editor-segmented .ylf-segmented__item) {
  min-height: var(--ylf-editor-control);
  height: auto;
  padding: 4px 10px;
  border-radius: 3px;
  box-shadow: none;
}
.editor-playground :deep(.editor-segmented .ylf-segmented__item[aria-pressed='true']) {
  color: var(--ylf-editor-fg);
}
@media (max-width: 1000px) {
  .workspace-panels,
  .workspace-panels.without-inspector {
    grid-template-columns: 180px minmax(0, 1fr);
  }
}
@media (max-width: 700px) {
  .workspace-panels,
  .workspace-panels.without-inspector {
    grid-template-columns: minmax(0, 1fr);
  }
  .workspace-header {
    padding: 12px;
  }
  .workspace-actions {
    flex-basis: 100%;
    margin-left: 0;
  }
  .workspace-actions .preview-button {
    margin-left: auto;
  }
  .demo-label {
    display: none;
  }
}
@media (pointer: coarse) {
  .editor-playground :deep(.editor-button) {
    min-height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .editor-playground :deep(.editor-button) {
    transition: none;
  }
}
</style>
