import type { PackageIndexes, YunLeFunComponent } from '../types'
import { join, resolve } from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'

import Git from 'simple-git'

export const DOCS_URL = 'https://ui.yunle.fun'
export const COMPONENTS_DIR = resolve(__dirname, '..')
export const DIR_ROOT = resolve(__dirname, '../../..')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DIR_TYPES = resolve(DIR_ROOT, 'types/packages')

export const git = Git(DIR_ROOT)

export async function listComponents(dir: string, ignore: string[] = []) {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'src',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files
}

export async function readComponentsMetadata() {
  const vueComponentsDir = join(DIR_SRC, 'vue/components')
  const componentNames = await listComponents(vueComponentsDir)

  const components: YunLeFunComponent[] = []

  await Promise.all(componentNames.map(async (compName) => {
    const mdPath = join(vueComponentsDir, compName, 'index.md')
    const vuePath = join(vueComponentsDir, compName, 'demo.vue')

    const mdRaw = await fs.readFile(mdPath, 'utf-8')

    const { content: md, data: frontmatter } = matter(mdRaw)

    // 文档正文的 H1 由 markdownTransform 在构建期注入，原始 md 没有标题，
    // 因此取 frontmatter.description，否则取首个正文段落（跳过标题/表格/代码/HTML）。
    const firstParagraph = md
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .find(line => line && !/^[#|`<]/.test(line))

    const description: string = (frontmatter.description || firstParagraph || '').trim()

    const comp: YunLeFunComponent = {
      ...frontmatter,
      title: frontmatter.title,
      name: compName,
      lastUpdated: +await git.raw(['log', '-1', '--format=%at', vuePath]) * 1000,
      description,
    }

    components.push(comp)
  }))

  return components
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    components: [],
  }

  indexes.components.push(...await readComponentsMetadata())
  indexes.components.sort((a, b) => a.name.localeCompare(b.name))

  return indexes
}

async function run() {
  const indexes = await readMetadata()
  await fs.writeJSON(join(COMPONENTS_DIR, 'index.json'), indexes, { spaces: 2 })
}

run()
