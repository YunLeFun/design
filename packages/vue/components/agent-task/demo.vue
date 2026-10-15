<script setup lang="ts">
import { shallowRef } from 'vue'

const continued = shallowRef(false)
</script>

<template>
  <YlfAgentTask title="当前任务" :state="continued ? 'working' : 'waiting'" :status-label="continued ? '执行中' : '等待审批'" task-id="task-20261006-001" description="查看操作范围后，由应用显式确认是否继续。">
    <template #actions>
      <YlfButton :disabled="continued" @click="continued = true">
        继续
      </YlfButton>
    </template>
  </YlfAgentTask>
</template>
