// @vitest-environment happy-dom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import NavigationIndicator from '../packages/vitepress-theme-yunlefun/components/NavigationIndicator.vue'

vi.mock('vitepress', () => ({ useData: () => ({ theme: ref({ nav: [] }) }) }))
enableAutoUnmount(cleanup => afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
}))

describe('native VitePress navigation adapter', () => {
  it('moves between direct links and hides the marker for active dropdown groups', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.classList.contains('VPNavBarMenu'))
        return new DOMRect(100, 10, 400, 44)
      return new DOMRect(this.getAttribute('href') === '/vue/' ? 220 : 100, 10, 100, 44)
    })
    const wrapper = mount({
      components: { NavigationIndicator },
      template: `<header>
        <NavigationIndicator />
        <nav class="VPNavBarMenu">
          <a class="VPNavBarMenuLink active" href="/guide/">Guide</a>
          <a class="VPNavBarMenuLink" href="/vue/">Components</a>
          <div class="VPNavBarMenuGroup"><button aria-expanded="false">More</button></div>
        </nav>
      </header>`,
    }, { attachTo: document.body })
    const marker = () => wrapper.find('.ylf-docs-nav-indicator')
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(42px, 38px)'))
    const element = marker().element
    wrapper.get('[href="/guide/"]').element.classList.remove('active')
    wrapper.get('[href="/vue/"]').element.classList.add('active')
    await vi.waitFor(() => expect(marker().attributes('style')).toContain('translate(162px, 38px)'))
    expect(marker().element).toBe(element)
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('[href="/guide/"]').attributes('href')).toBe('/guide/')
    wrapper.get('[href="/vue/"]').element.classList.remove('active')
    wrapper.get('.VPNavBarMenuGroup').element.classList.add('active')
    await vi.waitFor(() => expect(marker().exists()).toBe(false))
    expect(wrapper.get('.VPNavBarMenuGroup').classes()).toContain('active')
    wrapper.unmount()
    expect(document.querySelector('.ylf-docs-nav-indicator')).toBeNull()
  })
})
