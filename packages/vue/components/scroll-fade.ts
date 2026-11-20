import type { ComputedRef, CSSProperties, Ref } from 'vue'
import { computed, shallowRef, watch } from 'vue'

function edgeOpacity(distance: number): number {
  // Layout heights are rounded to whole pixels, but scrollTop can be fractional.
  return distance <= 1 ? 0 : Math.min(1, distance / 24)
}

/** Reveal the edges with more content, including before the first scroll. */
export function useScrollFade(viewport: Readonly<Ref<HTMLElement | null | undefined>>): ComputedRef<CSSProperties> {
  const top = shallowRef(0)
  const bottom = shallowRef(0)
  watch(viewport, (element, _, onCleanup) => {
    top.value = 0
    bottom.value = 0
    if (!element)
      return

    let frame = 0
    const update = (): void => {
      frame = 0
      const range = Math.max(0, element.scrollHeight - element.clientHeight)
      const offset = Math.min(range, Math.max(0, element.scrollTop))
      top.value = edgeOpacity(offset)
      bottom.value = edgeOpacity(range - offset)
    }
    const schedule = (): void => {
      if (!frame)
        frame = requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(schedule)
    const observeContent = (): void => {
      resize.disconnect()
      resize.observe(element)
      for (const child of Array.from(element.children))
        resize.observe(child)
      schedule()
    }
    const content = new MutationObserver(observeContent)
    content.observe(element, { childList: true, characterData: true, subtree: true })
    observeContent()
    element.addEventListener('scroll', schedule, { passive: true })
    onCleanup(() => {
      resize.disconnect()
      content.disconnect()
      cancelAnimationFrame(frame)
      element.removeEventListener('scroll', schedule)
    })
  }, { immediate: true, flush: 'post' })

  return computed(() => ({ '--scroll-fade-top': top.value, '--scroll-fade-bottom': bottom.value }))
}
