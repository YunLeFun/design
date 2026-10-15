<script setup lang="ts">
const states = [
  {
    state: 'offline',
    label: 'Offline',
  },
  {
    state: 'connecting',
    label: 'Connecting',
  },
  {
    state: 'ready',
    label: 'Ready',
  },
  {
    state: 'working',
    label: 'Running',
  },
  {
    state: 'waiting',
    label: 'Awaiting approval',
  },
  {
    state: 'error',
    label: 'Connection failed',
  },
  {
    state: 'unknown',
    label: 'Unverified',
  },
] as const
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: var(--ylf-space-3)">
    <YlfAgentStatus v-for="item in states" :key="item.state" :state="item.state" :label="item.label" />
  </div>
</template>
