<script setup lang="ts">
import type { DemoScenario } from './demo-agent'
import { computed, shallowRef, useId } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import YlfSelect from '../../../../vue/components/YlfSelect.vue'
import { useDocsLocale } from '../../composables/useDocsLocale'
import AgUiDemoSession from './AgUiDemoSession.vue'
import { demoScenarios, getDemoScenario } from './demo-scenarios'
import 'vitepress-theme-yunlefun/workbench.css'

const scenarioId = useId()
const { english, text } = useDocsLocale()
const scenario = shallowRef<DemoScenario>('tool')
const generation = shallowRef(0)
const scenarios = computed(() => demoScenarios.map(item => getDemoScenario(item.id, english.value)))
const description = computed(() => scenarios.value.find(item => item.value === scenario.value)?.description)
</script>

<template>
  <section class="ag-ui-demo ylf-workbench" :aria-label="text('AG-UI 交互演示', 'AG-UI interactive demo')">
    <div class="demo-toolbar">
      <div class="scenario-label">
        <label :for="scenarioId">{{ text('选择示例', 'Choose an example') }} · {{ scenarios.length }}</label>
        <YlfSelect :id="scenarioId" v-model="scenario" :options="scenarios" class="scenario-select" />
      </div>
      <YlfButton size="sm" variant="secondary" @click="generation++">
        {{ text('重置示例', 'Reset example') }}
      </YlfButton>
    </div>
    <p class="scenario-description">
      {{ description }}
    </p>
    <p class="demo-note">
      {{ text('本地协议演示 · 固定示例回复，无需密钥，不调用模型或发送网络请求', 'Local protocol demo · Scripted replies, no API key, model call or network request') }}
    </p>
    <AgUiDemoSession :key="`${scenario}-${generation}-${english}`" :scenario="scenario" :english="english" />
  </section>
</template>

<style scoped>
.ag-ui-demo {
  margin: 24px 0;
}
.demo-toolbar {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
}
.scenario-label {
  display: grid;
  min-width: 0;
  max-width: 100%;
  gap: 6px;
  font-size: 13px;
}
.scenario-select {
  min-width: 0;
  max-width: 100%;
}
.scenario-description {
  margin-bottom: 8px;
}
.demo-note {
  color: var(--ylf-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}
</style>
