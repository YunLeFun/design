// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YlfCheckbox from '../packages/vue/components/YlfCheckbox.vue'
import YlfRadioGroup from '../packages/vue/components/YlfRadioGroup.vue'
import YlfSelect from '../packages/vue/components/YlfSelect.vue'
import YlfSlider from '../packages/vue/components/YlfSlider.vue'
import YlfSwitch from '../packages/vue/components/YlfSwitch.vue'

enableAutoUnmount(cleanup => afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
}))

const options = [
  { label: '晴空蓝', value: 'blue' },
  { label: '禁用项', value: 'disabled', disabled: true },
  { label: '明黄', value: 'sun' },
]

describe('form controls', () => {
  it('exposes checkbox mixed state and updates the public model', async () => {
    const wrapper = mount(YlfCheckbox, {
      props: { modelValue: 'indeterminate' },
      attrs: { 'aria-label': '选择所有项目' },
    })
    const checkbox = wrapper.get('[role="checkbox"]')
    expect(checkbox.attributes('aria-checked')).toBe('mixed')
    expect(checkbox.attributes('aria-label')).toBe('选择所有项目')
    await checkbox.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.setProps({ modelValue: false, disabled: true })
    await checkbox.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(checkbox.attributes('aria-checked')).toBe('false')
  })

  it('submits checked checkbox and switch values and excludes disabled fields', async () => {
    const wrapper = mount({
      components: { YlfCheckbox, YlfSwitch },
      template: `<form>
        <YlfCheckbox :model-value="true" name="consent" value="yes" aria-label="同意" />
        <YlfSwitch :model-value="true" name="notifications" value="on" aria-label="通知" />
        <YlfCheckbox :model-value="true" name="disabled" value="yes" disabled aria-label="禁用" />
      </form>`,
    }, { attachTo: document.body })
    await flushPromises()
    const data = new FormData(wrapper.element as HTMLFormElement)
    expect(data.get('consent')).toBe('yes')
    expect(data.get('notifications')).toBe('on')
    expect(data.has('disabled')).toBe(false)
  })

  it('updates switch state with Enter and prevents disabled interaction', async () => {
    const wrapper = mount(YlfSwitch, { props: { modelValue: false }, attrs: { 'aria-label': '通知' } })
    const control = wrapper.get('[role="switch"]')
    await control.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true, disabled: true })
    await control.trigger('click')
    await control.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(control.attributes('aria-checked')).toBe('true')
  })

  it('selects radio values, preserves names and prevents disabled choices', async () => {
    const wrapper = mount(YlfRadioGroup, {
      props: { options, modelValue: 'blue' },
      attrs: { 'aria-label': '主题颜色' },
    })
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-label')).toBe('主题颜色')
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].attributes('aria-checked')).toBe('true')
    await radios[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await radios[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['sun']])
    await wrapper.setProps({ disabled: true })
    for (const radio of radios)
      expect(radio.attributes('disabled')).toBeDefined()
  })

  it('names each slider thumb and preserves keyboard stepping and bounds', async () => {
    const wrapper = mount(YlfSlider, {
      attachTo: document.body,
      props: { modelValue: [40], label: '音量', step: 5 },
    })
    await flushPromises()
    const thumb = wrapper.get('[role="slider"]')
    expect(thumb.attributes('aria-label')).toBe('音量')
    expect(thumb.attributes('aria-valuenow')).toBe('40')
    ;(thumb.element as HTMLElement).focus()
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[[45]]])
    expect(wrapper.emitted('valueCommit')).toEqual([[[45]]])
    await wrapper.setProps({ modelValue: [45] })
    await thumb.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[100]])
    await wrapper.setProps({ disabled: true })
    expect(thumb.attributes('tabindex')).toBeUndefined()
  })

  it('selects the focused radio after a fast arrow key tap and skips disabled items', async () => {
    const wrapper = mount(YlfRadioGroup, {
      attachTo: document.body,
      props: { options, modelValue: 'blue' },
      attrs: { 'aria-label': '主题颜色' },
    })
    await flushPromises()
    const radios = wrapper.findAll('[role="radio"]')
    ;(radios[0].element as HTMLElement).focus()
    await radios[0].trigger('keydown', { key: 'ArrowDown' })
    await radios[0].trigger('keyup', { key: 'ArrowDown' })
    await flushPromises()
    expect(document.activeElement).toBe(radios[2].element)
    expect(wrapper.emitted('update:modelValue')).toEqual([['sun']])
    await wrapper.setProps({ modelValue: 'sun' })
    await radios[2].trigger('keydown', { key: 'ArrowUp', ctrlKey: true })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('assigns distinct accessible names to range endpoints', async () => {
    const wrapper = mount(YlfSlider, {
      props: { modelValue: [20, 70], thumbLabels: ['最低价格', '最高价格'] },
    })
    await flushPromises()
    expect(wrapper.findAll('[role="slider"]').map(thumb => thumb.attributes('aria-label'))).toEqual(['最低价格', '最高价格'])
  })

  it('submits Select through its form name and forwards trigger labels', async () => {
    const wrapper = mount({
      components: { YlfSelect },
      data: () => ({ options, selected: 'blue' }),
      template: `<form>
        <YlfSelect v-model="selected" :options="options" name="color" required id="color" aria-label="主题颜色" />
      </form>`,
    }, { attachTo: document.body })
    await flushPromises()
    await vi.waitFor(() => expect(new FormData(wrapper.element as HTMLFormElement).get('color')).toBe('blue'))
    const trigger = wrapper.get('[role="combobox"]')
    expect(trigger.attributes('id')).toBe('color')
    expect(trigger.attributes('aria-label')).toBe('主题颜色')
    expect(trigger.attributes('aria-required')).toBe('true')
    expect(trigger.attributes('name')).toBeUndefined()
    await wrapper.setData({ selected: 'sun' })
    await vi.waitFor(() => expect(new FormData(wrapper.element as HTMLFormElement).get('color')).toBe('sun'))
  })

  it('disables both the Select trigger and its native form field', async () => {
    const wrapper = mount({
      components: { YlfSelect },
      data: () => ({ options }),
      template: '<form><YlfSelect model-value="blue" :options="options" name="color" disabled aria-label="主题颜色" /></form>',
    }, { attachTo: document.body })
    await flushPromises()
    expect(wrapper.get('[role="combobox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('select').attributes('disabled')).toBeDefined()
  })
})
