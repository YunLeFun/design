// @vitest-environment happy-dom
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, shallowRef } from 'vue'
import DesignPlayground from '../packages/.vitepress/theme/components/DesignPlayground.vue'
import { provideAppearanceTransition, useAppearanceTransition } from '../packages/.vitepress/theme/composables/useAppearanceTransition'

const isDark = shallowRef(false)
vi.mock('vitepress', () => ({ useData: () => ({ isDark }) }))

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
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
})

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('appearance transitions', () => {
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

  it('cleans up the animation scope when the layout unmounts', async () => {
    const wrapper = mountControls()
    await wrapper.get('[aria-label="header"]').trigger('click')
    wrapper.unmount()
    expect(document.documentElement.classList.contains('ylf-appearance-fade')).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})
