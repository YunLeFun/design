<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('cloud')
const items = [
  { label: 'Cloud', value: 'cloud' },
  { label: 'Fun', value: 'fun' },
  { label: 'Studio', value: 'studio' },
]
</script>

<template>
  <YlfTabs v-model="tab" :items="items">
    <template #cloud>
      <p class="m-0 text-sm">
        Cloud: a little sky for YunLeFun.
      </p>
    </template>
    <template #fun>
      <p class="m-0 text-sm">
        Fun: colorful, cheerful and confident.
      </p>
    </template>
    <template #studio>
      <p class="m-0 text-sm">
        Studio: one shared component workshop.
      </p>
    </template>
  </YlfTabs>
</template>
