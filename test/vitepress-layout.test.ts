// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, ref } from 'vue'
import Layout from '../packages/vitepress-theme-yunlefun/components/Layout.vue'

const site = vi.hoisted(() => ({ brand: { icon: 'design-mark', hero: true } as { icon: unknown, hero?: boolean } }))
vi.mock('vitepress', () => ({
  useData: () => ({ isDark: ref(false), theme: ref(site), frontmatter: ref({ hero: { name: 'Design' } }) }),
  withBase: (path: string) => `/base${path}`,
}))
vi.mock('vitepress/theme-without-fonts', () => ({
  default: {
    Layout: defineComponent({
      setup(_, { slots }) {
        return () => h('main', [
          slots['nav-bar-title-before']?.({ area: 'title' }),
          slots['nav-bar-content-before']?.({ area: 'menu' }),
          slots['doc-before']?.(),
          slots['home-hero-image']?.(),
        ])
      },
    }),
  },
}))

describe('shared layout slots', () => {
  it('renders a canonical mark with a labelled hero and decorative navigation', () => {
    const wrapper = mount(Layout)
    expect(wrapper.findAll('[data-icon="ylf:design-mark"]')).toHaveLength(2)
    expect(wrapper.get('.ylf-nav-logo').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.ylf-hero-logo').attributes('aria-label')).toBe('Design')
    wrapper.unmount()
  })

  it('renders a site-provided Iconify mark or image without forking the theme', () => {
    site.brand = { icon: { body: '<path fill="currentColor" d="M0 0h24v24H0z"/>', width: 24, height: 24 }, hero: true }
    const iconified = mount(Layout)
    expect(iconified.findAll('svg[data-icon="site"]')).toHaveLength(2)
    expect(iconified.get('.ylf-nav-logo').attributes('viewBox')).toBe('0 0 24 24')
    expect(iconified.get('.ylf-nav-logo').html()).toContain('fill="currentColor"')
    iconified.unmount()

    site.brand = { icon: { src: '/logo.svg' }, hero: true }
    const image = mount(Layout)
    expect(image.get('img.ylf-nav-logo').attributes()).toMatchObject({ src: '/base/logo.svg', alt: '' })
    expect(image.get('img.ylf-hero-logo').attributes('alt')).toBe('Design')
    image.unmount()
    site.brand = { icon: 'design-mark', hero: true }
  })

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
        'nav-bar-content-before': ({ area }: { area: string }) => h('span', { id: 'native-menu-slot' }, area),
        'doc-before': () => h(Control),
      },
    })
    expect(wrapper.get('span').text()).toBe('title')
    expect(wrapper.get('#native-menu-slot').text()).toBe('menu')
    expect(wrapper.get('button').text()).toBe('Theme')
    await wrapper.get('button').trigger('click')
    wrapper.unmount()
  })
})
