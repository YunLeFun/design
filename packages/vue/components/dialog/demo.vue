<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <YlfDialog
    v-model:open="open"
    title="云端之上"
    description="这是一个基于 reka-ui 的对话框：自带遮罩、焦点陷阱、ESC / 点击外部关闭、滚动锁与 aria 关联。"
  >
    <template #trigger>
      <YlfButton variant="primary">
        打开对话框
      </YlfButton>
    </template>

    <div class="flex flex-col gap-4">
      <p class="text-sm">
        行为由 reka-ui 提供，皮肤是云乐坊 token —— 试试按 <kbd>Esc</kbd> 或点击遮罩关闭。
      </p>
      <div class="flex justify-end gap-2">
        <YlfButton variant="secondary" size="sm" @click="open = false">
          取消
        </YlfButton>
        <YlfButton variant="primary" size="sm" @click="open = false">
          确定
        </YlfButton>
      </div>
    </div>
  </YlfDialog>
</template>
