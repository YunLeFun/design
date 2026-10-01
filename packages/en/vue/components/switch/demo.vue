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
        <YlfSwitch v-model="brand" aria-label="Brand switch" />
        <span class="text-sm">brand solid</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="accent" aria-label="Cyan switch" variant="accent" tone="cyan" />
        <span class="text-sm">accent cyan</span>
      </div>
      <div class="flex items-center gap-2">
        <YlfSwitch v-model="small" aria-label="Small switch" size="sm" />
        <span class="text-sm">small</span>
      </div>
      <div class="flex items-center gap-2 op-60">
        <YlfSwitch :model-value="true" aria-label="Disabled switch" disabled />
        <span class="text-sm">disabled</span>
      </div>
    </div>
    <p class="text-sm op-70">
      Current: brand = {{ brand }} · accent = {{ accent }}
    </p>
  </div>
</template>
