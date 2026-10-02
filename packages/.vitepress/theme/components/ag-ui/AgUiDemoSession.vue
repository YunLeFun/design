<script setup lang="ts">
import type { DemoScenario } from './demo-agent'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import AgUiComposer from './AgUiComposer.vue'
import AgUiConversation from './AgUiConversation.vue'
import AgUiDraftForm from './AgUiDraftForm.vue'
import AgUiEventLog from './AgUiEventLog.vue'
import AgUiRecommendations from './AgUiRecommendations.vue'
import AgUiRunState from './AgUiRunState.vue'
import AgUiTaskPlan from './AgUiTaskPlan.vue'
import AgUiToolApprovals from './AgUiToolApprovals.vue'
import AgUiToolResults from './AgUiToolResults.vue'
import { useAgUiDemo } from './useAgUiDemo'

const props = defineProps<{ scenario: DemoScenario, english: boolean }>()
const { messages, state, status, isRunning, error, interrupts, isAwaitingInput, events, actionError, disabled, canRetry, pendingTools, submit, cancel, confirmTool, resume, simulateFailure, retry, selectRecommendation, updateDraft, submitDraft } = useAgUiDemo(props.scenario, props.english)
</script>

<template>
  <div class="demo-grid">
    <div class="demo-chat ylf-workbench-panel">
      <AgUiConversation :messages="messages" :english="english" />
      <AgUiToolApprovals v-if="pendingTools.length && !isRunning" :tools="pendingTools" :english="english" @confirm="(id, approved) => confirmTool(approved, id)" />
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
  <div v-if="state.tasks || state.recommendations || state.draft || state.toolResults" class="scenario-result">
    <AgUiTaskPlan v-if="state.tasks" :tasks="state.tasks" :progress="state.progress ?? 0" :english="english" />
    <AgUiRecommendations v-if="state.recommendations?.length" :recommendations="state.recommendations" :selected="state.selectedRecommendation" :disabled="isRunning" :english="english" @select="selectRecommendation" />
    <AgUiDraftForm v-if="state.draft" :draft="state.draft" :submitted="state.draftSubmitted ?? false" :disabled="isRunning" :english="english" @update="updateDraft" @submit="submitDraft" />
    <AgUiToolResults v-if="state.toolResults" :results="state.toolResults" :english="english" />
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
.scenario-result {
  margin-top: 20px;
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
