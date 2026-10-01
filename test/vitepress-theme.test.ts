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
})
