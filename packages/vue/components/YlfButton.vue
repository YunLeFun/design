<script lang="ts" setup>
import { computed } from 'vue'

type ButtonVariant
  = | 'primary' // 晴空蓝实色（主操作）
    | 'aurora' // 极光渐变（签名 / 特殊 CTA，opt-in）
    | 'secondary' // 描边
    | 'soft' // 柔色填充
    | 'ghost' // 幽灵
    | 'success'
    | 'warning'
    | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  /** 胶囊圆角，默认开启（云是软的） */
  round?: boolean
  /** 占满整行宽度 */
  block?: boolean
  disabled?: boolean
  loading?: boolean
  /** 渲染标签，如 'a' */
  tag?: string
}>(), {
  variant: 'primary',
  size: 'md',
  round: true,
  block: false,
  disabled: false,
  loading: false,
  tag: 'button',
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const classes = computed(() => [
  `ylf-button--${props.variant}`,
  `ylf-button--${props.size}`,
  {
    'is-round': props.round,
    'is-block': props.block,
    'is-loading': props.loading,
    'is-disabled': props.disabled,
  },
])

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading)
    return
  emit('click', e)
}
</script>

<template>
  <component
    :is="tag"
    class="ylf-button"
    :class="classes"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="loading" class="ylf-button__spinner" aria-hidden="true" />
    <slot name="icon" />
    <span class="ylf-button__label"><slot /></span>
  </component>
</template>

<style lang="scss">
.ylf-button {
  --_radius: var(--ylf-radius, 14px);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--_radius);
  font-family: var(--ylf-font-body, inherit);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition:
    transform 0.18s var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
    box-shadow 0.25s ease,
    background 0.25s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &.is-round {
    --_radius: var(--ylf-radius-pill, 999px);
  }

  &.is-block {
    display: flex;
    width: 100%;
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px var(--ylf-c-brand-soft, #eff6ff),
      0 0 0 5px var(--ylf-c-brand, #2563eb);
  }

  // --- sizes ---
  &--sm {
    padding: 8px 18px;
    font-size: 13px;
  }

  &--md {
    padding: 11px 24px;
    font-size: 15px;
  }

  &--lg {
    padding: 14px 30px;
    font-size: 17px;
  }

  // --- primary：晴空蓝实色（主操作，单色不花） ---
  &--primary {
    color: var(--ylf-c-text-on-accent, #fff);
    background: var(--ylf-c-brand, #2563eb);
    box-shadow: var(--ylf-glow-brand, 0 6px 18px -8px rgba(37, 99, 235, 0.35));

    &:hover {
      background: var(--ylf-c-brand-hover, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: var(--ylf-glow-brand-hover, 0 8px 22px -8px rgba(37, 99, 235, 0.4));
    }
  }

  // --- aurora：极光渐变（签名 / 特殊 CTA，opt-in） ---
  &--aurora {
    color: var(--ylf-c-text-on-aurora, #020617);
    background-image: var(--ylf-gradient-aurora, linear-gradient(110deg, #ff4d8d, #ffc233, #19d08b, #2fb4ff, #9a5cff));
    background-size: 180% auto;
    box-shadow: var(--ylf-glow-aurora, 0 10px 30px -6px rgba(124, 92, 255, 0.5));

    &:hover {
      background-position: right center;
      transform: translateY(-2px);
      box-shadow: var(--ylf-glow-aurora-hover, 0 16px 40px -8px rgba(124, 92, 255, 0.6));
    }
  }

  // --- secondary：描边 ---
  &--secondary {
    color: var(--ylf-c-text, #0f172a);
    background: var(--ylf-c-surface, #fff);
    border-color: var(--ylf-c-border-strong, #cbd5e1);

    &:hover {
      color: var(--ylf-c-brand, #2563eb);
      border-color: var(--ylf-c-brand, #2563eb);
      transform: translateY(-2px);
    }
  }

  // --- soft：柔色填充 ---
  &--soft {
    color: var(--ylf-c-brand, #2563eb);
    background: var(--ylf-c-brand-soft, #eff6ff);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--ylf-shadow-sm, 0 2px 8px -2px rgba(15, 23, 42, 0.12));
    }
  }

  // --- ghost：幽灵 ---
  &--ghost {
    color: var(--ylf-c-text-2, #475569);
    background: transparent;

    &:hover {
      color: var(--ylf-c-brand, #2563eb);
      background: var(--ylf-c-brand-soft, #eff6ff);
    }
  }

  // --- 语义色 ---
  &--success,
  &--warning,
  &--danger {
    color: var(--ylf-c-text-on-accent, #fff);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--ylf-shadow, 0 10px 28px -8px rgba(15, 23, 42, 0.16));
    }
  }

  &--success {
    background: var(--ylf-c-success, #065f46);
  }

  &--warning {
    background: var(--ylf-c-warning, #92400e);
  }

  &--danger {
    background: var(--ylf-c-danger, #b91c1c);
  }

  // --- 状态 ---
  &.is-disabled,
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
    transform: none !important;
  }

  &.is-loading {
    cursor: progress;
  }

  &__label {
    display: inline-flex;
    align-items: center;
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ylf-button-spin 0.7s linear infinite;
  }
}

@keyframes ylf-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-button {
    transition: none;
  }

  .ylf-button__spinner {
    animation-duration: 1.4s;
  }
}
</style>
