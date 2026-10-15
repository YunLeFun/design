<script setup lang="ts">
import { ref, useId } from 'vue'

const name = ref('')
const id = useId()
</script>

<template>
  <div class="grid max-w-sm w-full gap-4">
    <label :for="id" class="grid gap-2">
      Name
      <YlfInput :id="id" v-model="name" name="name" autocomplete="name" placeholder="Your name" />
    </label>
    <YlfInput size="sm" aria-label="Compact field" placeholder="Compact field" />
    <YlfInput model-value="Read-only value" aria-label="Read-only value" readonly />
    <YlfInput model-value="Unavailable" aria-label="Unavailable" disabled />
    <div class="grid gap-2">
      <YlfInput invalid aria-label="Name" :aria-describedby="`${id}-error`" />
      <span :id="`${id}-error`" class="text-sm text-[var(--ylf-status-danger-text)]">Please enter a name.</span>
    </div>
  </div>
</template>
