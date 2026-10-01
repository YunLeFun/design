<script setup lang="ts">
import YlfSegmentedControl from '@yunlefun/vue/components/YlfSegmentedControl.vue'
import { shallowRef } from 'vue'

const view = shallowRef<'grid' | 'list'>('grid')
const kind = shallowRef('all')
const options = [{ value: 'grid', label: 'Grid view' }, { value: 'list', label: 'List view' }] as const
const icons = { grid: 'i-ri-grid-line', list: 'i-ri-list-check' }
const kinds = [{ value: 'all', label: 'All', count: 24 }, { value: 'image', label: 'Images', count: 18 }, { value: 'video', label: 'Videos', count: 6 }]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <YlfSegmentedControl v-model="kind" :options="kinds" label="Media type" size="sm" />
    <YlfSegmentedControl v-model="view" :options="options" label="Resource view" size="sm" icon-only>
      <template #icon="{ option }">
        <i :class="icons[option.value]" />
      </template>
    </YlfSegmentedControl>
  </div>
</template>
