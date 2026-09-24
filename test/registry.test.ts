import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const tokenDependency = 'https://ui.yunle.fun/r/ylf-tokens.json'

async function readJson(path: string) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'))
}

describe('registry distribution', () => {
  it('declares shared tokens and stable universal component items', async () => {
    const registry = await readJson('registry.json')
    const tokens = registry.items.find((item: { name: string }) => item.name === 'ylf-tokens')
    const button = registry.items.find((item: { name: string }) => item.name === 'ylf-button')
    const dialog = registry.items.find((item: { name: string }) => item.name === 'ylf-dialog')

    expect(tokens).toMatchObject({
      name: 'ylf-tokens',
      type: 'registry:file',
      meta: {
        status: 'stable',
        sourcePackage: '@yunlefun/ui',
      },
      files: [{
        path: 'packages/ui/styles/css-vars.scss',
        type: 'registry:file',
        target: '~/src/styles/ylf-tokens.scss',
      }],
    })
    expect(button).toMatchObject({
      name: 'ylf-button',
      type: 'registry:item',
      registryDependencies: [tokenDependency],
      meta: {
        status: 'stable',
        sourcePackage: '@yunlefun/vue',
      },
      files: [{
        path: 'packages/vue/components/YlfButton.vue',
        type: 'registry:item',
        target: '~/src/components/ui/YlfButton.vue',
      }, {
        path: 'packages/vue/components/theme.ts',
        type: 'registry:file',
        target: '~/src/components/ui/theme.ts',
      }],
    })
    expect(dialog).toMatchObject({
      name: 'ylf-dialog',
      type: 'registry:item',
      dependencies: ['reka-ui@^2.10.1', 'sass@^1.101.0'],
      registryDependencies: [tokenDependency],
      meta: {
        status: 'stable',
        sourcePackage: '@yunlefun/vue',
      },
      files: [{
        path: 'packages/vue/components/YlfDialog.vue',
        type: 'registry:item',
        target: '~/src/components/ui/YlfDialog.vue',
      }],
    })
  })

  it('keeps every generated payload in sync with its canonical source', async () => {
    const [builtTokens, builtButton, builtDialog] = await Promise.all([
      readJson('packages/public/r/ylf-tokens.json'),
      readJson('packages/public/r/ylf-button.json'),
      readJson('packages/public/r/ylf-dialog.json'),
    ])
    const [tokens, button, dialog, theme] = await Promise.all([
      readFile(resolve(root, 'packages/ui/styles/css-vars.scss'), 'utf8'),
      readFile(resolve(root, 'packages/vue/components/YlfButton.vue'), 'utf8'),
      readFile(resolve(root, 'packages/vue/components/YlfDialog.vue'), 'utf8'),
      readFile(resolve(root, 'packages/vue/components/theme.ts'), 'utf8'),
    ])

    expect(builtTokens).toMatchObject({
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      files: [expect.objectContaining({
        path: 'packages/ui/styles/css-vars.scss',
        target: '~/src/styles/ylf-tokens.scss',
        content: tokens,
      })],
    })
    expect(builtButton).toMatchObject({
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      registryDependencies: [tokenDependency],
      files: [expect.objectContaining({
        path: 'packages/vue/components/YlfButton.vue',
        target: '~/src/components/ui/YlfButton.vue',
        content: button,
      }), expect.objectContaining({
        path: 'packages/vue/components/theme.ts',
        target: '~/src/components/ui/theme.ts',
        content: theme,
      })],
    })
    expect(builtDialog).toMatchObject({
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      registryDependencies: [tokenDependency],
      files: [expect.objectContaining({
        path: 'packages/vue/components/YlfDialog.vue',
        target: '~/src/components/ui/YlfDialog.vue',
        content: dialog,
      })],
    })
  })
})
