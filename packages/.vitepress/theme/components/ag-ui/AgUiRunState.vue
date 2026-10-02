<script setup lang="ts">
import type { AgUiStatus } from '../../../../vue/src/ag-ui'
import { computed } from 'vue'
import YlfBadge from '../../../../vue/components/YlfBadge.vue'

const props = defineProps<{ status: AgUiStatus, state: unknown, pending: boolean, english: boolean }>()
const labels = computed(() => props.english
  ? { idle: 'Ready', running: 'Streaming', success: 'Complete', cancelled: 'Stopped', interrupted: 'Paused', error: 'Failed' }
  : { idle: '就绪', running: '接收中', success: '完成', cancelled: '已停止', interrupted: '已暂停', error: '失败' })
</script>

<template>
  <aside class="run-state ylf-workbench-panel ylf-workbench-grid" :aria-label="english ? 'Agent state' : 'Agent 状态'">
    <YlfBadge :variant="status === 'error' ? 'danger' : status === 'running' ? 'brand' : 'neutral'" appearance="soft">
      {{ pending ? (english ? 'Awaiting confirmation' : '等待确认') : labels[status] }}
    </YlfBadge>
    <h3>{{ english ? 'Shared state' : '共享状态' }}</h3>
    <pre>{{ JSON.stringify(state, null, 2) }}</pre>
    <p>{{ english ? 'State snapshots and patches arrive through AG-UI.' : '状态快照与增量更新通过 AG-UI 同步。' }}</p>
  </aside>
</template>

<style scoped>
.run-state {
  padding: 18px;
  align-self: start;
}
.run-state h3 {
  margin: 18px 0 8px;
  font-size: 14px;
}
.run-state pre {
  max-height: 260px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding: 12px;
  font-size: 12px;
  background: var(--ylf-c-surface);
  border-radius: var(--ylf-radius-sm);
}
.run-state p {
  font-size: 12px;
  color: var(--ylf-c-text-2);
  line-height: 1.6;
}
</style>
