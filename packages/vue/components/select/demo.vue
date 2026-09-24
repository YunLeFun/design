<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('')
const options = [
  { label: '晴空蓝', value: 'blue', color: 'var(--ylf-accent-blue)' },
  { label: '明黄', value: 'sun', color: 'var(--ylf-accent-sun)' },
  { label: '桃粉', value: 'pink', color: 'var(--ylf-accent-pink)' },
  { label: '暂不可选', value: 'x', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <YlfSelect v-model="picked" :options="options" placeholder="选择一种颜色" />
    <p class="text-sm op-70">
      当前：{{ picked || '（未选）' }}
    </p>
  </div>
</template>
