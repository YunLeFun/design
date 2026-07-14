<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('cloud')
const items = [
  { label: '云', value: 'cloud' },
  { label: '乐', value: 'fun' },
  { label: '坊', value: 'studio' },
]
</script>

<template>
  <YlfTabs v-model="tab" :items="items">
    <template #cloud>
      <p class="m-0 text-sm">
        云：一片属于云乐坊的天空。
      </p>
    </template>
    <template #fun>
      <p class="m-0 text-sm">
        乐：缤纷多彩，明快而笃定。
      </p>
    </template>
    <template #studio>
      <p class="m-0 text-sm">
        坊：一套统一的组件工坊。
      </p>
    </template>
  </YlfTabs>
</template>
