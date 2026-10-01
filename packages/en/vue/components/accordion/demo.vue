<script setup lang="ts">
const items = [
  { value: 'a', title: 'What is YunLeFun Design?', content: 'A shared system of guidelines, brand visuals and UI, with sky blue and vivid accents.' },
  { value: 'b', title: 'Why Reka UI?', content: 'Reka UI provides keyboard, focus and ARIA behavior; YunLeFun adds product APIs and themes. Each wrapped scenario is verified.' },
  { value: 'c', title: 'Does it support dark mode?', content: 'Token driven neutral surfaces follow daylight and night themes.' },
]
</script>

<template>
  <YlfAccordion :items="items" />
</template>
