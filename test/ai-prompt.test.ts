import { afterEach, describe, expect, it, vi } from 'vitest'
import { aiProviders, buildAiPromptTarget, copyAndOpenAiPrompt } from '../packages/vue/components/ai-prompt'

afterEach(() => vi.unstubAllGlobals())

describe('aI prompt handoff', () => {
  const prompt = '中文 🌟\nA&B? x=1#2 + 100% https://example.com/?a=1&b=2'
  it.each(['deepseek', 'chatgpt', 'claude', 'cursor'] as const)('round trips a complete prompt through %s', (provider) => {
    const target = buildAiPromptTarget(provider, prompt)
    const url = new URL(target.url)
    expect(target.mode).toBe('link')
    expect(url.searchParams.get(provider === 'cursor' ? 'text' : 'q')).toBe(prompt)
    expect(url.searchParams.has('autosend')).toBe(false)
    expect(url.searchParams.has('hints')).toBe(false)
    expect(url.hash).toBe('')
  })
  it('only opts ChatGPT into search when requested', () => {
    expect(new URL(buildAiPromptTarget('chatgpt', prompt, { chatgptSearch: true }).url).searchParams.get('hints')).toBe('search')
    expect(new URL(buildAiPromptTarget('claude', prompt, { chatgptSearch: true }).url).searchParams.has('hints')).toBe(false)
  })
  it.each(aiProviders)('never leaks or truncates long/empty text into the $id fallback', ({ id, url }) => {
    expect(buildAiPromptTarget(id, '文章'.repeat(10000)).url).toBe(url)
    expect(buildAiPromptTarget(id, '文章'.repeat(10000)).mode).toBe('copy')
    expect(buildAiPromptTarget(id, '  \n')).toMatchObject({ url, mode: 'copy', reason: 'empty' })
  })
  it('counts encoded characters and enforces the Cursor limit even with an override', () => {
    const exact = buildAiPromptTarget('deepseek', prompt).url.length
    expect(buildAiPromptTarget('deepseek', prompt, { maxUrlLength: exact }).mode).toBe('link')
    expect(buildAiPromptTarget('deepseek', prompt, { maxUrlLength: exact - 1 }).reason).toBe('too-long')
    expect(buildAiPromptTarget('cursor', '中'.repeat(1500), { maxUrlLength: 50000 }).reason).toBe('too-long')
    expect(() => buildAiPromptTarget('unknown' as never, prompt)).toThrow('Unknown AI provider')
  })

  function setup(copying: Promise<void>, blocked = false) {
    const popup = { opener: {}, closed: false, close: vi.fn(), location: { replace: vi.fn() } }
    const writeText = vi.fn(() => copying)
    const open = vi.fn(() => blocked ? null : popup)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    vi.stubGlobal('window', { open })
    return { popup, writeText, open }
  }
  it('copies all text before reserving a detached tab, then navigates after success', async () => {
    let finish!: () => void
    const { popup, writeText, open } = setup(new Promise<void>((resolve) => {
      finish = resolve
    }))
    const result = copyAndOpenAiPrompt(buildAiPromptTarget('yuanbao', prompt), prompt)
    expect(writeText).toHaveBeenCalledWith(prompt)
    expect(writeText.mock.invocationCallOrder[0]).toBeLessThan(open.mock.invocationCallOrder[0]!)
    expect(popup.opener).toBeNull()
    expect(popup.location.replace).not.toHaveBeenCalled()
    finish()
    expect(await result).toBe('opened')
    expect(popup.location.replace).toHaveBeenCalledWith('https://yuanbao.tencent.com/')
  })
  it('closes the reserved tab when copying fails', async () => {
    const { popup } = setup(Promise.reject(new Error('denied')))
    expect(await copyAndOpenAiPrompt(buildAiPromptTarget('doubao', prompt), prompt)).toBe('copy-failed')
    expect(popup.close).toHaveBeenCalledOnce()
    expect(popup.location.replace).not.toHaveBeenCalled()
  })
  it('does not open a tab when clipboard access is unavailable', async () => {
    const { open } = setup(Promise.resolve())
    vi.stubGlobal('navigator', {})
    expect(await copyAndOpenAiPrompt(buildAiPromptTarget('doubao', prompt), prompt)).toBe('copy-failed')
    expect(open).not.toHaveBeenCalled()
  })
  it('keeps the complete clipboard fallback when popups are blocked or closed', async () => {
    const { writeText } = setup(Promise.resolve(), true)
    expect(await copyAndOpenAiPrompt(buildAiPromptTarget('claude', prompt), prompt)).toBe('copied')
    expect(writeText).toHaveBeenCalledWith(prompt)
    const { popup } = setup(Promise.resolve())
    popup.closed = true
    expect(await copyAndOpenAiPrompt(buildAiPromptTarget('yuanbao', prompt), prompt)).toBe('copied')
  })
  it('keeps copied text if navigation throws', async () => {
    const { popup } = setup(Promise.resolve())
    popup.location.replace.mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(await copyAndOpenAiPrompt(buildAiPromptTarget('yuanbao', prompt), prompt)).toBe('copied')
    expect(popup.close).toHaveBeenCalledOnce()
  })
})
