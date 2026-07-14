<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('iris')
const options = [
  { label: '晴空蓝', value: 'sky' },
  { label: '鸢尾紫', value: 'iris' },
  { label: '兰紫粉', value: 'pink' },
  { label: '禁用项', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <YlfRadioGroup v-model="picked" :options="options" orientation="horizontal" />
    <p class="text-sm op-70">
      当前：{{ picked }}
    </p>
  </div>
</template>
