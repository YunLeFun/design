import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import fs from 'fs-extra'
import { componentNames, getComponent } from '../../../packages/metadata/metadata'
import { getTypeDefinition } from '../../../scripts/utils'

export function MarkdownTransform(): Plugin {
  return {
    name: 'ylf-ui-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      // linkify function names
      code = code.replace(
        new RegExp(`\`({${componentNames.join('|')}})\`(.)`, 'g'),
        (_, name, ending) => {
          if (ending === ']') // already a link
            return _
          const fn = getComponent(name)!
          return `[\`${fn.name}\`](${fn.docs}) `
        },
      )
      // convert links to relative
      code = code.replace(/https?:\/\/ui\.yunlefun\.org\//g, '/')

      const [pkg, _name, i] = id.split('/').slice(-3)

      const name = componentNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name

      if (componentNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('\n---\n')
        const sliceIndex = frontmatterEnds < 0 ? 0 : frontmatterEnds + 5

        const { header } = await getComponentMarkdown(pkg, name)

        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)

        code = code
          .replace(/(# \w+?)\n/, `$1\n\n<ComponentInfo comp="${name}"/>\n`)
          .replace(/## (Components?(?:\sUsage)?)/i, '## $1\n<LearnMoreComponents />\n\n')
          .replace(/## (Directives?(?:\sUsage)?)/i, '## $1\n<LearnMoreDirectives />\n\n')
      }

      return code
    },
  }
}

const DIR_SRC = resolve(__dirname, '../..')
const GITHUB_BLOB_URL = 'https://github.com/YunLeFun/ui/blob/main/packages'

export async function getComponentMarkdown(pkg: string, name: string) {
  const comp = getComponent(name)
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`

  const dirname = join(DIR_SRC, pkg, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find(i => fs.existsSync(join(dirname, i)))
  const types = await getTypeDefinition(pkg, name)

  const codeSnippets = `
  <<< @/vue-components/${name}/demo.vue
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
    .map(i => `[${i![0]}](${i![1]})`).join(' • ')

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
