// @vitest-environment happy-dom
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, shallowRef } from 'vue'
import DesignPlayground from '../packages/.vitepress/theme/components/DesignPlayground.vue'
import { provideAppearanceTransition, useAppearanceTransition } from '../packages/.vitepress/theme/composables/useAppearanceTransition'

const isDark = shallowRef(false)
const lang = shallowRef('zh-Hans')
vi.mock('vitepress', () => ({ useData: () => ({ isDark, lang }) }))

const wrappers: VueWrapper[] = []

function mountControls() {
  const Controls = defineComponent({
    setup() {
      const { toggleAppearance } = useAppearanceTransition()
      const toggle = inject<() => void>('toggle-appearance')!
      return () => h('div', [
        h('p', isDark.value ? 'night' : 'day'),
        h('button', { 'aria-label': 'header', 'onClick': toggle }, 'Header'),
        h('button', { 'aria-label': 'home', 'onClick': toggleAppearance }, 'Home'),
      ])
    },
  })
  const wrapper = mount(defineComponent({
    setup() {
      provideAppearanceTransition()
      return () => h(Controls)
    },
  }))
  wrappers.push(wrapper)
  return wrapper
}

beforeEach(() => {
  isDark.value = false
  lang.value = 'zh-Hans'
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
})

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('appearance transitions', () => {
  it('updates playground language without losing the theme or accent selection', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAppearanceTransition()
        return () => h(DesignPlayground)
      },
    }), { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.get('[role="switch"]').trigger('click')
    await wrapper.findAll('button').find(button => button.text() === '换个颜色')!.trigger('click')
    lang.value = 'en'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('section').attributes('aria-label')).toBe('Interactive design preview')
    expect(wrapper.get('label').text()).toBe('Night sky')
    expect(wrapper.get('.ylf-badge').text()).toBe('Sun yellow')
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true')
    expect(isDark.value).toBe(true)
    lang.value = 'zh-Hans'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.ylf-badge').text()).toBe('明黄')
    expect(wrapper.get('label').text()).toBe('夜空模式')
  })

  it('updates both entry points immediately and removes temporary styles after the animation', async () => {
    const wrapper = mountControls()
    await wrapper.get('[aria-label="header"]').trigger('click')
    expect(wrapper.get('p').text()).toBe('night')
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(true)
    await wrapper.get('[aria-label="home"]').trigger('click')
    expect(wrapper.get('p').text()).toBe('day')
    await vi.advanceTimersByTimeAsync(450)
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
  })

  it('respects reduced motion without enabling animation styles', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList)
    const wrapper = mountControls()
    await wrapper.get('[aria-label="home"]').trigger('click')
    expect(wrapper.get('p').text()).toBe('night')
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
  })

  it('keeps a saved dark theme still on initial load', () => {
    isDark.value = true
    const wrapper = mountControls()
    expect(wrapper.get('p').text()).toBe('night')
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('restarts cleanup after the last click instead of interrupting its animation', async () => {
    const wrapper = mountControls()
    await wrapper.get('[aria-label="header"]').trigger('click')
    await vi.advanceTimersByTimeAsync(300)
    await wrapper.get('[aria-label="home"]').trigger('click')
    await vi.advanceTimersByTimeAsync(150)
    expect(wrapper.get('p').text()).toBe('day')
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(true)
    await vi.advanceTimersByTimeAsync(300)
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
  })

  it('handles rapid clicks and reset on the actual playground switch', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAppearanceTransition()
        return () => h(DesignPlayground)
      },
    }))
    wrappers.push(wrapper)
    const nightSwitch = wrapper.get('[role="switch"]')
    await nightSwitch.trigger('click')
    await nightSwitch.trigger('click')
    expect(nightSwitch.attributes('aria-checked')).toBe('false')
    expect(isDark.value).toBe(false)
    await nightSwitch.trigger('click')
    expect(nightSwitch.attributes('aria-checked')).toBe('true')
    await wrapper.findAll('button').find(button => button.text() === '重置')!.trigger('click')
    expect(nightSwitch.attributes('aria-checked')).toBe('false')
    expect(isDark.value).toBe(false)
  })

  function mockViewTransition(softMask: boolean) {
    const finishers: (() => void)[] = []
    const startViewTransition = vi.fn((update: () => Promise<void>) => {
      void update()
      return {
        ready: Promise.resolve(),
        finished: new Promise<void>((resolve) => {
          finishers.push(resolve)
        }),
      }
    })
    const animations: { cancel: ReturnType<typeof vi.fn> }[] = []
    const animate = vi.fn(() => {
      const animation = { cancel: vi.fn() }
      animations.push(animation)
      return animation
    })
    Object.assign(document, { startViewTransition })
    Object.assign(document.documentElement, { animate })
    vi.stubGlobal('CSS', { supports: () => softMask })
    return {
      animate,
      animations,
      startViewTransition,
      async finish() {
        finishers.splice(0).forEach(resolve => resolve())
        await Promise.resolve()
        await Promise.resolve()
      },
      restore() {
        delete (document as { startViewTransition?: unknown }).startViewTransition
        delete (document.documentElement as { animate?: unknown }).animate
        vi.unstubAllGlobals()
      },
    }
  }

  it('lets night fall from the top and the sky open from the pointer', async () => {
    const transition = mockViewTransition(true)
    try {
      const wrapper = mountControls()
      const header = wrapper.get('[aria-label="header"]')
      const root = document.documentElement
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 120, clientY: 40 }))
      await header.trigger('click')
      await wrapper.vm.$nextTick()
      expect(transition.startViewTransition).toHaveBeenCalledOnce()
      expect(wrapper.get('p').text()).toBe('night')
      expect(root.classList.contains('ylf-appearance-night')).toBe(true)
      expect(root.classList.contains('ylf-appearance-fade')).toBe(false)
      await Promise.resolve()
      const [curtain, curtainOptions] = transition.animate.mock.calls[0]
      expect(curtain.maskPosition[1]).toBe('0px 0px')
      expect(curtainOptions.pseudoElement).toBe('::view-transition-new(root)')
      expect(transition.animate.mock.calls[1][1].pseudoElement).toBe('::view-transition-old(root)')
      expect(transition.animations.every(animation => animation.cancel.mock.calls.length === 0)).toBe(true)
      await transition.finish()
      // forwards 填充的动画必须取消，否则会叠到下一次过渡的伪元素上。
      expect(transition.animations).toHaveLength(2)
      expect(transition.animations.every(animation => animation.cancel.mock.calls.length === 1)).toBe(true)
      expect(root.classList.contains('ylf-appearance-reveal')).toBe(false)
      expect(root.classList.contains('ylf-appearance-night')).toBe(false)

      transition.animate.mockClear()
      transition.animations.splice(0)
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 120, clientY: 40 }))
      await header.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.get('p').text()).toBe('day')
      expect(root.classList.contains('ylf-appearance-day')).toBe(true)
      await Promise.resolve()
      const [glow] = transition.animate.mock.calls[0]
      expect(glow.maskPosition[0]).toBe('120px 40px')
      expect(glow.maskSize[0]).toBe('0px 0px')
      await transition.finish()
      expect(transition.animations).toHaveLength(2)
      expect(transition.animations.every(animation => animation.cancel.mock.calls.length === 1)).toBe(true)
      expect(root.classList.contains('ylf-appearance-day')).toBe(false)
    }
    finally {
      transition.restore()
    }
  })

  it('falls back to a circular clip without CSS masks', async () => {
    const transition = mockViewTransition(false)
    try {
      const wrapper = mountControls()
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 120, clientY: 40 }))
      await wrapper.get('[aria-label="header"]').trigger('click')
      await wrapper.vm.$nextTick()
      await Promise.resolve()
      expect(transition.animate).toHaveBeenCalledOnce()
      expect(transition.animate.mock.calls[0][0].clipPath[0]).toBe('circle(0px at 120px 40px)')
      expect(document.documentElement.classList.contains('ylf-appearance-night')).toBe(false)
      await transition.finish()
      expect(transition.animations[0].cancel).toHaveBeenCalledOnce()
      expect(document.documentElement.classList.contains('ylf-appearance-reveal')).toBe(false)
    }
    finally {
      transition.restore()
    }
  })

  it('cleans up the animation scope when the layout unmounts', async () => {
    const wrapper = mountControls()
    await wrapper.get('[aria-label="header"]').trigger('click')
    wrapper.unmount()
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})
