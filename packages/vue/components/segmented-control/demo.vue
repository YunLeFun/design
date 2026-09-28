<script setup lang="ts">
import { shallowRef } from 'vue'
import YlfSegmentedControl from '../YlfSegmentedControl.vue'

const view = shallowRef<'grid' | 'list'>('grid')
const kind = shallowRef('all')
const options = [{ value: 'grid', label: '网格视图' }, { value: 'list', label: '列表视图' }] as const
const icons = { grid: 'i-ri-grid-line', list: 'i-ri-list-check' }
const kinds = [{ value: 'all', label: '全部', count: 24 }, { value: 'image', label: '图片', count: 18 }, { value: 'video', label: '视频', count: 6 }]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <YlfSegmentedControl v-model="kind" :options="kinds" label="素材类型" size="sm" />
    <YlfSegmentedControl v-model="view" :options="options" label="资源视图" size="sm" icon-only>
      <template #icon="{ option }">
        <i :class="icons[option.value]" />
      </template>
    </YlfSegmentedControl>
  </div>
</template>
