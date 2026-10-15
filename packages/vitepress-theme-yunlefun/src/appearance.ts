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
const nightClass = 'ylf-appearance-night'
const dayClass = 'ylf-appearance-day'

interface ViewTransitionDocument {
  startViewTransition?: (update: () => Promise<void>) => { ready: Promise<void>, finished: Promise<void> }
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
    const width = window.innerWidth
    const height = window.innerHeight
    // 键盘切换或超过一秒的旧坐标，从右上角的主题开关附近展开。
    const recent = lastPointer && performance.now() - lastPointer.time < 1000
    const x = recent ? lastPointer!.x : width - 64
    const y = recent ? lastPointer!.y : 32
    const softMask = typeof CSS !== 'undefined' && CSS.supports?.('mask-image', 'linear-gradient(#000, #000)')
    const sceneClass = softMask ? (dark ? nightClass : dayClass) : undefined
    // 过渡期间暂停毛玻璃：新视图是实时画面，模糊层会让每一帧都重新绘制。
    root.classList.add(revealClass)
    if (sceneClass)
      root.classList.add(sceneClass)
    const transition = startViewTransition(async () => {
      isDark.value = dark
      await nextTick()
    })
    // fill: forwards 的动画会一直挂在 html 的 ::view-transition-* 上；不取消的话会叠到下一次切换，
    // 例如晴空展开留下的 maskSize 会盖住夜幕的遮罩尺寸，让夜色一下子铺满。
    const animations: Animation[] = []
    const animate = (keyframes: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
      const animation = root.animate?.(keyframes, options)
      if (animation)
        animations.push(animation)
    }
    // 用具体像素值驱动 WAAPI，并在快照就绪后立即开始；forwards 保持终态直到过渡结束。
    transition.ready.then(() => {
      const fill = 'forwards' as const
      const newView = '::view-transition-new(root)'
      const oldView = '::view-transition-old(root)'
      if (!softMask) {
        const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
        animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill, pseudoElement: newView },
        )
        return
      }
      if (dark) {
        // 夜幕落下：带柔和下缘的夜色从屏幕顶端垂落，白天的页面随之暗下来。
        const curtain = height * 1.5
        const timing = { duration: 820, easing: 'cubic-bezier(0.55, 0, 0.2, 1)', fill }
        animate({ maskPosition: [`0px ${-curtain}px`, '0px 0px'] }, { ...timing, pseudoElement: newView })
        animate({ filter: ['none', 'brightness(0.72) saturate(0.85)'] }, { ...timing, pseudoElement: oldView })
        return
      }
      // 晴空展开：光从点击处向外柔和铺开，新画面带一点刚放晴的明亮，再回到正常。
      const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
      const size = (reach * 2) / 0.7
      const timing = { duration: 720, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill }
      animate(
        {
          maskSize: ['0px 0px', `${size}px ${size}px`],
          maskPosition: [`${x}px ${y}px`, `${x - size / 2}px ${y - size / 2}px`],
        },
        { ...timing, pseudoElement: newView },
      )
      animate(
        { filter: ['brightness(1.15) saturate(1.1)', 'none'] },
        { ...timing, duration: 900, pseudoElement: newView },
      )
    }, () => {})
    transition.finished.finally(() => {
      for (const animation of animations)
        animation.cancel()
      root.classList.remove(revealClass)
      if (sceneClass)
        root.classList.remove(sceneClass)
    })
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
