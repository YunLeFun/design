<script setup lang="ts">
import { shallowRef } from 'vue'
import YlfAiPromptLauncher from '../YlfAiPromptLauncher.vue'

const prompt = shallowRef('请帮我把这段话写得更清楚：今天做一个让人开心的小作品。')
</script>

<template>
  <div>
    <label for="ai-launcher-demo-prompt">想交给 AI 的提示词</label>
    <textarea id="ai-launcher-demo-prompt" v-model="prompt" rows="3" style="display: block; width: 100%; padding: 12px; border: 1px solid var(--ylf-c-border); border-radius: 12px; font: inherit;" />
    <YlfAiPromptLauncher :prompt="prompt" />
  </div>
</template>
