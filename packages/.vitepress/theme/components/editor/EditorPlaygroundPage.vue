<script setup lang="ts">
import EditorPlayground from './EditorPlayground.vue'

withDefaults(defineProps<{ english?: boolean }>(), { english: false })
</script>

<template>
  <main class="editor-playground-page">
    <header class="page-intro">
      <div>
        <h1>{{ english ? 'Editor Playground' : '编辑器 Playground' }}</h1>
        <p>{{ english ? 'One design language, two creative workspaces. Try the script, preview and inspector.' : '同一套设计语言，两种创作工作区。试试文稿编辑、画面预览和属性联动。' }}</p>
      </div>
      <a class="spec-link" :href="english ? '/en/guide/editor' : '/guide/editor'">{{ english ? 'Editor guidelines' : '阅读设计规范' }}<span class="i-ri-arrow-right-line" aria-hidden="true" /></a>
    </header>
    <EditorPlayground :english="english" />
    <div class="playground-notes">
      <section>
        <h2>{{ english ? 'Shared visual foundations' : '统一的视觉基础' }}</h2>
        <p>{{ english ? 'Neutral surfaces, sky-blue interaction states and 5 px control corners. The demo uses the existing Editor tokens.' : '中性表面、晴空蓝交互态与 5 px 控件圆角。样板直接使用现有 Editor 设计变量。' }}</p>
      </section>
      <section>
        <h2>{{ english ? 'Room for the work' : '把空间留给内容' }}</h2>
        <p>{{ english ? 'Compact controls surround a readable script. Sections, the storyboard and the inspector share one selection.' : '工具保持紧凑，正文保留阅读空间。项目目录、分镜顺序与属性面板围绕同一个选择联动。' }}</p>
      </section>
      <section>
        <h2>{{ english ? 'A design playground' : '设计演示范围' }}</h2>
        <p>{{ english ? 'Sample content stays in memory and resets on reload. This is a proposed layout, not a live ADV.JS or Studio integration.' : '示例数据仅保留在当前页面，刷新后恢复。这里展示候选布局，不代表 ADV.JS 或 Studio 已完成接入。' }}</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.editor-playground-page {
  box-sizing: border-box;
  max-width: 1480px;
  margin: 0 auto;
  padding: 40px 32px 64px;
}
.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}
.page-intro h1 {
  margin: 0 0 10px;
  color: var(--ylf-c-text);
  font: 600 28px / 1.35 var(--ylf-font-body);
  letter-spacing: -0.025em;
}
.page-intro p {
  margin: 0;
  color: var(--ylf-c-text-2);
  font: 14px / 1.8 var(--ylf-font-body);
}
.spec-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  color: var(--ylf-c-brand);
  font-size: 13px;
  text-decoration: none;
}
.spec-link:hover {
  text-decoration: underline;
}
.spec-link:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 4px;
  border-radius: 4px;
}
.playground-notes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-top: 20px;
  padding-top: 24px;
  border-top: 1px solid var(--ylf-c-border);
}
.playground-notes h2 {
  margin: 0 0 10px;
  font: 500 13px / 1.5 var(--ylf-font-body);
  color: var(--ylf-c-text);
}
.playground-notes p {
  max-width: 40em;
  margin: 0;
  color: var(--ylf-c-text-2);
  font: 12px / 1.9 var(--ylf-font-body);
}
@media (max-width: 700px) {
  .editor-playground-page {
    padding: 24px 16px 40px;
  }
  .page-intro {
    gap: 8px;
    margin-bottom: 20px;
  }
  .page-intro h1 {
    font-size: 24px;
  }
  .playground-notes {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
</style>
