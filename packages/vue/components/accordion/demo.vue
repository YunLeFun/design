<script setup lang="ts">
const items = [
  { value: 'a', title: '什么是云乐坊 UI？', content: '以「云」与极光为灵魂的组件库，让每个子应用都属于同一片天空。' },
  { value: 'b', title: '为什么基于 reka-ui？', content: 'reka 管行为与可访问性，我们只管皮肤——省心，且无障碍达标。' },
  { value: 'c', title: '支持暗色吗？', content: '晴空白与深蓝夜空两套中性色，token 驱动，零配置随主题切换。' },
]
</script>

<template>
  <YlfAccordion :items="items" />
</template>
