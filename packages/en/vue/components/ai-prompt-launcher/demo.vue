<script setup lang="ts">
import YlfAiPromptLauncher from '@yunlefun/vue/components/YlfAiPromptLauncher.vue'
import { shallowRef } from 'vue'

const prompt = shallowRef('Please clarify this sentence: Today I want to make something small that makes people happy.')
</script>

<template>
  <div>
    <label for="ai-launcher-demo-prompt">Your prompt for AI</label>
    <textarea id="ai-launcher-demo-prompt" v-model="prompt" rows="3" style="display: block; width: 100%; padding: 12px; border: 1px solid var(--ylf-c-border); border-radius: 12px; font: inherit;" />
    <YlfAiPromptLauncher :prompt="prompt" locale="en" />
  </div>
</template>
