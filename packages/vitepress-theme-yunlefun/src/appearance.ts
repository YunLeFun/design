import type { InjectionKey } from 'vue'
import { useData } from 'vitepress'
import { inject, onScopeDispose, provide } from 'vue'

interface AppearanceTransition {
  setAppearance: (dark: boolean) => void
  toggleAppearance: () => void
}

const appearanceTransitionKey: InjectionKey<AppearanceTransition> = Symbol('ylf-appearance-transition')
const fadeClass = 'ylf-appearance-fade'

export function provideAppearanceTransition() {
  const { isDark } = useData()
  let fadeTimer: ReturnType<typeof setTimeout> | undefined

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

    // 连点可立即反转当前主题；普通过渡保持页面控件可交互。
    clearTimeout(fadeTimer)
    document.documentElement.classList.add(fadeClass)
    isDark.value = dark
    fadeTimer = setTimeout(cleanup, 450)
  }

  function toggleAppearance() {
    setAppearance(!isDark.value)
  }

  const appearance = { setAppearance, toggleAppearance }
  provide(appearanceTransitionKey, appearance)
  provide('toggle-appearance', toggleAppearance)
  onScopeDispose(cleanup)

  return appearance
}

export function useAppearanceTransition() {
  const appearance = inject(appearanceTransitionKey)
  if (!appearance)
    throw new Error('Appearance transitions must be provided by the docs layout')
  return appearance
}
