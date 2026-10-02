<script setup lang="ts">
import type { DemoScenario } from './demo-agent'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import AgUiComposer from './AgUiComposer.vue'
import AgUiConversation from './AgUiConversation.vue'
import AgUiEventLog from './AgUiEventLog.vue'
import AgUiRunState from './AgUiRunState.vue'
import { useAgUiDemo } from './useAgUiDemo'

const props = defineProps<{ scenario: DemoScenario, english: boolean }>()
const { messages, state, status, isRunning, error, interrupts, isAwaitingInput, events, actionError, disabled, canRetry, pendingTool, submit, cancel, confirmTool, resume, simulateFailure, retry } = useAgUiDemo(props.scenario, props.english)
</script>

<template>
  <div class="demo-grid">
    <div class="demo-chat ylf-workbench-panel">
      <AgUiConversation :messages="messages" :english="english" />
      <div v-if="pendingTool && !isRunning" class="confirmation" role="group" :aria-label="english ? 'Tool approval' : '工具确认'">
        <p class="confirmation-prompt">
          {{ english ? 'Allow reading this page’s light or dark theme?' : '允许读取当前页面的亮暗主题吗？' }}
        </p>
        <div class="confirmation-actions">
          <YlfButton size="sm" @click="confirmTool(true)">
            {{ english ? 'Allow and continue' : '允许并继续' }}
          </YlfButton>
          <YlfButton size="sm" variant="secondary" @click="confirmTool(false)">
            {{ english ? 'Decline' : '拒绝' }}
          </YlfButton>
        </div>
      </div>
      <div v-if="interrupts.length && !isRunning" class="confirmation" role="group" :aria-label="english ? 'Resume approval' : '继续确认'">
        <p class="confirmation-prompt">
          {{ interrupts[0]?.message }}
        </p>
        <div class="confirmation-actions">
          <YlfButton size="sm" @click="resume(true)">
            {{ english ? 'Confirm and resume' : '确认并继续' }}
          </YlfButton>
          <YlfButton size="sm" variant="secondary" @click="resume(false)">
            {{ english ? 'Decline continuation' : '取消继续' }}
          </YlfButton>
        </div>
      </div>
      <p v-if="error || actionError" class="demo-error" role="alert">
        {{ actionError || error?.message }}
      </p>
      <AgUiComposer :scenario="scenario" :english="english" :disabled="disabled" :is-running="isRunning" :can-retry="canRetry" @submit="submit" @cancel="cancel" @simulate-failure="simulateFailure" @retry="retry" />
    </div>
    <AgUiRunState :status="status" :state="state" :pending="isAwaitingInput" :english="english" />
  </div>
  <AgUiEventLog :events="events" :english="english" />
</template>

<style scoped>
.demo-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: 16px;
}
.demo-chat {
  overflow: hidden;
}
.confirmation {
  padding: 16px 20px;
  border-top: 1px solid var(--ylf-c-border);
  background: var(--ylf-c-brand-soft);
}
.confirmation-prompt {
  margin: 0 0 12px;
}
.confirmation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
