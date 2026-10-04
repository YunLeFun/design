// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, shallowRef } from 'vue'
import YlfDropdownMenu from '../packages/vue/components/YlfDropdownMenu.vue'
import YlfNavigation from '../packages/vue/components/YlfNavigation.vue'
import YlfNavigationLink from '../packages/vue/components/YlfNavigationLink.vue'
import YlfNavigationTrigger from '../packages/vue/components/YlfNavigationTrigger.vue'

enableAutoUnmount(cleanup => afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
}))

function mountMeasuredNavigation() {
  const active = shallowRef<string | null>('blog')
  const rectangles = {
    nav: new DOMRect(100, 50, 300, 44),
    help: new DOMRect(100, 50, 60, 44),
    blog: new DOMRect(176, 50, 84, 44),
  }
  let notifyResize = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) { notifyResize = callback }
    observe() {}
    unobserve() {}
    disconnect = disconnect
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    const key = this.classList.contains('ylf-navigation') ? 'nav' : this.getAttribute('data-destination')
    return rectangles[key as keyof typeof rectangles] ?? new DOMRect()
  })
  const wrapper = mount(YlfNavigation, {
    props: { label: '主导航' },
    slots: {
      default: () => ['help', 'blog'].map(id => h(YlfNavigationLink, {
        'href': `/${id}`,
        'active': active.value === id,
        'data-destination': id,
      }, () => id)),
    },
  })
  return { wrapper, active, rectangles, resize: () => notifyResize(), disconnect }
}

describe('site navigation', () => {
  it('moves the same underline between current links and hides it with no selection', async () => {
    const { wrapper, active } = mountMeasuredNavigation()
    const marker = () => wrapper.find('.ylf-navigation__indicator')
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(110px, 38px)'))
    const element = marker().element
    expect(marker().attributes('aria-hidden')).toBe('true')
    active.value = 'help'
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(22px, 38px)'))
    expect(marker().element).toBe(element)
    active.value = 'blog'
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(110px, 38px)'))
    expect(marker().element).toBe(element)
    active.value = null
    await vi.waitFor(() => expect(marker().exists()).toBe(false))
  })

  it('realigns the underline when link widths or wrapping change', async () => {
    const { wrapper, rectangles, resize } = mountMeasuredNavigation()
    const marker = () => wrapper.find('.ylf-navigation__indicator')
    await vi.waitFor(() => expect(marker().exists()).toBe(true))
    rectangles.blog = new DOMRect(100, 102, 120, 44)
    rectangles.nav = new DOMRect(100, 50, 180, 96)
    resize()
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(52px, 90px)'))
  })

  it('keeps vertical and opted-out navigation static and releases observers', async () => {
    const { wrapper, disconnect } = mountMeasuredNavigation()
    await vi.waitFor(() => expect(wrapper.find('.ylf-navigation__indicator').exists()).toBe(true))
    await wrapper.setProps({ orientation: 'vertical' })
    await vi.waitFor(() => expect(wrapper.find('.ylf-navigation__indicator').exists()).toBe(false))
    expect(wrapper.get('[aria-current="page"]').attributes('href')).toBe('/blog')
    await wrapper.setProps({ orientation: 'horizontal', animated: false })
    await flushPromises()
    expect(wrapper.find('.ylf-navigation__indicator').exists()).toBe(false)
    await wrapper.setProps({ animated: true })
    await vi.waitFor(() => expect(wrapper.find('.ylf-navigation__indicator').exists()).toBe(true))
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('names the landmark and updates the current destination', async () => {
    const wrapper = mount(YlfNavigation, {
      props: { label: '主导航', orientation: 'vertical' },
      slots: { default: () => h(YlfNavigationLink, { href: '/blog', active: true }, () => '博客') },
    })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('主导航')
    expect(wrapper.get('a').attributes('href')).toBe('/blog')
    expect(wrapper.get('a').attributes('aria-current')).toBe('page')
    const link = mount(YlfNavigationLink, { props: { active: true }, attrs: { href: '/docs' } })
    await link.setProps({ active: false })
    expect(link.attributes('aria-current')).toBeUndefined()
    expect(link.attributes('href')).toBe('/docs')
  })

  it('composes one router anchor without losing attributes or click handlers', async () => {
    const childClick = vi.fn()
    const wrapperClick = vi.fn()
    const RouterLink = defineComponent({
      props: { to: { type: String, required: true } },
      setup: (props, { slots }) => () => h('a', { href: props.to }, slots.default?.()),
    })
    const wrapper = mount(YlfNavigationLink, {
      props: { asChild: true, active: true },
      attrs: { 'aria-label': '查看博客', 'onClick': wrapperClick },
      slots: { default: () => h(RouterLink, { to: '/blog', onClick: childClick }, () => '博客') },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.find('a a').exists()).toBe(false)
    expect(wrapper.attributes('href')).toBe('/blog')
    expect(wrapper.attributes('aria-current')).toBe('page')
    expect(wrapper.attributes('aria-label')).toBe('查看博客')
    await wrapper.trigger('click')
    expect(wrapperClick).toHaveBeenCalledOnce()
    expect(childClick).toHaveBeenCalledOnce()
  })

  it('lets the menu own expanded state and respond to Enter and Escape', async () => {
    const wrapper = mount(YlfDropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: '应用', value: 'apps' }] },
      slots: { trigger: () => h(YlfNavigationTrigger, {}, () => '官网') },
    })
    const trigger = wrapper.get('button')
    expect(trigger.attributes('type')).toBe('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!
    expect(menu).not.toBeNull()
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('keeps a disabled menu trigger native and non-submitting', () => {
    const click = vi.fn()
    const wrapper = mount(YlfNavigationTrigger, { props: { disabled: true }, attrs: { onClick: click } })
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('disabled')).toBeDefined()
    wrapper.element.click()
    expect(click).not.toHaveBeenCalled()
  })
})
