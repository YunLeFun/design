<script setup lang="ts">
import { ref, useId } from 'vue'

const name = ref('')
const id = useId()
</script>

<template>
  <div class="grid max-w-sm w-full gap-4">
    <label :for="id" class="grid gap-2">
      名称
      <YlfInput :id="id" v-model="name" name="name" autocomplete="name" placeholder="输入名称" />
    </label>
    <YlfInput size="sm" aria-label="紧凑输入" placeholder="紧凑输入" />
    <YlfInput model-value="只读内容" aria-label="只读内容" readonly />
    <YlfInput model-value="暂不可用" aria-label="暂不可用" disabled />
    <div class="grid gap-2">
      <YlfInput invalid aria-label="名称" :aria-describedby="`${id}-error`" />
      <span :id="`${id}-error`" class="text-sm text-[var(--ylf-status-danger-text)]">请输入名称。</span>
    </div>
  </div>
</template>
