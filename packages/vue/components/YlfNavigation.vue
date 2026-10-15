<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useNavigationIndicator } from './navigation-indicator'

const props = withDefaults(defineProps<{
  /** Accessible name; distinguish multiple navigation landmarks on one page. */
  label: string
  orientation?: 'horizontal' | 'vertical'
  /** Move the shared underline between current links in horizontal navigation. */
  animated?: boolean
}>(), {
  orientation: 'horizontal',
  animated: true,
})

const root = useTemplateRef<HTMLElement>('root')
const indicator = useNavigationIndicator(root, {
  links: element => Array.from(element.querySelectorAll<HTMLElement>('.ylf-navigation-link'))
    .filter(link => link.closest('.ylf-navigation') === element),
  active: link => link.hasAttribute('data-active'),
  attributes: ['data-active'],
  enabled: () => props.animated && props.orientation === 'horizontal',
})
</script>

<template>
  <nav ref="root" class="ylf-navigation" :aria-label="label" :data-orientation="orientation" :data-indicator="indicator ? '' : undefined">
    <slot />
    <span
      v-if="indicator"
      class="ylf-navigation__indicator"
      aria-hidden="true"
      :style="{ transform: `translate(${indicator.x}px, ${indicator.y}px)` }"
    />
  </nav>
</template>

<style lang="scss" scoped>
.ylf-navigation {
  --_ylf-nav-justify: center;
  --_ylf-nav-active-bg: transparent;
  --_ylf-nav-indicator: block;

  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ylf-space-2, 8px);
  min-width: 0;

  &[data-indicator] {
    --_ylf-nav-indicator: none;
  }

  &__indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 2px;
    border-radius: var(--ylf-radius-pill, 999px);
    background: var(--ylf-c-brand, #2563eb);
    pointer-events: none;
    transition: transform var(--ylf-duration-normal, 240ms) var(--ylf-ease-standard, ease);
  }

  &[data-orientation='vertical'] {
    --_ylf-nav-justify: flex-start;
    --_ylf-nav-active-bg: var(--ylf-c-brand-soft, #eff6ff);
    --_ylf-nav-indicator: none;

    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: var(--ylf-space-1, 4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-navigation__indicator {
    transition: none;
  }
}
</style>
