<script setup lang="ts">
import type { ToolCall } from '@ag-ui/client'
import type { DeepReadonly } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import { getDemoToolLabel } from './demo-tools'

defineProps<{ tools: readonly DeepReadonly<ToolCall>[], english: boolean }>()
const emit = defineEmits<{ confirm: [id: string, approved: boolean] }>()
</script>

<template>
  <div class="tool-approvals">
    <div v-for="tool in tools" :key="tool.id" class="tool-approval" role="group" :aria-label="getDemoToolLabel(tool.function.name, english)">
      <p class="tool-prompt">
        {{ tool.function.name === 'read_theme'
          ? (english ? 'Allow reading this page’s light or dark theme?' : '允许读取当前页面的亮暗主题吗？')
          : (english ? 'Allow reading the local example catalog?' : '允许读取本地示例目录吗？') }}
      </p>
      <code class="tool-name">{{ tool.function.name }}</code>
      <div class="tool-actions">
        <YlfButton size="sm" @click="emit('confirm', tool.id, true)">
          {{ english ? 'Allow and continue' : '允许并继续' }}
        </YlfButton>
        <YlfButton size="sm" variant="secondary" @click="emit('confirm', tool.id, false)">
          {{ english ? 'Decline' : '拒绝' }}
        </YlfButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-approval {
  padding: 16px 20px;
  border-top: 1px solid var(--ylf-c-border);
  background: var(--ylf-c-brand-soft);
}
.tool-prompt {
  margin: 0 0 8px;
}
.tool-name {
  color: var(--ylf-c-text-2);
  font-size: 12px;
}
.tool-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
