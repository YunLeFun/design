<script setup lang="ts">
const states = [
  {
    state: 'offline',
    label: '未连接',
  },
  {
    state: 'connecting',
    label: '连接中',
  },
  {
    state: 'ready',
    label: '已就绪',
  },
  {
    state: 'working',
    label: '执行中',
  },
  {
    state: 'waiting',
    label: '等待审批',
  },
  {
    state: 'error',
    label: '连接失败',
  },
  {
    state: 'unknown',
    label: '未验证',
  },
] as const
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: var(--ylf-space-3)">
    <YlfAgentStatus v-for="item in states" :key="item.state" :state="item.state" :label="item.label" />
  </div>
</template>
