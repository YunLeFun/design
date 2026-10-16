import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createMarkdownRenderer } from 'vitepress'
import { describe, expect, it } from 'vitest'
import { withYunlefun, yunlefunMarkdown } from '../packages/vitepress-theme-yunlefun/src/config'

async function renderer() {
  const md = await createMarkdownRenderer(import.meta.dirname)
  md.use(yunlefunMarkdown)
  return md
}

describe('shared VitePress theme config', () => {
  it('keeps native table structure, alignment and a single keyboard scroll region', async () => {
    const md = await renderer()
    const html = md.render('| Name | State |\n| :--- | ---: |\n| Theme | Ready |', { relativePath: 'en/guide/theme.md' })
    expect(html).toContain('aria-label="Table; scroll horizontally if needed" tabindex="0"')
    expect(html).toContain('<table>')
    expect(html).toContain('<thead>')
    expect(html).toContain('<tbody>')
    expect(html).toContain('style="text-align:right"')
    expect(html.match(/tabindex=/g)).toHaveLength(1)
    expect(html).toContain('</table>\n</div>')
  })

  it('escapes custom labels and uses visible chapter names with explicit bilingual IDs', async () => {
    const md = await renderer()
    md.use(yunlefunMarkdown, { tableLabel: () => 'Table "A" <B>' })
    const html = md.render('# Getting started {#快速开始}\n\n| Name |\n| --- |\n| A |', {})
    expect(html).toContain('aria-label="Table &quot;A&quot; &lt;B&gt;"')
    expect(html).toContain('id="快速开始"')
    expect(html).toContain('aria-label="Getting started"')
    expect(html).not.toContain('aria-label="快速开始"')
  })

  it('preserves site configuration and SSR package exceptions', () => {
    const config = withYunlefun({
      title: 'Site',
      vite: { ssr: { noExternal: ['other-theme-plugin'] } },
      themeConfig: { nav: [{ text: 'Guide', link: '/guide/' }] },
    })
    expect(config.title).toBe('Site')
    expect(config.themeConfig?.nav).toEqual([{ text: 'Guide', link: '/guide/' }])
    expect(config.vite?.ssr?.noExternal).toEqual(['vitepress-theme-yunlefun', 'other-theme-plugin'])
  })

  it('keeps markdown and Vite hooks added by wrappers such as withMermaid', () => {
    const plugin = { name: 'vite-plugin-mermaid' }
    const markdownConfig = () => {}
    const config = withYunlefun({
      markdown: { config: markdownConfig },
      vite: { plugins: [plugin], optimizeDeps: { include: ['dayjs'] } },
    })
    expect(config.markdown?.config).toBe(markdownConfig)
    expect(config.vite?.plugins).toEqual([plugin])
    expect(config.vite?.optimizeDeps?.include).toEqual(['dayjs'])
    expect(config.vite?.ssr?.noExternal).toEqual(['vitepress-theme-yunlefun'])
  })

  it('keeps the dev optimizer from pre-bundling the theme with a second VitePress', () => {
    expect(withYunlefun({}).vite?.optimizeDeps?.exclude).toEqual(['vitepress-theme-yunlefun'])
    const config = withYunlefun({ vite: { optimizeDeps: { exclude: ['@site/local-plugin'] } } })
    expect(config.vite?.optimizeDeps?.exclude).toEqual(['vitepress-theme-yunlefun', '@site/local-plugin'])
  })

  it('animates doc content only under the client route-change class, never on first paint', async () => {
    const source = await readFile(resolve(import.meta.dirname, '../packages/vitepress-theme-yunlefun/styles/index.css'), 'utf8')
    const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
    const rules = [...css.matchAll(/([^{}]+)\{[^{}]*animation:\s*ylf-doc-enter/g)].map(match => match[1].trim())
    expect(rules).toHaveLength(1)
    for (const selector of rules[0].split(','))
      expect(selector.trim()).toMatch(/^\.ylf-route-enter /)
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.ylf-route-enter \.VPDoc \.vp-doc > div,\s*\.ylf-route-enter \.VPPage > div\s*\{\s*animation: none/)
  })

  it('keeps the home sky decorative, token-driven and still under reduced motion', async () => {
    const css = await readFile(resolve(import.meta.dirname, '../packages/vitepress-theme-yunlefun/styles/home.css'), 'utf8')
    expect(css).toContain('var(--ylf-cloud-body')
    expect(css).toContain('var(--ylf-c-sky)')
    expect(css).toMatch(/\.ylf-home-sky \{[^}]*position: absolute;[^}]*pointer-events: none;/)
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.ylf-home-sky__cloud\s*\{\s*animation: none/)
    // The moonlit night (moon, stars, lit cloud rims) is dark-only and adds no motion.
    for (const part of ['::before', '::after']) {
      const rule = css.match(new RegExp(`([^{}]*)\\.ylf-home-sky${part} \\{([^}]*)\\}`))
      expect(rule?.[1].trim()).toMatch(/\.dark$/)
      expect(rule?.[2]).not.toMatch(/animation|transition/)
    }
    expect(css).toMatch(/\.dark \.ylf-home-sky__cloud \{[^}]*filter: drop-shadow/)
  })
})
