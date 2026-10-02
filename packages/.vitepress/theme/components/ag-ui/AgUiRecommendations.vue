<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { DemoRecommendation } from './demo-types'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import YlfCard from '../../../../vue/components/YlfCard.vue'

defineProps<{ recommendations: readonly DeepReadonly<DemoRecommendation>[], selected?: string, disabled: boolean, english: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <section class="recommendations" :aria-label="english ? 'Palette recommendations' : '配色推荐'">
    <h3 class="recommendations-heading">
      {{ english ? 'Choose your palette' : '选择喜欢的配色' }}
    </h3>
    <div class="recommendations-grid">
      <YlfCard v-for="item in recommendations" :key="item.id" class="recommendation" :class="{ 'is-selected': selected === item.id }" :data-recommendation="item.id" :tone="item.tone" variant="tinted" padding="16px" :hoverable="false">
        <div class="palette-swatches" :aria-label="item.colors.join(', ')">
          <span v-for="color in item.colors" :key="color" class="palette-swatch" :style="{ backgroundColor: color }" />
        </div>
        <h4 class="recommendation-title">
          {{ item.title }}
        </h4>
        <p class="recommendation-description">
          {{ item.description }}
        </p>
        <YlfButton size="sm" variant="accent" appearance="outline" :tone="item.tone" :disabled="disabled" :aria-pressed="selected === item.id" @click="emit('select', item.id)">
          {{ selected === item.id ? (english ? 'Selected' : '已选择') : (english ? 'Choose palette' : '选择配色') }}
        </YlfButton>
      </YlfCard>
    </div>
  </section>
</template>

<style scoped>
.recommendations-heading {
  margin: 0 0 14px;
  font-size: 16px;
}
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.recommendation {
  display: flex;
  align-items: start;
  flex-direction: column;
  min-width: 0;
}
.recommendation.is-selected {
  outline: 2px solid var(--ylf-accent, var(--ylf-c-brand));
  outline-offset: 3px;
}
.palette-swatches {
  display: flex;
  width: 100%;
  height: 40px;
  overflow: hidden;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius-sm);
}
.palette-swatch {
  flex: 1;
}
.recommendation-title {
  margin: 14px 0 6px;
  font-size: 14px;
}
.recommendation-description {
  flex: 1;
  margin: 0 0 14px;
  color: var(--ylf-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}
@media (max-width: 640px) {
  .recommendations-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
