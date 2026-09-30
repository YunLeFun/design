// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YlfAvatar from '../packages/vue/components/YlfAvatar.vue'
import YlfProgress from '../packages/vue/components/YlfProgress.vue'
import YlfSeparator from '../packages/vue/components/YlfSeparator.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.useRealTimers())

describe('display controls', () => {
  it.each([
    { value: 40, max: 80, expected: '40', expectedMax: '80', transform: 'translateX(-50%)' },
    { value: 120, max: 100, expected: '100', expectedMax: '100', transform: 'translateX(-0%)' },
    { value: -20, max: 100, expected: '0', expectedMax: '100', transform: 'translateX(-100%)' },
    { value: 40, max: 0, expected: '40', expectedMax: '100', transform: 'translateX(-60%)' },
    { value: 40, max: Number.POSITIVE_INFINITY, expected: '40', expectedMax: '100', transform: 'translateX(-60%)' },
  ])('keeps progress visuals and ARIA consistent for $value / $max', ({ value, max, expected, expectedMax, transform }) => {
    const wrapper = mount(YlfProgress, { props: { value, max }, attrs: { 'aria-label': '上传进度' } })
    const progress = wrapper.get('[role="progressbar"]')
    expect(progress.attributes('aria-label')).toBe('上传进度')
    expect(progress.attributes('aria-valuenow')).toBe(expected)
    expect(progress.attributes('aria-valuemax')).toBe(expectedMax)
    expect(wrapper.get('.ylf-progress__indicator').attributes('style')).toContain(transform)
  })

  it.each([null, Number.NaN, Number.POSITIVE_INFINITY])('exposes unknown progress without an invalid numeric value (%s)', async (value) => {
    const wrapper = mount(YlfProgress, { props: { value }, attrs: { 'aria-label': '正在上传' } })
    const progress = wrapper.get('[role="progressbar"]')
    expect(progress.attributes('aria-valuenow')).toBeUndefined()
    expect(progress.attributes('data-state')).toBe('indeterminate')
    expect(wrapper.get('.ylf-progress__indicator').attributes('style') ?? '').not.toMatch(/NaN|Infinity/)
    await wrapper.setProps({ value: 100 })
    expect(progress.attributes('data-state')).toBe('complete')
  })

  it('names avatar fallbacks with the full alternative text', async () => {
    vi.useFakeTimers()
    const wrapper = mount(YlfAvatar, { props: { alt: '云乐坊用户', fallback: '云' } })
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('云乐坊用户')
    expect(wrapper.get('[role="img"]').text()).toBe('云')
  })

  it('distinguishes decorative separators from meaningful sections', async () => {
    const wrapper = mount(YlfSeparator)
    expect(wrapper.attributes('role')).toBe('none')
    await wrapper.setProps({ decorative: false, orientation: 'vertical' })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })
})
