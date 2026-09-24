<script lang="ts" setup>
type BadgeVariant
  = | 'aurora' // 极光填充
    | 'brand' // 晴空蓝柔色
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'

withDefaults(defineProps<{
  variant?: BadgeVariant
  /** 胶囊圆角 */
  round?: boolean
}>(), {
  variant: 'brand',
  round: true,
})
</script>

<template>
  <span class="ylf-badge" :class="[`ylf-badge--${variant}`, { 'is-round': round }]">
    <slot />
  </span>
</template>

<style lang="scss">
.ylf-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--ylf-font-body, inherit);
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1;
  padding: 5px 12px;
  border-radius: var(--ylf-radius-sm, 10px);
  white-space: nowrap;

  &.is-round {
    border-radius: var(--ylf-radius-pill, 999px);
  }

  &--aurora {
    color: var(--ylf-c-text-on-aurora, #020617);
    background-image: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
  }

  &--brand {
    color: var(--ylf-c-brand, #2563eb);
    background: var(--ylf-c-brand-soft, #eff6ff);
  }

  &--success {
    color: var(--ylf-c-success, #065f46);
    background: color-mix(in srgb, var(--ylf-c-success, #065f46) 14%, transparent);
  }

  &--warning {
    color: var(--ylf-c-warning, #92400e);
    background: color-mix(in srgb, var(--ylf-c-warning, #92400e) 16%, transparent);
  }

  &--danger {
    color: var(--ylf-c-danger, #b91c1c);
    background: color-mix(in srgb, var(--ylf-c-danger, #b91c1c) 14%, transparent);
  }

  &--info {
    color: var(--ylf-c-info, #0369a1);
    background: color-mix(in srgb, var(--ylf-c-info, #0369a1) 14%, transparent);
  }
}
</style>
