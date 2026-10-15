import type { InjectionKey } from 'vue'
import { useData } from 'vitepress'
import { inject, nextTick, onScopeDispose, provide } from 'vue'

interface AppearanceTransition {
  setAppearance: (dark: boolean) => void
  toggleAppearance: () => void
}

const appearanceTransitionKey: InjectionKey<AppearanceTransition> = Symbol('ylf-appearance-transition')
const fadeClass = 'ylf-appearance-fade'
const revealClass = 'ylf-appearance-reveal'

interface ViewTransitionDocument {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> }
}

export function provideAppearanceTransition() {
  const { isDark } = useData()
  let fadeTimer: ReturnType<typeof setTimeout> | undefined
  // 记住最近一次按下的位置，让夜幕或晴空从点击处扩散开。
  let lastPointer: { x: number, y: number, time: number } | undefined
  function recordPointer(event: PointerEvent) {
    lastPointer = { x: event.clientX, y: event.clientY, time: performance.now() }
  }
  if (typeof window !== 'undefined')
    window.addEventListener('pointerdown', recordPointer, { capture: true, passive: true })

  function cleanup() {
    clearTimeout(fadeTimer)
    if (typeof document !== 'undefined')
      document.documentElement.classList.remove(fadeClass)
  }

  function setAppearance(dark: boolean) {
    if (isDark.value === dark)
      return

    if (typeof document === 'undefined'
      || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      cleanup()
      isDark.value = dark
      return
    }

    const startViewTransition = (document as ViewTransitionDocument).startViewTransition?.bind(document)
    if (startViewTransition) {
      reveal(dark, startViewTransition)
      return
    }

    // 连点可立即反转当前主题；普通过渡保持页面控件可交互。
    clearTimeout(fadeTimer)
    document.documentElement.classList.add(fadeClass)
    isDark.value = dark
    fadeTimer = setTimeout(cleanup, 450)
  }

  function reveal(dark: boolean, startViewTransition: NonNullable<ViewTransitionDocument['startViewTransition']>) {
    const root = document.documentElement
    // 键盘切换或超过一秒的旧坐标，从右上角的主题开关附近展开。
    const recent = lastPointer && performance.now() - lastPointer.time < 1000
    const x = recent ? lastPointer!.x : window.innerWidth - 64
    const y = recent ? lastPointer!.y : 32
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    root.style.setProperty('--ylf-reveal-x', `${x}px`)
    root.style.setProperty('--ylf-reveal-y', `${y}px`)
    root.style.setProperty('--ylf-reveal-radius', `${radius}px`)
    root.classList.add(revealClass)
    startViewTransition(async () => {
      isDark.value = dark
      await nextTick()
    }).finished.finally(() => root.classList.remove(revealClass))
  }

  function toggleAppearance() {
    setAppearance(!isDark.value)
  }

  const appearance = { setAppearance, toggleAppearance }
  provide(appearanceTransitionKey, appearance)
  provide('toggle-appearance', toggleAppearance)
  onScopeDispose(() => {
    cleanup()
    if (typeof window !== 'undefined')
      window.removeEventListener('pointerdown', recordPointer, { capture: true })
  })

  return appearance
}

export function useAppearanceTransition() {
  const appearance = inject(appearanceTransitionKey)
  if (!appearance)
    throw new Error('Appearance transitions must be provided by the docs layout')
  return appearance
}
