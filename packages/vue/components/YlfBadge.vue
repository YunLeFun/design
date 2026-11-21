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

<style>
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
  font-size: var(--ylf-text-xs, 0.75rem);
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
}

.ylf-badge.is-round {
  border-radius: var(--ylf-radius-pill, 999px);
}

.ylf-badge--accent {
  --_color: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
  --_soft: var(--ylf-accent-soft, var(--ylf-c-brand-soft, #eff6ff));
  --_text: var(--ylf-accent-text, var(--ylf-c-brand, #2563eb));

  color: var(--ylf-accent-on, var(--ylf-c-text-on-accent, #fff));
  background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
  border-color: transparent;
}

.ylf-badge--featured,
.ylf-badge--aurora {
  color: var(--ylf-c-feature-text, var(--ylf-c-text, #0f172a));
  background: var(--ylf-c-feature-bg, var(--ylf-accent-sun-soft, #fef9c3));
  border-color: color-mix(in srgb, var(--ylf-c-feature, #facc15) 45%, var(--ylf-c-surface, #fff));
}

/* 装饰星芒不承担状态语义，标签文字保持清晰。 */
.ylf-badge__spark {
  flex: none;
  width: 12px;
  height: 12px;
  background: var(--ylf-c-feature, #facc15);
  clip-path: polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%);
}

.ylf-badge--neutral {
  --_badge-tone: var(--ylf-c-text-2, #475569);
}

.ylf-badge__status-icon {
  flex: none;
  width: 12px;
  height: 12px;
}

.ylf-badge--success {
  --_color: var(--ylf-status-success, #22c55e);
  --_soft: var(--ylf-status-success-soft, var(--ylf-c-bg-soft, #f1f5f9));
  --_text: var(--ylf-status-success-text, #166534);

  color: var(--ylf-status-success-on, #124324);
  background: var(--ylf-status-success, #22c55e);
  border-color: transparent;
}

.ylf-badge--warning {
  --_color: var(--ylf-status-warning, #facc15);
  --_soft: var(--ylf-status-warning-soft, var(--ylf-c-bg-soft, #f1f5f9));
  --_text: var(--ylf-status-warning-text, #854d0e);

  color: var(--ylf-status-warning-on, #64380e);
  background: var(--ylf-status-warning, #facc15);
  border-color: transparent;
}

.ylf-badge--danger {
  --_color: var(--ylf-status-danger, #ff6b4a);
  --_soft: var(--ylf-status-danger-soft, var(--ylf-c-bg-soft, #f1f5f9));
  --_text: var(--ylf-status-danger-text, #9a3412);

  color: var(--ylf-status-danger-on, #551b0a);
  background: var(--ylf-status-danger, #ff6b4a);
  border-color: transparent;
}

.ylf-badge--info {
  --_color: var(--ylf-status-info, #06b6d4);
  --_soft: var(--ylf-status-info-soft, var(--ylf-c-bg-soft, #f1f5f9));
  --_text: var(--ylf-status-info-text, #155e75);

  color: var(--ylf-status-info-on, #083e4f);
  background: var(--ylf-status-info, #06b6d4);
  border-color: transparent;
}

:is(.ylf-badge--accent, .ylf-badge--success, .ylf-badge--warning, .ylf-badge--danger, .ylf-badge--info).is-soft {
  color: var(--_text);
  background: var(--_soft);
}

:is(.ylf-badge--accent, .ylf-badge--success, .ylf-badge--warning, .ylf-badge--danger, .ylf-badge--info).is-outline {
  color: var(--_text);
  background: transparent;
  border-color: var(--_color);
}
</style>
