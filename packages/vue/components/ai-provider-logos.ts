import type { AiProviderId } from './ai-prompt'

/** Bundled assets: no favicon service or third-party image requests. */
export const aiProviderLogos: Record<AiProviderId, string> = {
  yuanbao: new URL('./_ai-providers/yuanbao.png', import.meta.url).href,
  doubao: new URL('./_ai-providers/doubao.png', import.meta.url).href,
  deepseek: new URL('./_ai-providers/deepseek.svg', import.meta.url).href,
  chatgpt: new URL('./_ai-providers/chatgpt.svg', import.meta.url).href,
  claude: new URL('./_ai-providers/claude.svg', import.meta.url).href,
  cursor: new URL('./_ai-providers/cursor.svg', import.meta.url).href,
}
