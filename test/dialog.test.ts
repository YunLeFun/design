// @vitest-environment happy-dom

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import YlfDialog from '../packages/vue/components/YlfDialog.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

async function mountOpenDialog(props: Record<string, unknown> = {}) {
  const wrapper = mount(YlfDialog, {
    attachTo: document.body,
    props: {
      open: true,
      ...props,
    },
    slots: {
      default: '<button type="button">继续</button>',
    },
  })

  await flushPromises()
  const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')
  expect(dialog).not.toBeNull()

  return { dialog: dialog!, wrapper }
}

describe('ylfDialog accessibility', () => {
  it('links a visible title and description to the dialog', async () => {
    const { dialog, wrapper } = await mountOpenDialog({
      title: '发布作品',
      description: '发布后所有访客都能看到。',
    })

    const titleId = dialog.getAttribute('aria-labelledby')
    const descriptionId = dialog.getAttribute('aria-describedby')

    expect(titleId).toBeTruthy()
    expect(descriptionId).toBeTruthy()
    expect(document.getElementById(titleId!)?.textContent).toContain('发布作品')
    expect(document.getElementById(descriptionId!)?.textContent).toContain('发布后所有访客都能看到。')

    wrapper.unmount()
  })

  it('provides a hidden accessible title and omits an empty description relation', async () => {
    const { dialog, wrapper } = await mountOpenDialog({
      accessibleTitle: '作品发布确认',
    })

    const titleId = dialog.getAttribute('aria-labelledby')

    expect(titleId).toBeTruthy()
    expect(document.getElementById(titleId!)?.textContent).toContain('作品发布确认')
    expect(dialog.hasAttribute('aria-describedby')).toBe(false)

    wrapper.unmount()
  })

  it('closes on Escape and exposes an accessible close control', async () => {
    const { wrapper } = await mountOpenDialog({ title: '键盘测试' })
    const close = document.body.querySelector<HTMLButtonElement>('.ylf-dialog__close')

    expect(close?.getAttribute('aria-label')).toBe('关闭')

    document.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    }))
    await flushPromises()

    expect(wrapper.emitted('update:open')).toContainEqual([false])

    wrapper.unmount()
  })
})
