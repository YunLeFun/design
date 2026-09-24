<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
function step(d: number) {
  value.value = Math.max(0, Math.min(100, value.value + d))
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <YlfProgress :value="value" aria-label="主色进度" />
    <YlfProgress :value="value" variant="accent" tone="green" aria-label="完成进度" />
    <div class="flex items-center gap-3">
      <YlfButton size="sm" variant="secondary" @click="step(-10)">
        −10
      </YlfButton>
      <YlfButton size="sm" variant="primary" @click="step(10)">
        +10
      </YlfButton>
      <span class="text-sm op-70">{{ value }}%</span>
    </div>
  </div>
</template>
