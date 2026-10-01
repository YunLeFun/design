<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('iris')
const options = [
  { label: 'Sky blue', value: 'sky' },
  { label: 'Iris purple', value: 'iris' },
  { label: 'Orchid pink', value: 'pink' },
  { label: 'Disabled option', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <YlfRadioGroup v-model="picked" :options="options" orientation="horizontal" aria-label="Theme color" />
    <p class="text-sm op-70">
      Current: {{ picked }}
    </p>
  </div>
</template>
