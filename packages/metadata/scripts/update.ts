import { join, resolve } from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import fg from 'fast-glob'
import Git from 'simple-git'

import type { PackageIndexes, YunLeFunComponent } from '../types'

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
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files
}

export async function readComponentsMetadata() {
  const dir = join(DIR_SRC, 'components')
  const componentsName = await listComponents(dir)

  const components: YunLeFunComponent[] = []

  await Promise.all(componentsName.map(async (compName) => {
    const mdPath = join(dir, compName, 'index.md')
    const vuePath = join(dir, compName, 'index.vue')

    const mdRaw = await fs.readFile(mdPath, 'utf-8')

    const { content: md, data: frontmatter } = matter(mdRaw)

    let description = (md
      .replace(/\r\n/g, '\n')
      .match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || []
    )[1] || ''

    description = description.trim().charAt(0).toLowerCase() + description.slice(1)

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
