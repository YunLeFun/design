<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { DemoToolResult } from './demo-types'
import YlfBadge from '../../../../vue/components/YlfBadge.vue'
import { getDemoToolLabel } from './demo-tools'

defineProps<{ results: readonly DeepReadonly<DemoToolResult>[], english: boolean }>()
</script>

<template>
  <section class="tool-results ylf-workbench-panel" :aria-label="english ? 'Tool results' : '工具结果'">
    <h3 class="results-heading">
      {{ english ? 'Tool results' : '工具结果' }}
    </h3>
    <div v-for="result in results" :key="result.name" class="tool-result" :data-tool="result.name">
      <div class="result-heading">
        <strong class="result-title">{{ getDemoToolLabel(result.name, english) }}</strong>
        <YlfBadge :variant="result.approved ? 'success' : 'neutral'" appearance="soft">
          {{ result.approved ? (english ? 'Approved' : '已允许') : (english ? 'Declined' : '已拒绝') }}
        </YlfBadge>
      </div>
      <p class="result-detail">
        {{ !result.approved ? (english ? 'No information was read.' : '没有读取信息。')
          : result.name === 'read_theme' ? `${english ? 'Theme' : '主题'}: ${result.theme}`
            : `${english ? 'Available examples' : '可用示例'}: ${result.count}` }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.tool-results {
  padding: 20px;
}
.results-heading {
  margin: 0 0 14px;
  font-size: 16px;
}
.tool-result {
  padding: 12px 0;
  border-top: 1px solid var(--ylf-c-border);
}
.result-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}
.result-title {
  font-size: 13px;
}
.result-detail {
  margin: 8px 0 0;
  color: var(--ylf-c-text-2);
  font-size: 12px;
}
</style>
