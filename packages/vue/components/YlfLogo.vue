<script lang="ts" setup>
import { icons } from '@yunlefun/icons'

withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  layout?: 'vertical' | 'horizontal'
  /** 是否显示「云乐坊」文字 */
  wordmark?: boolean
}>(), {
  size: 'md',
  layout: 'vertical',
  wordmark: true,
})
const mark = icons.icons['brand-mark']
const viewBox = `0 0 ${mark.width || icons.width || 16} ${mark.height || icons.height || 16}`
</script>

<template>
  <div class="ylf-logo" :class="[`ylf-logo--${size}`, `ylf-logo--${layout}`]">
    <span class="ylf-logo__mark" aria-hidden="true">
      <!-- Trusted, sanitized SVG body from the canonical Iconify package. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <svg :viewBox="viewBox" fill="currentColor" v-html="mark.body" />
    </span>
    <span v-if="wordmark" class="ylf-logo__name">云乐坊</span>
  </div>
</template>

<style>
.ylf-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: default;
  line-height: 1;
}

.ylf-logo--vertical {
  flex-direction: column;
  gap: 8px;
}

.ylf-logo__mark {
  flex: none;
  display: grid;
  place-items: center;
  color: var(--ylf-c-brand, #2563eb);
}

.ylf-logo__mark svg {
  width: 100%;
  height: 100%;
}

.ylf-logo__name {
  font-family: var(
    --ylf-font-wordmark,
    var(
      --ylf-font-display,
      'Baloo 2',
      'ZCOOL KuaiLe',
      ui-rounded,
      'Hiragino Maru Gothic ProN',
      'Hiragino Maru Gothic Pro',
      'PingFang SC',
      'Hiragino Sans GB',
      'Microsoft YaHei',
      '微软雅黑',
      'Source Han Sans SC',
      sans-serif
    )
  );
  font-weight: 700;
  color: var(--ylf-c-text, #0f172a);
}

/* sizes */
.ylf-logo--sm .ylf-logo__mark {
  width: 36px;
  height: 25.2px;
}

.ylf-logo--sm .ylf-logo__name {
  font-size: 18px;
}

.ylf-logo--md .ylf-logo__mark {
  width: 48px;
  height: 33.6px;
}

.ylf-logo--md .ylf-logo__name {
  font-size: 24px;
}

.ylf-logo--lg .ylf-logo__mark {
  width: 72px;
  height: 50.4px;
}

.ylf-logo--lg .ylf-logo__name {
  font-size: 34px;
}
</style>
