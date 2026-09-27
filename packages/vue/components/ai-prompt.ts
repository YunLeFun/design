/** Services supported by the shared AI prompt launcher. */
export type AiProviderId = 'yuanbao' | 'doubao' | 'deepseek' | 'chatgpt' | 'claude' | 'cursor'

export interface AiProvider {
  readonly id: AiProviderId
  readonly name: string
  readonly url: string
  readonly promptParameter?: 'q' | 'text'
}

/** Only public entry points belong here; never accept an arbitrary destination URL. */
export const aiProviders: readonly AiProvider[] = [
  { id: 'yuanbao', name: '元宝', url: 'https://yuanbao.tencent.com/' },
  { id: 'doubao', name: '豆包', url: 'https://www.doubao.com/chat/' },
  { id: 'deepseek', name: 'DeepSeek', url: 'https://chat.deepseek.com/', promptParameter: 'q' },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', promptParameter: 'q' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/new', promptParameter: 'q' },
  { id: 'cursor', name: 'Cursor', url: 'https://cursor.com/link/prompt', promptParameter: 'text' },
]

export interface AiPromptOptions {
  /** Optional ChatGPT search hint. Ordinary creative/editorial prompts leave this off. */
  chatgptSearch?: boolean
  /** Conservative encoded URL budget; Cursor also has a hard 10,000-character limit. */
  maxUrlLength?: number
}

export interface AiPromptTarget {
  provider: AiProvider
  url: string
  mode: 'link' | 'copy'
  reason?: 'unsupported' | 'too-long' | 'empty'
}

/** Build a lossless handoff. Long prompts use the clipboard, never truncated query text. */
export function buildAiPromptTarget(id: AiProviderId, prompt: string, options: AiPromptOptions = {}): AiPromptTarget {
  const provider = aiProviders.find(item => item.id === id)
  if (!provider)
    throw new Error(`Unknown AI provider: ${id}`)
  const fallback = (reason: AiPromptTarget['reason']): AiPromptTarget => ({ provider, url: provider.url, mode: 'copy', reason })
  if (!prompt.trim())
    return fallback('empty')
  if (!provider.promptParameter)
    return fallback('unsupported')

  const url = new URL(provider.url)
  url.searchParams.set(provider.promptParameter, prompt)
  if (id === 'chatgpt' && options.chatgptSearch)
    url.searchParams.set('hints', 'search')
  // Cursor's HTTPS landing page builds a slightly longer cursor:// deeplink.
  const providerLimit = id === 'cursor' ? 9900 : Number.POSITIVE_INFINITY
  const limit = Math.min(options.maxUrlLength ?? 8192, providerLimit)
  if (!Number.isFinite(limit) || limit <= 0 || url.href.length > limit)
    return fallback('too-long')
  return { provider, url: url.href, mode: 'link' }
}

export type AiPromptLaunchStatus = 'opened' | 'copied' | 'copy-failed' | 'open-failed'
export interface AiPromptLaunchResult {
  target: AiPromptTarget
  status: AiPromptLaunchStatus
}

/** A desktop host can supply an IPC-backed launcher without exposing Electron to this package. */
export type AiPromptLaunch = (target: AiPromptTarget, prompt: string) => Promise<AiPromptLaunchStatus>

/** Browser fallback. Call synchronously from a click to retain clipboard and popup activation. */
export async function copyAndOpenAiPrompt(target: AiPromptTarget, prompt: string): Promise<AiPromptLaunchStatus> {
  let copying: Promise<void>
  try {
    copying = navigator.clipboard.writeText(prompt)
  }
  catch { return 'copy-failed' }

  let popup: Window | null = null
  try {
    popup = window.open('about:blank', '_blank')
    if (popup)
      popup.opener = null
  }
  catch {
    popup?.close()
    popup = null
  }
  try {
    await copying
  }
  catch {
    popup?.close()
    return 'copy-failed'
  }
  if (!popup || popup.closed)
    return 'copied'
  try {
    // This helper is only the copy fallback: never navigate to a stale prompt query.
    popup.location.replace(target.provider.url)
    return 'opened'
  }
  catch {
    popup.close()
    return 'copied'
  }
}
