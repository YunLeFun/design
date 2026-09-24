<script setup lang="ts">
import { ref } from 'vue'

const brand = ref(true)
const accent = ref(true)
const small = ref(false)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="brand" aria-label="主色开关" />
        <span class="text-sm">brand 实色</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="accent" aria-label="青色开关" variant="accent" tone="cyan" />
        <span class="text-sm">accent 青色</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="small" aria-label="小号开关" size="sm" />
        <span class="text-sm">small</span>
      </div>
      <div class="flex items-center gap-2 op-60">
        <YlfSwitch :model-value="true" aria-label="禁用开关" disabled />
        <span class="text-sm">disabled</span>
      </div>
    </div>
    <p class="text-sm op-70">
      当前：brand = {{ brand }} · accent = {{ accent }}
    </p>
  </div>
</template>
