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
import { useAppearanceTransition } from '../composables/useAppearanceTransition'
import { useDocsLocale } from '../composables/useDocsLocale'
import DesignCloud from './DesignCloud.vue'

const { text } = useDocsLocale()
const tones = computed<{ value: YlfAccentTone, label: string, color: string }[]>(() => [
  { value: 'blue', label: text('晴空蓝', 'Sky blue'), color: 'var(--ylf-accent-blue)' },
  { value: 'sun', label: text('明黄', 'Sun yellow'), color: 'var(--ylf-accent-sun)' },
  { value: 'cyan', label: text('青色', 'Cyan'), color: 'var(--ylf-accent-cyan)' },
  { value: 'coral', label: text('珊瑚橙', 'Coral'), color: 'var(--ylf-accent-coral)' },
  { value: 'pink', label: text('桃粉', 'Pink'), color: 'var(--ylf-accent-pink)' },
  { value: 'green', label: text('鲜绿', 'Green'), color: 'var(--ylf-accent-green)' },
])
const appearances = computed<{ value: YlfColorAppearance, label: string }[]>(() => [
  { value: 'solid', label: text('实色', 'Solid') },
  { value: 'soft', label: text('柔色', 'Soft') },
  { value: 'outline', label: text('描边', 'Outline') },
])
const { isDark } = useData()
const { setAppearance, toggleAppearance } = useAppearanceTransition()
// 云景配色跟随全局 CSS，挂载后再读取主题偏好以保持 SSR 标记一致。
const isMounted = shallowRef(false)
const night = computed({
  get: () => isMounted.value && isDark.value,
  set: (value: boolean) => {
    setAppearance(value)
  },
})

onMounted(() => {
  isMounted.value = true
})
const tone = shallowRef<YlfAccentTone>('blue')
const appearance = shallowRef<YlfColorAppearance>('solid')
const dialogOpen = shallowRef(false)
const toneLabel = computed(() => tones.value.find(item => item.value === tone.value)!.label)
const nightId = useId()
const toneId = useId()
const appearanceId = useId()
const portalTargetId = `ylf-playground-portal-${useId()}`
const portalTargetSelector = `#${portalTargetId}`

function nextTone() {
  tone.value = tones.value[(tones.value.findIndex(item => item.value === tone.value) + 1) % tones.value.length].value
}

function resetAppearance() {
  night.value = false
  tone.value = 'blue'
  appearance.value = 'solid'
}
</script>

