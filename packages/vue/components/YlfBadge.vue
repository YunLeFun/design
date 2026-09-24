<script lang="ts" setup>
import type { YlfAccentTone, YlfColorAppearance } from './theme'
import { computed } from 'vue'

type BadgeVariant
  = | 'featured' // 精选：明黄星芒 + 中性文字
    | 'accent' // 高饱和实色
    | 'aurora' // @deprecated 使用 featured
    | 'brand' // 晴空蓝
    | 'neutral' // 灰蓝中性信息
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  /** 仅 accent 变体使用 */
  tone?: YlfAccentTone
  /** accent 与状态变体的强调程度 */
  appearance?: YlfColorAppearance
  /** 胶囊圆角 */
  round?: boolean
}>(), {
  variant: 'brand',
  tone: 'blue',
  appearance: 'solid',
  round: true,
})

const statusPaths: Partial<Record<BadgeVariant, string>> = {
  success: 'M3.5 8 6.5 11 12.5 5',
  warning: 'M8 3v6M8 12h.01',
  danger: 'm4.5 4.5 7 7m0-7-7 7',
  info: 'M8 7v5M8 4h.01',
}
const statusPath = computed(() => statusPaths[props.variant])
</script>

<template>
  <span class="ylf-badge" :data-ylf-tone="tone" :class="[`ylf-badge--${variant}`, `is-${appearance}`, { 'is-round': round }]">
    <span v-if="variant === 'featured' || variant === 'aurora'" class="ylf-badge__spark" aria-hidden="true" />
    <svg v-else-if="statusPath" class="ylf-badge__status-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path :d="statusPath" />
    </svg>
    <slot />
  </span>
</template>

<style lang="scss">
.ylf-badge {
  --_badge-tone: var(--ylf-c-brand, #2563eb);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-sizing: border-box;
  vertical-align: middle;
  padding: 2px 9px;
  border: 1px solid color-mix(in srgb, var(--_badge-tone) 18%, var(--ylf-c-surface, #fff));
  border-radius: var(--ylf-radius-sm, 10px);
  background: color-mix(in srgb, var(--_badge-tone) 6%, var(--ylf-c-surface, #fff));
  color: var(--_badge-tone);
  font-family: var(--ylf-font-body, inherit);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;

  &.is-round {
    border-radius: var(--ylf-radius-pill, 999px);
  }

  &--accent {
    --_color: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
    --_soft: var(--ylf-accent-soft, var(--ylf-c-brand-soft, #eff6ff));
    --_text: var(--ylf-accent-text, var(--ylf-c-brand, #2563eb));

    color: var(--ylf-accent-on, var(--ylf-c-text-on-accent, #fff));
    background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
    border-color: transparent;
  }

  &--featured,
  &--aurora {
    color: var(--ylf-c-feature-text, #0f172a);
    background: var(--ylf-c-feature-bg, #fef9c3);
    border-color: color-mix(in srgb, var(--ylf-c-feature, #facc15) 45%, var(--ylf-c-surface, #fff));
  }

  // 装饰星芒不承担状态语义，标签文字保持清晰。
  &__spark {
    flex: none;
    width: 12px;
    height: 12px;
    background: var(--ylf-c-feature, #facc15);
    clip-path: polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%);
  }

  &--neutral {
    --_badge-tone: var(--ylf-c-text-2, #475569);
  }

  &__status-icon {
    flex: none;
    width: 12px;
    height: 12px;
  }

  @each $status, $fill, $on in (success, #22c55e, #124324), (warning, #facc15, #64380e), (danger, #ff6b4a, #551b0a),
    (info, #06b6d4, #083e4f)
  {
    &--#{$status} {
      --_color: var(--ylf-status-#{$status}, #{$fill});
      --_soft: var(--ylf-status-#{$status}-soft, var(--ylf-c-bg-soft, #f1f5f9));
      --_text: var(--ylf-status-#{$status}-text, #{$on});

      color: var(--ylf-status-#{$status}-on, $on);
      background: var(--ylf-status-#{$status}, $fill);
      border-color: transparent;
    }
  }

  &--accent,
  &--success,
  &--warning,
  &--danger,
  &--info {
    &.is-soft {
      color: var(--_text);
      background: var(--_soft);
    }

    &.is-outline {
      color: var(--_text);
      background: transparent;
      border-color: var(--_color);
    }
  }
}
</style>
