<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { components } from '@yunlefun/metadata'
import { computed } from 'vue'

const props = defineProps<{ comp: string }>()
const info = computed(() => components.find(i => i.name === props.comp))
const lastUpdated = useTimeAgo(new Date(info.value?.lastUpdated || 0))
</script>

<template>
  <div class="component-info grid grid-cols-[100px_auto] mb-8 mt-4 items-start gap-2 text-sm">
    <template v-if="info?.lastUpdated">
      <div opacity="50">
        Last Changed
      </div>
      <div>{{ lastUpdated }}</div>
    </template>
  </div>
</template>
