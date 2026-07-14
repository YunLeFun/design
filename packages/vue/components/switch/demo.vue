<script setup lang="ts">
import { ref } from 'vue'

const brand = ref(true)
const aurora = ref(true)
const small = ref(false)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="brand" />
        <span class="text-sm">brand 实色</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="aurora" variant="aurora" />
        <span class="text-sm">aurora 极光</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="small" size="sm" />
        <span class="text-sm">small</span>
      </div>
      <div class="flex items-center gap-2 op-60">
        <YlfSwitch :model-value="true" disabled />
        <span class="text-sm">disabled</span>
      </div>
    </div>
    <p class="text-sm op-70">
      当前：brand = {{ brand }} · aurora = {{ aurora }}
    </p>
  </div>
</template>
