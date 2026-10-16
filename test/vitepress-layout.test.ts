// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick } from 'vue'
import Layout from '../packages/vitepress-theme-yunlefun/components/Layout.vue'

const site = vi.hoisted(() => ({ brand: { icon: 'design-mark', hero: true } as { icon: unknown, hero?: boolean, sky?: boolean } }))
const page = vi.hoisted(() => ({ frontmatter: { hero: { name: 'Design' } } as Record<string, unknown> }))
const route = vi.hoisted(() => ({ path: '/' }))
vi.mock('vitepress', async () => {
  const { reactive, ref } = await import('vue')
  const current = reactive(route)
  return {
    useData: () => ({ isDark: ref(false), theme: ref(site), frontmatter: ref(page.frontmatter) }),
    useRoute: () => current,
    withBase: (path: string) => `/base${path}`,
  }
})
vi.mock('vitepress/theme-without-fonts', () => ({
  default: {
    Layout: defineComponent({
      setup(_, { slots }) {
        return () => h('main', [
          slots['nav-bar-title-before']?.({ area: 'title' }),
          slots['nav-bar-content-before']?.({ area: 'menu' }),
          slots['doc-before']?.(),
          slots['home-hero-before']?.(),
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

  it('keeps the first paint still and plays the doc enter only after a client route change', async () => {
    const { useRoute } = await import('vitepress')
    const current = useRoute() as unknown as { path: string }
    const root = document.documentElement
    const wrapper = mount(Layout)
    await nextTick()
    expect(root.classList.contains('ylf-route-enter')).toBe(false)

    current.path = '/guide/'
    await nextTick()
    expect(root.classList.contains('ylf-route-enter')).toBe(true)
    // Unrelated animations, such as the appearance transition, leave the class alone.
    document.dispatchEvent(new AnimationEvent('animationend', { animationName: 'ylf-appearance' }))
    expect(root.classList.contains('ylf-route-enter')).toBe(true)
    document.dispatchEvent(new AnimationEvent('animationend', { animationName: 'ylf-doc-enter' }))
    expect(root.classList.contains('ylf-route-enter')).toBe(false)

    current.path = '/'
    await nextTick()
    expect(root.classList.contains('ylf-route-enter')).toBe(true)
    wrapper.unmount()
    expect(root.classList.contains('ylf-route-enter')).toBe(false)
  })

  it('draws an opt-in decorative sky only behind a native home hero', () => {
    const sky = (frontmatter: Record<string, unknown>, brand: typeof site.brand) => {
      page.frontmatter = frontmatter
      site.brand = brand
      const wrapper = mount(Layout)
      const html = wrapper.find('.ylf-home-sky')
      const result = html.exists() ? { hidden: html.attributes('aria-hidden'), clouds: html.findAll('.ylf-home-sky__cloud').length } : null
      wrapper.unmount()
      return result
    }
    const home = { layout: 'home', hero: { name: 'AI' } }
    expect(sky(home, { icon: 'design-mark' })).toBeNull()
    expect(sky(home, { icon: 'design-mark', sky: true })).toEqual({ hidden: 'true', clouds: 3 })
    expect(sky({ layout: 'home' }, { icon: 'design-mark', sky: true })).toBeNull()
    expect(sky({ hero: { name: 'AI' } }, { icon: 'design-mark', sky: true })).toBeNull()

    page.frontmatter = home
    site.brand = { icon: 'design-mark', sky: true }
    const wrapper = mount(Layout, { slots: { 'home-hero-before': () => h('p', { id: 'site-banner' }, 'Banner') } })
    expect(wrapper.find('.ylf-home-sky + #site-banner').exists()).toBe(true)
    wrapper.unmount()
    page.frontmatter = { hero: { name: 'Design' } }
    site.brand = { icon: 'design-mark', hero: true }
  })
})
