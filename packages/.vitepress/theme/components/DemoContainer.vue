<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { onErrorCaptured, ref, useId } from 'vue'
import { useDemoPreview } from '../composables/useDemoPreview'

defineProps<{
  name: string
  source: string
}>()

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
      <div class="ylf-demo-preview__file" :title="`packages/vue/components/${name}/demo.vue`">
        <span class="ylf-demo-preview__vue-icon" aria-hidden="true">
          <span i-logos:vue />
        </span>
        <code>{{ `${name}/demo.vue` }}</code>
      </div>

      <div class="ylf-demo-preview__controls">
        <div class="ylf-demo-preview__control-group" role="group" aria-label="预览宽度">
          <button
            type="button"
            title="自适应宽度"
            aria-label="自适应宽度"
            :aria-pressed="viewport === 'responsive'"
            @click="setViewport('responsive')"
          >
            <span i-ri-computer-line aria-hidden="true" />
          </button>
          <button
            type="button"
            title="平板宽度 768px"
            aria-label="平板宽度 768px"
            :aria-pressed="viewport === 'tablet'"
            @click="setViewport('tablet')"
          >
            <span i-ri-tablet-line aria-hidden="true" />
          </button>
          <button
            type="button"
            title="手机宽度 390px"
            aria-label="手机宽度 390px"
            :aria-pressed="viewport === 'mobile'"
            @click="setViewport('mobile')"
          >
            <span i-ri-smartphone-line aria-hidden="true" />
          </button>
        </div>

        <span class="ylf-demo-preview__separator" aria-hidden="true" />

        <div class="ylf-demo-preview__control-group" role="group" aria-label="预览主题">
          <button
            type="button"
            title="浅色预览"
            aria-label="浅色预览"
            :aria-pressed="scheme === 'light'"
            @click="setScheme('light')"
          >
            <span i-ri-sun-line aria-hidden="true" />
          </button>
          <button
            type="button"
            title="深色预览"
            aria-label="深色预览"
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
          title="在 GitHub 查看 Demo"
          aria-label="在 GitHub 查看 Demo"
        >
          <span i-ri-github-line aria-hidden="true" />
        </a>
        <button
          class="ylf-demo-preview__icon-button"
          type="button"
          title="查看源码"
          aria-label="查看源码"
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
        class="ylf-demo-preview__frame"
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
          <strong>Demo 渲染失败</strong>
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
  box-shadow: var(--ylf-shadow-sm);
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
  background: var(--ylf-c-bg-soft);
}

.ylf-demo-preview__control-group button,
.ylf-demo-preview__icon-button {
  width: 30px;
  height: 30px;
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
    box-shadow: 0 1px 4px rgba(27, 34, 56, 0.12);
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
  background: radial-gradient(
      circle at 12% 10%,
      color-mix(in srgb, var(--ylf-aurora-sky) 10%, transparent),
      transparent 34%
    ),
    radial-gradient(circle at 88% 90%, color-mix(in srgb, var(--ylf-aurora-pink) 10%, transparent), transparent 34%),
    var(--ylf-c-bg-soft);
}

.ylf-demo-preview__frame {
  width: 100%;
  min-width: 320px;
  margin: 0 auto;
  overflow: visible;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius);
  background: var(--ylf-c-bg);
  box-shadow: var(--ylf-shadow-sm);
  color: var(--ylf-c-text);
  transition:
    max-width 0.28s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
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
    min-width: 290px;
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
