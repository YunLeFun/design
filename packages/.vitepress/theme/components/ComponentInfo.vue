<script setup lang="ts">
import { components } from '@yunlefun/metadata'
import { computed } from 'vue'

const props = defineProps<{ comp: string }>()
const info = computed(() => components.find(i => i.name === props.comp))
// 文档是静态生成的，绝对日期不会随访问时间变化而产生 hydration 差异。
const lastUpdated = computed(() => info.value?.lastUpdated
  ? new Date(info.value.lastUpdated).toISOString()
  : undefined)
</script>

<template>
  <div class="component-info grid grid-cols-[100px_auto] mb-8 mt-4 items-start gap-2 text-sm">
    <template v-if="lastUpdated">
      <div opacity="50">
        更新日期
      </div>
      <time :datetime="lastUpdated" :title="lastUpdated">{{ lastUpdated.slice(0, 10) }} UTC</time>
    </template>
  </div>
</template>
