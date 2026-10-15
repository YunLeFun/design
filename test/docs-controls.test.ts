// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import AgUiComposer from '../packages/.vitepress/theme/components/ag-ui/AgUiComposer.vue'
import AgUiDraftForm from '../packages/.vitepress/theme/components/ag-ui/AgUiDraftForm.vue'
import DemoContainer from '../packages/.vitepress/theme/components/DemoContainer.vue'
import YlfButton from '../packages/vue/components/YlfButton.vue'
import YlfInput from '../packages/vue/components/YlfInput.vue'

vi.mock('vitepress', () => ({ useData: () => ({ lang: ref('en') }), withBase: (path: string) => path }))
enableAutoUnmount(cleanup => afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
}))

describe('documentation consumes shared controls', () => {
  it('switches preview width and theme and exposes the matching source region', async () => {
    const wrapper = mount(DemoContainer, {
      attachTo: document.body,
      props: { name: 'button', source: 'https://github.com/YunLeFun/design' },
      slots: { default: '<button>Example</button>', source: '<pre>Source code</pre>' },
    })
    const mobile = wrapper.get('[aria-label="Mobile width 390px"]')
    await mobile.trigger('click')
    expect(mobile.attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.ylf-demo-preview__frame').attributes('style')).toContain('390px')
    await wrapper.get('[aria-label="Dark preview"]').trigger('click')
    expect(wrapper.get('.ylf-demo-preview__frame').classes()).toContain('ylf-theme-dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    const source = wrapper.get('[aria-label="View source"]')
    await source.trigger('click')
    expect(source.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get(`#${source.attributes('aria-controls')}`).isVisible()).toBe(true)
    await source.trigger('click')
    expect(wrapper.get('.ylf-demo-preview__source').isVisible()).toBe(false)
  })

  it('updates a draft through shared inputs without mutating the supplied draft', async () => {
    const draft = { title: 'Workshop', audience: 'Creators', tone: 'friendly' as const }
    const wrapper = mount(AgUiDraftForm, { props: { draft, submitted: false, disabled: false, english: true } })
    await wrapper.findAll('input.ylf-input')[0].setValue('Updated workshop')
    expect(wrapper.emitted('update')).toEqual([[{ ...draft, title: 'Updated workshop' }]])
    expect(draft.title).toBe('Workshop')
    expect(wrapper.get('[role="combobox"]').text()).toContain('Friendly')
    await wrapper.setProps({ submitted: true })
    expect(wrapper.get('input.ylf-input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[role="combobox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('confirmed and returned')
  })

  it('submits the edited message once and keeps the explicit submit button type', async () => {
    const wrapper = mount(AgUiComposer, { props: { scenario: 'stream', english: true, disabled: false, isRunning: false, canRetry: false } })
    await wrapper.get('input').setValue('Try the shared field')
    expect(wrapper.get('button').attributes('type')).toBe('submit')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toEqual([['Try the shared field']])
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})

describe('shared native controls', () => {
  it('keeps IME text uncommitted until composition ends and forwards field semantics', async () => {
    const wrapper = mount(YlfInput, {
      props: { modelValue: '', invalid: true },
      attrs: { 'name': 'title', 'required': true, 'aria-label': 'Title', 'aria-describedby': 'title-error' },
    })
    const input = wrapper.get('input')
    await input.trigger('compositionstart')
    ;(input.element as HTMLInputElement).value = '云'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await input.trigger('compositionend')
    expect(wrapper.emitted('update:modelValue')).toEqual([['云']])
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('title-error')
    expect(input.attributes('name')).toBe('title')
    expect(input.attributes('required')).toBeDefined()
  })

  it('submits enabled native fields and leaves toolbar icon buttons out of submission', async () => {
    const wrapper = mount({
      components: { YlfButton, YlfInput },
      template: `<form>
        <YlfInput model-value="Title" name="title" aria-label="Title" />
        <YlfInput model-value="Private" name="disabled" disabled aria-label="Disabled" />
        <YlfButton icon-only aria-label="Source"><span aria-hidden="true">+</span></YlfButton>
      </form>`,
    }, { attachTo: document.body })
    await flushPromises()
    const data = new FormData(wrapper.element as HTMLFormElement)
    expect(data.get('title')).toBe('Title')
    expect(data.has('disabled')).toBe(false)
    expect(wrapper.get('button').attributes('type')).toBe('button')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Source')
  })
})
