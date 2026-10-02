<script setup lang="ts">
import type { DemoEvent } from './useAgUiDemo'
import { computed } from 'vue'

const props = defineProps<{ events: readonly DemoEvent[], english: boolean }>()
const latest = computed(() => props.events.at(-1)?.id ?? 0)
</script>

<template>
  <details class="event-log ylf-workbench-panel">
    <summary class="event-log-summary">
      {{ english ? 'Protocol events' : '协议事件' }} · {{ latest }}
    </summary>
    <p class="event-log-note">
      {{ english ? 'Expand an event to inspect the JSON received by the official client. The latest 80 events are retained.' : '展开事件可查看官方客户端收到的 JSON，保留最近 80 条事件。' }}
    </p>
    <p v-if="!events.length" class="event-log-note">
      {{ english ? 'Send a message to start the event stream.' : '发送消息后即可查看事件流。' }}
    </p>
    <div class="event-log-list">
      <details v-for="event in events" :key="event.id" class="event-item">
        <summary class="event-type">
          <span class="event-number">{{ event.id }}</span>{{ event.type }}
        </summary>
        <pre class="event-payload">{{ event.payload }}</pre>
      </details>
    </div>
  </details>
</template>

<style scoped>
.event-log {
  margin-top: 16px;
  padding: 14px 18px;
  min-width: 0;
}
.event-log-summary,
.event-type {
  cursor: pointer;
  overflow-wrap: anywhere;
}
.event-log-summary:focus-visible,
.event-type:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 3px;
}
.event-log-note {
  font-size: 12px;
  color: var(--ylf-c-text-2);
}
.event-log-list {
  max-height: 280px;
  overflow: auto;
}
.event-item {
  padding: 6px 0;
  border-top: 1px solid var(--ylf-c-border);
}
.event-type {
  font-family: var(--ylf-font-mono);
  font-size: 11px;
}
.event-number {
  display: inline-block;
  min-width: 28px;
  color: var(--ylf-c-text-3);
}
.event-payload {
  padding: 10px;
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-bg-soft);
  font-size: 11px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
