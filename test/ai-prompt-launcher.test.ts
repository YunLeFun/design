// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YlfAiPromptLauncher from '../packages/vue/components/YlfAiPromptLauncher.vue'

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('aI prompt launcher', () => {
  it('renders six local logos, native prefill links and accessible copy buttons', () => {
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: '你好 🌟' } })
    expect(wrapper.findAll('nav img')).toHaveLength(6)
    expect(wrapper.findAll('nav a')).toHaveLength(4)
    expect(wrapper.findAll('nav button')).toHaveLength(2)
    expect(wrapper.get('[data-provider="chatgpt"]').attributes('rel')).toBe('noopener noreferrer')
    expect(new URL(wrapper.get('[data-provider="claude"]').attributes('href')).searchParams.get('q')).toBe('你好 🌟')
    wrapper.unmount()
  })

  it('does not expose a prompt URL or launch when disabled or empty', async () => {
    const launch = vi.fn()
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: 'secret', disabled: true } })
    expect(wrapper.get('[data-provider="chatgpt"]').attributes('href')).toBeUndefined()
    await wrapper.setProps({ disabled: false, prompt: ' ', launch })
    await wrapper.get('[data-provider="chatgpt"]').trigger('click')
    expect(launch).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('uses native host adapters, preserves the exact prompt, and prevents duplicate launch', async () => {
    let finish!: (status: 'opened') => void
    const launch = vi.fn(() => new Promise<'opened'>((resolve) => {
      finish = resolve
    }))
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: '全文\nA&B 🌟', launch, providers: ['cursor', 'chatgpt'], locale: 'en' } })
    await wrapper.get('[data-provider="cursor"]').trigger('click')
    expect(launch).toHaveBeenCalledWith(expect.objectContaining({ mode: 'link', provider: expect.objectContaining({ id: 'cursor' }) }), '全文\nA&B 🌟')
    await wrapper.get('[data-provider="chatgpt"]').trigger('click')
    expect(launch).toHaveBeenCalledTimes(1)
    finish('opened')
    await flushPromises()
    expect(wrapper.emitted('busy')).toEqual([[true], [false]])
    expect(wrapper.emitted('result')?.[0]?.[0]).toMatchObject({ status: 'opened' })
    wrapper.unmount()
  })

  it('selects full manual text when clipboard access fails', async () => {
    vi.stubGlobal('navigator', {})
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: '请完整保留这段内容 🌟' }, attachTo: document.body })
    await wrapper.get('.ylf-ai-launcher__actions button').trigger('click')
    await flushPromises()
    const textarea = wrapper.get('textarea').element
    expect(document.activeElement).toBe(textarea)
    expect(textarea.selectionEnd - textarea.selectionStart).toBe(textarea.value.length)
    expect(wrapper.get('details').attributes('open')).toBeDefined()
    wrapper.unmount()
  })

  it('reports manual copies so hosts can bind the response to the displayed snapshot', async () => {
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: '完整的文章快照' } })
    await wrapper.get('textarea').trigger('copy')
    expect(wrapper.emitted('manualCopy')).toEqual([['完整的文章快照']])
    wrapper.unmount()
  })

  it('does not announce a stale async result after the prompt changes', async () => {
    let finish!: () => void
    const copyText = vi.fn(() => new Promise<void>((resolve) => {
      finish = resolve
    }))
    const wrapper = mount(YlfAiPromptLauncher, { props: { prompt: 'old', copyText } })
    await wrapper.get('.ylf-ai-launcher__actions button').trigger('click')
    await wrapper.setProps({ prompt: 'new' })
    finish()
    await flushPromises()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(copyText).toHaveBeenCalledWith('old')
    wrapper.unmount()
  })
})
