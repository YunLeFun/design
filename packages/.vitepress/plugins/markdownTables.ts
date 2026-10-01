import type { MarkdownRenderer } from 'vitepress'

// 把滚动与键盘焦点留在表格容器，表格自身保留原生行列语义和 Markdown 属性。
export function markdownTables(md: MarkdownRenderer) {
  md.renderer.rules.table_open = (tokens, index, options, env, renderer) => {
    const label = env?.relativePath?.startsWith('en/')
      ? 'Table; scroll horizontally if needed'
      : '表格，宽表格可横向滚动'
    return `<div class="ylf-doc-table" role="region" aria-label="${label}" tabindex="0">\n${renderer.renderToken(tokens, index, options)}`
  }
  md.renderer.rules.table_close = (tokens, index, options, _env, renderer) =>
    `${renderer.renderToken(tokens, index, options)}</div>\n`
}
