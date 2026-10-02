import type { DefaultTheme, MarkdownRenderer, UserConfig } from 'vitepress'
import { mergeConfig } from 'vitepress'

export interface YunlefunThemeConfig extends DefaultTheme.Config {
  /** Canonical Iconify mark, shared by navigation and optionally the home hero. */
  brand?: { icon: 'brand-mark' | 'design-mark', hero?: boolean }
}

export interface MarkdownOptions {
  /** Override the label for a custom locale directory. */
  tableLabel?: (env: { relativePath?: string, lang?: string }) => string
}

/** Keep native table semantics and attributes; put scrolling and focus on the wrapper. */
export function yunlefunMarkdown(md: MarkdownRenderer, options: MarkdownOptions = {}) {
  md.renderer.rules.table_open = (tokens, index, rendererOptions, env, renderer) => {
    const english = env?.lang?.startsWith('en') || env?.relativePath?.startsWith('en/')
    const label = options.tableLabel?.(env || {}) || (english
      ? 'Table; scroll horizontally if needed'
      : '表格，宽表格可横向滚动')
    return `<div class="ylf-doc-table" role="region" aria-label="${md.utils.escapeHtml(label)}" tabindex="0">\n${renderer.renderToken(tokens, index, rendererOptions)}`
  }
  md.renderer.rules.table_close = (tokens, index, rendererOptions, _env, renderer) =>
    `${renderer.renderToken(tokens, index, rendererOptions)}</div>\n`

  // Explicit chapter IDs are URLs, not accessible names.
  md.core.ruler.after('anchor', 'ylf-heading-labels', (state) => {
    for (let index = 0; index < state.tokens.length; index++) {
      if (state.tokens[index].type !== 'heading_open')
        continue
      const inline = state.tokens[index + 1]
      const title = inline.content.replace(/\s*\{#[^}]+\}\s*$/, '')
      for (const child of inline.children || []) {
        if (child.type === 'link_open' && child.attrGet('class')?.includes('header-anchor'))
          child.attrSet('aria-label', title)
      }
    }
  })
}

/** Native VitePress labels; spread before each site's navigation and sidebar. */
export const zhThemeConfig: DefaultTheme.Config = {
  langMenuLabel: '切换语言',
  skipToContentLabel: '跳至内容',
  outline: { label: '本页内容', level: [2, 3] },
  sidebarMenuLabel: '目录',
  returnToTopLabel: '返回顶部',
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换到晴空模式',
  darkModeSwitchTitle: '切换到夜空模式',
  docFooter: { prev: '上一篇', next: '下一篇' },
  lastUpdated: { text: '最近更新' },
  search: {
    provider: 'local',
    options: {
      translations: {
        button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
        modal: {
          displayDetails: '显示详细内容',
          resetButtonTitle: '清空搜索',
          backButtonTitle: '关闭搜索',
          noResultsText: '没有找到相关内容',
          footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
        },
      },
    },
  },
}

/** Bundle the SFC theme during SSR as well as the browser build. */
export function withYunlefun(config: UserConfig<YunlefunThemeConfig>): UserConfig<YunlefunThemeConfig> {
  return mergeConfig({ vite: { ssr: { noExternal: ['vitepress-theme-yunlefun'] } } }, config)
}
