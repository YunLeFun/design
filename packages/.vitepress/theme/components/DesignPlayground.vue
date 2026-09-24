<script setup lang="ts">
import type { YlfAccentTone, YlfColorAppearance } from '../../../vue/components/theme'
import { ConfigProvider } from 'reka-ui'
import { computed, shallowRef, useId } from 'vue'
import YlfBadge from '../../../vue/components/YlfBadge.vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfCard from '../../../vue/components/YlfCard.vue'
import YlfSelect from '../../../vue/components/YlfSelect.vue'
import YlfSwitch from '../../../vue/components/YlfSwitch.vue'

const tones: { value: YlfAccentTone, label: string, color: string }[] = [
  { value: 'blue', label: '晴空蓝', color: 'var(--ylf-accent-blue)' },
  { value: 'sun', label: '明黄', color: 'var(--ylf-accent-sun)' },
  { value: 'cyan', label: '青色', color: 'var(--ylf-accent-cyan)' },
  { value: 'coral', label: '珊瑚橙', color: 'var(--ylf-accent-coral)' },
  { value: 'pink', label: '桃粉', color: 'var(--ylf-accent-pink)' },
  { value: 'green', label: '鲜绿', color: 'var(--ylf-accent-green)' },
]
const appearances: { value: YlfColorAppearance, label: string }[] = [
  { value: 'solid', label: '实色' },
  { value: 'soft', label: '柔色' },
  { value: 'outline', label: '描边' },
]
const night = shallowRef(false)
const tone = shallowRef<YlfAccentTone>('blue')
const appearance = shallowRef<YlfColorAppearance>('solid')
const toneLabel = computed(() => tones.find(item => item.value === tone.value)!.label)
const nightId = useId()
const toneId = useId()
const appearanceId = useId()
const portalTargetId = `ylf-playground-portal-${useId()}`
const portalTargetSelector = `#${portalTargetId}`

function nextTone() {
  tone.value = tones[(tones.findIndex(item => item.value === tone.value) + 1) % tones.length].value
}

function resetAppearance() {
  night.value = false
  tone.value = 'blue'
  appearance.value = 'solid'
}
</script>

<template>
  <section class="design-playground" :class="night ? 'ylf-theme-dark' : 'ylf-theme-light'" aria-label="设计主题交互预览">
    <div class="design-playground__sky ylf-pattern-sky">
      <div class="design-playground__grid ylf-pattern-grid" aria-hidden="true" />
      <svg class="design-playground__cloud" viewBox="0 0 400 150" fill="currentColor" aria-hidden="true">
        <path d="M0 150V117c20-29 58-29 80-7 1-29 25-52 55-48 13-41 76-51 104-14 39-11 65 11 68 42 44-15 81 11 93 33v27Z" />
      </svg>
      <div class="design-playground__caption">
        <span :class="night ? 'i-ri-moon-clear-line' : 'i-ri-sun-line'" aria-hidden="true" />
        <span>{{ night ? '夜空，也清晰' : '今天，晴空正好' }}</span>
      </div>
    </div>
    <div :id="portalTargetId" class="design-playground__portal vp-raw" />
    <ConfigProvider :teleport-to="portalTargetSelector">
      <YlfCard class="design-playground__card" :hoverable="false" variant="tinted" :tone="tone" padding="var(--ylf-space-6)">
        <div class="design-playground__heading">
          <h2>一点轻盈，恰到好处</h2>
          <YlfBadge variant="accent" :tone="tone" :appearance="appearance">
            {{ toneLabel }}
          </YlfBadge>
        </div>
        <p>试着切换外观，看看同一组组件的不同表情。</p>
        <div class="design-playground__setting">
          <label :for="nightId">夜空模式</label>
          <YlfSwitch :id="nightId" v-model="night" />
        </div>
        <div class="design-playground__setting">
          <label :for="toneId">强调色</label>
          <YlfSelect :id="toneId" v-model="tone" :options="tones" class="design-playground__select" />
        </div>
        <div class="design-playground__setting">
          <label :for="appearanceId">强调样式</label>
          <YlfSelect :id="appearanceId" v-model="appearance" :options="appearances" class="design-playground__select" />
        </div>
        <div class="design-playground__actions">
          <YlfButton variant="accent" :tone="tone" :appearance="appearance" @click="nextTone">
            换个颜色
          </YlfButton>
          <YlfButton variant="ghost" @click="resetAppearance">
            重置
          </YlfButton>
        </div>
      </YlfCard>
    </ConfigProvider>
    <p class="design-playground__footnote">
      真实组件 · 即刻体验
    </p>
  </section>
</template>

<style scoped>
.design-playground {
  position: relative;
  isolation: isolate;
  min-width: 0;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius-xl);
  background: var(--ylf-c-bg-soft);
  color: var(--ylf-c-text);
  transition: background-color var(--ylf-duration-normal) var(--ylf-ease-standard);
}
.design-playground__sky {
  position: relative;
  height: 195px;
  overflow: hidden;
  border-radius: var(--ylf-radius-xl) var(--ylf-radius-xl) 0 0;
}
.design-playground__portal {
  display: contents;
}
.design-playground__grid {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(#000, transparent);
}
.design-playground__cloud {
  position: absolute;
  width: 100%;
  height: 150px;
  bottom: 0;
  color: var(--ylf-c-cloud);
}
.design-playground__caption {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ylf-space-2);
  padding-top: 42px;
  color: var(--ylf-c-brand);
  font-size: var(--ylf-text-sm);
}
.design-playground__caption > span:first-child {
  font-size: 20px;
}
.design-playground__card {
  margin: -56px var(--ylf-space-6) 0;
}
.design-playground__heading {
  display: flex;
  gap: var(--ylf-space-2);
  align-items: center;
  justify-content: space-between;
}
.design-playground h2 {
  font-size: 18px;
  line-height: 1.5;
  font-weight: 600;
  margin: 0;
}
.design-playground__card > p {
  margin: var(--ylf-space-3) 0 var(--ylf-space-6);
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-sm);
  line-height: var(--ylf-leading-body);
}
.design-playground__setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ylf-space-3);
  min-height: 52px;
  font-size: var(--ylf-text-sm);
}
.design-playground__setting label {
  flex: 1;
  cursor: pointer;
}
.design-playground__setting :deep(.design-playground__select) {
  width: 132px;
  min-width: 0;
  max-width: 60%;
  font-size: var(--ylf-text-sm);
}
.design-playground__actions {
  display: flex;
  gap: var(--ylf-space-2);
  padding-top: var(--ylf-space-6);
  margin-top: var(--ylf-space-3);
  border-top: 1px solid var(--ylf-c-border);
}
.design-playground__footnote {
  margin: var(--ylf-space-4) 0;
  text-align: center;
  color: var(--ylf-c-text-3);
  font-size: var(--ylf-text-xs);
}
@media (min-width: 768px) and (max-width: 959px), (max-width: 400px) {
  .design-playground__card {
    margin-inline: var(--ylf-space-3);
    padding: var(--ylf-space-4) !important;
  }
  .design-playground h2 {
    font-size: 16px;
  }
}
</style>
