<script setup lang="ts">
import type { YlfAccentTone, YlfColorAppearance } from '../../../vue/components/theme'
import { ConfigProvider } from 'reka-ui'
import { useData } from 'vitepress'
import { computed, onMounted, shallowRef, useId } from 'vue'
import YlfBadge from '../../../vue/components/YlfBadge.vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfCard from '../../../vue/components/YlfCard.vue'
import YlfDialog from '../../../vue/components/YlfDialog.vue'
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
const { isDark } = useData()
// 云景配色跟随全局 CSS，挂载后再读取主题偏好以保持 SSR 标记一致。
const isMounted = shallowRef(false)
const night = computed({
  get: () => isMounted.value && isDark.value,
  set: (value: boolean) => {
    isDark.value = value
  },
})

onMounted(() => {
  isMounted.value = true
})
const tone = shallowRef<YlfAccentTone>('blue')
const appearance = shallowRef<YlfColorAppearance>('solid')
const dialogOpen = shallowRef(false)
const cloudFillId = `ylf-cloud-fill-${useId()}`
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
  <section class="design-playground" aria-label="设计主题交互预览">
    <div class="design-playground__sky ylf-pattern-sky">
      <div class="design-playground__grid ylf-pattern-grid" aria-hidden="true" />
      <div class="design-playground__sun" aria-hidden="true" />
      <svg class="design-playground__cloud" viewBox="0 0 400 220" fill="none" aria-hidden="true">
        <defs>
          <linearGradient :id="cloudFillId" x1="200" y1="60" x2="210" y2="190" gradientUnits="userSpaceOnUse">
            <stop stop-color="var(--ylf-c-cloud)" />
            <stop offset="1" stop-color="var(--ylf-c-sky)" />
          </linearGradient>
        </defs>
        <path d="M102 181c-30 0-53-21-53-48 0-28 24-50 53-50 7 0 14 1 20 4 5-36 35-62 72-62 36 0 66 25 72 58 8-3 17-5 26-5 34 0 61 24 61 53 0 28-26 50-58 50H102Z" :fill="`url(#${cloudFillId})`" stroke="var(--ylf-c-highlight)" stroke-width="1.5" />
        <path d="M83 102c7-5 15-7 23-7m33-12c8-25 28-42 56-42" stroke="var(--ylf-c-highlight)" stroke-width="4" stroke-linecap="round" />
      </svg>
      <div class="design-playground__caption">
        <span :class="night ? 'i-ri-moon-clear-line' : 'i-ri-sun-line'" aria-hidden="true" />
        <span>{{ night ? '灵感在夜空继续' : '今天，晴空正好' }}</span>
      </div>
    </div>
    <div :id="portalTargetId" class="design-playground__portal vp-raw" />
    <ConfigProvider :teleport-to="portalTargetSelector">
      <YlfCard class="design-playground__card" :hoverable="false" variant="glass" :tone="tone" padding="var(--ylf-space-6)">
        <div class="design-playground__heading">
          <h2>把晴空握在手里</h2>
          <YlfBadge variant="accent" :tone="tone" :appearance="appearance">
            {{ toneLabel }}
          </YlfBadge>
        </div>
        <p>从光线到触感，试试属于你的云端界面。</p>
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
          <YlfDialog v-model:open="dialogOpen" title="灵感，轻轻落在云端" description="细腻的光线与清晰的层次，让每一次交互都更从容。">
            <template #trigger>
              <YlfButton variant="secondary">
                体验浮层
              </YlfButton>
            </template>
            <div class="design-playground__dialog-scene" aria-hidden="true">
              <span class="i-ri-cloud-line" />
            </div>
            <div class="design-playground__dialog-actions">
              <YlfButton block @click="dialogOpen = false">
                继续探索
              </YlfButton>
            </div>
          </YlfDialog>
          <YlfButton variant="ghost" @click="resetAppearance">
            重置
          </YlfButton>
        </div>
      </YlfCard>
    </ConfigProvider>
  </section>
</template>

