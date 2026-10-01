import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { getWrapperMarkdown } from '../packages/.vitepress/plugins/markdownTransform'

const root = resolve(import.meta.dirname, '../packages')
const pages = fg.sync([
  'index.md',
  'guide/*.md',
  'vue/index.md',
  'vue/components/*/index.md',
  'css/**/index.md',
  'utils/**/index.md',
], { cwd: root })

describe('bilingual documentation routes', () => {
  it.each(pages)('%s has a complete English counterpart', async (page) => {
    const [chinese, english] = await Promise.all([
      readFile(resolve(root, page), 'utf8'),
      readFile(resolve(root, 'en', page), 'utf8'),
    ])
    // Every public API table entry remains available in both versions.
    const apiRows = (source: string) => [...source.matchAll(/^\|\s*(`[^`]+`)\s*\|/gm)].map(row => row[1])
    for (const entry of apiRows(chinese))
      expect(apiRows(english), entry).toContain(entry)
    expect(english).not.toMatch(/\]\(\/(?:guide|vue|css|utils)(?:\/|\))/)
  })

  it('shows localized demo source without changing component implementation paths', async () => {
    const wrapper = await getWrapperMarkdown({ pkg: 'vue', subPath: 'components', name: 'dialog', english: true })
    expect(wrapper.header).toContain('import Demo from \'./demo.vue\'')
    expect(wrapper.header).toContain('@/en/vue/components/dialog/demo.vue')
    expect(wrapper.header).toContain('/packages/en/vue/components/dialog/demo.vue')
    expect(wrapper.header).not.toContain(' - 对话框')
  })
})
