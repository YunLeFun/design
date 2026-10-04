<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

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
const indicator = shallowRef<{ x: number, y: number } | null>(null)
let frame: number | undefined
let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
const observedLinks = new Set<HTMLElement>()

function links() {
  const element = root.value
  return Array.from(element?.querySelectorAll<HTMLElement>('.ylf-navigation-link') ?? [])
    .filter(link => link.closest('.ylf-navigation') === element)
}

function updateIndicator() {
  const element = root.value
  const active = links().find(link => link.hasAttribute('data-active'))
  if (!element || !active || !props.animated || props.orientation !== 'horizontal') {
    indicator.value = null
    return
  }

  const bounds = element.getBoundingClientRect()
  const target = active.getBoundingClientRect()
  if (!bounds.width || !target.width || !target.height) {
    indicator.value = null
    return
  }

  // Convert viewport coordinates to the nav's padding box, including scaled previews.
  const scaleX = element.offsetWidth ? bounds.width / element.offsetWidth : 1
  const scaleY = element.offsetHeight ? bounds.height / element.offsetHeight : 1
  const x = (target.left - bounds.left + target.width / 2) / scaleX - element.clientLeft + element.scrollLeft - 8
  const y = (target.bottom - bounds.top) / scaleY - element.clientTop + element.scrollTop - 6
  if (indicator.value?.x !== x || indicator.value?.y !== y)
    indicator.value = { x, y }
}

function scheduleUpdate() {
  if (!root.value || frame !== undefined)
    return
  frame = requestAnimationFrame(() => {
    frame = undefined
    updateIndicator()
  })
}

function observeLinks() {
  const current = new Set(links())
  for (const link of observedLinks) {
    if (!current.has(link)) {
      resizeObserver?.unobserve(link)
      observedLinks.delete(link)
    }
  }
  for (const link of current) {
    if (!observedLinks.has(link)) {
      resizeObserver?.observe(link)
      observedLinks.add(link)
    }
  }
}

onMounted(() => {
  const element = root.value!
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(element)
  }
  observeLinks()
  mutationObserver = new MutationObserver((mutations) => {
    if (mutations.some(mutation => mutation.type === 'childList'))
      observeLinks()
    scheduleUpdate()
  })
  mutationObserver.observe(element, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-active'],
  })
  window.addEventListener('resize', scheduleUpdate)
  scheduleUpdate()
})

watch(() => [props.orientation, props.animated], scheduleUpdate, { flush: 'post' })

onBeforeUnmount(() => {
  if (frame !== undefined)
    cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  window.removeEventListener('resize', scheduleUpdate)
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