<style scoped>
.design-playground {
  position: relative;
  isolation: isolate;
  min-width: 0;
  padding-bottom: 1px;
  color: var(--ylf-c-text);
}
.design-playground__sky {
  position: relative;
  height: 330px;
  overflow: hidden;
  border: 1px solid var(--ylf-c-border);
  border-radius: 120px 120px 32px 32px;
  background-color: var(--ylf-c-sky);
  background-image: radial-gradient(ellipse at 50% 0%, var(--ylf-c-bg) 0, transparent 75%);
  box-shadow: inset 0 1px 0 var(--ylf-c-highlight);
}
.dark .design-playground__sky {
  --ylf-c-sky: #112539;
  --ylf-c-cloud: #233b51;
  --ylf-c-highlight: rgba(203, 229, 249, 0.17);

  background-color: #080f1c;
  background-image:
    radial-gradient(ellipse at 80% 22%, rgba(129, 185, 211, 0.12), transparent 52%),
    linear-gradient(165deg, #080f1c 15%, #102438 70%, #193b50);
}
.dark .design-playground__sky::after {
  content: '';
  position: absolute;
  top: 78px;
  left: 74px;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(217, 236, 252, 0.7);
  box-shadow:
    68px -24px 0 -0.25px rgba(217, 236, 252, 0.45),
    131px 18px 0 -0.5px rgba(217, 236, 252, 0.5),
    -25px 53px 0 -0.25px rgba(217, 236, 252, 0.4),
    183px 58px 0 -0.5px rgba(217, 236, 252, 0.35),
    229px -28px 0 -0.25px rgba(217, 236, 252, 0.45);
  pointer-events: none;
}
.design-playground__portal {
  display: contents;
}
.design-playground__grid {
  position: absolute;
  inset: 0;
  opacity: 0.65;
  mask-image: linear-gradient(transparent, #000 35%, transparent);
}
.dark .design-playground__grid {
  opacity: 0.18;
}
.design-playground__sun {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 58px;
  right: 58px;
  border: 1px solid color-mix(in srgb, var(--ylf-accent-sun) 75%, #fff);
  border-radius: 50%;
  background: var(--ylf-accent-sun);
  box-shadow:
    inset 0 3px 4px rgba(255, 255, 255, 0.5),
    0 0 0 14px color-mix(in srgb, var(--ylf-accent-sun) 10%, transparent),
    0 0 0 30px color-mix(in srgb, var(--ylf-accent-sun) 5%, transparent);
  transition:
    background var(--ylf-duration-normal),
    box-shadow var(--ylf-duration-normal),
    transform var(--ylf-duration-normal);
}
.dark .design-playground__sun {
  background: linear-gradient(145deg, #f5faff, #b3cde5);
  border-color: transparent;
  box-shadow: none;
  mask-image: radial-gradient(circle 42px at 68% 32%, transparent 97%, #000 100%);
  transform: rotate(-12deg);
}
.design-playground__cloud {
  position: absolute;
  width: 100%;
  height: 245px;
  top: 59px;
  left: -18px;
  filter: drop-shadow(0 14px 9px color-mix(in srgb, var(--ylf-c-brand) 14%, transparent));
}
.design-playground__caption {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  margin: 24px auto 0;
  padding: 7px 13px;
  border: 1px solid var(--ylf-glass-border);
  border-radius: var(--ylf-radius-pill);
  background: var(--ylf-glass-bg);
  color: var(--ylf-c-text-2);
  font-size: 12px;
  backdrop-filter: var(--ylf-glass-blur);
}
.design-playground__caption > span:first-child {
  font-size: 16px;
  color: var(--ylf-c-brand);
}
.design-playground__card {
  position: relative;
  margin: -91px 22px 0;
  border-radius: 22px;
  border-color: color-mix(in srgb, var(--ylf-accent) 25%, var(--ylf-c-border));
}
.design-playground__heading {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}
.design-playground h2 {
  margin: 0;
  font: 650 20px/1.5 var(--ylf-font-heading);
  letter-spacing: -0.025em;
}
.design-playground__card > p {
  margin: 8px 0 22px;
  color: var(--ylf-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}
.design-playground__setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  font-size: 14px;
}
.design-playground__setting + .design-playground__setting {
  border-top: 1px solid color-mix(in srgb, var(--ylf-c-border) 60%, transparent);
}
.design-playground__setting label {
  flex: 1;
  cursor: pointer;
}
.design-playground__setting :deep(.design-playground__select) {
  width: 140px;
  min-width: 0;
  max-width: 60%;
  font-size: 14px;
}
.design-playground__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 22px;
  margin-top: 10px;
  border-top: 1px solid var(--ylf-c-border);
}
.design-playground__actions :deep(.ylf-button) {
  padding-inline: 18px;
  font-size: 13px;
}
.design-playground__actions :deep(.ylf-button--ghost) {
  margin-left: auto;
  padding-inline: 8px;
}
.design-playground__dialog-scene {
  display: grid;
  place-items: center;
  height: 128px;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius);
  background: var(--ylf-c-sky);
  color: var(--ylf-c-brand);
  box-shadow: var(--ylf-shadow-inset);
}
.design-playground__dialog-scene span {
  font-size: 72px;
  filter: drop-shadow(0 8px 4px color-mix(in srgb, var(--ylf-c-brand) 20%, transparent));
}
.design-playground__dialog-actions {
  margin-top: 24px;
}
@media (min-width: 768px) and (max-width: 959px), (max-width: 400px) {
  .design-playground__card {
    margin-inline: 10px;
    padding: 20px !important;
  }
  .design-playground h2 {
    font-size: 17px;
  }
  .design-playground__sun {
    right: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .design-playground__sun {
    transition: none;
  }
}
</style>
