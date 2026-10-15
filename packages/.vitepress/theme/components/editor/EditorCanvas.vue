<script setup lang="ts">
import type { PlaygroundScene, PlaygroundView } from './playground-types'
import { computed } from 'vue'
import YlfSegmentedControl from '../../../../vue/components/YlfSegmentedControl.vue'

const props = defineProps<{ scene: PlaygroundScene, scenes: PlaygroundScene[], english: boolean, story: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<PlaygroundScene>], select: [id: string] }>()
const view = defineModel<PlaygroundView>('view', { required: true })
const views = computed(() => [
  { value: 'document' as const, label: props.english ? 'Script' : '文稿' },
  { value: 'preview' as const, label: props.english ? 'Preview' : '画面预览' },
])
const sceneIndex = computed(() => props.scenes.findIndex(scene => scene.id === props.scene.id))
const paragraphs = computed(() => props.scene.body.split('\n\n').filter(Boolean))
const totalDuration = computed(() => props.scenes.reduce((total, scene) => total + scene.duration, 0))
</script>

<template>
  <section class="editor-canvas" :aria-label="english ? 'Content workspace' : '内容工作区'">
    <header class="canvas-toolbar">
      <span class="canvas-file"><span class="i-ri-file-text-line" aria-hidden="true" />{{ scene.name }}<span class="file-extension">{{ story ? '.adv.md' : '.md' }}</span></span>
      <YlfSegmentedControl v-model="view" class="editor-segmented" :options="views" :label="english ? 'Content view' : '内容视图'" size="sm" />
    </header>
    <div class="canvas-content">
      <article v-if="view === 'document'" class="script-paper">
        <div class="paper-meta">
          <span>{{ story ? (english ? 'Chapter one' : '第一章') : (english ? 'Video script' : '视频脚本') }}</span><span>{{ String(sceneIndex + 1).padStart(2, '0') }} / {{ String(scenes.length).padStart(2, '0') }}</span>
        </div>
        <h2 class="paper-title">
          {{ scene.title || (english ? 'Untitled' : '未命名片段') }}
        </h2>
        <p class="paper-description">
          {{ english ? 'Narration & dialogue' : '旁白与对白' }}<span>{{ scene.duration }} {{ english ? 'sec' : '秒' }}</span>
        </p>
        <textarea class="script-input" :aria-label="english ? 'Script text' : '文稿正文'" :value="scene.body" spellcheck="false" @input="emit('update', { body: ($event.target as HTMLTextAreaElement).value })" />
        <div class="paper-note">
          <span class="i-ri-movie-line" aria-hidden="true" /><p>{{ scene.direction }}</p>
        </div>
      </article>
      <div v-else class="preview-workspace">
        <div class="preview-frame" :class="{ 'story-preview': story }">
          <img class="preview-brand" src="/favicon.svg" alt="" width="42" height="42">
          <span class="preview-project">{{ story ? (english ? 'Letters from the clouds' : '来自云端的信') : (english ? 'YunLeFun · A creator’s notebook' : '云乐坊 · 创作手记') }}</span>
          <h2 class="preview-title">
            {{ scene.title || (english ? 'Untitled' : '未命名片段') }}
          </h2>
          <div class="preview-copy">
            <p v-for="(paragraph, index) in paragraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
          <span class="preview-page">{{ String(sceneIndex + 1).padStart(2, '0') }}</span>
        </div>
        <p class="preview-caption">
          {{ english ? 'Static content preview · appearance stays independent of the editor theme' : '静态内容预览 · 作品画面保持独立，不随编辑器主题变色' }}
        </p>
      </div>
    </div>
    <footer class="sequence-panel">
      <div class="sequence-heading">
        <strong>{{ story ? (english ? 'Story sequence' : '故事顺序') : (english ? 'Storyboard' : '分镜顺序') }}</strong><span>{{ scenes.length }} {{ english ? 'sections' : '个片段' }}<span class="sequence-dot">·</span>{{ totalDuration }} {{ english ? 'sec' : '秒' }}</span>
      </div>
      <div class="sequence-items">
        <button v-for="(item, index) in scenes" :key="item.id" class="sequence-item" type="button" :aria-pressed="item.id === scene.id" :aria-label="`${english ? 'Select' : '选择'} ${item.name}`" @click="emit('select', item.id)">
          <span class="sequence-number">{{ String(index + 1).padStart(2, '0') }}</span><span class="sequence-name">{{ item.name }}</span><span class="sequence-duration">{{ item.duration }}s</span>
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.editor-canvas {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--ylf-editor-workspace);
}
.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  min-height: var(--ylf-editor-header);
  padding: 8px 14px;
  border-bottom: 1px solid var(--ylf-editor-border);
  background: var(--ylf-editor-panel);
}
.canvas-file {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.file-extension {
  margin-left: -6px;
  color: var(--ylf-editor-muted);
}
.canvas-content {
  flex: 1;
  min-width: 0;
  padding: 28px;
}
.script-paper {
  max-width: 780px;
  min-height: 380px;
  margin: 0 auto;
  padding: 32px 36px 24px;
  border: 1px solid var(--ylf-editor-border);
  border-radius: 3px;
  background: var(--ylf-editor-field);
}
.paper-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--ylf-editor-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.paper-title {
  margin: 26px 0 12px;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
}
.paper-description {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px;
  color: var(--ylf-editor-muted);
  font-size: 11px;
}
.paper-description > span {
  border-left: 1px solid var(--ylf-editor-border);
  padding-left: 12px;
  font-variant-numeric: tabular-nums;
}
.script-input {
  display: block;
  width: 100%;
  min-height: 210px;
  padding: 8px;
  margin: -8px 0 20px -8px;
  border: 1px solid transparent;
  border-radius: var(--ylf-editor-radius);
  background: transparent;
  color: var(--ylf-editor-fg);
  font: 14px / 2 var(--ylf-editor-font);
  resize: vertical;
}
.script-input:hover {
  border-color: var(--ylf-editor-border);
}
.script-input:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
}
.paper-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--ylf-editor-border);
  color: var(--ylf-editor-muted);
}
.paper-note > span {
  flex: none;
  margin-top: 3px;
}
.paper-note p {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
.preview-workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
}
/* This is the sample work itself, not editor chrome. Its colors stay fixed. */
.preview-frame {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 360px;
  aspect-ratio: 16 / 10;
  padding: 32px 40px;
  border-radius: 3px;
  background: #f8fbff;
  color: #20334d;
}
.preview-brand {
  align-self: flex-start;
  margin-bottom: 22px;
}
.preview-project {
  font-size: 11px;
  color: #51647d;
}
.preview-title {
  margin: 12px 0 22px;
  font-size: clamp(22px, 2.2vw, 34px);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.04em;
  color: #2563eb;
  overflow-wrap: anywhere;
}
.preview-copy {
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.preview-copy p {
  margin: 0 0 12px;
}
.preview-page {
  align-self: flex-end;
  margin-top: 20px;
  color: #51647d;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.story-preview {
  border-top: 3px solid #2563eb;
}
.preview-caption {
  max-width: 100%;
  margin: 14px 0 0;
  color: var(--ylf-editor-muted);
  text-align: center;
  font-size: 11px;
  line-height: 1.7;
}
.sequence-panel {
  padding: 14px 16px 16px;
  border-top: 1px solid var(--ylf-editor-border);
  background: var(--ylf-editor-panel);
}
.sequence-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.sequence-heading strong {
  font-weight: 500;
}
.sequence-heading > span {
  color: var(--ylf-editor-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.sequence-dot {
  margin-inline: 6px;
}
.sequence-items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.sequence-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 48px;
  padding: 8px 10px;
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-radius);
  color: var(--ylf-editor-fg);
  background: var(--ylf-editor-field);
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.sequence-item:hover {
  border-color: var(--ylf-editor-accent);
}
.sequence-item[aria-pressed='true'] {
  border-color: var(--ylf-editor-accent);
  background: var(--ylf-editor-selection);
}
.sequence-item:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
}
.sequence-number {
  color: var(--ylf-editor-accent);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.sequence-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sequence-duration {
  margin-left: auto;
  color: var(--ylf-editor-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 700px) {
  .canvas-content {
    padding: 16px;
  }
  .script-paper {
    padding: 24px 20px;
  }
  .preview-frame {
    padding: 24px;
  }
  .paper-title {
    font-size: 22px;
  }
}
@media (max-width: 480px) {
  .canvas-content {
    padding: 10px;
  }
  .script-paper {
    padding: 20px 16px;
  }
  .sequence-items {
    gap: 4px;
  }
  .sequence-item {
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
  }
  .sequence-name {
    flex-basis: calc(100% - 24px);
  }
  .sequence-duration {
    margin-left: 0;
  }
}
</style>
