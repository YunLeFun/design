<script setup lang="ts">
import type { Message } from '@ag-ui/client'
import type { DeepReadonly } from 'vue'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'

const props = defineProps<{ messages: readonly DeepReadonly<Message>[], english: boolean }>()
const visibleMessages = computed(() => props.messages.filter(message => message.role === 'user' || message.role === 'assistant'))
const conversation = useTemplateRef<HTMLDivElement>('conversation')
const followLatest = shallowRef(true)
function onScroll() {
  const element = conversation.value
  if (element)
    followLatest.value = element.scrollHeight - element.scrollTop - element.clientHeight < 48
}
watch(() => props.messages, () => {
  const element = conversation.value
  if (element && followLatest.value)
    element.scrollTop = element.scrollHeight
}, { flush: 'post' })
function messageText(message: DeepReadonly<Message>) {
  if (typeof message.content === 'string')
    return message.content
  if (Array.isArray(message.content))
    return message.content.filter(part => part.type === 'text').map(part => part.text).join('')
  return ''
}
</script>

<template>
  <div ref="conversation" class="conversation" role="log" :aria-label="english ? 'Agent conversation' : 'Agent 对话'" aria-live="polite" aria-relevant="additions text" @scroll="onScroll">
    <p v-if="!visibleMessages.length" class="empty">
      {{ english ? 'Send a message to try streaming and explicit tool confirmation.' : '发送消息，体验流式回复与工具确认。' }}
    </p>
    <article v-for="message in visibleMessages" :key="message.id" class="message" :data-role="message.role">
      <strong>{{ message.role === 'user' ? (english ? 'You' : '你') : 'Agent' }}</strong>
      <p>{{ messageText(message) }}</p>
      <span v-if="message.role === 'assistant' && message.toolCalls?.length" class="tool-label">{{ english ? 'Tool requested' : '请求工具' }} · {{ message.toolCalls.map(tool => tool.function.name).join(', ') }}</span>
    </article>
  </div>
</template>

<style scoped>
.conversation {
  display: grid;
  gap: 12px;
  min-height: 180px;
  max-height: 360px;
  overflow: auto;
  align-content: start;
  padding: 20px;
}
.empty {
  color: var(--ylf-c-text-2);
}
.message {
  padding: 12px 16px;
  border-radius: var(--ylf-radius);
  background: var(--ylf-c-bg-soft);
  overflow-wrap: anywhere;
}
.message[data-role='user'] {
  margin-left: 24px;
  background: var(--ylf-c-brand-soft);
}
.message strong {
  font-size: 12px;
  color: var(--ylf-c-brand);
}
.message p {
  margin: 6px 0 0;
  white-space: pre-wrap;
}
.tool-label {
  display: block;
  margin-top: 8px;
  color: var(--ylf-c-text-2);
  font-size: 12px;
}
</style>
