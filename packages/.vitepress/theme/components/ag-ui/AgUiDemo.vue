<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import { useAgUiAgent } from '../../../../vue/src/ag-ui'
import { useDocsLocale } from '../../composables/useDocsLocale'
import AgUiConversation from './AgUiConversation.vue'
import AgUiRunState from './AgUiRunState.vue'
import { createDemoAgent } from './demo-agent'
import 'vitepress-theme-yunlefun/workbench.css'

const { english, text } = useDocsLocale()
const agent = createDemoAgent(english.value)
const { messages, state, status, isRunning, error, isAwaitingInput, pendingToolCallIds, send, run, cancel, addToolResult } = useAgUiAgent(agent)
const prompt = shallowRef(text('请检查主题并给出配色建议', 'Inspect the theme and suggest a palette'))
const disabled = computed(() => isRunning.value || isAwaitingInput.value)
function submit() {
  const content = prompt.value
  if (!content.trim() || disabled.value)
    return
  prompt.value = ''
  void send(content, { tools: [{ name: 'read_theme', description: 'Read the current page theme after confirmation', parameters: { type: 'object', properties: {} } }] })
}
function confirm(approved: boolean) {
  const id = pendingToolCallIds.value[0]
  if (!id || isRunning.value)
    return
  // Only this known, read-only demo tool is handled. No generated code is executed.
  const result = approved ? { approved, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' } : { approved }
  addToolResult(id, JSON.stringify(result))
  void run()
}
</script>

<template>
  <section class="ag-ui-demo ylf-workbench" :aria-label="text('AG-UI 交互演示', 'AG-UI interactive demo')">
    <p class="demo-note">
      {{ text('本地协议演示 · 无需密钥，不调用模型或发送网络请求', 'Local protocol demo · No API key, model call or network request') }}
    </p>
    <div class="demo-grid">
      <div class="demo-chat ylf-workbench-panel">
        <AgUiConversation :messages="messages" :english="english" />
        <div v-if="isAwaitingInput" class="tool-confirmation">
          <p>{{ text('允许读取当前页面的亮暗主题吗？', 'Allow reading this page’s light or dark theme?') }}</p>
          <YlfButton size="sm" @click="confirm(true)">
            {{ text('允许并继续', 'Allow and continue') }}
          </YlfButton>
          <YlfButton size="sm" variant="secondary" @click="confirm(false)">
            {{ text('拒绝', 'Decline') }}
          </YlfButton>
        </div>
        <p v-if="error" class="demo-error" role="alert">
          {{ error.message }}
        </p>
        <form class="composer" @submit.prevent="submit">
          <label for="ag-ui-prompt">{{ text('消息', 'Message') }}</label>
          <input id="ag-ui-prompt" v-model="prompt" :disabled="disabled" :placeholder="text('输入消息…', 'Enter a message…')" autocomplete="off">
          <div class="composer-actions">
            <YlfButton type="submit" size="sm" :disabled="disabled || !prompt.trim()">
              {{ text('发送', 'Send') }}
            </YlfButton>
            <YlfButton v-if="isRunning" type="button" variant="secondary" size="sm" @click="cancel">
              {{ text('停止', 'Stop') }}
            </YlfButton>
            <YlfButton type="button" variant="ghost" size="sm" :disabled="disabled" @click="run({ forwardedProps: { fail: true } })">
              {{ text('模拟连接错误', 'Simulate connection error') }}
            </YlfButton>
          </div>
        </form>
      </div>
      <AgUiRunState :status="status" :state="state" :pending="isAwaitingInput" :english="english" />
    </div>
  </section>
</template>

<style scoped>
.ag-ui-demo {
  margin: 24px 0;
}
.demo-note {
  color: var(--ylf-c-text-2);
  font-size: 13px;
}
.demo-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: 16px;
}
.demo-chat {
  overflow: hidden;
}
.tool-confirmation,
.composer {
  padding: 16px 20px;
  border-top: 1px solid var(--ylf-c-border);
}
.tool-confirmation {
  background: var(--ylf-c-brand-soft);
}
.tool-confirmation p {
  margin: 0 0 12px;
}
.tool-confirmation button + button {
  margin-left: 8px;
}
.composer label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
}
.composer input {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--ylf-c-border-strong);
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-bg);
  color: var(--ylf-c-text);
  font: inherit;
}
.composer input:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 2px;
}
.composer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.demo-error {
  margin: 12px 20px;
  color: var(--ylf-status-danger-text);
}
@media (max-width: 640px) {
  .demo-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
