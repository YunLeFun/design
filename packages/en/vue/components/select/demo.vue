<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('')
const options = [
  { label: 'Sky blue', value: 'blue', color: 'var(--ylf-accent-blue)' },
  { label: 'Sun yellow', value: 'sun', color: 'var(--ylf-accent-sun)' },
  { label: 'Pink', value: 'pink', color: 'var(--ylf-accent-pink)' },
  { label: 'Unavailable', value: 'x', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <YlfSelect v-model="picked" :options="options" placeholder="Choose a color" />
    <p class="text-sm op-70">
      Current: {{ picked || '(not selected)' }}
    </p>
  </div>
</template>
