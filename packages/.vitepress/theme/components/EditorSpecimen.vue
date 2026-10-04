<script setup lang="ts">
import { computed, ref } from 'vue'
import '../../../ui/styles/editor.css'

const props = defineProps<{ english?: boolean }>()
const dark = ref(false)
const selected = ref(1)
const opacity = ref(60)
const layers = computed(() => props.english
  ? ['Heart signature', 'Cross ribbon', 'Fine texture']
  : ['心形签名', '十字缎带', '满屏细纹理'])
</script>

<template>
  <section class="editor-specimen" :data-ylf-editor-theme="dark ? 'dark' : 'light'" :aria-label="english ? 'Interactive editor specimen' : 'Editor 交互样板'">
    <header>
      <strong>{{ english ? 'Saier' : '云绘' }} <span>Editor</span></strong><button type="button" :aria-pressed="dark" @click="dark = !dark">
        {{ english ? (dark ? 'Use light theme' : 'Use dark theme') : (dark ? '切换浅色' : '切换深色') }}
      </button>
    </header>
    <div class="specimen-body">
      <section class="specimen-layers" :aria-label="english ? 'Sample layers' : '样板图层'">
        <h3>{{ english ? 'Layers' : '图层' }}</h3>
        <button v-for="(layer, index) in layers" :key="index" type="button" :aria-pressed="selected === index" @click="selected = index">
          <span class="layer-thumbnail" aria-hidden="true">◇</span><span>{{ layer }}</span>
        </button>
      </section>
      <section class="specimen-properties">
        <h3>{{ layers[selected] }}</h3>
        <label>{{ english ? 'Opacity' : '不透明度' }}<input v-model="opacity" type="range" min="5" max="100"><output>{{ opacity }}%</output></label>
        <div class="specimen-note">
          {{ english ? 'Compact properties · Neutral surfaces · Sky-blue selection' : '紧凑属性 · 中性表面 · 晴空蓝选中态' }}
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.editor-specimen {
  margin-block: 24px;
  overflow: hidden;
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-panel-radius);
  background: var(--ylf-editor-panel);
  color: var(--ylf-editor-fg);
  font: var(--ylf-editor-text) / 1.45 var(--ylf-editor-font);
  box-shadow: var(--ylf-editor-shadow);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--ylf-editor-chrome);
  border-bottom: 1px solid var(--ylf-editor-border);
}
header strong span {
  margin-left: 6px;
  color: var(--ylf-editor-muted);
  font-weight: 400;
}
button {
  min-height: var(--ylf-editor-control);
  padding: 3px 8px;
  border: 1px solid var(--ylf-editor-border);
  border-radius: var(--ylf-editor-radius);
  color: inherit;
  background: var(--ylf-editor-field);
  font: inherit;
  cursor: pointer;
}
button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--ylf-editor-accent);
  outline-offset: 2px;
}
.specimen-body {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
}
.specimen-layers {
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 8px;
  border-right: 1px solid var(--ylf-editor-border);
}
h3 {
  margin: 0 0 8px;
  padding: 0;
  border: 0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}
.specimen-layers button {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--ylf-editor-row);
  text-align: left;
  border-color: transparent;
  background: transparent;
}
.specimen-layers button[aria-pressed='true'] {
  background: var(--ylf-editor-selection);
}
.layer-thumbnail {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border: 1px solid var(--ylf-editor-border);
  border-radius: 3px;
  color: var(--ylf-editor-accent);
  background: var(--ylf-editor-field);
}
.specimen-properties {
  padding: 12px;
  min-width: 0;
}
label {
  display: grid;
  grid-template-columns: 60px minmax(40px, 1fr) 32px;
  align-items: center;
  gap: 8px;
  color: var(--ylf-editor-muted);
}
input {
  width: 100%;
  min-width: 0;
  min-height: var(--ylf-editor-control);
  accent-color: var(--ylf-editor-accent);
}
output {
  font-variant-numeric: tabular-nums;
}
.specimen-note {
  margin-top: 16px;
  color: var(--ylf-editor-muted);
  font-size: var(--ylf-editor-caption);
}
@media (max-width: 540px) {
  .specimen-body {
    grid-template-columns: minmax(0, 1fr);
  }
  .specimen-layers {
    border-right: 0;
    border-bottom: 1px solid var(--ylf-editor-border);
  }
}
</style>
