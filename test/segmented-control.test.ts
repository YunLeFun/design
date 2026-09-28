// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YlfSegmentedControl from '../packages/vue/components/YlfSegmentedControl.vue'

const options = [
  { value: 'grid', label: '网格视图' },
  { value: 'list', label: '列表视图' },
  { value: 'timeline', label: '时间线', disabled: true },
]

describe('segmented choices', () => {
  it('keeps the selected choice when clicked again and emits valid changes', async () => {
    const wrapper = mount(YlfSegmentedControl, { props: { modelValue: 'grid', options, label: '资源视图' } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['list']])
    await wrapper.setProps({ modelValue: 'list' })
    expect(buttons[0].attributes('aria-pressed')).toBe('false')
    expect(buttons[1].attributes('aria-pressed')).toBe('true')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['list']])
    wrapper.unmount()
  })

  it('prevents disabled choices and group interaction', async () => {
    const wrapper = mount(YlfSegmentedControl, { props: { modelValue: 'grid', options, label: '资源视图' } })
    expect(wrapper.findAll('button')[2].attributes('disabled')).toBeDefined()
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ disabled: true })
    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('disabled')).toBeDefined()
      await button.trigger('click')
    }
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps accessible names for icon-only choices and forwards group attributes', async () => {
    const wrapper = mount(YlfSegmentedControl, {
      props: { modelValue: 'grid', options, label: '资源视图', iconOnly: true },
      attrs: { id: 'view-switch' },
      slots: { icon: '<i class="test-icon" />' },
    })
    await flushPromises()
    expect(wrapper.attributes('aria-label')).toBe('资源视图')
    expect(wrapper.attributes('id')).toBe('view-switch')
    expect(wrapper.findAll('button').map(button => button.attributes('aria-label'))).toEqual(options.map(option => option.label))
    expect(wrapper.find('.ylf-segmented__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.ylf-segmented__label').exists()).toBe(false)
    wrapper.unmount()
  })
})
