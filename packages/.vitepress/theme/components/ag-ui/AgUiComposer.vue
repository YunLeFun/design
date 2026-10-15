<script setup lang="ts">
import type { DemoScenario } from './demo-agent'
import { shallowRef, useId } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import YlfInput from '../../../../vue/components/YlfInput.vue'
import { getDemoScenario } from './demo-scenarios'

const props = defineProps<{ scenario: DemoScenario, english: boolean, disabled: boolean, isRunning: boolean, canRetry: boolean }>()
const emit = defineEmits<{ submit: [content: string], cancel: [], simulateFailure: [], retry: [] }>()
const id = useId()
const prompt = shallowRef<string>(getDemoScenario(props.scenario, props.english).prompt)
function submit() {
  if (props.disabled || !prompt.value.trim())
    return
  emit('submit', prompt.value)
  prompt.value = ''
}
</script>

<template>
  <form class="composer" @submit.prevent="submit">
    <label class="composer-label" :for="id">{{ english ? 'Message' : '消息' }}</label>
    <YlfInput :id="id" v-model="prompt" :disabled="disabled" :placeholder="english ? 'Enter a message…' : '输入消息…'" autocomplete="off" />
    <div class="composer-actions">
      <YlfButton type="submit" size="sm" :disabled="disabled || !prompt.trim()">
        {{ english ? 'Send' : '发送' }}
      </YlfButton>
      <YlfButton v-if="isRunning" type="button" variant="secondary" size="sm" @click="emit('cancel')">
        {{ english ? 'Stop' : '停止' }}
      </YlfButton>
      <YlfButton v-if="canRetry" type="button" variant="secondary" size="sm" @click="emit('retry')">
        {{ english ? 'Retry run' : '重试运行' }}
      </YlfButton>
      <YlfButton type="button" variant="ghost" size="sm" :disabled="disabled" @click="emit('simulateFailure')">
        {{ english ? 'Simulate service error' : '模拟服务错误' }}
      </YlfButton>
    </div>
  </form>
</template>

<style scoped>
.composer {
  padding: 16px 20px;
  border-top: 1px solid var(--ylf-c-border);
}
.composer-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
}
.composer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
