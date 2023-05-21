<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue'
import { components } from '@yunlefun/metadata'

const props = defineProps<{ comp: string }>()
const info = computed(() => components.find(i => i.name === props.comp))
const lastUpdated = useTimeAgo(new Date(info.value?.lastUpdated || 0))
</script>

<template>
  <div class="grid grid-cols-[100px_auto] gap-2 text-sm mt-4 mb-8 items-start">
    <template v-if="info?.lastUpdated">
      <div opacity="50">
        Last Changed
      </div>
      <div>{{ lastUpdated }}</div>
    </template>
  </div>
</template>
