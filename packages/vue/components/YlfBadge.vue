<script lang="ts" setup>
type BadgeVariant
  = | 'aurora' // 极光填充
    | 'brand' // 鸢尾柔色
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
    color: var(--ylf-c-text-on-accent, #fff);
    background-image: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff9fb2, #ffd66b, #7fe0c0, #7cc4ff, #9d8bff));
  }

  &--brand {
    color: var(--ylf-c-brand, #6e7bff);
    background: var(--ylf-c-brand-soft, #edefff);
  }

  &--success {
    color: var(--ylf-c-success, #1fb089);
    background: color-mix(in srgb, var(--ylf-c-success, #1fb089) 14%, transparent);
  }

  &--warning {
    color: var(--ylf-c-warning, #e9a21e);
    background: color-mix(in srgb, var(--ylf-c-warning, #e9a21e) 16%, transparent);
  }

  &--danger {
    color: var(--ylf-c-danger, #fb5c7c);
    background: color-mix(in srgb, var(--ylf-c-danger, #fb5c7c) 14%, transparent);
  }

  &--info {
    color: var(--ylf-c-info, #2e9bff);
    background: color-mix(in srgb, var(--ylf-c-info, #2e9bff) 14%, transparent);
  }
}
</style>
