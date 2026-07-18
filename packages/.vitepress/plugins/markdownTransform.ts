import type { Plugin } from 'vite'
import { join, resolve } from 'node:path'
import fs from 'fs-extra'
import { DIR_PACKAGE_UTILS, GITHUB_BLOB_URL } from '../../../constants'
import { componentNames, getComponent } from '../../../packages/metadata/metadata'
import { getTypeDefinition } from '../../../scripts/utils'

export const DIR_SRC = resolve(__dirname, '../..')

/**
 * 获取工具函数列表
 */
export function getUtilsList() {
  const files = fs.readdirSync(DIR_PACKAGE_UTILS, {
    withFileTypes: true,
  })
  // 子文件夹
  const utils = files.filter(i => i.isDirectory() && !i.name.startsWith('.'))
  return utils
}

const utils = getUtilsList()

export function MarkdownTransform(): Plugin {
  return {
    name: 'ylf-ui-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.md\b/.test(id))
        return null

      const [_name, i] = id.split('/').slice(-2)
      const name = componentNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name
      let type: 'vue' | 'utils' | undefined
      // inject markdown for utils/*/index.md
      if (i === 'index.md') {
        if (utils.findIndex(i => id.startsWith(i.parentPath)) !== -1) {
          type = 'utils'
        }
        else if (componentNames.includes(name)) {
          type = 'vue'
        }
      }

      // linkify function names
      code = code.replace(
        new RegExp(`\`({${componentNames.join('|')}})\`(.)`, 'g'),
        (_, name, ending) => {
          if (ending === ']') // already a link
            return _
          const fn = getComponent(name)!
          // fn.docs 在 metadata 里并不存在（旧 bug，会产出 ./undefined 死链）；
          // 直接指向组件文档页，并保留被吃掉的尾字符。
          return `[\`${fn.name}\`](/vue/components/${fn.name}/)${ending}`
        },
      )
      // convert links to relative
      code = code.replace(/https?:\/\/ui\.yunlefun\.org\//g, '/')

      if (type) {
        const frontmatterEnds = code.indexOf('\n---\n')
        const sliceIndex = frontmatterEnds < 0 ? 0 : frontmatterEnds + 5

        const options = {
          pkg: '',
          subPath: '',
          name,
        }
        switch (type) {
          case 'utils':
            options.pkg = 'utils'
            break
          case 'vue':
            options.pkg = 'vue'
            options.subPath = 'components'
            break
          default:
            break
        }
        const { header } = await getWrapperMarkdown(options)
        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)

        code = code
          .replace(/(# \w+)\n/, `$1\n\n<ComponentInfo comp="${name}"/>\n`)
          .replace(/## (Components?(?:\sUsage)?)/i, '## $1\n<LearnMoreComponents />\n\n')
          .replace(/## (Directives?(?:\sUsage)?)/i, '## $1\n<LearnMoreDirectives />\n\n')
      }

      return code
    },
  }
}

/**
 * 包装初始的 Markdown 内容
 */
export async function getWrapperMarkdown(options: {
  /**
   * package name
   */
  pkg: string
  subPath?: string
  /**
   * item name
   */
  name: string
}) {
  const { pkg, name, subPath = '' } = options
  const pkgPath = join(pkg, subPath)
  const comp = getComponent(name)
  const URL = `${GITHUB_BLOB_URL}/${pkgPath}/${name}`

  // 组件 demo 位于 packages/<pkg>/<subPath>/<name>（如 vue/components/button），需带上 subPath
  const dirname = join(DIR_SRC, pkgPath, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find(i => fs.existsSync(join(dirname, i)))
  const types = await getTypeDefinition(pkg, name)

  const codeSnippets = `
  <<< @/${pkgPath}/${name}/demo.vue
  `

  let typingSection = ''

  if (types) {
    const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``
    typingSection = types.length > 1000
      ? `
## Type Declarations

<details>
<summary op50 italic cursor-pointer select-none>Show Type Declarations</summary>

${code}

</details>
`
      : `\n## Type Declarations\n\n${code}`
  }

  const links = ([
    ['Source', `${URL}/index.ts`],
    demoPath ? ['Demo', `${URL}/${demoPath}`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`)
    .join(' • ')

  const sourceSection = `## Source\n\n${links}\n`
  const ContributorsSection = `
## Contributors

<Contributors fn="${name}" />
  `
  const changelogSection = `
## Changelog

<Changelog fn="${name}" />
`

  const demoContainerStart = `<DemoContainer source="${URL}/${demoPath}" name="${name}">`

  const demoSection = demoPath
    ? demoPath.endsWith('.client.vue')
      ? `
<script setup>
import { defineAsyncComponent } from 'vue'
const Demo = defineAsyncComponent(() => import('./${demoPath}'))
</script>

## Demo

${demoContainerStart}
<ClientOnly>
  <Suspense>
    <Demo/>
    <template #fallback>
      Loading demo...
    </template>
  </Suspense>
</ClientOnly>
</DemoContainer>
`
      : `
<script setup>
import Demo from \'./${demoPath}\'
</script>

## Demo

${demoContainerStart}

<template #source>

${codeSnippets}

</template>

<template #default>
<Demo/>
</template>

</DemoContainer>
`
    : ''

  const footer = `${typingSection}\n\n${sourceSection}\n${ContributorsSection}\n${changelogSection}\n`

  const header = `# ${comp?.title + (comp?.title_zh ? ` - ${comp?.title_zh}` : '')}\n${demoSection}`

  return {
    footer,
    header,
  }
}
