<script setup lang="ts">
import { shallowRef } from 'vue'

const continued = shallowRef(false)
</script>

<template>
  <YlfAgentTask title="Current task" :state="continued ? 'working' : 'waiting'" :status-label="continued ? 'Running' : 'Awaiting approval'" task-id="task-20261006-001" description="Review the requested action before continuing.">
    <template #actions>
      <YlfButton :disabled="continued" @click="continued = true">
        Continue
      </YlfButton>
    </template>
  </YlfAgentTask>
</template>