<template>
  <section class="design-playground" :aria-label="text('设计主题交互预览', 'Interactive design preview')">
    <div class="design-playground__sky">
      <div class="design-playground__day ylf-theme-light" aria-hidden="true" />
      <div class="design-playground__night" aria-hidden="true" />
      <div class="design-playground__grid ylf-pattern-grid" aria-hidden="true" />
      <div class="design-playground__celestial" aria-hidden="true">
        <div class="design-playground__sun ylf-theme-light" />
        <div class="design-playground__moon" />
      </div>
      <DesignCloud class="design-playground__cloud" />
      <div class="design-playground__caption">
        <span :class="night ? 'i-ri-moon-clear-line' : 'i-ri-sun-line'" aria-hidden="true" />
        <span>{{ night ? text('灵感在夜空继续', 'Ideas carry on after dark') : text('今天，晴空正好', 'A little sunshine today') }}</span>
      </div>
    </div>
    <div :id="portalTargetId" class="design-playground__portal vp-raw" />
    <ConfigProvider :teleport-to="portalTargetSelector">
      <YlfCard class="design-playground__card" :hoverable="false" variant="glass" :tone="tone" padding="var(--ylf-space-6)">
        <div class="design-playground__heading">
          <h2>{{ text('把晴空握在手里', 'Make the sky yours') }}</h2>
          <YlfBadge variant="accent" :tone="tone" :appearance="appearance">
            {{ toneLabel }}
          </YlfBadge>
        </div>
        <p>{{ text('从光线到触感，试试属于你的云端界面。', 'Explore the light, color and feel of your interface.') }}</p>
        <div class="design-playground__setting">
          <label :for="nightId">{{ text('夜空模式', 'Night sky') }}</label>
          <YlfSwitch :id="nightId" :model-value="night" @update:model-value="toggleAppearance" />
        </div>
        <div class="design-playground__setting">
          <label :for="toneId">{{ text('强调色', 'Accent color') }}</label>
          <YlfSelect :id="toneId" v-model="tone" :options="tones" class="design-playground__select" />
        </div>
        <div class="design-playground__setting">
          <label :for="appearanceId">{{ text('强调样式', 'Accent style') }}</label>
          <YlfSelect :id="appearanceId" v-model="appearance" :options="appearances" class="design-playground__select" />
        </div>
        <div class="design-playground__actions">
          <YlfButton variant="accent" :tone="tone" :appearance="appearance" @click="nextTone">
            {{ text('换个颜色', 'Next color') }}
          </YlfButton>
          <YlfDialog v-model:open="dialogOpen" :title="text('灵感，轻轻落在云端', 'Let inspiration land softly')" :description="text('细腻的光线与清晰的层次，让每一次交互都更从容。', 'Soft light and clear layers bring a little calm to every interaction.')" :close-label="text('关闭', 'Close')">
            <template #trigger>
              <YlfButton variant="secondary">
                {{ text('体验浮层', 'Try a dialog') }}
              </YlfButton>
            </template>
            <div class="design-playground__dialog-scene" aria-hidden="true">
              <span class="i-ri-cloud-line" />
            </div>
            <div class="design-playground__dialog-actions">
              <YlfButton block @click="dialogOpen = false">
                {{ text('继续探索', 'Keep exploring') }}
              </YlfButton>
            </div>
          </YlfDialog>
          <YlfButton variant="ghost" @click="resetAppearance">
            {{ text('重置', 'Reset') }}
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
  box-shadow: inset 0 1px 0 var(--ylf-c-highlight);
}
.design-playground__day,
.design-playground__night {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.design-playground__day {
  background-color: var(--ylf-c-sky);
  background-image: radial-gradient(ellipse at 50% 0%, var(--ylf-c-bg) 0, transparent 75%);
}
.design-playground__night {
  opacity: 0;
  background-color: #0d131b;
  background-image:
    radial-gradient(circle at 80% 32%, rgba(173, 191, 209, 0.13), transparent 36%),
    linear-gradient(165deg, #0d131b 15%, #16212c 65%, #253644);
}
.dark .design-playground__day {
  opacity: 0;
}
.dark .design-playground__night {
  opacity: 1;
}
.dark .design-playground__sky {
  border-color: rgba(148, 169, 192, 0.18);
  box-shadow: inset 0 1px 0 rgba(210, 226, 240, 0.1);
}
.design-playground__sky::after {
  content: '';
  position: absolute;
  top: 78px;
  left: 74px;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  opacity: 0;
  background: rgba(217, 236, 252, 0.7);
  box-shadow:
    68px -24px 0 -0.25px rgba(217, 236, 252, 0.45),
    131px 18px 0 -0.5px rgba(217, 236, 252, 0.5),
    -25px 53px 0 -0.25px rgba(217, 236, 252, 0.4),
    183px 58px 0 -0.5px rgba(217, 236, 252, 0.35),
    229px -28px 0 -0.25px rgba(217, 236, 252, 0.45);
  pointer-events: none;
}
.dark .design-playground__sky::after {
  opacity: 1;
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
  opacity: 0.1;
}
.design-playground__celestial {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 58px;
  right: 58px;
  pointer-events: none;
}
.design-playground__sun,
.design-playground__moon {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}
.design-playground__sun {
  border: 1px solid color-mix(in srgb, var(--ylf-accent-sun) 75%, #fff);
  background: var(--ylf-accent-sun);
  box-shadow:
    inset 0 3px 4px rgba(255, 255, 255, 0.5),
    0 0 0 14px color-mix(in srgb, var(--ylf-accent-sun) 10%, transparent),
    0 0 0 30px color-mix(in srgb, var(--ylf-accent-sun) 5%, transparent);
}
.dark .design-playground__sun {
  opacity: 0;
  transform: translateY(6px) scale(0.9);
}
.design-playground__moon {
  opacity: 0;
  background:
    radial-gradient(circle at 30% 80%, rgba(53, 69, 89, 0.28), transparent 50%),
    radial-gradient(circle at 65% 25%, #dbe5ee, #b4c4d4 55%, #738ba3);
  border-color: transparent;
  box-shadow: inset 2px -3px 5px rgba(34, 51, 71, 0.2);
  mask-image: radial-gradient(circle 42px at 68% 32%, transparent 97%, #000 100%);
  transform: translateY(10px) scale(0.9) rotate(-12deg);
}
.dark .design-playground__moon {
  opacity: 1;
  transform: rotate(-12deg);
}
.design-playground__moon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle 5px at 22% 52%, rgba(58, 77, 100, 0.24), transparent),
    radial-gradient(circle 3px at 17% 34%, rgba(58, 77, 100, 0.2), transparent),
    radial-gradient(circle 8px at 42% 80%, rgba(58, 77, 100, 0.19), transparent),
    radial-gradient(circle 4px at 61% 85%, rgba(58, 77, 100, 0.24), transparent);
  pointer-events: none;
}
.design-playground__cloud {
  position: absolute;
  width: 100%;
  height: 245px;
  top: 59px;
  left: -18px;
  /* 两端使用相同的 sRGB 色格式，避免 color-mix 与 rgba 插值时出现异色光晕。 */
  filter: drop-shadow(0 14px 9px rgba(58, 87, 122, 0.18));
}
.dark .design-playground__cloud {
  filter: drop-shadow(-8px 18px 10px rgba(2, 8, 16, 0.65));
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
  isolation: isolate;
  margin: -91px 22px 0;
  border-radius: 22px;
  border-color: color-mix(in srgb, var(--ylf-accent) 25%, var(--ylf-c-border));
}
.design-playground__card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 100% 0%, rgba(184, 205, 227, 0.06), transparent 55%),
    linear-gradient(150deg, rgba(31, 41, 58, 0.97), rgba(21, 29, 44, 0.98));
}
.dark .design-playground__card::before {
  opacity: 1;
}
.dark .design-playground__card {
  border-color: rgba(159, 178, 201, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(220, 232, 248, 0.12),
    0 -8px 18px -12px rgba(2, 7, 15, 0.9),
    0 8px 18px rgba(4, 9, 19, 0.3),
    -8px 28px 50px -14px rgba(4, 9, 19, 0.65);
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
  .design-playground__actions :deep(.ylf-button:not(.ylf-button--ghost)) {
    padding-inline: 12px;
  }
  .design-playground__celestial {
    right: 32px;
  }
}
</style>
