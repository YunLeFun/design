// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, ref } from 'vue'
import Layout from '../packages/vitepress-theme-yunlefun/components/Layout.vue'

vi.mock('vitepress', () => ({ useData: () => ({ isDark: ref(false) }) }))
vi.mock('vitepress/theme-without-fonts', () => ({
  default: {
    Layout: defineComponent({
      setup(_, { slots }) {
        return () => h('main', [
          slots['nav-bar-title-before']?.({ area: 'title' }),
          slots['doc-before']?.(),
        ])
      },
    }),
  },
}))

describe('shared layout slots', () => {
  it('forwards native scoped slots and provides one appearance action to site content', async () => {
    const Control = defineComponent({
      setup() {
        const toggle = inject<() => void>('toggle-appearance')
        return () => h('button', { onClick: toggle }, 'Theme')
      },
    })
    const wrapper = mount(Layout, {
      slots: {
        'nav-bar-title-before': ({ area }: { area: string }) => h('span', area),
        'doc-before': () => h(Control),
      },
    })
    expect(wrapper.get('span').text()).toBe('title')
    expect(wrapper.get('button').text()).toBe('Theme')
    await wrapper.get('button').trigger('click')
    wrapper.unmount()
  })
})
