<script lang="ts" setup>
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'

interface MenuItem {
  label?: string
  value?: string
  disabled?: boolean
  /** 渲染成分隔线 */
  separator?: boolean
}

defineProps<{
  items: MenuItem[]
}>()

const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="ylf-menu" :side-offset="6" align="start">
        <template v-for="(it, i) in items" :key="i">
          <DropdownMenuSeparator v-if="it.separator" class="ylf-menu__sep" />
          <DropdownMenuItem
            v-else
            class="ylf-menu__item"
            :disabled="it.disabled"
            @select="it.value && emit('select', it.value)"
          >
            {{ it.label }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss">
.ylf-menu {
  z-index: 105;
  min-width: 180px;
  padding: 6px;
  background: var(--ylf-c-surface, #fff);
  border: 1px solid var(--ylf-c-border, #e2e8f0);
  border-radius: var(--ylf-radius, 14px);
  box-shadow: var(--ylf-shadow-lg, 0 22px 56px -14px rgba(15, 23, 42, 0.22));
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);

  &[data-state='open'] {
    animation: ylf-pop-in 0.16s ease;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    font-size: 14px;
    color: var(--ylf-c-text, #0f172a);
    border-radius: var(--ylf-radius-sm, 10px);
    cursor: pointer;
    user-select: none;
    outline: none;

    &[data-highlighted] {
      background: var(--ylf-c-brand-soft, #eff6ff);
      color: var(--ylf-c-brand, #2563eb);
    }

    &[data-disabled] {
      opacity: 0.45;
      pointer-events: none;
    }
  }

  &__sep {
    height: 1px;
    margin: 6px 4px;
    background: var(--ylf-c-border, #e2e8f0);
  }
}

@keyframes ylf-pop-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-menu[data-state='open'] {
    animation: none;
  }
}
</style>
