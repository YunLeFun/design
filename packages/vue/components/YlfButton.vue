<script lang="ts" setup>
import type { YlfAccentTone, YlfColorAppearance } from './theme'
import { computed } from 'vue'

type ButtonVariant
  = | 'primary' // 晴空蓝实色（主操作）
    | 'accent' // 高饱和纯色强调
    | 'aurora' // @deprecated 使用 accent；旧调用映射到纯色
    | 'secondary' // 描边
    | 'soft' // 柔色填充
    | 'ghost' // 幽灵
    | 'success'
    | 'warning'
    | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  /** 仅 accent 变体使用，默认晴空蓝 */
  tone?: YlfAccentTone
  /** accent 与状态变体的强调程度 */
  appearance?: YlfColorAppearance
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
  tone: 'blue',
  appearance: 'solid',
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
  `is-${props.appearance}`,
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
    :data-ylf-tone="tone"
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
    transform var(--ylf-duration-fast, 160ms) var(--ylf-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
    box-shadow var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    background var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease),
    color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease),
    border-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease);

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
    box-shadow: var(--ylf-shadow-sm);

    &:hover {
      background: var(--ylf-c-brand-hover, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: var(--ylf-shadow-sm);
    }
  }

  // 强调色来自共享上下文；实色上的文字与填充色成组维护。
  &--accent,
  &--aurora {
    --_color: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
    --_soft: var(--ylf-accent-soft, var(--ylf-c-brand-soft, #eff6ff));
    --_text: var(--ylf-accent-text, var(--ylf-c-brand, #2563eb));

    color: var(--ylf-accent-on, var(--ylf-c-text-on-accent, #fff));
    background: var(--ylf-accent, var(--ylf-c-brand, #2563eb));
    box-shadow: var(--ylf-shadow-sm);

    &:hover {
      background: var(--ylf-accent-hover, var(--ylf-c-brand-hover, #1d4ed8));
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
  @each $status, $fill, $on, $hover in (success, #22c55e, #124324, #4ade80), (warning, #facc15, #64380e, #eab308),
    (danger, #ff6b4a, #551b0a, #ff856b)
  {
    &--#{$status} {
      --_color: var(--ylf-status-#{$status}, #{$fill});
      --_soft: var(--ylf-status-#{$status}-soft, var(--ylf-c-bg-soft, #f1f5f9));
      --_text: var(--ylf-status-#{$status}-text, #{$on});

      color: var(--ylf-status-#{$status}-on, $on);
      background: var(--ylf-status-#{$status}, $fill);

      &:hover {
        background: var(--ylf-status-#{$status}-hover, $hover);
      }
    }
  }

  &--accent,
  &--aurora,
  &--success,
  &--warning,
  &--danger {
    &.is-soft,
    &.is-outline {
      color: var(--_text);
      box-shadow: none;

      &:hover {
        background: var(--_soft);
        border-color: var(--_text);
      }

      &:focus-visible {
        outline: 2px solid var(--ylf-c-brand, #2563eb);
        outline-offset: 3px;
      }
    }

    &.is-soft {
      background: var(--_soft);
    }

    &.is-outline {
      background: transparent;
      border-color: var(--_text);
    }
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
