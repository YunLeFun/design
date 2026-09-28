<script setup lang="ts">
import { ref } from 'vue'

const view = ref<'grid' | 'list'>('grid')
const viewOptions = [{ value: 'grid', label: '网格' }, { value: 'list', label: '列表' }] as const
</script>

<template>
  <main>
    <YlfButton>Nuxt 4 ready</YlfButton>
    <YlfButton variant="accent" tone="coral">
      开始体验
    </YlfButton>
    <YlfBadge variant="featured">
      精选
    </YlfBadge>
    <YlfCard variant="accent" tone="cyan" :hoverable="false">
      共享色彩
    </YlfCard>
    <YlfSegmentedControl v-model="view" :options="viewOptions" label="资源视图" size="sm" />
    <YlfSelect v-model="view" :options="viewOptions" aria-label="资源视图" size="sm" />
  </main>
</template>
