import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

/** Shared geometry for native documentation menus and YlfNavigation. No routing ownership. */
export function useNavigationIndicator(root: Readonly<Ref<HTMLElement | null>>, options: {
  links: (root: HTMLElement) => HTMLElement[]
  active: (link: HTMLElement) => boolean
  attributes: string[]
  enabled?: () => boolean
}) {
  const indicator = shallowRef<{ x: number, y: number } | null>(null)
  let frame: number | undefined
  let resizeObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined
  let connectedElement: HTMLElement | null = null
  const observedLinks = new Set<HTMLElement>()

  function update() {
    const element = root.value
    const active = element && options.links(element).find(options.active)
    if (!element || !active || options.enabled?.() === false) {
      indicator.value = null
      return
    }
    const bounds = element.getBoundingClientRect()
    const target = active.getBoundingClientRect()
    if (!bounds.width || !target.width || !target.height) {
      indicator.value = null
      return
    }
    // Convert viewport coordinates to the padding box, including scaled previews.
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
      update()
    })
  }

  function observeLinks() {
    const current = new Set(root.value ? options.links(root.value) : [])
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

  function disconnect() {
    if (frame !== undefined)
      cancelAnimationFrame(frame)
    frame = undefined
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    observedLinks.clear()
  }

  function connect() {
    if (root.value === connectedElement)
      return
    disconnect()
    indicator.value = null
    const element = root.value
    connectedElement = element
    if (!element)
      return
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
      attributeFilter: options.attributes,
    })
    scheduleUpdate()
  }

  onMounted(() => {
    connect()
    window.addEventListener('resize', scheduleUpdate)
  })
  watch(root, connect, { flush: 'post' })
  if (options.enabled)
    watch(options.enabled, scheduleUpdate, { flush: 'post' })
  onBeforeUnmount(() => {
    disconnect()
    window.removeEventListener('resize', scheduleUpdate)
  })
  return indicator
}
