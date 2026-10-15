<script setup lang="ts">
import type { DemoPreviewScheme } from '../composables/useDemoPreview'
import { ConfigProvider } from 'reka-ui'
import { useData } from 'vitepress'
import { onErrorCaptured, onMounted, ref, useId, watch } from 'vue'
import { useDemoPreview } from '../composables/useDemoPreview'
import { useDocsLocale } from '../composables/useDocsLocale'
import DemoToolbar from './DemoToolbar.vue'

defineProps<{
  name: string
  source: string
}>()

const { text } = useDocsLocale()
const error = ref<Error | null>(null)
const sourceId = `ylf-demo-source-${useId()}`
const portalTargetId = `ylf-demo-portal-${useId()}`
const portalTargetSelector = `#${portalTargetId}`
const {
  frameClass,
  frameStyle,
  scheme,
  sourceVisible,
  viewport,
} = useDemoPreview()

// 预览默认跟随站点明暗，夜里不再亮出一块白板；手动切换后保留读者的选择。
const { isDark } = useData()
let schemePicked = false
function pickScheme(value: DemoPreviewScheme) {
  schemePicked = true
  scheme.value = value
}
onMounted(() => {
  if (!isDark)
    return
  watch(isDark, (dark) => {
    if (!schemePicked)
      scheme.value = dark ? 'dark' : 'light'
  }, { immediate: true })
})

onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <section class="ylf-demo-preview" :data-viewport="viewport">
    <DemoToolbar
      v-model:viewport="viewport"
      v-model:source-visible="sourceVisible"
      :scheme="scheme"
      :name="name"
      :source="source"
      :source-id="sourceId"
      @update:scheme="pickScheme"
    />

    <div class="ylf-demo-preview__stage">
      <div
        class="ylf-demo-preview__frame vp-raw"
        :class="frameClass"
        :style="frameStyle"
      >
        <div :id="portalTargetId" class="ylf-demo-preview__portal" />

        <ConfigProvider :teleport-to="portalTargetSelector">
          <div class="ylf-demo-preview__canvas">
            <slot />
          </div>
        </ConfigProvider>

        <div v-if="error" class="ylf-demo-preview__error" role="alert">
          <strong>{{ text('Demo 渲染失败', 'Demo failed to render') }}</strong>
          <span>{{ error.message }}</span>
        </div>
      </div>
    </div>

    <div v-show="sourceVisible" :id="sourceId" class="ylf-demo-preview__source">
      <slot name="source" />
    </div>
  </section>
</template>

<style lang="scss">
.ylf-demo-preview {
  position: relative;
  margin: 20px 0 28px;
  overflow: hidden;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius-lg);
  background: var(--ylf-c-surface);
  box-shadow: var(--ylf-shadow-control);
}

.ylf-demo-preview__stage {
  min-height: 180px;
  overflow-x: auto;
  padding: clamp(18px, 4vw, 40px);
  background-color: var(--ylf-c-bg-soft);
  background-image: radial-gradient(var(--ylf-c-grid) 1px, transparent 1px);
  background-size: 16px 16px;
}

.ylf-demo-preview__frame {
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  overflow: visible;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius);
  background: var(--ylf-c-surface-raised, var(--ylf-c-bg));
  box-shadow: var(--ylf-shadow-control);
  color: var(--ylf-c-text);
  transition:
    max-width var(--ylf-duration-normal) var(--ylf-ease-standard),
    background-color var(--ylf-duration-fast) ease,
    border-color var(--ylf-duration-fast) ease;
}

.ylf-demo-preview__canvas {
  min-height: 132px;
  display: grid;
  align-content: center;
  padding: clamp(18px, 4vw, 32px);
  font-family: var(--ylf-font-body);
}

.ylf-demo-preview__portal {
  display: contents;
}

.ylf-demo-preview__error {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 20px 20px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--ylf-c-danger) 35%, transparent);
  border-radius: var(--ylf-radius-sm);
  background: color-mix(in srgb, var(--ylf-c-danger) 9%, var(--ylf-c-surface));
  color: var(--ylf-c-danger);
  font-size: 13px;
}

.ylf-demo-preview__source {
  border-top: 1px solid var(--ylf-c-border);

  div[class*='language-'] {
    margin: 0;
    border-radius: 0;
  }
}

@media (max-width: 640px) {
  .ylf-demo-preview__stage {
    padding: 14px;
  }

  .ylf-demo-preview__frame {
    min-width: 0;
  }

  .ylf-demo-preview__canvas {
    padding: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-demo-preview__frame {
    transition: none;
  }
}
</style>
