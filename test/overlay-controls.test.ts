// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import YlfDialog from '../packages/vue/components/YlfDialog.vue'
import YlfDropdownMenu from '../packages/vue/components/YlfDropdownMenu.vue'
import YlfPopover from '../packages/vue/components/YlfPopover.vue'
import YlfSelect from '../packages/vue/components/YlfSelect.vue'
import YlfTooltip from '../packages/vue/components/YlfTooltip.vue'

enableAutoUnmount(cleanup => afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
}))

function createThemeTarget() {
  const target = document.createElement('div')
  target.id = 'theme-portal'
  target.className = 'ylf-theme-dark'
  document.body.append(target)
  return target
}

describe('overlay public interfaces', () => {
  it('puts Dialog content and attributes in the requested theme boundary', async () => {
    const target = createThemeTarget()
    const wrapper = mount(YlfDialog, {
      attachTo: document.body,
      props: { open: true, title: '发布确认', portalTo: target },
      attrs: { 'id': 'publish-dialog', 'class': 'custom-dialog', 'aria-describedby': 'custom-description' },
      slots: { default: '<p id="custom-description">自定义说明</p>' },
    })
    await flushPromises()
    const dialog = target.querySelector<HTMLElement>('[role="dialog"]')!
    expect(dialog.id).toBe('publish-dialog')
    expect(dialog.classList.contains('custom-dialog')).toBe(true)
    expect(dialog.getAttribute('aria-describedby')).toBe('custom-description')
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(wrapper.emitted('update:open')).toContainEqual([false])
  })

  it('opens Popover into a selector target and forwards its accessible name', async () => {
    const target = createThemeTarget()
    const wrapper = mount(YlfPopover, {
      attachTo: document.body,
      props: { portalTo: '#theme-portal' },
      attrs: { 'aria-label': '帮助信息', 'data-section': 'help', 'class': 'custom-popover' },
      slots: { trigger: '<button>帮助</button>', default: '<button>帮助正文</button>' },
    })
    await flushPromises()
    await wrapper.get('button').trigger('click')
    await flushPromises()
    const content = target.querySelector<HTMLElement>('[role="dialog"]')!
    expect(content.dataset.section).toBe('help')
    expect(content.classList.contains('custom-popover')).toBe(true)
    expect(content.getAttribute('aria-label')).toBe('帮助信息')
    expect(content.textContent).toContain('帮助正文')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('supports controlled menu state, disabled items and empty string values', async () => {
    const target = createThemeTarget()
    const wrapper = mount(YlfDropdownMenu, {
      attachTo: document.body,
      props: {
        open: true,
        portalTo: target,
        items: [{ label: '禁用', value: 'disabled', disabled: true }, { label: '全部项目', value: '' }],
      },
      attrs: { 'aria-label': '项目范围' },
      slots: { trigger: '<button>范围</button>' },
    })
    await flushPromises()
    const menu = target.querySelector<HTMLElement>('[role="menu"]')!
    expect(menu.getAttribute('aria-label')).toBe('项目范围')
    const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
    items[0].click()
    await flushPromises()
    expect(wrapper.emitted('select')).toBeUndefined()
    items[1].click()
    await flushPromises()
    expect(wrapper.emitted('select')).toEqual([['']])
    expect(wrapper.emitted('update:open')).toContainEqual([false])
  })

  it('keeps Select options in the local theme container', async () => {
    const target = createThemeTarget()
    const wrapper = mount(YlfSelect, {
      attachTo: document.body,
      props: { portalTo: target, options: [{ value: 'blue', label: '晴空蓝' }] },
      attrs: { 'aria-label': '主题颜色' },
    })
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    expect(target.querySelector('[role="option"]')?.textContent).toContain('晴空蓝')
  })

  it('forwards Tooltip attributes to its trigger and skips disabled content', async () => {
    const target = createThemeTarget()
    const wrapper = mount(YlfTooltip, {
      attachTo: document.body,
      props: { portalTo: target, content: '查看帮助', disabled: true },
      attrs: { 'id': 'help-trigger', 'aria-label': '帮助' },
      slots: { default: '<button>?</button>' },
    })
    const trigger = wrapper.get('button')
    expect(trigger.attributes('id')).toBe('help-trigger')
    expect(trigger.attributes('aria-label')).toBe('帮助')
    await trigger.trigger('focus')
    await flushPromises()
    expect(target.querySelector('[role="tooltip"]')).toBeNull()
    await wrapper.setProps({ disabled: false })
    await trigger.trigger('focus')
    await flushPromises()
    expect(target.querySelector('[role="tooltip"]')?.textContent).toBe('查看帮助')
  })
})
