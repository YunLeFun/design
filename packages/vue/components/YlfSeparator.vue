<script lang="ts" setup>
import type { YlfAccentTone } from './theme'
import { Separator } from 'reka-ui'

withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  /** 仅装饰（不被屏幕阅读器作为分节朗读） */
  decorative?: boolean
  variant?: 'neutral' | 'brand' | 'accent' | 'spectrum'
  tone?: YlfAccentTone
}>(), {
  orientation: 'horizontal',
  decorative: true,
  variant: 'neutral',
  tone: 'blue',
})
</script>

<template>
  <Separator
    class="ylf-separator"
    :class="[`ylf-separator--${orientation}`, `ylf-separator--${variant}`]"
    :data-ylf-tone="tone"
    :orientation="orientation"
    :decorative="decorative"
  />
</template>

<style lang="scss">
.ylf-separator {
  --_separator-size: 1px;

  flex: none;
  background: var(--ylf-c-border, #e2e8f0);

  &--horizontal {
    width: 100%;
    height: var(--_separator-size);
  }

  &--vertical {
    width: var(--_separator-size);
    height: 100%;
    align-self: stretch;
  }

  &--brand {
    background: var(--ylf-c-brand, #2563eb);
  }

  &--accent {
    --_separator-size: 2px;

    background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
  }

  &--spectrum {
    --_separator-size: 4px;

    border-radius: var(--ylf-radius-pill, 999px);
    background: linear-gradient(90deg, var(--ylf-spectrum-stops, #2563eb, #facc15));

    &.ylf-separator--vertical {
      background: linear-gradient(180deg, var(--ylf-spectrum-stops, #2563eb, #facc15));
    }
  }
}
</style>
