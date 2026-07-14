<script setup lang="ts">
import { ref } from 'vue'

const a = ref(true)
const b = ref(false)
const c = ref<boolean | 'indeterminate'>('indeterminate')
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <YlfCheckbox v-model="a" />
      <span class="text-sm">已勾选</span>
    </div>
    <div class="flex items-center gap-2">
      <YlfCheckbox v-model="b" />
      <span class="text-sm">未勾选</span>
    </div>
    <div class="flex items-center gap-2">
      <YlfCheckbox v-model="c" />
      <span class="text-sm">半选 indeterminate</span>
    </div>
    <div class="flex items-center gap-2 op-60">
      <YlfCheckbox :model-value="true" disabled />
      <span class="text-sm">禁用</span>
    </div>
  </div>
</template>
