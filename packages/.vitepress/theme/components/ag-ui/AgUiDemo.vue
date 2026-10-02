<script setup lang="ts">
import type { DemoScenario } from './demo-agent'
import { computed, shallowRef } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import { useDocsLocale } from '../../composables/useDocsLocale'
import AgUiDemoSession from './AgUiDemoSession.vue'
import 'vitepress-theme-yunlefun/workbench.css'

const { english, text } = useDocsLocale()
const scenario = shallowRef<DemoScenario>('tool')
const generation = shallowRef(0)
const scenarios = computed(() => [
  { value: 'stream', label: text('流式对话', 'Streaming chat'), description: text('发送消息，观察分段回复和共享状态同步。', 'Send a message and watch text chunks and shared state arrive.') },
  { value: 'tool', label: text('主题工具确认', 'Theme tool approval'), description: text('允许或拒绝读取亮暗主题，再回传工具结果。', 'Allow or decline reading the page theme, then return a tool result.') },
  { value: 'interrupt', label: text('中断与继续', 'Interrupt and resume'), description: text('运行暂停后，显式确认继续或取消。', 'When the run pauses, explicitly choose to continue or decline.') },
])
const description = computed(() => scenarios.value.find(item => item.value === scenario.value)?.description)
</script>

<template>
  <section class="ag-ui-demo ylf-workbench" :aria-label="text('AG-UI 交互演示', 'AG-UI interactive demo')">
    <div class="demo-toolbar">
      <label class="scenario-label">
        {{ text('选择示例', 'Choose an example') }}
        <select v-model="scenario" class="scenario-select">
          <option v-for="item in scenarios" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </label>
      <YlfButton size="sm" variant="secondary" @click="generation++">
        {{ text('重置示例', 'Reset example') }}
      </YlfButton>
    </div>
    <p class="scenario-description">
      {{ description }}
    </p>
    <p class="demo-note">
      {{ text('本地协议演示 · 固定示例回复，无需密钥，不调用模型或发送网络请求', 'Local protocol demo · Scripted replies, no API key, model call or network request') }}
    </p>
    <AgUiDemoSession :key="`${scenario}-${generation}`" :scenario="scenario" :english="english" />
  </section>
</template>

<style scoped>
.ag-ui-demo {
  margin: 24px 0;
}
.demo-toolbar {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
}
.scenario-label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}
.scenario-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--ylf-c-border-strong);
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-bg);
  color: var(--ylf-c-text);
  font: inherit;
}
.scenario-select:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 2px;
}
.scenario-description {
  margin-bottom: 8px;
}
.demo-note {
  color: var(--ylf-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}
</style>
