<script setup lang="ts">
const items = [
  { value: 'a', title: '什么是 YunLeFun Design？', content: '云乐坊设计系统，统一设计规范、品牌视觉与 UI 实现；默认晴空蓝为主，高饱和纯色点缀。' },
  { value: 'b', title: '为什么基于 reka-ui？', content: 'Reka UI 提供键盘、焦点和 ARIA 行为，云乐坊提供产品接口与主题；封装后的场景仍需逐项验收。' },
  { value: 'c', title: '支持暗色吗？', content: '晴空白与深蓝夜空两套中性色，token 驱动，零配置随主题切换。' },
]
</script>

<template>
  <YlfAccordion :items="items" />
</template>
