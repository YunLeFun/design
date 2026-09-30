// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import YlfAccordion from '../packages/vue/components/YlfAccordion.vue'
import YlfTabs from '../packages/vue/components/YlfTabs.vue'

enableAutoUnmount(afterEach)

describe('disclosure controls', () => {
  it('connects tabs with their panels and prevents disabled selection', async () => {
    const wrapper = mount(YlfTabs, {
      props: {
        modelValue: 'one',
        items: [{ value: 'one', label: '第一项' }, { value: 'disabled', label: '禁用项', disabled: true }, { value: 'two', label: '第二项' }],
      },
      slots: { one: '第一项内容', two: '第二项内容' },
    })
    const tabs = wrapper.findAll('[role="tab"]')
    await flushPromises()
    const panel = wrapper.get('[role="tabpanel"]')
    expect(panel.attributes('aria-labelledby')).toBe(tabs[0].attributes('id'))
    expect(tabs[0].attributes('aria-controls')).toBe(panel.attributes('id'))
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await tabs[2].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['two']])
    await wrapper.setProps({ modelValue: 'two' })
    await flushPromises()
    expect(wrapper.get('[role="tabpanel"]:not([hidden])').text()).toBe('第二项内容')
    expect(tabs[2].attributes('aria-selected')).toBe('true')
  })

  it('opens and collapses a single accordion while preventing disabled items', async () => {
    const wrapper = mount(YlfAccordion, {
      props: { items: [{ value: 'one', title: '第一项', content: '第一项内容' }, { value: 'disabled', title: '禁用项', disabled: true }] },
    })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['one']])
    expect(buttons[0].attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('第一项内容')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
  })

  it('keeps multiple accordion sections open and renders named slots', async () => {
    const wrapper = mount(YlfAccordion, {
      props: { type: 'multiple', items: [{ value: 'one', title: '第一项' }, { value: 'two', title: '第二项' }] },
      slots: { one: '自定义第一项', two: '自定义第二项' },
    })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['one', 'two']])
    expect(buttons.every(button => button.attributes('aria-expanded') === 'true')).toBe(true)
    expect(wrapper.text()).toContain('自定义第二项')
  })
})
