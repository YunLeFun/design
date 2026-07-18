import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')

async function readJson(path: string) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'))
}

describe('registry pilot', () => {
  it('builds the Button item from the package source of truth', async () => {
    const registry = await readJson('registry.json')
    const button = registry.items.find((item: { name: string }) => item.name === 'ylf-button')

    expect(button).toMatchObject({
      name: 'ylf-button',
      type: 'registry:item',
      meta: {
        status: 'pilot',
        sourcePackage: '@yunlefun/vue',
      },
    })
    expect(button.files).toEqual([
      {
        path: 'packages/vue/components/YlfButton.vue',
        type: 'registry:item',
        target: '~/src/components/ui/YlfButton.vue',
      },
      {
        path: 'packages/ui/styles/css-vars.scss',
        type: 'registry:file',
        target: '~/src/styles/ylf-tokens.scss',
      },
    ])
  })

  it('keeps the generated registry payload in sync with canonical sources', async () => {
    const built = await readJson('packages/public/r/ylf-button.json')
    const component = await readFile(resolve(root, 'packages/vue/components/YlfButton.vue'), 'utf8')
    const tokens = await readFile(resolve(root, 'packages/ui/styles/css-vars.scss'), 'utf8')

    expect(built.$schema).toBe('https://shadcn-vue.com/schema/registry-item.json')
    expect(built.files).toEqual([
      expect.objectContaining({
        path: 'packages/vue/components/YlfButton.vue',
        type: 'registry:item',
        target: '~/src/components/ui/YlfButton.vue',
        content: component,
      }),
      expect.objectContaining({
        path: 'packages/ui/styles/css-vars.scss',
        type: 'registry:file',
        target: '~/src/styles/ylf-tokens.scss',
        content: tokens,
      }),
    ])
  })
})
