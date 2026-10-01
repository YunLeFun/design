<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { onErrorCaptured, ref, useId } from 'vue'
import { useDemoPreview } from '../composables/useDemoPreview'
import { useDocsLocale } from '../composables/useDocsLocale'

defineProps<{
  name: string
  source: string
}>()

const { text } = useDocsLocale()
const error = ref<Error | null>(null)
const portalTargetId = `ylf-demo-portal-${useId()}`
const portalTargetSelector = `#${portalTargetId}`
const {
  frameClass,
  frameStyle,
  scheme,
  setScheme,
  setViewport,
  sourceVisible,
  toggleSource,
  viewport,
} = useDemoPreview()

onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <section class="ylf-demo-preview" :data-viewport="viewport">
    <header class="ylf-demo-preview__toolbar">
      <div class="ylf-demo-preview__file" :title="source">
        <span class="ylf-demo-preview__vue-icon" aria-hidden="true">
          <span i-logos:vue />
        </span>
        <code>{{ `${name}/demo.vue` }}</code>
      </div>

      <div class="ylf-demo-preview__controls">
        <div class="ylf-demo-preview__control-group" role="group" :aria-label="text('预览宽度', 'Preview width')">
          <button
            type="button"
            :title="text('自适应宽度', 'Responsive width')"
            :aria-label="text('自适应宽度', 'Responsive width')"
            :aria-pressed="viewport === 'responsive'"
            @click="setViewport('responsive')"
          >
            <span i-ri-computer-line aria-hidden="true" />
          </button>
          <button
            type="button"
            :title="text('平板宽度 768px', 'Tablet width 768px')"
            :aria-label="text('平板宽度 768px', 'Tablet width 768px')"
            :aria-pressed="viewport === 'tablet'"
            @click="setViewport('tablet')"
          >
            <span i-ri-tablet-line aria-hidden="true" />
          </button>
          <button
            type="button"
            :title="text('手机宽度 390px', 'Mobile width 390px')"
            :aria-label="text('手机宽度 390px', 'Mobile width 390px')"
            :aria-pressed="viewport === 'mobile'"
            @click="setViewport('mobile')"
          >
            <span i-ri-smartphone-line aria-hidden="true" />
          </button>
        </div>

        <span class="ylf-demo-preview__separator" aria-hidden="true" />

        <div class="ylf-demo-preview__control-group" role="group" :aria-label="text('预览主题', 'Preview theme')">
          <button
            type="button"
            :title="text('浅色预览', 'Light preview')"
            :aria-label="text('浅色预览', 'Light preview')"
            :aria-pressed="scheme === 'light'"
            @click="setScheme('light')"
          >
            <span i-ri-sun-line aria-hidden="true" />
          </button>
          <button
            type="button"
            :title="text('深色预览', 'Dark preview')"
            :aria-label="text('深色预览', 'Dark preview')"
            :aria-pressed="scheme === 'dark'"
            @click="setScheme('dark')"
          >
            <span i-ri-moon-line aria-hidden="true" />
          </button>
        </div>

        <span class="ylf-demo-preview__separator" aria-hidden="true" />

        <a
          class="ylf-demo-preview__icon-button"
          :href="source"
          target="_blank"
          rel="noreferrer"
          :title="text('在 GitHub 查看 Demo', 'View demo on GitHub')"
          :aria-label="text('在 GitHub 查看 Demo', 'View demo on GitHub')"
        >
          <span i-ri-github-line aria-hidden="true" />
        </a>
        <button
          class="ylf-demo-preview__icon-button"
          type="button"
          :title="text('查看源码', 'View source')"
          :aria-label="text('查看源码', 'View source')"
          :aria-expanded="sourceVisible"
          :aria-pressed="sourceVisible"
          @click="toggleSource"
        >
          <span i-ri-code-s-slash-line aria-hidden="true" />
        </button>
      </div>
    </header>

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

    <div v-show="sourceVisible" class="ylf-demo-preview__source">
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

.ylf-demo-preview__toolbar {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px 7px 14px;
  border-bottom: 1px solid var(--ylf-c-border);
  background: color-mix(in srgb, var(--ylf-c-surface) 88%, var(--ylf-c-bg-soft));
}

.ylf-demo-preview__file {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ylf-c-text-2);

  code {
    min-width: 0;
    overflow: hidden;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.ylf-demo-preview__vue-icon {
  flex: none;
  display: inline-flex;
  font-size: 16px;
}

.ylf-demo-preview__controls,
.ylf-demo-preview__control-group {
  display: flex;
  align-items: center;
}

.ylf-demo-preview__controls {
  flex: none;
  gap: 4px;
}

.ylf-demo-preview__control-group {
  gap: 2px;
  padding: 2px;
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-surface-inset, var(--ylf-c-bg-soft));
  box-shadow: var(--ylf-shadow-inset);
}

.ylf-demo-preview__control-group button,
.ylf-demo-preview__icon-button {
  width: 36px;
  height: 36px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ylf-c-text-3);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    color: var(--ylf-c-brand);
    background: var(--ylf-c-brand-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ylf-c-brand);
  }

  &[aria-pressed='true'] {
    color: var(--ylf-c-brand);
    background: var(--ylf-c-surface);
    box-shadow: var(--ylf-shadow-control);
  }
}

.ylf-demo-preview__separator {
  width: 1px;
  height: 20px;
  margin: 0 2px;
  background: var(--ylf-c-border);
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
  .ylf-demo-preview__toolbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 10px;
  }

  .ylf-demo-preview__controls {
    width: 100%;
    justify-content: flex-end;
  }

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
  .ylf-demo-preview__frame,
  .ylf-demo-preview__control-group button,
  .ylf-demo-preview__icon-button {
    transition: none;
  }
}
</style>
