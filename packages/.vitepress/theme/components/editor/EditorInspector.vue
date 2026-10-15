<script setup lang="ts">
import type { PlaygroundScene } from './playground-types'
import { useId } from 'vue'

defineProps<{ scene: PlaygroundScene, english: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<PlaygroundScene>] }>()
const id = useId()

function updateDuration(event: Event) {
  const input = event.target as HTMLInputElement
  const value = Number(input.value)
  if (Number.isFinite(value)) {
    const duration = Math.min(60, Math.max(1, Math.round(value)))
    input.value = String(duration)
    emit('update', { duration })
  }
}
</script>

<template>
  <aside class="editor-inspector" :aria-label="english ? 'Inspector' : '属性检查器'">
    <header class="inspector-heading">
      <span class="i-ri-equalizer-line" aria-hidden="true" />
      <strong>{{ english ? 'Inspector' : '属性检查器' }}</strong>
    </header>
    <section class="inspector-section">
      <h3 class="section-heading">
        {{ english ? 'Section' : '片段' }}
      </h3>
      <label class="property-stack" :for="`${id}-title`">
        {{ english ? 'Title' : '标题' }}
        <input :id="`${id}-title`" class="property-field" :value="scene.title" maxlength="80" @input="emit('update', { title: ($event.target as HTMLInputElement).value })">
      </label>
      <label class="property-row" :for="`${id}-status`">
        <span>{{ english ? 'Status' : '状态' }}</span>
        <select :id="`${id}-status`" class="property-field" :value="scene.status" @change="emit('update', { status: ($event.target as HTMLSelectElement).value as PlaygroundScene['status'] })">
          <option value="draft">{{ english ? 'Draft' : '草稿' }}</option>
          <option value="ready">{{ english ? 'Ready' : '已就绪' }}</option>
        </select>
      </label>
      <label class="property-row" :for="`${id}-duration`">
        <span>{{ english ? 'Duration' : '时长' }}</span>
        <span class="number-field"><input :id="`${id}-duration`" class="property-field" :aria-label="english ? 'Duration in seconds' : '时长（秒）'" type="number" min="1" max="60" :value="scene.duration" @change="updateDuration"><span>{{ english ? 'sec' : '秒' }}</span></span>
      </label>
    </section>
    <section class="inspector-section">
      <h3 class="section-heading">
        {{ english ? 'Direction' : '画面说明' }}
      </h3>
      <label class="property-stack" :for="`${id}-direction`">
        <span class="sr-only">{{ english ? 'Direction notes' : '画面说明内容' }}</span>
        <textarea :id="`${id}-direction`" class="property-field direction-field" :value="scene.direction" rows="5" @input="emit('update', { direction: ($event.target as HTMLTextAreaElement).value })" />
      </label>
    </section>
    <details class="inspector-section inspector-details">
      <summary>{{ english ? 'Design details' : '设计细节' }}</summary>
      <dl class="spec-list">
        <div><dt>{{ english ? 'Controls' : '标准控件' }}</dt><dd>28 px</dd></div>
        <div><dt>{{ english ? 'Corners' : '控件圆角' }}</dt><dd>5 px</dd></div>
        <div><dt>{{ english ? 'Accent' : '交互强调' }}</dt><dd>{{ english ? 'Sky blue' : '晴空蓝' }}</dd></div>
      </dl>
      <p class="inspector-note">
        {{ english ? 'Mouse / trackpad baseline. Touch targets grow to 40–44 px.' : '以上为鼠标 / 触控板基线，触屏命中区增至 40–44 px。' }}
      </p>
    </details>
  </aside>
</template>

<style scoped>
.editor-inspector {
  min-width: 0;
  border-left: 1px solid var(--ylf-editor-border);
  background: var(--ylf-editor-panel);
}
.inspector-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--ylf-editor-header);
  padding: 12px 16px;
  border-bottom: 1px solid var(--ylf-editor-border);
}
.inspector-heading strong {
  font-weight: 600;
}
.inspector-section {
  padding: 18px 16px;
  border-bottom: 1px solid var(--ylf-editor-border);
}
.section-heading {
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 600;
}
.property-stack {
  display: grid;
  gap: 8px;
  color: var(--ylf-editor-muted);
}
.property-row {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  color: var(--ylf-editor-muted);
}
.property-field {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: var(--ylf-editor-control);
  padding: 4px 8px;
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-radius);
  background: var(--ylf-editor-field);
  color: var(--ylf-editor-fg);
  font: inherit;
}
.property-field:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
}
.direction-field {
  line-height: 1.8;
  resize: vertical;
}
.number-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-variant-numeric: tabular-nums;
}
.number-field > span {
  flex: none;
}
.inspector-details summary {
  cursor: pointer;
  font-weight: 500;
}
.inspector-details summary:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 4px;
}
.spec-list {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
}
.spec-list > div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.spec-list dt,
.inspector-note {
  color: var(--ylf-editor-muted);
}
.spec-list dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.inspector-note {
  margin: 16px 0 0;
  font-size: var(--ylf-editor-caption);
  line-height: 1.7;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (max-width: 1000px) {
  .editor-inspector {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-left: 0;
    border-top: 1px solid var(--ylf-editor-border);
  }
  .inspector-heading,
  .inspector-details {
    grid-column: 1 / -1;
  }
}
@media (max-width: 480px) {
  .editor-inspector {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
