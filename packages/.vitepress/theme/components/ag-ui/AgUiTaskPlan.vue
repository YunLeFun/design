<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { DemoTask } from './demo-types'
import { computed } from 'vue'
import YlfBadge from '../../../../vue/components/YlfBadge.vue'
import YlfProgress from '../../../../vue/components/YlfProgress.vue'

const props = defineProps<{ tasks: readonly DeepReadonly<DemoTask>[], progress: number, english: boolean }>()
const labels = computed(() => props.english ? { queued: 'Queued', running: 'In progress', done: 'Done' } : { queued: '待开始', running: '进行中', done: '已完成' })
</script>

<template>
  <section class="task-plan ylf-workbench-panel" :aria-label="english ? 'Task plan' : '任务规划'">
    <div class="plan-heading">
      <h3 class="plan-title">
        {{ english ? 'Workshop plan' : '活动规划' }}
      </h3>
      <span class="plan-progress">{{ progress }}%</span>
    </div>
    <YlfProgress :value="progress" :aria-label="english ? 'Planning progress' : '规划进度'" />
    <ol class="plan-tasks">
      <li v-for="task in tasks" :key="task.id" class="plan-task" :data-task-status="task.status">
        <span class="task-title">{{ task.title }}</span>
        <YlfBadge :variant="task.status === 'running' ? 'brand' : task.status === 'done' ? 'success' : 'neutral'" appearance="soft">
          {{ labels[task.status] }}
        </YlfBadge>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.task-plan {
  padding: 20px;
}
.plan-heading,
.plan-task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.plan-heading {
  margin-bottom: 14px;
}
.plan-title {
  margin: 0;
  font-size: 16px;
}
.plan-progress {
  font-size: 13px;
  color: var(--ylf-c-brand);
  font-variant-numeric: tabular-nums;
}
.plan-tasks {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}
.plan-task {
  padding: 12px;
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-bg-soft);
}
.task-title {
  min-width: 0;
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
