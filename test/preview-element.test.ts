// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { previewElement } from '../packages/utils/previewElement/index'

describe('previewElement utility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('keeps clone enabled when only scale is supplied, strips duplicate IDs, and restores focus on Escape', async () => {
    const trigger = document.createElement('button')
    trigger.id = 'preview-source'
    trigger.innerHTML = '<span id="inner-badge">Preview</span>'
    document.body.appendChild(trigger)
    trigger.focus()

    await previewElement(trigger, { scale: 3 })

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(dialog).toBeTruthy()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(dialog)

    const clonedTrigger = dialog.querySelector('button')!
    expect(clonedTrigger).not.toBe(trigger)
    expect(clonedTrigger.style.transform).toBe('scale(3)')
    expect(clonedTrigger.hasAttribute('id')).toBe(false)
    expect(clonedTrigger.querySelector('[id]')).toBeNull()
    expect(document.getElementById('preview-source')).toBe(trigger)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('restores original transform and click listener in non-clone mode', async () => {
    const wrapper = document.createElement('div')
    const target = document.createElement('button')
    target.style.transform = 'rotate(4deg)'
    const clickSpy = vi.fn()
    target.addEventListener('click', clickSpy)
    wrapper.appendChild(target)
    document.body.appendChild(wrapper)

    await previewElement(target, { clone: false, scale: 2 })
    expect(target.style.transform).toBe('scale(2)')

    target.click()
    expect(clickSpy).not.toHaveBeenCalled()

    const overlay = document.body.querySelector('[role="dialog"] > div') as HTMLElement
    overlay.click()

    expect(target.style.transform).toBe('rotate(4deg)')
    expect(target.parentElement).toBe(wrapper)
    target.click()
    expect(clickSpy).toHaveBeenCalledOnce()
  })
})
